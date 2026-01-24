import { Gift, ShoppingBag, ExternalLink, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SafeFoodWidgetProps {
  foodName: string;
  petType: "dog" | "cat";
}

// Affiliate product recommendations based on food type and pet
const getRecommendations = (food: string, petType: "dog" | "cat") => {
  const recommendations: Record<string, { title: string; description: string; icon: React.ReactNode }[]> = {
    dog: [
      {
        title: "Premium Training Treats",
        description: "Healthy, bite-sized rewards for positive reinforcement",
        icon: <Gift className="w-5 h-5" />,
      },
      {
        title: "Natural Freeze-Dried Snacks",
        description: "Single-ingredient treats with no additives",
        icon: <Sparkles className="w-5 h-5" />,
      },
    ],
    cat: [
      {
        title: "Gourmet Cat Treats",
        description: "Irresistible flavors cats love",
        icon: <Gift className="w-5 h-5" />,
      },
      {
        title: "Dental Health Treats",
        description: "Crunchy treats that support oral health",
        icon: <Sparkles className="w-5 h-5" />,
      },
    ],
  };

  return recommendations[petType] || recommendations.dog;
};

export function SafeFoodWidget({ foodName, petType }: SafeFoodWidgetProps) {
  const recommendations = getRecommendations(foodName, petType);
  
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 animate-slide-up">
      <div className="bg-safe/10 border-2 border-safe/30 rounded-2xl p-5 relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-safe/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-safe/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-safe" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground">
                Treat Recommendations
              </h3>
              <p className="text-xs text-muted-foreground">
                Vet-approved options your {petType} will love
              </p>
            </div>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-card/80 rounded-xl p-4 border border-border/50 hover:border-safe/40 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-safe/10 flex items-center justify-center text-safe group-hover:bg-safe/20 transition-colors">
                    {rec.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-foreground mb-0.5">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {rec.description}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-safe transition-colors shrink-0" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Affiliate disclosure */}
          <p className="mt-4 text-xs text-muted-foreground text-center">
            These are general recommendations. We may earn a small commission from qualifying purchases.
          </p>
        </div>
      </div>
    </div>
  );
}
