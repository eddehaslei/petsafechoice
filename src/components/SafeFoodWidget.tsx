import { useState, useEffect, forwardRef } from "react";
import { ShoppingBag, Loader2, Shield, Apple, Beef, Fish, Pill, Cookie, Carrot, Cherry, Milk, Wheat, Droplets, Citrus, Grape, Egg } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { AffiliateButton } from "./AffiliateButton";
import type { SafetyLevel } from "./SafetyResult";

// Food category detection for icon display
type FoodCategory = "fruit" | "vegetable" | "protein" | "dairy" | "supplement" | "grain" | "toxic" | "unknown";

// STRICT FOOD-TO-CATEGORY MAPPING (exact matches first)
const EXACT_FOOD_CATEGORY: Record<string, FoodCategory> = {
  // Fruits
  "apple": "fruit",
  "manzana": "fruit",
  "banana": "fruit",
  "plátano": "fruit",
  "platano": "fruit",
  "bananas": "fruit",
  "orange": "fruit",
  "naranja": "fruit",
  "strawberry": "fruit",
  "fresa": "fruit",
  "strawberries": "fruit",
  "fresas": "fruit",
  "blueberry": "fruit",
  "blueberries": "fruit",
  "arándano": "fruit",
  "arándanos": "fruit",
  "watermelon": "fruit",
  "sandía": "fruit",
  "sandia": "fruit",
  "mango": "fruit",
  "peach": "fruit",
  "melocotón": "fruit",
  "pear": "fruit",
  "pera": "fruit",
  "cherry": "fruit",
  "cereza": "fruit",
  "pineapple": "fruit",
  "piña": "fruit",
  "coconut": "fruit",
  "coco": "fruit",
  
  // Vegetables
  "carrot": "vegetable",
  "carrots": "vegetable",
  "zanahoria": "vegetable",
  "zanahorias": "vegetable",
  "broccoli": "vegetable",
  "brócoli": "vegetable",
  "spinach": "vegetable",
  "espinaca": "vegetable",
  "pumpkin": "vegetable",
  "calabaza": "vegetable",
  "cucumber": "vegetable",
  "pepino": "vegetable",
  "celery": "vegetable",
  "apio": "vegetable",
  "sweet potato": "vegetable",
  "batata": "vegetable",
  "potato": "vegetable",
  "papa": "vegetable",
  "lettuce": "vegetable",
  "lechuga": "vegetable",
  "peas": "vegetable",
  "guisantes": "vegetable",
  "green beans": "vegetable",
  "judías verdes": "vegetable",
  
  // Proteins
  "chicken": "protein",
  "pollo": "protein",
  "beef": "protein",
  "carne": "protein",
  "carne de res": "protein",
  "salmon": "protein",
  "salmón": "protein",
  "fish": "protein",
  "pescado": "protein",
  "turkey": "protein",
  "pavo": "protein",
  "egg": "protein",
  "eggs": "protein",
  "huevo": "protein",
  "huevos": "protein",
  "tuna": "protein",
  "atún": "protein",
  "liver": "protein",
  "hígado": "protein",
  "shrimp": "protein",
  "camarones": "protein",
  "pork": "protein",
  "cerdo": "protein",
  "lamb": "protein",
  "cordero": "protein",
  "duck": "protein",
  "pato": "protein",
  
  // Dairy
  "cheese": "dairy",
  "queso": "dairy",
  "yogurt": "dairy",
  "yogur": "dairy",
  "milk": "dairy",
  "leche": "dairy",
  "cottage cheese": "dairy",
  "requesón": "dairy",
  
  // Supplements & Pet Products
  "salmon oil": "supplement",
  "aceite de salmón": "supplement",
  "fish oil": "supplement",
  "aceite de pescado": "supplement",
  "coconut oil": "supplement",
  "aceite de coco": "supplement",
  "peanut butter": "supplement",
  "mantequilla de maní": "supplement",
  "honey": "supplement",
  "miel": "supplement",
  
  // Grains
  "rice": "grain",
  "arroz": "grain",
  "oatmeal": "grain",
  "avena": "grain",
  "bread": "grain",
  "pan": "grain",
  "pasta": "grain",
  "quinoa": "grain",
  
  // Toxic foods
  "chocolate": "toxic",
  "onion": "toxic",
  "onions": "toxic",
  "cebolla": "toxic",
  "cebollas": "toxic",
  "garlic": "toxic",
  "ajo": "toxic",
  "grapes": "toxic",
  "grape": "toxic",
  "uvas": "toxic",
  "uva": "toxic",
  "raisins": "toxic",
  "pasas": "toxic",
  "avocado": "toxic",
  "aguacate": "toxic",
  "xylitol": "toxic",
  "macadamia": "toxic",
  "coffee": "toxic",
  "café": "toxic",
  "alcohol": "toxic",
};

