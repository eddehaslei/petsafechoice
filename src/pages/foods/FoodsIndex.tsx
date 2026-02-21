import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SafetyStatus = "safe" | "dangerous" | "caution";

interface FoodEntry {
  slug: string;
  name: string;
  emoji: string;
  dogStatus: SafetyStatus;
  catStatus: SafetyStatus;
}

const FOODS: FoodEntry[] = [
  { slug: "chocolate", name: "Chocolate", emoji: "🍫", dogStatus: "dangerous", catStatus: "dangerous" },
  { slug: "grapes", name: "Grapes & Raisins", emoji: "🍇", dogStatus: "dangerous", catStatus: "dangerous" },
  { slug: "chicken", name: "Chicken", emoji: "🍗", dogStatus: "safe", catStatus: "safe" },
  { slug: "avocado", name: "Avocado", emoji: "🥑", dogStatus: "caution", catStatus: "dangerous" },
  { slug: "peanut-butter", name: "Peanut Butter", emoji: "🥜", dogStatus: "caution", catStatus: "caution" },
  { slug: "bananas", name: "Bananas", emoji: "🍌", dogStatus: "safe", catStatus: "caution" },
  { slug: "onions", name: "Onions & Garlic", emoji: "🧅", dogStatus: "dangerous", catStatus: "dangerous" },
  { slug: "strawberries", name: "Strawberries", emoji: "🍓", dogStatus: "safe", catStatus: "caution" },
  { slug: "milk", name: "Milk & Dairy", emoji: "🥛", dogStatus: "caution", catStatus: "caution" },
  { slug: "watermelon", name: "Watermelon", emoji: "🍉", dogStatus: "safe", catStatus: "safe" },
];

const statusColors: Record<SafetyStatus, string> = {
  safe: "bg-safe text-safe-foreground",
  dangerous: "bg-danger text-danger-foreground",
  caution: "bg-caution text-caution-foreground",
};

const statusLabel: Record<SafetyStatus, string> = {
  safe: "Safe",
  dangerous: "Toxic",
  caution: "Caution",
};

export default function FoodsIndex() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Pet Food Safety Guides | PetSafeChoice</title>
        <meta name="description" content="Complete vet-reviewed food safety guides for dogs and cats. Learn which foods are safe, dangerous, or need caution." />
        <link rel="canonical" href="https://petsafechoice.lovable.app/foods" />
      </Helmet>

      <Header />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-foreground mb-2">
            🐾 Food Safety Guides
          </h1>
          <p className="text-muted-foreground">Vet-reviewed guides for the most searched pet foods</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {FOODS.map((food) => (
            <Link key={food.slug} to={`/foods/${food.slug}`}>
              <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5">
                <CardContent className="p-4 text-center">
                  <span className="text-3xl block mb-2">{food.emoji}</span>
                  <h2 className="font-heading font-bold text-sm mb-2">{food.name}</h2>
                  <div className="flex flex-col gap-1">
                    <Badge className={cn("text-[10px] px-1.5 py-0.5 justify-center", statusColors[food.dogStatus])}>
                      🐶 {statusLabel[food.dogStatus]}
                    </Badge>
                    <Badge className={cn("text-[10px] px-1.5 py-0.5 justify-center", statusColors[food.catStatus])}>
                      🐱 {statusLabel[food.catStatus]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
