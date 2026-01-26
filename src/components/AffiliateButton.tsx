import { ShoppingBag, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchStore } from "@/stores/searchStore";

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
  const petType = useSearchStore((state) => state.petType);
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
  
  // Get pet type label
  const petLabel = currentLanguage === 'es'
    ? (petType === 'dog' ? 'Perro' : 'Gato')
    : (petType === 'dog' ? 'Dog' : 'Cat');

  // Localized button text with pet type
  const buttonText = currentLanguage === 'es'
    ? `Ver ${displayName} para ${petLabel} en Amazon`
    : `Shop ${displayName} for ${petLabel}s on Amazon`;

  // Generate Amazon.com fallback URL for Spanish users
  const getGlobalFallbackUrl = () => {
    const petWord = petType === 'dog' ? 'dog' : 'cat';
    const searchTerm = encodeURIComponent(`best ${productName} ${petWord}`);
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