// Fallback keyword detection (if no exact match)
const CATEGORY_KEYWORDS: Record<FoodCategory, string[]> = {
  fruit: ["berry", "melon", "fruit", "fruta"],
  vegetable: ["veggie", "vegetable", "verdura", "legume"],
  protein: ["meat", "carne", "poultry", "seafood"],
  dairy: ["cream", "crema", "butter", "mantequilla"],
  supplement: ["oil", "aceite", "treat", "premio", "supplement", "suplemento", "vitamin", "vitamina", "chew", "bone", "hueso", "biscuit", "galleta"],
  grain: ["wheat", "trigo", "oat", "cereal"],
  toxic: [],
  unknown: [],
};

const detectFoodCategory = (foodName: string, safetyLevel?: SafetyLevel): FoodCategory => {
  const lowerFood = foodName.toLowerCase().trim();
  
  // 1. Check exact match first
  if (EXACT_FOOD_CATEGORY[lowerFood]) {
    return EXACT_FOOD_CATEGORY[lowerFood];
  }
  
  // 2. If dangerous, mark as toxic
  if (safetyLevel === "dangerous") {
    return "toxic";
  }
  
  // 3. Fallback to keyword detection
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === "toxic" || category === "unknown") continue;
    if (keywords.some(keyword => lowerFood.includes(keyword))) {
      return category as FoodCategory;
    }
  }
  
  return "unknown";
};

interface SafeFoodWidgetProps {
  foodName: string;
  petType: "dog" | "cat";
  safetyLevel?: SafetyLevel;
}

interface AffiliateLink {
  productName: string;
  url: string;
}

// Amazon domain configuration by language
const AMAZON_CONFIG: Record<string, { domain: string; tag: string; petKeyword: Record<string, string> }> = {
  es: { 
    domain: "amazon.es", 
    tag: "petsafechoice-20",
    petKeyword: { dog: "perro", cat: "gato" }
  },
  de: { 
    domain: "amazon.de", 
    tag: "petsafechoice-20",
    petKeyword: { dog: "hund", cat: "katze" }
  },
  fr: { 
    domain: "amazon.fr", 
    tag: "petsafechoice-20",
    petKeyword: { dog: "chien", cat: "chat" }
  },
  en: { 
    domain: "amazon.com", 
    tag: "petsafechoice-20",
    petKeyword: { dog: "dog", cat: "cat" }
  },
};

const DEFAULT_CONFIG = AMAZON_CONFIG.en;

// Common food name translations for Spanish Amazon searches
const FOOD_TRANSLATIONS_ES: Record<string, string> = {
  "apple": "manzana",
  "banana": "plátano",
  "blueberry": "arándano",
  "blueberries": "arándanos",
  "carrot": "zanahoria",
  "carrots": "zanahorias",
  "chicken": "pollo",
  "chocolate": "chocolate",
  "egg": "huevo",
  "eggs": "huevos",
  "fish": "pescado",
  "grapes": "uvas",
  "grape": "uva",
  "meat": "carne",
  "milk": "leche",
  "onion": "cebolla",
  "onions": "cebollas",
  "peanut butter": "mantequilla de maní",
  "pumpkin": "calabaza",
  "rice": "arroz",
  "salmon": "salmón",
  "salmon oil": "aceite de salmón",
  "spinach": "espinaca",
  "strawberry": "fresa",
  "strawberries": "fresas",
  "sweet potato": "batata",
  "tuna": "atún",
  "turkey": "pavo",
  "watermelon": "sandía",
  "yogurt": "yogur",
  "cheese": "queso",
  "beef": "carne de res",
  "pork": "cerdo",
  "honey": "miel",
  "oatmeal": "avena",
  "broccoli": "brócoli",
  "cucumber": "pepino",
  "mango": "mango",
  "coconut": "coco",
  "coconut oil": "aceite de coco",
  "liver": "hígado",
  "shrimp": "camarones",
};

/**
 * Get Amazon config based on user's language
 */
function getAmazonConfig(language: string) {
  const lang = language.split('-')[0];
  return AMAZON_CONFIG[lang] || DEFAULT_CONFIG;
}

/**
 * Translate food name for regional Amazon searches
 */
