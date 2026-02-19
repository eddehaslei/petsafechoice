import { ShoppingBag, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchStore } from "@/stores/searchStore";

// Common food name translations for button display (EN → ES)
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

// Reverse translations: non-English food names → English (for Amazon.com Global search)
const REVERSE_TRANSLATIONS: Record<string, string> = {
  // Spanish → English
  "manzana": "apple", "plátano": "banana", "platano": "banana",
  "arándano": "blueberry", "arándanos": "blueberries",
  "zanahoria": "carrot", "zanahorias": "carrots",
  "pollo": "chicken", "huevo": "egg", "huevos": "eggs",
  "pescado": "fish", "uvas": "grapes", "uva": "grape",
  "carne": "meat", "leche": "milk", "cebolla": "onion", "cebollas": "onions",
  "mantequilla de maní": "peanut butter", "calabaza": "pumpkin",
  "arroz": "rice", "salmón": "salmon", "aceite de salmón": "salmon oil",
  "espinaca": "spinach", "fresa": "strawberry", "fresas": "strawberries",
  "batata": "sweet potato", "atún": "tuna", "pavo": "turkey",
  "sandía": "watermelon", "sandia": "watermelon",
  "yogur": "yogurt", "queso": "cheese", "carne de res": "beef",
  "cerdo": "pork", "miel": "honey", "avena": "oatmeal",
  "brócoli": "broccoli", "pepino": "cucumber", "coco": "coconut",
  "aceite de coco": "coconut oil", "hígado": "liver", "camarones": "shrimp",
  "galletas de algarrobo": "carob cookies", "algarrobo": "carob",
  "snacks liofilizados naturales": "natural freeze-dried treats",
  // French → English
  "pomme": "apple", "poulet": "chicken",
  "oeuf": "egg", "oeufs": "eggs", "poisson": "fish", "raisins": "grapes",
  "viande": "meat", "lait": "milk", "oignon": "onion",
  "riz": "rice", "saumon": "salmon", "dinde": "turkey",
  "pastèque": "watermelon", "fromage": "cheese",
  // German → English
  "apfel": "apple", "hähnchen": "chicken",
  "ei": "egg", "eier": "eggs", "fisch": "fish", "trauben": "grapes",
  "fleisch": "meat", "milch": "milk", "zwiebel": "onion",
  "reis": "rice", "lachs": "salmon", "truthahn": "turkey",
  "wassermelone": "watermelon", "käse": "cheese", "honig": "honey",
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
    // Use the pre-computed smart URL passed from SafeFoodWidget (category-aware logic)
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  // Translate product name for display only
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
      
      {/* Multilingual legal disclosure */}
      <p className="text-[10px] text-muted-foreground/70 text-center mt-1">
        {currentLanguage === 'es'
          ? 'Enlace pagado. Como afiliado de Amazon, percibo ingresos por compras adscritas que cumplen los requisitos aplicables.'
          : 'Paid link. As an Amazon Associate I earn from qualifying purchases.'}
      </p>
    </div>
  );
}
