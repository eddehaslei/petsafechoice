import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSearchStore } from '@/stores/searchStore';

interface FoodSuggestion {
  name: string;
  species: string;
}

export function useFoodAutocomplete(query: string) {
  const [allFoods, setAllFoods] = useState<FoodSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const petType = useSearchStore((state) => state.petType);

  // Fetch all foods once on mount
  useEffect(() => {
    const fetchFoods = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('foods')
          .select('name, species')
          .order('name');
        
        if (error) return;
        
        setAllFoods(data || []);
      } catch {
        // Silent fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Filter suggestions based on query and pet type
  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    
    // Filter by species (match current petType or 'both')
    const relevantFoods = allFoods.filter(
      (food) => food.species === petType || food.species === 'both'
    );
    
    // Filter by query match and deduplicate
    const matches = relevantFoods
      .filter((food) => food.name.toLowerCase().includes(normalizedQuery))
      .reduce((acc, food) => {
        // Deduplicate by lowercase name
        const key = food.name.toLowerCase();
        if (!acc.has(key)) {
          acc.set(key, food.name);
        }
        return acc;
      }, new Map<string, string>());
    
    // Return unique names, sorted by relevance (starts with > contains)
    return Array.from(matches.values())
      .sort((a, b) => {
        const aStartsWith = a.toLowerCase().startsWith(normalizedQuery);
        const bStartsWith = b.toLowerCase().startsWith(normalizedQuery);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.localeCompare(b);
      })
      .slice(0, 6); // Limit to 6 suggestions
  }, [query, allFoods, petType]);

  return { suggestions, isLoading };
}
