import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SafetyResultData } from "./SafetyResult";
import { VetVerifiedBadge } from "./VetVerifiedBadge";
import { isLiquidFood } from "@/lib/liquidFoods";

interface FeaturedSnippetProps {
  data: SafetyResultData;
}

export function FeaturedSnippet({ data }: FeaturedSnippetProps) {
  const { t, i18n } = useTranslation();
  
  const petName = data.petType === "dog" ? t('petToggle.dog').toLowerCase() + "s" : t('petToggle.cat').toLowerCase() + "s";
  const foodName = data.food.charAt(0).toUpperCase() + data.food.slice(1);
  const isLiquid = isLiquidFood(data.food);

  const getAnswer = () => {
    const lang = i18n.language.split('-')[0];
    
    switch (data.safetyLevel) {
      case "safe":
        if (isLiquid) {
          // Use "drink" for liquids
          if (lang === 'es') {
            return `Sí, los ${petName} pueden beber ${foodName.toLowerCase()} de forma segura.`;
          }
          return `Yes, ${petName} can safely drink ${foodName.toLowerCase()}.`;
        }
        return t('featuredSnippet.safeAnswer', { petType: petName, food: foodName.toLowerCase() });
      case "caution":
        if (isLiquid) {
          if (lang === 'es') {
            return `${foodName} debe darse a los ${petName} con precaución.`;
          }
          return `${foodName} should be given to ${petName} with caution.`;
        }
        return t('featuredSnippet.cautionAnswer', { petType: petName, food: foodName });
      case "dangerous":
        if (isLiquid) {
          if (lang === 'es') {
            return `¡No! ${foodName} es tóxico para los ${petName}.`;
          }
          return `No! ${foodName} is toxic to ${petName}.`;
        }
        return t('featuredSnippet.dangerousAnswer', { petType: petName, food: foodName });
    }
  };

  const config = {
    safe: {
      icon: CheckCircle,
      bgClass: "bg-safe/5 border-safe/30",
      iconClass: "text-safe",
      answerClass: "text-safe",
    },
    caution: {
      icon: AlertTriangle,
      bgClass: "bg-caution/5 border-caution/30",
      iconClass: "text-caution",
      answerClass: "text-caution",
    },
    dangerous: {
      icon: XCircle,
      bgClass: "bg-danger/5 border-danger/30",
      iconClass: "text-danger",
      answerClass: "text-danger",
    },
  };

  const { icon: Icon, bgClass, iconClass, answerClass } = config[data.safetyLevel];
  const formattedDate = new Date().toLocaleDateString(i18n.language, { month: 'short', year: 'numeric' });

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 animate-fade-in">
      {/* Featured Snippet Box - Optimized for Google */}
      <div className={`rounded-2xl border-2 p-5 ${bgClass}`}>
        {/* Quick Answer - the "snippet" Google may display */}
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <Icon className={`w-8 h-8 ${iconClass}`} />
          </div>
          <div className="flex-1">
            {/* Primary Answer - Large and scannable */}
            <p className={`text-xl font-bold leading-tight mb-2 ${answerClass}`}>
              {getAnswer()}
            </p>
            
            {/* Supporting Summary */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.summary}
            </p>
            
            {/* Trust Signal */}
            <div className="mt-3 flex items-center gap-2">
              <VetVerifiedBadge variant="compact" />
              <span className="text-xs text-muted-foreground">
                {t('featuredSnippet.updated', { date: formattedDate })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
