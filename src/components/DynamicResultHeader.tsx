import { SafetyResultData } from "./SafetyResult";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DynamicResultHeaderProps {
  data: SafetyResultData;
}

export function DynamicResultHeader({ data }: DynamicResultHeaderProps) {
  const { t, i18n } = useTranslation();
  
  const petName = data.petType === "dog" 
    ? (i18n.language.startsWith('es') ? "Perros" : "Dogs")
    : (i18n.language.startsWith('es') ? "Gatos" : "Cats");
  const foodName = data.food.charAt(0).toUpperCase() + data.food.slice(1);

  // Format date in user's language
  const formattedDate = new Date().toLocaleDateString(i18n.language, { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 text-center">
      {/* Freshness Signal - SEO timestamp */}
      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
        <Calendar className="w-3.5 h-3.5" />
        <span>{t('resultHeader.lastUpdated')} {formattedDate}</span>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
        {t('resultHeader.canEat', { petName, foodName })}
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        {t('resultHeader.safetyGuide')}
      </p>
    </div>
  );
}