function translateFoodName(foodName: string, language: string): string {
  const lang = language.split('-')[0];
  if (lang === 'es') {
    const lowerName = foodName.toLowerCase().trim();
    return FOOD_TRANSLATIONS_ES[lowerName] || foodName;
  }
  return foodName;
}

/**
 * Generate safe treats URL based on language and pet type
 */
function getSafeTreatsUrl(language: string, petType: "dog" | "cat"): string {
  const config = getAmazonConfig(language);
  const petWord = config.petKeyword[petType];
  const lang = language.split('-')[0];
  
  const safetyKeyword = lang === 'es' 
    ? `mejores+snacks+naturales+${petWord}` 
    : `best+natural+freeze+dried+${petWord}+treats`;
  return `https://www.${config.domain}/s?k=${safetyKeyword}&tag=${config.tag}`;
}

/**
 * SMART AMAZON LOGIC - Generate category-aware search URLs
 * - Fruits/Vegetables: "Organic [food]"
 * - Yogurt/Peanut Butter: "[food] unsweetened sugar free no xylitol"
 * - Meat/Fish: "Plain [food] no salt"
 * - Default: "[food]"
 */
function generateSmartFallbackUrl(
  foodName: string, 
  language: string, 
  petType: "dog" | "cat",
  category: FoodCategory
): string {
  const config = getAmazonConfig(language);
  const lang = language.split('-')[0];
  const translatedName = translateFoodName(foodName, language);
  const petWord = config.petKeyword[petType];
  const lowerFood = foodName.toLowerCase().trim();
  
  let searchQuery: string;
  
  // Smart search modifiers based on category and food type
  if (category === 'fruit' || category === 'vegetable') {
    // Organic prefix for fruits and vegetables
    const organic = lang === 'es' ? 'orgánico' : 'organic';
    searchQuery = `${organic} ${translatedName} ${petWord}`;
  } else if (lowerFood === 'yogurt' || lowerFood === 'yogur' || 
             lowerFood === 'peanut butter' || lowerFood === 'mantequilla de maní') {
    // Safety-focused search for xylitol risk foods
    const safetyTerms = lang === 'es' 
      ? `${translatedName} sin azúcar sin xilitol ${petWord}`
      : `${translatedName} unsweetened sugar free no xylitol ${petWord}`;
    searchQuery = safetyTerms;
  } else if (category === 'protein') {
    // Plain/unseasoned for meats
    const plain = lang === 'es' ? 'simple sin sal' : 'plain no salt';
    searchQuery = `${plain} ${translatedName} ${petWord}`;
  } else {
    // Default: just food name + pet type
    const qualityPrefix = lang === 'es' ? 'mejores' : 'best';
    searchQuery = `${qualityPrefix} ${translatedName} ${petWord}`;
  }
  
  return `https://www.${config.domain}/s?k=${encodeURIComponent(searchQuery)}&tag=${config.tag}`;
}

