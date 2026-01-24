import { useState } from "react";
import { Sparkles, Leaf, Fish, Heart, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendingTopic {
  id: string;
  icon: React.ReactNode;
  title: string;
  keyword: string;
  summary: string;
  badge: string;
  badgeColor: "coral" | "sage" | "cream";
}

const trendingTopics: TrendingTopic[] = [
  {
    id: "salmon-oil",
    icon: <Fish className="w-5 h-5" />,
    title: "The Salmon Oil Secret",
    keyword: "Best Salmon Oil 2026",
    summary: "Liquid gold for fur health. Safe in daily small doses for both dogs and cats.",
    badge: "Popular",
    badgeColor: "coral",
  },
  {
    id: "mushrooms",
    icon: <Sparkles className="w-5 h-5" />,
    title: "Mushroom Immunity",
    keyword: "Medicinal Mushrooms Dogs",
    summary: "Lion's Mane and Reishi support senior pet brain health and cognitive function.",
    badge: "New 2026",
    badgeColor: "sage",
  },
  {
    id: "air-dried",
    icon: <Leaf className="w-5 h-5" />,
    title: "Air-Dried Raw Food",
    keyword: "Air-Dried Raw Food",
    summary: "The safest middle ground between kibble and raw diets. Retains nutrients naturally.",
    badge: "Trending",
    badgeColor: "cream",
  },
];

interface TrendingSafetyTipsProps {
  onTopicClick?: (keyword: string) => void;
}

export function TrendingSafetyTips({ onTopicClick }: TrendingSafetyTipsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getBadgeClasses = (color: TrendingTopic["badgeColor"]) => {
    switch (color) {
      case "coral":
        return "bg-primary/90 text-primary-foreground";
      case "sage":
        return "bg-sage text-sage-foreground";
      case "cream":
        return "bg-cream text-cream-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-heading font-bold text-foreground">
          Trending Now
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {trendingTopics.map((topic) => (
          <div
            key={topic.id}
            className={cn(
              "group cursor-pointer rounded-3xl p-6",
              "bg-white/70 dark:bg-card/50 backdrop-blur-md",
              "border border-primary/10 dark:border-border/30",
              "transition-all duration-300 ease-out",
              "hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)]",
              "dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
            )}
            onMouseEnter={() => setHoveredId(topic.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onTopicClick?.(topic.keyword)}
          >
            {/* Badge */}
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full text-xs font-medium mb-4",
                getBadgeClasses(topic.badgeColor)
              )}
            >
              {topic.badge}
            </span>

            {/* Icon & Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                {topic.icon}
              </div>
              <h3 className="font-heading font-semibold text-foreground text-lg leading-tight">
                {topic.title}
              </h3>
            </div>

            {/* Summary */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {topic.summary}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-1 text-sm text-primary font-medium opacity-80 group-hover:opacity-100 transition-opacity">
              <span>Discover</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Schema JSON-LD for Trending Topics */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": trendingTopics.map((topic) => ({
              "@type": "Question",
              "name": `What is ${topic.title} for pets?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": topic.summary,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
