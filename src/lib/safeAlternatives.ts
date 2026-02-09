/**
 * Safe Pet-Friendly Alternatives for Dangerous Foods
 * When a food is toxic, suggest a safe alternative.
 */

interface SafeAlternative {
  name: string;
  nameEs: string;
  amazonQuery: string;
  amazonQueryEs: string;
}

const SAFE_ALTERNATIVES: Record<string, SafeAlternative> = {
  chocolate: {
    name: 'Carob Dog Treats',
    nameEs: 'Galletas de Algarroba',
    amazonQuery: 'carob dog treats',
    amazonQueryEs: 'galletas algarroba perro',
  },
  grapes: {
    name: 'Blueberry Dog Treats',
    nameEs: 'Premios de Arándanos',
    amazonQuery: 'blueberry dog treats',
    amazonQueryEs: 'premios arándanos perro',
  },
  grape: {
    name: 'Blueberry Dog Treats',
    nameEs: 'Premios de Arándanos',
    amazonQuery: 'blueberry dog treats',
    amazonQueryEs: 'premios arándanos perro',
  },
  raisins: {
    name: 'Dried Cranberry Dog Treats',
    nameEs: 'Premios de Arándano Rojo Seco',
    amazonQuery: 'dried cranberry dog treats',
    amazonQueryEs: 'premios arándano rojo perro',
  },
  onion: {
    name: 'Sweet Potato Dog Chews',
    nameEs: 'Masticables de Batata',
    amazonQuery: 'sweet potato dog chews',
    amazonQueryEs: 'masticables batata perro',
  },
  onions: {
    name: 'Sweet Potato Dog Chews',
    nameEs: 'Masticables de Batata',
    amazonQuery: 'sweet potato dog chews',
    amazonQueryEs: 'masticables batata perro',
  },
  garlic: {
    name: 'Parsley Dog Treats',
    nameEs: 'Premios de Perejil',
    amazonQuery: 'parsley dog treats fresh breath',
    amazonQueryEs: 'premios perejil perro aliento fresco',
  },
  avocado: {
    name: 'Coconut Oil Dog Treats',
    nameEs: 'Premios de Aceite de Coco',
    amazonQuery: 'coconut oil dog treats',
    amazonQueryEs: 'premios aceite coco perro',
  },
  xylitol: {
    name: 'Pet-Safe Peanut Butter',
    nameEs: 'Mantequilla de Maní para Mascotas',
    amazonQuery: 'xylitol free peanut butter dog',
    amazonQueryEs: 'mantequilla maní sin xilitol perro',
  },
  macadamia: {
    name: 'Pumpkin Dog Treats',
    nameEs: 'Premios de Calabaza',
    amazonQuery: 'pumpkin dog treats',
    amazonQueryEs: 'premios calabaza perro',
  },
  coffee: {
    name: 'Bone Broth for Dogs',
    nameEs: 'Caldo de Hueso para Perros',
    amazonQuery: 'bone broth for dogs',
    amazonQueryEs: 'caldo hueso perro',
  },
  alcohol: {
    name: 'Pet-Safe Bone Broth',
    nameEs: 'Caldo de Hueso para Mascotas',
    amazonQuery: 'bone broth for dogs',
    amazonQueryEs: 'caldo hueso perro',
  },
};

/**
 * Get a safe alternative for a dangerous food
 */
export function getSafeAlternative(
  foodName: string,
  language: string,
  petType: 'dog' | 'cat'
): { name: string; amazonQuery: string } | null {
  const lowerFood = foodName.toLowerCase().trim();
  const lang = language.split('-')[0];
  const alt = SAFE_ALTERNATIVES[lowerFood];

  if (!alt) return null;

  // Swap dog→cat in query if needed
  const petSwap = (q: string) =>
    petType === 'cat' ? q.replace(/\bdog\b/gi, 'cat').replace(/\bperro\b/gi, 'gato') : q;

  if (lang === 'es') {
    return { name: alt.nameEs, amazonQuery: petSwap(alt.amazonQueryEs) };
  }
  return { name: alt.name, amazonQuery: petSwap(alt.amazonQuery) };
}
