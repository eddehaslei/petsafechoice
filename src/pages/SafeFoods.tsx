import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Dog, Cat, Check, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface FoodItem {
  name: string;
  benefits: string;
  notes?: string;
}

const dogSafeFoods: FoodItem[] = [
  { name: "Chicken", benefits: "Lean protein source, easy to digest", notes: "Cooked, boneless, unseasoned" },
  { name: "Carrots", benefits: "Low calorie, high in fiber and beta-carotene", notes: "Raw or cooked" },
  { name: "Blueberries", benefits: "Rich in antioxidants and vitamins", notes: "Fresh or frozen" },
  { name: "Peanut Butter", benefits: "Protein and healthy fats", notes: "Xylitol-free only" },
  { name: "Pumpkin", benefits: "Aids digestion, high in fiber", notes: "Plain, cooked, no spices" },
  { name: "Sweet Potatoes", benefits: "Vitamins A, C, and B6", notes: "Cooked, no seasoning" },
  { name: "Watermelon", benefits: "Hydrating, vitamins A, B6, C", notes: "Seedless, no rind" },
  { name: "Apples", benefits: "Fiber, vitamins A and C", notes: "No seeds or core" },
  { name: "Green Beans", benefits: "Low calorie, filling", notes: "Plain, no salt" },
  { name: "Salmon", benefits: "Omega-3 fatty acids", notes: "Cooked, boneless" },
  { name: "Eggs", benefits: "Complete protein source", notes: "Fully cooked" },
  { name: "Oatmeal", benefits: "Fiber, good for sensitive stomachs", notes: "Plain, cooked" },
  { name: "Bananas", benefits: "Potassium, vitamins", notes: "In moderation" },
  { name: "Cucumber", benefits: "Hydrating, low calorie", notes: "Great for overweight dogs" },
  { name: "Rice", benefits: "Easy to digest carbohydrate", notes: "White or brown, plain" },
  { name: "Spinach", benefits: "Iron, vitamins K, A, C", notes: "Small amounts" },
  { name: "Turkey", benefits: "Lean protein", notes: "Plain, no bones or skin" },
  { name: "Broccoli", benefits: "Fiber, vitamin C", notes: "Small amounts only" },
  { name: "Strawberries", benefits: "Fiber, vitamin C", notes: "Fresh, stems removed" },
  { name: "Cantaloupe", benefits: "Low calorie, high water content", notes: "No seeds or rind" },
  { name: "Zucchini", benefits: "Low calorie, vitamins", notes: "Raw or cooked" },
  { name: "Pears", benefits: "Fiber, vitamins C and K", notes: "No seeds or core" },
  { name: "Mango", benefits: "Vitamins A, B6, C, E", notes: "Remove pit, small amounts" },
  { name: "Celery", benefits: "Freshens breath, low calorie", notes: "Cut into small pieces" },
  { name: "Coconut", benefits: "Healthy fats, immune support", notes: "In moderation, no shell" },
  { name: "Pineapple", benefits: "Vitamins, bromelain enzyme", notes: "Fresh only, no core" },
  { name: "Raspberries", benefits: "Antioxidants, low sugar", notes: "In moderation" },
  { name: "Blackberries", benefits: "Fiber, vitamins C and K", notes: "Fresh or frozen" },
  { name: "Oranges", benefits: "Vitamin C, potassium", notes: "Small amounts, no peel" },
  { name: "Lean Beef", benefits: "Protein, iron, zinc", notes: "Cooked, no seasoning" },
];

const catSafeFoods: FoodItem[] = [
  { name: "Chicken", benefits: "Essential protein for obligate carnivores", notes: "Cooked, boneless, unseasoned" },
  { name: "Salmon", benefits: "Omega-3s for coat health", notes: "Cooked, no bones" },
  { name: "Turkey", benefits: "Lean protein source", notes: "Plain, no seasoning" },
  { name: "Tuna", benefits: "Protein and omega fatty acids", notes: "Occasional treat only" },
  { name: "Eggs", benefits: "Complete protein with amino acids", notes: "Fully cooked" },
  { name: "Pumpkin", benefits: "Fiber for digestion", notes: "Plain, pureed" },
  { name: "Blueberries", benefits: "Antioxidants", notes: "Occasional treat" },
  { name: "Watermelon", benefits: "Hydration, vitamins", notes: "Seedless, no rind" },
  { name: "Cooked Beef", benefits: "Protein and iron", notes: "Lean, unseasoned" },
  { name: "Sardines", benefits: "Omega-3s, calcium", notes: "In water, no salt" },
  { name: "Carrots", benefits: "Beta-carotene, fiber", notes: "Cooked, small pieces" },
  { name: "Spinach", benefits: "Iron and vitamins", notes: "Small amounts only" },
  { name: "Cantaloupe", benefits: "Vitamins A and C", notes: "Small amounts" },
  { name: "Bananas", benefits: "Potassium", notes: "Small pieces, rarely" },
  { name: "Rice", benefits: "Easy to digest", notes: "Plain, cooked" },
  { name: "Cucumber", benefits: "Hydrating snack", notes: "Peeled, small pieces" },
  { name: "Green Beans", benefits: "Low calorie fiber", notes: "Plain, cooked" },
  { name: "Peas", benefits: "Vitamins and protein", notes: "Plain, no pods" },
  { name: "Cranberries", benefits: "Urinary health support", notes: "Plain, small amounts" },
  { name: "Cooked Liver", benefits: "Vitamin A, iron", notes: "Small amounts only" },
  { name: "Whitefish", benefits: "Lean protein, omega-3s", notes: "Cooked, deboned" },
  { name: "Shrimp", benefits: "Protein, low calorie", notes: "Cooked, deveined, no shell" },
  { name: "Duck", benefits: "Protein, novel protein source", notes: "Cooked, no bones" },
  { name: "Rabbit", benefits: "Lean protein, hypoallergenic", notes: "Cooked, boneless" },
  { name: "Squash", benefits: "Fiber, vitamins", notes: "Cooked, mashed" },
  { name: "Asparagus", benefits: "Fiber, vitamins", notes: "Cooked, small pieces" },
  { name: "Zucchini", benefits: "Low calorie, hydrating", notes: "Cooked, small pieces" },
  { name: "Oatmeal", benefits: "Fiber, energy", notes: "Plain, cooked, occasional" },
  { name: "Cheese", benefits: "Protein, calcium", notes: "Small amounts, low lactose" },
  { name: "Plain Yogurt", benefits: "Probiotics, calcium", notes: "Unsweetened, small amounts" },
];

