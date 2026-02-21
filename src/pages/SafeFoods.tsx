import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Dog, Cat, Check, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { buildAmazonAffiliateUrl } from "@/lib/amazonAffiliateUrl";

interface FoodItem {
  key: string;
  nameKey: string;
  nameFallback: string;
  benefitsKey: string;
  benefitsFallback: string;
  notesKey?: string;
  notesFallback?: string;
}

const dogSafeFoodKeys: FoodItem[] = [
  { key: "chicken", nameKey: "safeFoods.foods.dog.chicken.name", nameFallback: "Chicken", benefitsKey: "safeFoods.foods.dog.chicken.benefits", benefitsFallback: "Lean protein source, easy to digest", notesKey: "safeFoods.foods.dog.chicken.notes", notesFallback: "Cooked, boneless, unseasoned" },
  { key: "carrots", nameKey: "safeFoods.foods.dog.carrots.name", nameFallback: "Carrots", benefitsKey: "safeFoods.foods.dog.carrots.benefits", benefitsFallback: "Low calorie, high in fiber and beta-carotene", notesKey: "safeFoods.foods.dog.carrots.notes", notesFallback: "Raw or cooked" },
  { key: "blueberries", nameKey: "safeFoods.foods.dog.blueberries.name", nameFallback: "Blueberries", benefitsKey: "safeFoods.foods.dog.blueberries.benefits", benefitsFallback: "Rich in antioxidants and vitamins", notesKey: "safeFoods.foods.dog.blueberries.notes", notesFallback: "Fresh or frozen" },
  { key: "peanutButter", nameKey: "safeFoods.foods.dog.peanutButter.name", nameFallback: "Peanut Butter", benefitsKey: "safeFoods.foods.dog.peanutButter.benefits", benefitsFallback: "Protein and healthy fats", notesKey: "safeFoods.foods.dog.peanutButter.notes", notesFallback: "Xylitol-free only" },
  { key: "pumpkin", nameKey: "safeFoods.foods.dog.pumpkin.name", nameFallback: "Pumpkin", benefitsKey: "safeFoods.foods.dog.pumpkin.benefits", benefitsFallback: "Aids digestion, high in fiber", notesKey: "safeFoods.foods.dog.pumpkin.notes", notesFallback: "Plain, cooked, no spices" },
  { key: "sweetPotatoes", nameKey: "safeFoods.foods.dog.sweetPotatoes.name", nameFallback: "Sweet Potatoes", benefitsKey: "safeFoods.foods.dog.sweetPotatoes.benefits", benefitsFallback: "Vitamins A, C, and B6", notesKey: "safeFoods.foods.dog.sweetPotatoes.notes", notesFallback: "Cooked, no seasoning" },
  { key: "watermelon", nameKey: "safeFoods.foods.dog.watermelon.name", nameFallback: "Watermelon", benefitsKey: "safeFoods.foods.dog.watermelon.benefits", benefitsFallback: "Hydrating, vitamins A, B6, C", notesKey: "safeFoods.foods.dog.watermelon.notes", notesFallback: "Seedless, no rind" },
  { key: "apples", nameKey: "safeFoods.foods.dog.apples.name", nameFallback: "Apples", benefitsKey: "safeFoods.foods.dog.apples.benefits", benefitsFallback: "Fiber, vitamins A and C", notesKey: "safeFoods.foods.dog.apples.notes", notesFallback: "No seeds or core" },
  { key: "greenBeans", nameKey: "safeFoods.foods.dog.greenBeans.name", nameFallback: "Green Beans", benefitsKey: "safeFoods.foods.dog.greenBeans.benefits", benefitsFallback: "Low calorie, filling", notesKey: "safeFoods.foods.dog.greenBeans.notes", notesFallback: "Plain, no salt" },
  { key: "salmon", nameKey: "safeFoods.foods.dog.salmon.name", nameFallback: "Salmon", benefitsKey: "safeFoods.foods.dog.salmon.benefits", benefitsFallback: "Omega-3 fatty acids", notesKey: "safeFoods.foods.dog.salmon.notes", notesFallback: "Cooked, boneless" },
  { key: "eggs", nameKey: "safeFoods.foods.dog.eggs.name", nameFallback: "Eggs", benefitsKey: "safeFoods.foods.dog.eggs.benefits", benefitsFallback: "Complete protein source", notesKey: "safeFoods.foods.dog.eggs.notes", notesFallback: "Fully cooked" },
  { key: "oatmeal", nameKey: "safeFoods.foods.dog.oatmeal.name", nameFallback: "Oatmeal", benefitsKey: "safeFoods.foods.dog.oatmeal.benefits", benefitsFallback: "Fiber, good for sensitive stomachs", notesKey: "safeFoods.foods.dog.oatmeal.notes", notesFallback: "Plain, cooked" },
  { key: "bananas", nameKey: "safeFoods.foods.dog.bananas.name", nameFallback: "Bananas", benefitsKey: "safeFoods.foods.dog.bananas.benefits", benefitsFallback: "Potassium, vitamins", notesKey: "safeFoods.foods.dog.bananas.notes", notesFallback: "In moderation" },
  { key: "cucumber", nameKey: "safeFoods.foods.dog.cucumber.name", nameFallback: "Cucumber", benefitsKey: "safeFoods.foods.dog.cucumber.benefits", benefitsFallback: "Hydrating, low calorie", notesKey: "safeFoods.foods.dog.cucumber.notes", notesFallback: "Great for overweight dogs" },
  { key: "rice", nameKey: "safeFoods.foods.dog.rice.name", nameFallback: "Rice", benefitsKey: "safeFoods.foods.dog.rice.benefits", benefitsFallback: "Easy to digest carbohydrate", notesKey: "safeFoods.foods.dog.rice.notes", notesFallback: "White or brown, plain" },
  { key: "spinach", nameKey: "safeFoods.foods.dog.spinach.name", nameFallback: "Spinach", benefitsKey: "safeFoods.foods.dog.spinach.benefits", benefitsFallback: "Iron, vitamins K, A, C", notesKey: "safeFoods.foods.dog.spinach.notes", notesFallback: "Small amounts" },
  { key: "turkey", nameKey: "safeFoods.foods.dog.turkey.name", nameFallback: "Turkey", benefitsKey: "safeFoods.foods.dog.turkey.benefits", benefitsFallback: "Lean protein", notesKey: "safeFoods.foods.dog.turkey.notes", notesFallback: "Plain, no bones or skin" },
  { key: "broccoli", nameKey: "safeFoods.foods.dog.broccoli.name", nameFallback: "Broccoli", benefitsKey: "safeFoods.foods.dog.broccoli.benefits", benefitsFallback: "Fiber, vitamin C", notesKey: "safeFoods.foods.dog.broccoli.notes", notesFallback: "Small amounts only" },
  { key: "strawberries", nameKey: "safeFoods.foods.dog.strawberries.name", nameFallback: "Strawberries", benefitsKey: "safeFoods.foods.dog.strawberries.benefits", benefitsFallback: "Fiber, vitamin C", notesKey: "safeFoods.foods.dog.strawberries.notes", notesFallback: "Fresh, stems removed" },
  { key: "cantaloupe", nameKey: "safeFoods.foods.dog.cantaloupe.name", nameFallback: "Cantaloupe", benefitsKey: "safeFoods.foods.dog.cantaloupe.benefits", benefitsFallback: "Low calorie, high water content", notesKey: "safeFoods.foods.dog.cantaloupe.notes", notesFallback: "No seeds or rind" },
  { key: "zucchini", nameKey: "safeFoods.foods.dog.zucchini.name", nameFallback: "Zucchini", benefitsKey: "safeFoods.foods.dog.zucchini.benefits", benefitsFallback: "Low calorie, vitamins", notesKey: "safeFoods.foods.dog.zucchini.notes", notesFallback: "Raw or cooked" },
  { key: "pears", nameKey: "safeFoods.foods.dog.pears.name", nameFallback: "Pears", benefitsKey: "safeFoods.foods.dog.pears.benefits", benefitsFallback: "Fiber, vitamins C and K", notesKey: "safeFoods.foods.dog.pears.notes", notesFallback: "No seeds or core" },
  { key: "mango", nameKey: "safeFoods.foods.dog.mango.name", nameFallback: "Mango", benefitsKey: "safeFoods.foods.dog.mango.benefits", benefitsFallback: "Vitamins A, B6, C, E", notesKey: "safeFoods.foods.dog.mango.notes", notesFallback: "Remove pit, small amounts" },
  { key: "celery", nameKey: "safeFoods.foods.dog.celery.name", nameFallback: "Celery", benefitsKey: "safeFoods.foods.dog.celery.benefits", benefitsFallback: "Freshens breath, low calorie", notesKey: "safeFoods.foods.dog.celery.notes", notesFallback: "Cut into small pieces" },
  { key: "coconut", nameKey: "safeFoods.foods.dog.coconut.name", nameFallback: "Coconut", benefitsKey: "safeFoods.foods.dog.coconut.benefits", benefitsFallback: "Healthy fats, immune support", notesKey: "safeFoods.foods.dog.coconut.notes", notesFallback: "In moderation, no shell" },
  { key: "pineapple", nameKey: "safeFoods.foods.dog.pineapple.name", nameFallback: "Pineapple", benefitsKey: "safeFoods.foods.dog.pineapple.benefits", benefitsFallback: "Vitamins, bromelain enzyme", notesKey: "safeFoods.foods.dog.pineapple.notes", notesFallback: "Fresh only, no core" },
  { key: "raspberries", nameKey: "safeFoods.foods.dog.raspberries.name", nameFallback: "Raspberries", benefitsKey: "safeFoods.foods.dog.raspberries.benefits", benefitsFallback: "Antioxidants, low sugar", notesKey: "safeFoods.foods.dog.raspberries.notes", notesFallback: "In moderation" },
  { key: "blackberries", nameKey: "safeFoods.foods.dog.blackberries.name", nameFallback: "Blackberries", benefitsKey: "safeFoods.foods.dog.blackberries.benefits", benefitsFallback: "Fiber, vitamins C and K", notesKey: "safeFoods.foods.dog.blackberries.notes", notesFallback: "Fresh or frozen" },
  { key: "oranges", nameKey: "safeFoods.foods.dog.oranges.name", nameFallback: "Oranges", benefitsKey: "safeFoods.foods.dog.oranges.benefits", benefitsFallback: "Vitamin C, potassium", notesKey: "safeFoods.foods.dog.oranges.notes", notesFallback: "Small amounts, no peel" },
  { key: "leanBeef", nameKey: "safeFoods.foods.dog.leanBeef.name", nameFallback: "Lean Beef", benefitsKey: "safeFoods.foods.dog.leanBeef.benefits", benefitsFallback: "Protein, iron, zinc", notesKey: "safeFoods.foods.dog.leanBeef.notes", notesFallback: "Cooked, no seasoning" },
];

