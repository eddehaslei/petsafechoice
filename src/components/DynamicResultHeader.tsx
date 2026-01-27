import { SafetyResultData } from "./SafetyResult";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { isLiquidFood, getCapitalizedVerb } from "@/lib/liquidFoods";

interface DynamicResultHeaderProps {
  data: SafetyResultData;
}

export function DynamicResultHeader({ data }: DynamicResultHeaderProps) {
  const { t, i18n } = useTranslation();
  
  const petName = data.petType === "dog" 
    ? (i18n.language.startsWith('es') ? "Perros" : "Dogs")
    : (i18n.language.startsWith('es') ? "Gatos" : "Cats");
  const foodName = data.food.charAt(0).toUpperCase() + data.food.slice(1);
  
  // Determine if food is liquid - use "Drink" instead of "Eat"
  const isLiquid = isLiquidFood(data.food);
  const verb = getCapitalizedVerb(data.food, i18n.language);

  // Format date in user's language
  const formattedDate = new Date().toLocaleDateString(i18n.language, { 
    month: 'long', 
    year: 'numeric' 
  });

  // Build the title dynamically with the correct verb
  const getTitle = () => {
    if (i18n.language.startsWith('es')) {
      const verbEs = isLiquid ? 'Beber' : 'Comer';
      return `¿Pueden los ${petName} ${verbEs} ${foodName}?`;
    }
    return `Can ${petName} ${verb} ${foodName}?`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 text-center">
      {/* Freshness Signal - SEO timestamp */}
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
