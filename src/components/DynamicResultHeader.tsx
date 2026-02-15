import { SafetyResultData } from "./SafetyResult";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { isLiquidFood } from "@/lib/liquidFoods";

interface DynamicResultHeaderProps {
  data: SafetyResultData;
}

export function DynamicResultHeader({ data }: DynamicResultHeaderProps) {
  const { t, i18n } = useTranslation();
  
  const petName = data.petType === "dog" 
    ? t('petToggle.dog') + "s"
    : t('petToggle.cat') + "s";
  const foodName = data.food.charAt(0).toUpperCase() + data.food.slice(1);

  const formattedDate = new Date().toLocaleDateString(i18n.language, { 
    month: 'long', 
    year: 'numeric' 
  });

  const getTitle = () => {
    return t('resultHeader.canEat', { petName, foodName });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 text-center">
      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
        <Calendar className="w-3.5 h-3.5" />
        <span>{t('resultHeader.lastUpdated')} {formattedDate}</span>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
        {getTitle()}
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        {t('resultHeader.safetyGuide')}
      </p>
    </div>
  );
}