const catSafeFoodKeys: FoodItem[] = [
  { key: "chicken", nameKey: "safeFoods.foods.cat.chicken.name", nameFallback: "Chicken", benefitsKey: "safeFoods.foods.cat.chicken.benefits", benefitsFallback: "Essential protein for obligate carnivores", notesKey: "safeFoods.foods.cat.chicken.notes", notesFallback: "Cooked, boneless, unseasoned" },
  { key: "salmon", nameKey: "safeFoods.foods.cat.salmon.name", nameFallback: "Salmon", benefitsKey: "safeFoods.foods.cat.salmon.benefits", benefitsFallback: "Omega-3s for coat health", notesKey: "safeFoods.foods.cat.salmon.notes", notesFallback: "Cooked, no bones" },
  { key: "turkey", nameKey: "safeFoods.foods.cat.turkey.name", nameFallback: "Turkey", benefitsKey: "safeFoods.foods.cat.turkey.benefits", benefitsFallback: "Lean protein source", notesKey: "safeFoods.foods.cat.turkey.notes", notesFallback: "Plain, no seasoning" },
  { key: "tuna", nameKey: "safeFoods.foods.cat.tuna.name", nameFallback: "Tuna", benefitsKey: "safeFoods.foods.cat.tuna.benefits", benefitsFallback: "Protein and omega fatty acids", notesKey: "safeFoods.foods.cat.tuna.notes", notesFallback: "Occasional treat only" },
  { key: "eggs", nameKey: "safeFoods.foods.cat.eggs.name", nameFallback: "Eggs", benefitsKey: "safeFoods.foods.cat.eggs.benefits", benefitsFallback: "Complete protein with amino acids", notesKey: "safeFoods.foods.cat.eggs.notes", notesFallback: "Fully cooked" },
  { key: "pumpkin", nameKey: "safeFoods.foods.cat.pumpkin.name", nameFallback: "Pumpkin", benefitsKey: "safeFoods.foods.cat.pumpkin.benefits", benefitsFallback: "Fiber for digestion", notesKey: "safeFoods.foods.cat.pumpkin.notes", notesFallback: "Plain, pureed" },
  { key: "blueberries", nameKey: "safeFoods.foods.cat.blueberries.name", nameFallback: "Blueberries", benefitsKey: "safeFoods.foods.cat.blueberries.benefits", benefitsFallback: "Antioxidants", notesKey: "safeFoods.foods.cat.blueberries.notes", notesFallback: "Occasional treat" },
  { key: "watermelon", nameKey: "safeFoods.foods.cat.watermelon.name", nameFallback: "Watermelon", benefitsKey: "safeFoods.foods.cat.watermelon.benefits", benefitsFallback: "Hydration, vitamins", notesKey: "safeFoods.foods.cat.watermelon.notes", notesFallback: "Seedless, no rind" },
  { key: "cookedBeef", nameKey: "safeFoods.foods.cat.cookedBeef.name", nameFallback: "Cooked Beef", benefitsKey: "safeFoods.foods.cat.cookedBeef.benefits", benefitsFallback: "Protein and iron", notesKey: "safeFoods.foods.cat.cookedBeef.notes", notesFallback: "Lean, unseasoned" },
  { key: "sardines", nameKey: "safeFoods.foods.cat.sardines.name", nameFallback: "Sardines", benefitsKey: "safeFoods.foods.cat.sardines.benefits", benefitsFallback: "Omega-3s, calcium", notesKey: "safeFoods.foods.cat.sardines.notes", notesFallback: "In water, no salt" },
  { key: "carrots", nameKey: "safeFoods.foods.cat.carrots.name", nameFallback: "Carrots", benefitsKey: "safeFoods.foods.cat.carrots.benefits", benefitsFallback: "Beta-carotene, fiber", notesKey: "safeFoods.foods.cat.carrots.notes", notesFallback: "Cooked, small pieces" },
  { key: "spinach", nameKey: "safeFoods.foods.cat.spinach.name", nameFallback: "Spinach", benefitsKey: "safeFoods.foods.cat.spinach.benefits", benefitsFallback: "Iron and vitamins", notesKey: "safeFoods.foods.cat.spinach.notes", notesFallback: "Small amounts only" },
  { key: "cantaloupe", nameKey: "safeFoods.foods.cat.cantaloupe.name", nameFallback: "Cantaloupe", benefitsKey: "safeFoods.foods.cat.cantaloupe.benefits", benefitsFallback: "Vitamins A and C", notesKey: "safeFoods.foods.cat.cantaloupe.notes", notesFallback: "Small amounts" },
  { key: "bananas", nameKey: "safeFoods.foods.cat.bananas.name", nameFallback: "Bananas", benefitsKey: "safeFoods.foods.cat.bananas.benefits", benefitsFallback: "Potassium", notesKey: "safeFoods.foods.cat.bananas.notes", notesFallback: "Small pieces, rarely" },
  { key: "rice", nameKey: "safeFoods.foods.cat.rice.name", nameFallback: "Rice", benefitsKey: "safeFoods.foods.cat.rice.benefits", benefitsFallback: "Easy to digest", notesKey: "safeFoods.foods.cat.rice.notes", notesFallback: "Plain, cooked" },
  { key: "cucumber", nameKey: "safeFoods.foods.cat.cucumber.name", nameFallback: "Cucumber", benefitsKey: "safeFoods.foods.cat.cucumber.benefits", benefitsFallback: "Hydrating snack", notesKey: "safeFoods.foods.cat.cucumber.notes", notesFallback: "Peeled, small pieces" },
  { key: "greenBeans", nameKey: "safeFoods.foods.cat.greenBeans.name", nameFallback: "Green Beans", benefitsKey: "safeFoods.foods.cat.greenBeans.benefits", benefitsFallback: "Low calorie fiber", notesKey: "safeFoods.foods.cat.greenBeans.notes", notesFallback: "Plain, cooked" },
  { key: "peas", nameKey: "safeFoods.foods.cat.peas.name", nameFallback: "Peas", benefitsKey: "safeFoods.foods.cat.peas.benefits", benefitsFallback: "Vitamins and protein", notesKey: "safeFoods.foods.cat.peas.notes", notesFallback: "Plain, no pods" },
  { key: "cranberries", nameKey: "safeFoods.foods.cat.cranberries.name", nameFallback: "Cranberries", benefitsKey: "safeFoods.foods.cat.cranberries.benefits", benefitsFallback: "Urinary health support", notesKey: "safeFoods.foods.cat.cranberries.notes", notesFallback: "Plain, small amounts" },
  { key: "cookedLiver", nameKey: "safeFoods.foods.cat.cookedLiver.name", nameFallback: "Cooked Liver", benefitsKey: "safeFoods.foods.cat.cookedLiver.benefits", benefitsFallback: "Vitamin A, iron", notesKey: "safeFoods.foods.cat.cookedLiver.notes", notesFallback: "Small amounts only" },
  { key: "whitefish", nameKey: "safeFoods.foods.cat.whitefish.name", nameFallback: "Whitefish", benefitsKey: "safeFoods.foods.cat.whitefish.benefits", benefitsFallback: "Lean protein, omega-3s", notesKey: "safeFoods.foods.cat.whitefish.notes", notesFallback: "Cooked, deboned" },
  { key: "shrimp", nameKey: "safeFoods.foods.cat.shrimp.name", nameFallback: "Shrimp", benefitsKey: "safeFoods.foods.cat.shrimp.benefits", benefitsFallback: "Protein, low calorie", notesKey: "safeFoods.foods.cat.shrimp.notes", notesFallback: "Cooked, deveined, no shell" },
  { key: "duck", nameKey: "safeFoods.foods.cat.duck.name", nameFallback: "Duck", benefitsKey: "safeFoods.foods.cat.duck.benefits", benefitsFallback: "Protein, novel protein source", notesKey: "safeFoods.foods.cat.duck.notes", notesFallback: "Cooked, no bones" },
  { key: "rabbit", nameKey: "safeFoods.foods.cat.rabbit.name", nameFallback: "Rabbit", benefitsKey: "safeFoods.foods.cat.rabbit.benefits", benefitsFallback: "Lean protein, hypoallergenic", notesKey: "safeFoods.foods.cat.rabbit.notes", notesFallback: "Cooked, boneless" },
  { key: "squash", nameKey: "safeFoods.foods.cat.squash.name", nameFallback: "Squash", benefitsKey: "safeFoods.foods.cat.squash.benefits", benefitsFallback: "Fiber, vitamins", notesKey: "safeFoods.foods.cat.squash.notes", notesFallback: "Cooked, mashed" },
  { key: "asparagus", nameKey: "safeFoods.foods.cat.asparagus.name", nameFallback: "Asparagus", benefitsKey: "safeFoods.foods.cat.asparagus.benefits", benefitsFallback: "Fiber, vitamins", notesKey: "safeFoods.foods.cat.asparagus.notes", notesFallback: "Cooked, small pieces" },
  { key: "zucchini", nameKey: "safeFoods.foods.cat.zucchini.name", nameFallback: "Zucchini", benefitsKey: "safeFoods.foods.cat.zucchini.benefits", benefitsFallback: "Low calorie, hydrating", notesKey: "safeFoods.foods.cat.zucchini.notes", notesFallback: "Cooked, small pieces" },
  { key: "oatmeal", nameKey: "safeFoods.foods.cat.oatmeal.name", nameFallback: "Oatmeal", benefitsKey: "safeFoods.foods.cat.oatmeal.benefits", benefitsFallback: "Fiber, energy", notesKey: "safeFoods.foods.cat.oatmeal.notes", notesFallback: "Plain, cooked, occasional" },
  { key: "cheese", nameKey: "safeFoods.foods.cat.cheese.name", nameFallback: "Cheese", benefitsKey: "safeFoods.foods.cat.cheese.benefits", benefitsFallback: "Protein, calcium", notesKey: "safeFoods.foods.cat.cheese.notes", notesFallback: "Small amounts, low lactose" },
  { key: "plainYogurt", nameKey: "safeFoods.foods.cat.plainYogurt.name", nameFallback: "Plain Yogurt", benefitsKey: "safeFoods.foods.cat.plainYogurt.benefits", benefitsFallback: "Probiotics, calcium", notesKey: "safeFoods.foods.cat.plainYogurt.notes", notesFallback: "Unsweetened, small amounts" },
];

