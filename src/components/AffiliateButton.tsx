import { ShoppingBag, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

// Common food name translations for button display
const FOOD_TRANSLATIONS_ES: Record<string, string> = {
  "apple": "Manzana",
  "banana": "Plátano",
  "blueberry": "Arándano",
  "blueberries": "Arándanos",
  "carrot": "Zanahoria",
  "carrots": "Zanahorias",
  "chicken": "Pollo",
  "chocolate": "Chocolate",
  "egg": "Huevo",
  "eggs": "Huevos",
  "fish": "Pescado",
  "grapes": "Uvas",
  "grape": "Uva",
  "meat": "Carne",
  "milk": "Leche",
  "onion": "Cebolla",
  "onions": "Cebollas",
  "peanut butter": "Mantequilla de Maní",
  "pumpkin": "Calabaza",
  "rice": "Arroz",
  "salmon": "Salmón",
  "salmon oil": "Aceite de Salmón",
  "spinach": "Espinaca",
  "strawberry": "Fresa",
  "strawberries": "Fresas",
  "sweet potato": "Batata",
  "tuna": "Atún",
  "turkey": "Pavo",
  "watermelon": "Sandía",
  "yogurt": "Yogur",
  "cheese": "Queso",
  "beef": "Carne de Res",
  "pork": "Cerdo",
  "honey": "Miel",
  "oatmeal": "Avena",
  "broccoli": "Brócoli",
  "cucumber": "Pepino",
  "mango": "Mango",
  "coconut": "Coco",
  "coconut oil": "Aceite de Coco",
  "liver": "Hígado",
  "shrimp": "Camarones",
  "natural freeze-dried treats": "Snacks Liofilizados Naturales",
};

interface AffiliateButtonProps {
  productName: string;
  affiliateUrl: string;
}

export function AffiliateButton({ productName, affiliateUrl }: AffiliateButtonProps) {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language?.split('-')[0] || 'en';

  const handleClick = () => {
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  // Translate product name for display
  const getDisplayName = () => {
    if (currentLanguage === 'es') {
      const lowerName = productName.toLowerCase().trim();
      return FOOD_TRANSLATIONS_ES[lowerName] || productName;
    }
    return productName;
  };

  const displayName = getDisplayName();

  // Localized button text
  const buttonText = currentLanguage === 'es'
    ? `Ver ${displayName} en Amazon`
    : `Shop Best-Selling ${displayName} on Amazon`;

  // Generate Amazon.com fallback URL for Spanish users
  const getGlobalFallbackUrl = () => {
    const searchTerm = encodeURIComponent(`best ${productName}`);
    return `https://www.amazon.com/s?k=${searchTerm}&tag=petsafechoice-20`;
  };

  return (
    <div className="flex flex-col items-center w-full gap-2">
      <button
        onClick={handleClick}
        className="w-[90%] sm:w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5 rounded-2xl font-bold text-white text-base sm:text-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
        style={{ backgroundColor: '#F28C74' }}
      >
        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
        <span className="text-center leading-tight">{buttonText}</span>
        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
      </button>
      
      {/* Regional fallback for Spanish users */}
      {currentLanguage === 'es' && (
        <a
          href={getGlobalFallbackUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
        >
          ¿No lo encuentras? Ver en Amazon Global (.com)
        </a>
      )}
    </div>
  );
}
