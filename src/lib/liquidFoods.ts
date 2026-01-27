/**
 * Liquid Foods Detection
 * Used to change "eat" to "drink" for liquid items
 */

// Foods that should use "drink" instead of "eat"
export const LIQUID_FOODS = new Set([
  // English
  "water",
  "milk",
  "broth",
  "bone broth",
  "chicken broth",
  "beef broth",
  "juice",
  "apple juice",
  "orange juice",
  "kefir",
  "goat milk",
  "coconut milk",
  "almond milk",
  "oat milk",
  "soy milk",
  "tea",
  "coffee",
  
  // Spanish
  "agua",
  "leche",
  "caldo",
  "caldo de hueso",
  "caldo de pollo",
  "caldo de res",
  "jugo",
  "jugo de manzana",
  "jugo de naranja",
  "kéfir",
  "leche de cabra",
  "leche de coco",
  "leche de almendra",
  "leche de avena",
  "leche de soja",
  "té",
  "café",
]);

/**
 * Check if a food item is a liquid
 * @param foodName - The name of the food to check
 * @returns true if the food is a liquid
 */
export function isLiquidFood(foodName: string): boolean {
  return LIQUID_FOODS.has(foodName.toLowerCase().trim());
}

/**
 * Get the appropriate verb for a food item
 * @param foodName - The name of the food
 * @param language - The current language code
 * @returns "eat" or "drink" (or localized equivalent)
 */
export function getEatDrinkVerb(foodName: string, language: string): { eat: string; drink: string; verb: string } {
  const lang = language.split('-')[0];
  const isLiquid = isLiquidFood(foodName);
  
  if (lang === 'es') {
    return {
      eat: 'comer',
      drink: 'beber',
      verb: isLiquid ? 'beber' : 'comer',
    };
  }
  
  // Default to English
  return {
    eat: 'eat',
    drink: 'drink',
    verb: isLiquid ? 'drink' : 'eat',
  };
}

/**
 * Get the capitalized verb for titles
 * @param foodName - The name of the food
 * @param language - The current language code
 * @returns Capitalized verb appropriate for the food type
 */
export function getCapitalizedVerb(foodName: string, language: string): string {
  const { verb } = getEatDrinkVerb(foodName, language);
  return verb.charAt(0).toUpperCase() + verb.slice(1);
}
