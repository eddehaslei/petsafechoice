import { SafetyResultData } from "./SafetyResult";
import { Calendar } from "lucide-react";

interface DynamicResultHeaderProps {
  data: SafetyResultData;
}

export function DynamicResultHeader({ data }: DynamicResultHeaderProps) {
  const petName = data.petType === "dog" ? "Dogs" : "Cats";
  const foodName = data.food.charAt(0).toUpperCase() + data.food.slice(1);

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 text-center">
      {/* Freshness Signal - SEO timestamp */}
      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
        <Calendar className="w-3.5 h-3.5" />
        <span>Last Updated: January 2026</span>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
        Can {petName} Eat {foodName}?
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Safety & Health Guide
      </p>
    </div>
  );
}
