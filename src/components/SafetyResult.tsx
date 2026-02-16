import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { VerifiedDataBadge } from "./VerifiedDataBadge";
import { isLiquidFood } from "@/lib/liquidFoods";

export type SafetyLevel = "safe" | "caution" | "dangerous";

export interface SafetyResultData {
  food: string;
  petType: "dog" | "cat";
  safetyLevel: SafetyLevel;
  summary: string;
  details: string;
  symptoms?: string[];
  recommendations?: string[];
  ingredients?: string[];
  toxicityThreshold?: string | null;
  source?: { name: string; url: string } | null;
}

interface SafetyResultProps {
  data: SafetyResultData;
}

export function SafetyResult({ data }: SafetyResultProps) {
  const { t, i18n } = useTranslation();
  
  // Determine if food is liquid - use "Drink" instead of "Eat"
  const isLiquid = isLiquidFood(data.food);
  const lang = i18n.language.split('-')[0];
  
  // Get the appropriate title based on safety level and food type
  const getSafeTitle = () => {
    if (isLiquid) {
      return lang === 'es' ? 'Seguro para Beber' : 'Safe to Drink';
    }
    return t('safety.safeTitle');
  };

  const safetyConfig = {
    safe: {
      icon: CheckCircle2,
      title: getSafeTitle(),
      bgClass: "bg-safe-bg",
      borderClass: "border-safe/30",
      iconClass: "text-safe",
      badgeClass: "safety-badge-safe",
    },
    caution: {
      icon: AlertTriangle,
      title: t('safety.cautionTitle'),
      bgClass: "bg-caution-bg",
      borderClass: "border-caution/30",
      iconClass: "text-caution",
      badgeClass: "safety-badge-caution",
    },
    dangerous: {
      icon: XCircle,
      title: t('safety.dangerousTitle'),
      bgClass: "bg-danger-bg",
      borderClass: "border-danger/30",
      iconClass: "text-danger",
      badgeClass: "safety-badge-danger",
    },
  };

  const config = safetyConfig[data.safetyLevel];
  const Icon = config.icon;

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up pb-8">
      <div
        className={cn(
          "rounded-3xl border-2 overflow-hidden card-shadow-lg",
          config.bgClass,
          config.borderClass
        )}
      >
        {/* Verified Data Badge */}
        <div className="px-6 pt-4 pb-3">
          <VerifiedDataBadge />
        </div>

        {/* Content */}
        <div className="px-6 pb-8 space-y-4">
          {/* Summary */}
          <div className="bg-card/80 backdrop-blur rounded-2xl p-4 border border-border/50">
            <p className="text-foreground font-medium leading-relaxed">
              {data.summary}
            </p>
          </div>

          {/* Details */}
          <div className="bg-card/60 rounded-2xl p-4 border border-border/30">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-muted-foreground text-sm leading-relaxed">
                {data.details}
              </p>
            </div>
          </div>

          {/* Symptoms */}
          {data.symptoms && data.symptoms.length > 0 && (
            <div className="bg-card/60 rounded-2xl p-4 border border-border/30">
              <h4 className="font-heading font-semibold text-sm mb-2 text-foreground">
                {t('safety.symptoms')}:
              </h4>
              <ul className="space-y-1">
                {data.symptoms.map((symptom, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {data.recommendations && data.recommendations.length > 0 && (
            <div className="bg-card/60 rounded-2xl p-4 border border-border/30">
              <h4 className="font-heading font-semibold text-sm mb-2 text-foreground">
                {t('safety.recommendations')}:
              </h4>
              <ul className="space-y-1">
                {data.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted-foreground mt-4 px-4">
        {t('safety.disclaimer')}
      </p>
    </div>
  );
}
