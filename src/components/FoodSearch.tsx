import { useState, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useFoodAutocomplete } from "@/hooks/useFoodAutocomplete";
import { cn } from "@/lib/utils";

interface FoodSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function FoodSearch({ onSearch, isLoading }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { t } = useTranslation();
  const { suggestions } = useFoodAutocomplete(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto" role="search">
      {/* Stacked layout: Full-width input, button below */}
      <div className="flex flex-col gap-3">
        {/* Search Input - Full Width with Autocomplete */}
        <div className="relative w-full">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" aria-hidden="true" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="w-full ps-12 pe-4 h-14 text-lg rounded-2xl border-2 border-border bg-card input-shadow focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            disabled={isLoading}
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-controls="food-suggestions"
            aria-autocomplete="list"
            aria-label={t('search.ariaLabel', 'Enter a food to check if it is safe for your pet')}
          />
          
          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              id="food-suggestions"
              role="listbox"
              className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  role="option"
                  aria-selected={index === selectedIndex}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "w-full px-4 py-3 text-left text-foreground hover:bg-accent transition-colors flex items-center gap-3 min-h-[48px]",
                    index === selectedIndex && "bg-accent"
                  )}
                >
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit Button - Centered Below - min-height 48px for touch */}
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          aria-label={t('search.buttonAriaLabel', 'Search for food safety information')}
          className="w-full sm:w-auto sm:mx-auto h-12 min-h-[48px] px-10 rounded-2xl font-heading font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          ) : (
            t('search.button')
          )}
        </Button>
      </div>
    </form>
  );
}
