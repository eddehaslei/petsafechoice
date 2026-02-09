/**
 * Food State Detection
 * Detects preparation states (frozen, raw, cooked, dried) that affect safety advice.
 */

export type FoodState = 'frozen' | 'raw' | 'cooked' | 'dried' | 'fresh';

const STATE_PATTERNS: { state: FoodState; patterns: RegExp[] }[] = [
  {
    state: 'frozen',
    patterns: [/\bfrozen\b/i, /\bcongelad[oa]s?\b/i, /\biced\b/i],
  },
  {
    state: 'raw',
    patterns: [/\braw\b/i, /\bcrud[oa]s?\b/i, /\buncooked\b/i],
  },
  {
    state: 'cooked',
    patterns: [/\bcooked\b/i, /\bcocid[oa]s?\b/i, /\bboiled\b/i, /\bgrilled\b/i, /\bbaked\b/i, /\broasted\b/i, /\bhervid[oa]s?\b/i, /\basad[oa]s?\b/i],
  },
  {
    state: 'dried',
    patterns: [/\bdried\b/i, /\bsec[oa]s?\b/i, /\bdehydrated\b/i, /\bfreeze[- ]?dried\b/i, /\bliofilizad[oa]s?\b/i],
  },
];

/**
 * Detect the preparation state from a food query
 * @returns The detected state and the cleaned food name (state prefix removed)
 */
export function detectFoodState(query: string): { state: FoodState; cleanName: string } {
  const trimmed = query.trim();

  for (const { state, patterns } of STATE_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(trimmed)) {
        const cleanName = trimmed.replace(pattern, '').replace(/\s+/g, ' ').trim();
        return { state, cleanName: cleanName || trimmed };
      }
    }
  }

  return { state: 'fresh', cleanName: trimmed };
}

/**
 * Get a safety note about the food state
 */
export function getFoodStateNote(state: FoodState, language: string): string | null {
  if (state === 'fresh') return null;

  const lang = language.split('-')[0];

  const notes: Record<FoodState, Record<string, string>> = {
    frozen: {
      en: '❄️ Frozen foods may have altered texture but generally retain nutritional value. Always thaw properly before serving.',
      es: '❄️ Los alimentos congelados pueden tener textura alterada pero generalmente retienen su valor nutricional. Siempre descongele adecuadamente antes de servir.',
    },
    raw: {
      en: '⚠️ Raw foods carry a higher risk of bacterial contamination (Salmonella, E. coli). Consult your vet before feeding raw.',
      es: '⚠️ Los alimentos crudos tienen mayor riesgo de contaminación bacteriana (Salmonella, E. coli). Consulte a su veterinario antes de alimentar con crudo.',
    },
    cooked: {
      en: '✅ Cooked foods are generally safer as cooking kills bacteria. Ensure no added seasonings, oils, or harmful ingredients.',
      es: '✅ Los alimentos cocidos son generalmente más seguros ya que la cocción elimina bacterias. Asegúrese de que no contengan condimentos, aceites o ingredientes dañinos.',
    },
    dried: {
      en: '📦 Dried foods are concentrated—serve smaller portions. Check for added sugars, salts, or preservatives.',
      es: '📦 Los alimentos deshidratados están concentrados—sirva porciones más pequeñas. Verifique que no contengan azúcares, sales o conservantes añadidos.',
    },
    fresh: { en: '', es: '' },
  };

  return notes[state]?.[lang] || notes[state]?.en || null;
}
