import { useState } from "react";
import { TrendingUp, Sparkles, Leaf, Fish, AlertTriangle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TrendingTopic {
  id: string;
  icon: React.ReactNode;
  title: string;
  keyword: string;
  summary: string;
  badge: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
}

const trendingTopics: TrendingTopic[] = [
  {
    id: "salmon-oil",
    icon: <Fish className="w-5 h-5" />,
    title: "Salmon Oil Benefits",
    keyword: "Best Salmon Oil 2026",
    summary: "Liquid gold for fur health. Safe in daily small doses for both dogs and cats.",
    badge: "Trending",
    badgeVariant: "default",
  },
  {
    id: "mushrooms",
    icon: <Sparkles className="w-5 h-5" />,
    title: "Medicinal Mushrooms",
    keyword: "Medicinal Mushrooms Dogs",
    summary: "Lion's Mane and Reishi support senior pet brain health and cognitive function.",
    badge: "New Research",
    badgeVariant: "secondary",
  },
  {
    id: "spring-safety",
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Spring Flower Toxicity",
    keyword: "Toxic Spring Flowers",
    summary: "Lilies and Tulips are high-risk for cats and dogs. Keep pets away from spring bouquets.",
    badge: "Seasonal Alert",
    badgeVariant: "destructive",
  },
  {
    id: "air-dried",
    icon: <Leaf className="w-5 h-5" />,
    title: "Air-Dried Raw Food",
    keyword: "Air-Dried Raw Food",
    summary: "The safest middle ground between kibble and raw diets. Retains nutrients without bacteria risk.",
    badge: "Diet Trend",
    badgeVariant: "outline",
  },
];

interface TrendingSafetyTipsProps {
  onTopicClick?: (keyword: string) => void;
}

export function TrendingSafetyTips({ onTopicClick }: TrendingSafetyTipsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-heading font-bold text-foreground">
          Trending Safety Tips
        </h2>
        <Badge variant="secondary" className="ml-2">2026</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trendingTopics.map((topic) => (
          <Card
            key={topic.id}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
              "bg-card/50 backdrop-blur-sm border-border/50",
              hoveredId === topic.id && "border-primary/50 shadow-primary/10"
            )}
            onMouseEnter={() => setHoveredId(topic.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onTopicClick?.(topic.keyword)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{topic.title}</h3>
                    <p className="text-xs text-muted-foreground">{topic.keyword}</p>
                  </div>
                </div>
                <Badge variant={topic.badgeVariant} className="text-xs">
                  {topic.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {topic.summary}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
                <span>Learn more</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </CardContent>
          </Card>
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