const INITIAL_ITEMS = 10;
const LOAD_MORE_COUNT = 10;

interface FoodCardProps {
  food: FoodItem;
  index: number;
  petType: "dog" | "cat";
  countryCode: string | null;
}

const FoodCard = ({ food, index, petType, countryCode }: FoodCardProps) => {
  const { t } = useTranslation();
  const name = t(food.nameKey, food.nameFallback);
  const benefits = t(food.benefitsKey, food.benefitsFallback);
  const notes = food.notesKey ? t(food.notesKey, food.notesFallback) : undefined;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-background rounded-xl border border-border/50 hover:border-safe/30 transition-colors">
      <span className="flex-shrink-0 w-8 h-8 bg-safe/10 rounded-full flex items-center justify-center text-sm font-semibold text-safe">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{t('safeFoods.benefits')} {benefits}</p>
        {notes && (
          <p className="text-xs text-safe mt-1 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-safe"></span>
            {t('safeFoods.note')} {notes}
          </p>
        )}
      </div>
      <a
        href={buildAmazonAffiliateUrl(food.nameFallback, petType, countryCode)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-[#E64A19]/5 whitespace-nowrap"
        style={{ color: '#E64A19', borderColor: '#E64A19' }}
      >
        Buy on Amazon
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};

const SafeFoods = () => {
  const [activeTab, setActiveTab] = useState("dogs");
  const [dogItemsToShow, setDogItemsToShow] = useState(INITIAL_ITEMS);
  const [catItemsToShow, setCatItemsToShow] = useState(INITIAL_ITEMS);
  const { t } = useTranslation();
  const { countryCode } = useGeoLocation();

  const handleShowMoreDogs = () => {
    setDogItemsToShow(prev => Math.min(prev + LOAD_MORE_COUNT, dogSafeFoodKeys.length));
  };

  const handleShowMoreCats = () => {
    setCatItemsToShow(prev => Math.min(prev + LOAD_MORE_COUNT, catSafeFoodKeys.length));
  };

  const visibleDogFoods = dogSafeFoodKeys.slice(0, dogItemsToShow);
  const visibleCatFoods = catSafeFoodKeys.slice(0, catItemsToShow);
  const hasMoreDogs = dogItemsToShow < dogSafeFoodKeys.length;
  const hasMoreCats = catItemsToShow < catSafeFoodKeys.length;

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
                  <FoodCard key={food.key} food={food} index={index} petType="dog" countryCode={countryCode} />
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
                    {t('safeFoods.showMore') || 'Show More'} ({dogSafeFoodKeys.length - dogItemsToShow} remaining)
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
                  <FoodCard key={food.key} food={food} index={index} petType="cat" countryCode={countryCode} />
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
                    {t('safeFoods.showMore') || 'Show More'} ({catSafeFoodKeys.length - catItemsToShow} remaining)
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
