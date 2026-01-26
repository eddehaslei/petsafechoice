import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface FoodSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function FoodSearch({ onSearch, isLoading }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      {/* Stacked layout: Full-width input, button below */}
      <div className="flex flex-col gap-3">
        {/* Search Input - Full Width */}
        <div className="relative w-full">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full ps-12 pe-4 h-14 text-lg rounded-2xl border-2 border-border bg-card input-shadow focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            disabled={isLoading}
          />
        </div>
        
        {/* Submit Button - Centered Below */}
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="w-full sm:w-auto sm:mx-auto h-12 px-10 rounded-2xl font-heading font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            t('search.button')
          )}
        </Button>
      </div>
    </form>
  );
}
