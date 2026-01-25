import { Clock, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

interface RecentSearchesProps {
  onFoodClick: (food: string) => void;
  currentFood?: string;
}

const STORAGE_KEY = "petsafechoice_recent_searches";
const MAX_RECENT = 3;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  const addSearch = (food: string) => {
    const normalizedFood = food.trim().toLowerCase();
    if (!normalizedFood) return;

    setRecentSearches((prev) => {
      // Remove if already exists, add to front
      const filtered = prev.filter((f) => f.toLowerCase() !== normalizedFood);
      const updated = [food.trim(), ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearSearches = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentSearches([]);
  };

  return { recentSearches, addSearch, clearSearches };
}

export function RecentSearches({ onFoodClick, currentFood }: RecentSearchesProps) {
  const { t } = useTranslation();
  const { recentSearches, clearSearches } = useRecentSearches();

  // Filter out current food from display
  const displaySearches = recentSearches.filter(
    (food) => food.toLowerCase() !== currentFood?.toLowerCase()
  );

  if (displaySearches.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">
            {t('recentSearches.title', 'Recently Checked')}
          </span>
        </div>
        <button
          onClick={clearSearches}
          className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          {t('recentSearches.clear', 'Clear')}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {displaySearches.map((food) => (
          <button
            key={food}
            onClick={() => onFoodClick(food)}
            className="px-3 py-1.5 bg-card hover:bg-accent rounded-full text-sm font-medium text-foreground border border-border hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
          >
            {food.charAt(0).toUpperCase() + food.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
