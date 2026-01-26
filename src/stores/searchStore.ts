import { create } from 'zustand';
import { SafetyResultData } from '@/components/SafetyResult';

type PetType = "dog" | "cat";

// Cache key format: "food:species" (e.g., "chocolate:dog")
type ResultCache = Record<string, SafetyResultData>;

interface SearchState {
  // Core search state
  petType: PetType;
  result: SafetyResultData | null;
  lastSearchedFood: string | null;
  isLoading: boolean;
  searchSource: "trending" | "search" | null;
  
  // Results cache - keyed by "food:species"
  resultCache: ResultCache;
  
  // Actions
  setPetType: (type: PetType) => void;
  setResult: (result: SafetyResultData | null) => void;
  setLastSearchedFood: (food: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setSearchSource: (source: "trending" | "search" | null) => void;
  clearResult: () => void;
  
  // Cache actions
  getCachedResult: (food: string, species: PetType) => SafetyResultData | null;
  setCachedResult: (food: string, species: PetType, result: SafetyResultData) => void;
}

const createCacheKey = (food: string, species: PetType): string => 
  `${food.toLowerCase().trim()}:${species}`;

export const useSearchStore = create<SearchState>((set, get) => ({
  // Initial state
  petType: "dog",
  result: null,
  lastSearchedFood: null,
  isLoading: false,
  searchSource: null,
  resultCache: {},
  
  // Actions
  setPetType: (type) => set({ petType: type }),
  setResult: (result) => set({ result }),
  setLastSearchedFood: (food) => set({ lastSearchedFood: food }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setSearchSource: (source) => set({ searchSource: source }),
  clearResult: () => set({ result: null, searchSource: null }),
  
  // Cache actions
  getCachedResult: (food, species) => {
    const key = createCacheKey(food, species);
    return get().resultCache[key] || null;
  },
  
  setCachedResult: (food, species, result) => {
    const key = createCacheKey(food, species);
    set((state) => ({
      resultCache: {
        ...state.resultCache,
        [key]: result,
      },
    }));
  },
}));