const INITIAL_ITEMS = 10;
const LOAD_MORE_COUNT = 10;

const SafeFoods = () => {
  const [activeTab, setActiveTab] = useState("dogs");
  const [dogItemsToShow, setDogItemsToShow] = useState(INITIAL_ITEMS);
  const [catItemsToShow, setCatItemsToShow] = useState(INITIAL_ITEMS);
  const { t } = useTranslation();

  const handleShowMoreDogs = () => {
    setDogItemsToShow(prev => Math.min(prev + LOAD_MORE_COUNT, dogSafeFoods.length));
  };

  const handleShowMoreCats = () => {
    setCatItemsToShow(prev => Math.min(prev + LOAD_MORE_COUNT, catSafeFoods.length));
  };

  const visibleDogFoods = dogSafeFoods.slice(0, dogItemsToShow);
  const visibleCatFoods = catSafeFoods.slice(0, catItemsToShow);
  const hasMoreDogs = dogItemsToShow < dogSafeFoods.length;
  const hasMoreCats = catItemsToShow < catSafeFoods.length;

  return (
    <div className="min-h-screen hero-gradient relative flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
            {t('safeFoods.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('safeFoods.subtitle')}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="dogs" className="flex items-center gap-2">
              <Dog className="w-4 h-4" />
              {t('safeFoods.dogsTab')}
            </TabsTrigger>
            <TabsTrigger value="cats" className="flex items-center gap-2">
              <Cat className="w-4 h-4" />
              {t('safeFoods.catsTab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dogs">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-safe/10 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-safe" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{t('safeFoods.title')} - {t('safeFoods.dogsTab')}</h2>
                  <p className="text-sm text-muted-foreground">{t('safeFoods.warning.description')}</p>
                </div>
              </div>
              
              <div className="grid gap-3">
                {visibleDogFoods.map((food, index) => (
                  <div 
                    key={food.name}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-background rounded-xl border border-border/50 hover:border-safe/30 transition-colors"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-safe/10 rounded-full flex items-center justify-center text-sm font-semibold text-safe">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{food.name}</h3>
                      <p className="text-sm text-muted-foreground">{t('safeFoods.benefits')} {food.benefits}</p>
                      {food.notes && (
                        <p className="text-xs text-safe mt-1 flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-safe"></span>
                          {t('safeFoods.note')} {food.notes}
                        </p>
                      )}
                    </div>
                    <a
                      href="https://amazon.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-[#E64A19]/5 whitespace-nowrap"
                      style={{ color: '#E64A19', borderColor: '#E64A19' }}
                    >
                      Buy on Amazon
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>

              {hasMoreDogs && (
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline" 
                    onClick={handleShowMoreDogs}
                    className="gap-2"
                  >
                    <ChevronDown className="w-4 h-4" />
                    {t('safeFoods.showMore') || 'Show More'} ({dogSafeFoods.length - dogItemsToShow} remaining)
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cats">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-safe/10 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-safe" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{t('safeFoods.title')} - {t('safeFoods.catsTab')}</h2>
                  <p className="text-sm text-muted-foreground">{t('safeFoods.warning.description')}</p>
                </div>
              </div>
              
              <div className="grid gap-3">
                {visibleCatFoods.map((food, index) => (
                  <div 
                    key={food.name}
                    className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border/50 hover:border-safe/30 transition-colors"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-safe/10 rounded-full flex items-center justify-center text-sm font-semibold text-safe">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{food.name}</h3>
                      <p className="text-sm text-muted-foreground">{t('safeFoods.benefits')} {food.benefits}</p>
                      {food.notes && (
                        <p className="text-xs text-safe mt-1 flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-safe"></span>
                          {t('safeFoods.note')} {food.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {hasMoreCats && (
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline" 
                    onClick={handleShowMoreCats}
                    className="gap-2"
                  >
                    <ChevronDown className="w-4 h-4" />
                    {t('safeFoods.showMore') || 'Show More'} ({catSafeFoods.length - catItemsToShow} remaining)
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-4 bg-caution/10 rounded-xl border border-caution/20">
          <p className="text-sm text-muted-foreground text-center">
            <strong className="text-foreground">⚠️ {t('safeFoods.warning.title')}:</strong> {t('safeFoods.warning.description')}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SafeFoods;
