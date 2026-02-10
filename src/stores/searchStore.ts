import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SafetyResultData } from '@/components/SafetyResult';

type PetType = "dog" | "cat";

// Cache key format: "food:species" (e.g., "chocolate:dog")
type ResultCache = Record<string, { data: SafetyResultData; timestamp: number }>;

// Cache expiry: 7 days (in milliseconds) - optimized for mobile storage
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

interface SearchState {
  // Core search state
  petType: PetType;
  result: SafetyResultData | null;
  lastSearchedFood: string | null;
  isLoading: boolean;
  searchSource: "trending" | "search" | null;
  petWeight: number;
  
  // Results cache - keyed by "food:species" with timestamp for INSTANT toggle (<50ms)
  resultsCache: ResultCache;
  
  // Actions
  setPetType: (type: PetType) => void;
  setPetWeight: (weight: number) => void;
  setResult: (result: SafetyResultData | null) => void;
  setLastSearchedFood: (food: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setSearchSource: (source: "trending" | "search" | null) => void;
  clearResult: () => void;
  
  // Cache actions - ZERO-LATENCY retrieval for species toggle
  getCachedResult: (food: string, species: PetType) => SafetyResultData | null;
  setCachedResult: (food: string, species: PetType, result: SafetyResultData) => void;
  hasCachedResult: (food: string, species: PetType) => boolean;
  clearExpiredCache: () => void;
}

const createCacheKey = (food: string, species: PetType): string => 
  `${food.toLowerCase().trim()}:${species}`;

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // Initial state
      petType: "dog",
      petWeight: 10,
      result: null,
      lastSearchedFood: null,
      isLoading: false,
      searchSource: null,
      resultsCache: {},
      
      // Actions
      setPetType: (type) => set({ petType: type }),
      setPetWeight: (weight) => set({ petWeight: weight }),
      setResult: (result) => set({ result }),
      setLastSearchedFood: (food) => set({ lastSearchedFood: food }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setSearchSource: (source) => set({ searchSource: source }),
      clearResult: () => set({ result: null, searchSource: null }),
      
      // Cache actions - with 24-hour expiry check
      getCachedResult: (food, species) => {
        const key = createCacheKey(food, species);
        const cached = get().resultsCache[key];
        
        if (!cached) return null;
        
        // Check if cache is still valid (within 24 hours)
        const now = Date.now();
        if (now - cached.timestamp > CACHE_EXPIRY_MS) {
          // Cache expired, remove it
          const { [key]: _, ...rest } = get().resultsCache;
          set({ resultsCache: rest });
          return null;
        }
        
        return cached.data;
      },
      
      setCachedResult: (food, species, result) => {
        const key = createCacheKey(food, species);
        set((state) => ({
          resultsCache: {
            ...state.resultsCache,
            [key]: { data: result, timestamp: Date.now() },
          },
        }));
      },
      
      hasCachedResult: (food, species) => {
        const key = createCacheKey(food, species);
        const cached = get().resultsCache[key];
        if (!cached) return false;
        
        // Check expiry
        const now = Date.now();
        return now - cached.timestamp <= CACHE_EXPIRY_MS;
      },
      
      // Clear expired cache entries
      clearExpiredCache: () => {
        const now = Date.now();
        const cache = get().resultsCache;
        const validCache: ResultCache = {};
        
        for (const [key, value] of Object.entries(cache)) {
          if (now - value.timestamp <= CACHE_EXPIRY_MS) {
            validCache[key] = value;
          }
        }
        
        set({ resultsCache: validCache });
      },
    }),
    {
      name: 'petsafe-search-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist the cache and pet type preference
        resultsCache: state.resultsCache,
        petType: state.petType,
        lastSearchedFood: state.lastSearchedFood,
      }),
    }
  )
);
