import { AlertTriangle, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface IngredientBreakdownProps {
  ingredients: string[];
  foodName: string;
}

const KNOWN_TOXINS = ["onion", "garlic", "xylitol", "nutmeg", "chocolate", "grapes", "raisins", "avocado", "caffeine", "alcohol", "macadamia"];

export function IngredientBreakdown({ ingredients, foodName }: IngredientBreakdownProps) {
  const { t } = useTranslation();
  
  if (!ingredients || ingredients.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 animate-fade-in">
      <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur p-5">
        <div className="flex items-center gap-2 mb-3">
          <Leaf className="w-5 h-5 text-primary" />
          <h4 className="font-heading font-semibold text-sm">
            {t('ingredientBreakdown.title', { food: foodName })}
          </h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, i) => {
            const isToxic = KNOWN_TOXINS.some((t) =>
              ingredient.toLowerCase().includes(t)
            );
            return (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
                  isToxic
                    ? "bg-danger/10 border-danger/30 text-danger"
                    : "bg-muted border-border text-muted-foreground"
                )}
              >
                {isToxic && <AlertTriangle className="w-3 h-3" />}
                {ingredient}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
