import { create } from 'zustand';
import { SafetyResultData } from '@/components/SafetyResult';

type PetType = "dog" | "cat";

interface SearchState {
  // Core search state
  petType: PetType;
  result: SafetyResultData | null;
  lastSearchedFood: string | null;
  isLoading: boolean;
  searchSource: "trending" | "search" | null;
  
  // Actions
  setPetType: (type: PetType) => void;
  setResult: (result: SafetyResultData | null) => void;
  setLastSearchedFood: (food: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setSearchSource: (source: "trending" | "search" | null) => void;
  clearResult: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  // Initial state
  petType: "dog",
  result: null,
  lastSearchedFood: null,
  isLoading: false,
  searchSource: null,
  
  // Actions
  setPetType: (type) => set({ petType: type }),
  setResult: (result) => set({ result }),
  setLastSearchedFood: (food) => set({ lastSearchedFood: food }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setSearchSource: (source) => set({ searchSource: source }),
  clearResult: () => set({ result: null, searchSource: null }),
}));
