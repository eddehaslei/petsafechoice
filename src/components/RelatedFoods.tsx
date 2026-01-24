import { Search, ArrowRight } from "lucide-react";
import { SafetyResultData } from "./SafetyResult";

interface RelatedFoodsProps {
  currentFood: string;
  petType: "dog" | "cat";
  onFoodClick: (food: string) => void;
}

// Related foods mapping by category
const foodCategories: Record<string, string[]> = {
  // Fruits
  blueberries: ["strawberries", "raspberries", "blackberries", "cranberries"],
  strawberries: ["blueberries", "raspberries", "watermelon", "cantaloupe"],
  raspberries: ["blueberries", "strawberries", "blackberries", "mango"],
  grapes: ["raisins", "cherries", "plums", "apricots"],
  apples: ["pears", "bananas", "watermelon", "mango"],
  bananas: ["apples", "watermelon", "pineapple", "mango"],
  watermelon: ["cantaloupe", "honeydew", "strawberries", "bananas"],
  avocado: ["mango", "papaya", "coconut", "kiwi"],
  oranges: ["tangerines", "lemons", "grapefruit", "limes"],
  
  // Vegetables
  carrots: ["sweet potato", "pumpkin", "green beans", "peas"],
  pumpkin: ["sweet potato", "carrots", "squash", "zucchini"],
  broccoli: ["cauliflower", "green beans", "spinach", "kale"],
  spinach: ["kale", "lettuce", "broccoli", "green beans"],
  
  // Proteins
  chicken: ["turkey", "beef", "salmon", "eggs"],
  beef: ["chicken", "turkey", "lamb", "pork"],
  salmon: ["tuna", "sardines", "cod", "chicken"],
  eggs: ["chicken", "turkey", "cheese", "yogurt"],
  
  // Dangerous foods
  chocolate: ["coffee", "caffeine", "cocoa", "xylitol"],
  xylitol: ["chocolate", "grapes", "onions", "garlic"],
  onions: ["garlic", "leeks", "chives", "shallots"],
  garlic: ["onions", "leeks", "chives", "shallots"],
  
  // Dairy
  cheese: ["yogurt", "milk", "cottage cheese", "cream cheese"],
  milk: ["cheese", "yogurt", "ice cream", "butter"],
  yogurt: ["cheese", "milk", "cottage cheese", "kefir"],
  
  // Nuts & Seeds
  peanuts: ["almonds", "cashews", "walnuts", "sunflower seeds"],
  almonds: ["peanuts", "cashews", "pecans", "hazelnuts"],
  
  // Grains
  rice: ["oatmeal", "quinoa", "pasta", "bread"],
  bread: ["rice", "pasta", "oatmeal", "crackers"],
  oatmeal: ["rice", "quinoa", "bread", "barley"],
  
  // Cooked items
  "cooked bones": ["raw bones", "chicken bones", "fish bones", "bone broth"],
};

// Fallback suggestions if no specific match
const defaultSuggestions = ["chocolate", "grapes", "chicken", "pumpkin"];

export function RelatedFoods({ currentFood, petType, onFoodClick }: RelatedFoodsProps) {
  const normalizedFood = currentFood.toLowerCase().trim();
  
  // Find related foods
  let relatedFoods = foodCategories[normalizedFood];
  
  // If no exact match, try partial matching
  if (!relatedFoods) {
    const matchingKey = Object.keys(foodCategories).find(key => 
      normalizedFood.includes(key) || key.includes(normalizedFood)
    );
    relatedFoods = matchingKey ? foodCategories[matchingKey] : defaultSuggestions;
  }

  // Filter out the current food and limit to 4
  const suggestions = relatedFoods
    .filter(food => food.toLowerCase() !== normalizedFood)
    .slice(0, 4);

  if (suggestions.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <div className="bg-card/80 backdrop-blur border border-border/50 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-semibold text-foreground">
            People Also Ask About
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {suggestions.map((food) => (
            <button
              key={food}
              onClick={() => onFoodClick(food)}
              className="group flex items-center justify-between gap-2 px-4 py-3 bg-background hover:bg-primary/5 border border-border hover:border-primary/30 rounded-xl text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5"
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