export const SafeFoodWidget = forwardRef<HTMLDivElement, SafeFoodWidgetProps>(
  function SafeFoodWidget({ foodName, petType, safetyLevel = "safe" }, ref) {
    const { i18n, t } = useTranslation();
    const currentLanguage = i18n.language || 'en';
    const [isLoading, setIsLoading] = useState(true);
    const [affiliateLink, setAffiliateLink] = useState<AffiliateLink | null>(null);

    // Check if food is dangerous - should show safe alternative instead
    const isDangerous = safetyLevel === "dangerous";
    const isCaution = safetyLevel === "caution";
    
    // Get the food category for icon display
    const foodCategory = detectFoodCategory(foodName, safetyLevel);
    
    // Get category icon component - STRICT CATEGORY ICONS
    const getCategoryIcon = () => {
      // Toxic foods get warning icon
      if (foodCategory === "toxic" || isDangerous) {
        return <Shield className="w-14 h-14 text-danger" />;
      }
      
      switch (foodCategory) {
        case "fruit":
          return <Cherry className="w-14 h-14 text-safe" />;
        case "vegetable":
          return <Carrot className="w-14 h-14 text-safe" />;
        case "protein":
          return <Beef className="w-14 h-14 text-primary" />;
        case "dairy":
          return <Milk className="w-14 h-14 text-muted-foreground" />;
        case "supplement":
          return <Droplets className="w-14 h-14 text-primary" />;
        case "grain":
          return <Wheat className="w-14 h-14 text-caution" />;
        default:
          // Default to a generic food icon
          return <Cookie className="w-14 h-14 text-muted-foreground" />;
      }
    };
    
    // Get background color based on safety
    const getIconBgColor = () => {
      if (isDangerous) return "from-danger/10 to-danger/5";
      if (isCaution) return "from-caution/10 to-caution/5";
      return "from-safe/10 to-safe/5";
    };

    useEffect(() => {
      // If food is dangerous, skip fetching and show safe alternative immediately
      if (isDangerous) {
        setAffiliateLink({
          productName: currentLanguage.startsWith('es') ? "Snacks Naturales Seguros" : "Natural Freeze-Dried Treats",
          url: getSafeTreatsUrl(currentLanguage, petType)
        });
        setIsLoading(false);
        console.log('Affiliate Status: Safe Alternative (Dangerous Food)');
        return;
      }
      
      let isMounted = true;
      const normalizedName = foodName.trim();

      const fetchAffiliate = async () => {
        try {
          const response = await supabase.functions.invoke('get-all-affiliates');
          
          if (!isMounted) return;

          if (response.data?.affiliates && Array.isArray(response.data.affiliates)) {
            const affiliates = response.data.affiliates as Array<{ product_name: string; affiliate_url: string }>;
            
            const match = affiliates.find(
              (a) => a.product_name && a.product_name.toLowerCase() === normalizedName.toLowerCase()
            );

            if (match && match.affiliate_url) {
              console.log('Affiliate Status: Database Match');
              setAffiliateLink({ productName: match.product_name, url: match.affiliate_url });
              setIsLoading(false);
              return;
            }
          }

          if (isMounted) {
            console.log('Affiliate Status: Smart Auto-Generated with Pet Type');
            setAffiliateLink({ 
              productName: normalizedName, 
              url: generateSmartFallbackUrl(normalizedName, currentLanguage, petType, foodCategory) 
            });
          }
        } catch {
          if (isMounted) {
            console.log('Affiliate Status: Smart Auto-Generated (Error Fallback)');
            setAffiliateLink({ 
              productName: normalizedName, 
              url: generateSmartFallbackUrl(normalizedName, currentLanguage, petType, foodCategory) 
            });
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      setIsLoading(true);
      setAffiliateLink(null);
      fetchAffiliate();

      return () => {
        isMounted = false;
      };
    }, [foodName, isDangerous, currentLanguage, petType]);

    // Dynamic styling based on safety
    const containerBg = isDangerous ? "bg-primary/10 border-primary/30" : "bg-safe/10 border-safe/30";
    const iconBg = isDangerous ? "bg-primary/20" : "bg-safe/20";
    const iconColor = isDangerous ? "text-primary" : "text-safe";
    const loaderColor = isDangerous ? "text-primary" : "text-safe";

    return (
      <div ref={ref} className="w-full max-w-2xl mx-auto mt-6 px-2 sm:px-0 animate-slide-up">
        <div className={`${containerBg} border-2 rounded-2xl overflow-hidden relative`}>
          {/* Food Icon Section - PURE ICONS, NO PHOTOS */}
          <div className={`relative w-full h-[120px] sm:h-[140px] bg-gradient-to-br ${getIconBgColor()} overflow-hidden flex items-center justify-center`}>
            <div className="flex flex-col items-center justify-center">
              <div className="p-4 rounded-2xl bg-background/60 shadow-sm border border-border/30 backdrop-blur-sm">
                {getCategoryIcon()}
              </div>
              <span className="mt-3 text-sm font-semibold text-foreground capitalize">
                {foodName}
              </span>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-background/20" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-background/20" />
          </div>

          <div className="relative p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4 px-1">
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                {isDangerous ? (
                  <Shield className={`w-5 h-5 ${iconColor}`} />
                ) : (
                  <ShoppingBag className={`w-5 h-5 ${iconColor}`} />
                )}
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">
                  {isDangerous 
                    ? t('safeFoodWidget.safeAlternative')
                    : t('safeFoodWidget.recommendedProduct')
                  }
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isDangerous
                    ? t('safeFoodWidget.tryThisInstead')
                    : t('safeFoodWidget.matchFound')
                  }
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className={`w-6 h-6 animate-spin ${loaderColor}`} />
              </div>
            ) : affiliateLink ? (
              <AffiliateButton productName={affiliateLink.productName} affiliateUrl={affiliateLink.url} />
            ) : null}

            <p className="mt-4 px-2 sm:px-0 text-xs text-muted-foreground text-center leading-relaxed">
              {t('safeFoodWidget.disclosure')}
            </p>
            <p className="mt-2 px-2 sm:px-0 text-[10px] text-muted-foreground/60 text-center leading-relaxed">
              {t('safeFoodWidget.amazonDisclosure')}
            </p>
          </div>
        </div>
      </div>
    );
  }
);
