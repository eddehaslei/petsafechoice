import { useState } from "react";
import { PetToggle } from "@/components/PetToggle";
import { FoodSearch } from "@/components/FoodSearch";
import { SafetyResult, SafetyResultData } from "@/components/SafetyResult";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dog, Cat, Heart } from "lucide-react";

type PetType = "dog" | "cat";

const Index = () => {
  const [petType, setPetType] = useState<PetType>("dog");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SafetyResultData | null>(null);

  const handleSearch = async (food: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("check-food-safety", {
        body: { food, petType },
      });

      if (error) {
        console.error("Edge function error:", error);
        
        if (error.message?.includes("429") || error.status === 429) {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else if (error.message?.includes("402") || error.status === 402) {
          toast.error("Service temporarily unavailable. Please try again later.");
        } else {
          toast.error("Failed to check food safety. Please try again.");
        }
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setResult(data);
    } catch (err) {
      console.error("Error checking food safety:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient relative">
      <Header />
      {/* Hero Section */}
      <div className="container max-w-4xl mx-auto px-4 pt-16 pb-8">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="relative">
              <Dog className="w-10 h-10 text-primary animate-bounce-gentle" />
            </div>
            <Heart className="w-6 h-6 text-primary/60" />
            <div className="relative">
              <Cat className="w-10 h-10 text-primary animate-bounce-gentle" style={{ animationDelay: "0.5s" }} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-3">
            Can My Pet Eat This?
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Science-backed food safety information for dogs and cats. Know what's safe before you share!
          </p>
        </div>

        {/* Pet Toggle */}
        <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <PetToggle value={petType} onChange={setPetType} />
        </div>

        {/* Search */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <FoodSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Popular Foods */}
        {!result && !isLoading && (
          <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Chocolate", "Grapes", "Chicken", "Peanut Butter", "Bananas", "Avocado"].map((food) => (
                <button
                  key={food}
                  onClick={() => handleSearch(food)}
                  className="px-4 py-2 bg-card hover:bg-accent rounded-full text-sm font-medium text-foreground border border-border hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
                >
                  {food}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {(result || isLoading) && (
        <div className="container max-w-4xl mx-auto px-4 pb-16">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-muted-foreground font-medium">
                Checking if it's safe for your {petType}...
              </p>
            </div>
          ) : result ? (
            <SafetyResult data={result} />
          ) : null}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Index;
