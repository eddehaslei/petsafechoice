import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Weight, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface DoseResponseSliderProps {
  safetyLevel: "safe" | "caution" | "dangerous";
  toxicityThreshold?: string | null;
  foodName: string;
  petType: "dog" | "cat";
}

export function DoseResponseSlider({ safetyLevel, toxicityThreshold, foodName, petType }: DoseResponseSliderProps) {
  const { t } = useTranslation();
  const [weight, setWeight] = useState([10]);

  // Only show for caution foods with threshold info
  if (safetyLevel !== "caution" || !toxicityThreshold) return null;

  const kg = weight[0];

  const getRiskLevel = () => {
    if (kg <= 5) return { level: "high", color: "text-danger", bg: "bg-danger/10", label: "High Risk" };
    if (kg <= 15) return { level: "medium", color: "text-caution", bg: "bg-caution/10", label: "Moderate Risk" };
    return { level: "low", color: "text-safe", bg: "bg-safe/10", label: "Low Risk" };
  };

  const risk = getRiskLevel();

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 animate-fade-in">
      <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur p-5">
        <div className="flex items-center gap-2 mb-4">
          <Weight className="w-5 h-5 text-primary" />
          <h4 className="font-heading font-semibold text-sm">
            Dose-Response Calculator
          </h4>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Pet Weight</span>
              <span className="text-lg font-bold text-foreground">{kg} kg</span>
            </div>
            <Slider
              value={weight}
              onValueChange={setWeight}
              min={1}
              max={60}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 kg</span>
              <span>60+ kg</span>
            </div>
          </div>

          <div className={cn("rounded-xl p-3 flex items-start gap-3", risk.bg)}>
            {risk.level === "high" ? (
              <AlertTriangle className={cn("w-5 h-5 mt-0.5 shrink-0", risk.color)} />
            ) : risk.level === "low" ? (
              <CheckCircle2 className={cn("w-5 h-5 mt-0.5 shrink-0", risk.color)} />
            ) : (
              <Info className={cn("w-5 h-5 mt-0.5 shrink-0", risk.color)} />
            )}
            <div>
              <p className={cn("font-semibold text-sm", risk.color)}>
                At {kg}kg: {risk.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {toxicityThreshold}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
