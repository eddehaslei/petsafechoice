import { Droplets, Leaf, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TrendItem {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  titleFallback: string;
  descKey: string;
  descFallback: string;
}

const trends: TrendItem[] = [
  {
    id: "salmon-oil",
    icon: <Droplets className="w-6 h-6 text-primary" />,
    titleKey: "trends.salmonOil.title",
    titleFallback: "Salmon Oil",
    descKey: "trends.salmonOil.desc",
    descFallback: "Rich in Omega-3 fatty acids for coat health and joint support.",
  },
  {
    id: "cbd",
    icon: <Leaf className="w-6 h-6 text-safe" />,
    titleKey: "trends.cbd.title",
    titleFallback: "CBD for Pets",
    descKey: "trends.cbd.desc",
    descFallback: "Growing interest in pet-safe CBD for anxiety and pain management.",
  },
  {
    id: "raw-diet",
    icon: <Sparkles className="w-6 h-6 text-caution" />,
    titleKey: "trends.rawDiet.title",
    titleFallback: "Raw & Air-Dried Diets",
    descKey: "trends.rawDiet.desc",
    descFallback: "Minimally processed foods gaining popularity among pet parents.",
  },
];

export function TrendingIn2026() {
  const { t } = useTranslation();

  return (
    <section className="w-full max-w-2xl mx-auto mt-10 px-4">
      <h2 className="text-lg font-heading font-bold text-foreground mb-4 text-center">
        {t('trends.title', '🔥 Trending in 2026')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trends.map((trend) => (
          <div
            key={trend.id}
            className="bg-card border border-border/50 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              {trend.icon}
            </div>
            <h3 className="font-semibold text-sm text-foreground mb-1">
              {t(trend.titleKey, trend.titleFallback)}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t(trend.descKey, trend.descFallback)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
