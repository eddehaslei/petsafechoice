import { forwardRef, useState, useEffect } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RelatedFoodsProps {
  currentFood: string;
  petType: "dog" | "cat";
  onFoodClick: (food: string) => void;
}

// Food category mapping for grouping
const foodCategories: Record<string, string> = {
  // Fruits
  blueberries: "fruit",
  strawberries: "fruit",
  raspberries: "fruit",
  blackberries: "fruit",
  cranberries: "fruit",
  apples: "fruit",
  bananas: "fruit",
  watermelon: "fruit",
  cantaloupe: "fruit",
  honeydew: "fruit",
  mango: "fruit",
  pineapple: "fruit",
  oranges: "fruit",
  cherries: "fruit",
  plums: "fruit",
  apricots: "fruit",
  
  // Vegetables
  carrots: "vegetable",
  pumpkin: "vegetable",
  "sweet potato": "vegetable",
  broccoli: "vegetable",
  cauliflower: "vegetable",
  spinach: "vegetable",
  kale: "vegetable",
  "green beans": "vegetable",
  peas: "vegetable",
  zucchini: "vegetable",
  squash: "vegetable",
  lettuce: "vegetable",
  
  // Proteins
  chicken: "protein",
  turkey: "protein",
  beef: "protein",
  lamb: "protein",
  pork: "protein",
  salmon: "protein",
  tuna: "protein",
  sardines: "protein",
  cod: "protein",
  eggs: "protein",
  
  // Dairy
  cheese: "dairy",
  yogurt: "dairy",
  milk: "dairy",
  "cottage cheese": "dairy",
  "cream cheese": "dairy",
  butter: "dairy",
  "ice cream": "dairy",
  kefir: "dairy",
  
  // Dangerous/Toxic - THESE SHOULD NEVER BE SUGGESTED
  chocolate: "toxic",
  xylitol: "toxic",
  onions: "toxic",
  garlic: "toxic",
  coffee: "toxic",
  caffeine: "toxic",
  alcohol: "toxic",
  grapes: "toxic",
  raisins: "toxic",
  avocado: "toxic",
  macadamia: "toxic",
  
  // Nuts & Seeds
  peanuts: "nuts",
  almonds: "nuts",
  cashews: "nuts",
  walnuts: "nuts",
  pecans: "nuts",
  "peanut butter": "nuts",
  
  // Grains
  rice: "grain",
  oatmeal: "grain",
  bread: "grain",
  pasta: "grain",
  quinoa: "grain",
  
  // Bones
  "cooked bones": "bones",
  "raw bones": "bones",
  "chicken bones": "bones",
  "fish bones": "bones",
  "bone broth": "bones",
};

// Foods that should NEVER be suggested (toxic/dangerous)
const DANGEROUS_FOODS = new Set([
  "chocolate", "grapes", "raisins", "avocado", "onions", "garlic",
  "xylitol", "macadamia", "coffee", "caffeine", "alcohol", "cooked bones",
  "chicken bones", "fish bones"
]);

export const RelatedFoods = forwardRef<HTMLDivElement, RelatedFoodsProps>(
  function RelatedFoods({ currentFood, petType, onFoodClick }, ref) {
    const [relatedFoods, setRelatedFoods] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchRelatedFoods = async () => {
        setIsLoading(true);
        
        // Get category of current food
        const normalizedFood = currentFood.toLowerCase().trim();
        let currentCategory = foodCategories[normalizedFood];
        
        // Try partial matching if no exact match
        if (!currentCategory) {
          const matchingKey = Object.keys(foodCategories).find(
            (key) => normalizedFood.includes(key) || key.includes(normalizedFood)
          );
          currentCategory = matchingKey ? foodCategories[matchingKey] : null;
        }

        try {
          // Fetch ONLY SAFE foods from database
          const { data, error } = await supabase
            .from("foods")
            .select("name, species, safety_rating")
            .or(`species.eq.${petType},species.eq.both`)
            .eq("safety_rating", "safe"); // ONLY SAFE FOODS

          if (error) {
            console.error("Error fetching related foods:", error);
            setRelatedFoods([]);
            return;
          }

          if (!data || data.length === 0) {
            setRelatedFoods([]);
            return;
          }

          // Deduplicate by lowercase name and filter out dangerous foods
          const uniqueFoods = Array.from(
            new Map(
              data
                .filter((f) => !DANGEROUS_FOODS.has(f.name.toLowerCase()))
                .map((f) => [f.name.toLowerCase(), f.name])
            ).values()
          );

          // Filter out current food
          const otherFoods = uniqueFoods.filter(
            (name) => name.toLowerCase() !== normalizedFood
          );

          // If we have a category, prioritize same-category foods
          let sameCategoryFoods: string[] = [];
          let otherCategoryFoods: string[] = [];

          if (currentCategory && currentCategory !== "toxic") {
            otherFoods.forEach((name) => {
              const category = foodCategories[name.toLowerCase()];
              if (category === currentCategory) {
                sameCategoryFoods.push(name);
              } else if (category !== "toxic") {
                otherCategoryFoods.push(name);
              }
            });
          } else {
            // Filter out toxic category from others
            otherCategoryFoods = otherFoods.filter(
              (name) => foodCategories[name.toLowerCase()] !== "toxic"
            );
          }

          // Shuffle same-category foods and pick 4
          const shuffled = sameCategoryFoods.sort(() => Math.random() - 0.5);
          let suggestions = shuffled.slice(0, 4);

          // If not enough same-category, fill with random safe others
          if (suggestions.length < 4) {
            const shuffledOthers = otherCategoryFoods.sort(() => Math.random() - 0.5);
            suggestions = [...suggestions, ...shuffledOthers].slice(0, 4);
          }

          setRelatedFoods(suggestions);
        } catch (err) {
          console.error("Error fetching related foods:", err);
          setRelatedFoods([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRelatedFoods();
    }, [currentFood, petType]);

    if (isLoading) {
      return (
        <div ref={ref} className="w-full max-w-2xl mx-auto mt-4 pb-8">
          <div className="bg-card/80 backdrop-blur border border-border/50 rounded-2xl p-5 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        </div>
      );
    }

    if (relatedFoods.length === 0) return null;

    return (
      <div ref={ref} className="w-full max-w-2xl mx-auto mt-4 pb-8 animate-fade-in">
        <div className="bg-card/80 backdrop-blur border border-border/50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">
              People Also Ask About
            </h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedFoods.map((food) => (
              <button
                key={food}
                onClick={() => onFoodClick(food)}
                className="group flex items-center justify-between gap-2 px-4 py-3 bg-background hover:bg-primary/5 border border-border hover:border-primary/30 rounded-xl text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 min-h-[48px]"
              >
                <span className="capitalize">{food}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Click to check if these foods are safe for your {petType}
          </p>
        </div>
      </div>
    );
  }
);
