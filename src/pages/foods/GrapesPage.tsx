import FoodPage from "./FoodPage";

export default function GrapesPage() {
  return (
    <FoodPage
      foodName="Grapes & Raisins"
      emoji="🍇"
      dogStatus="dangerous"
      catStatus="dangerous"
      dogSummary="Grapes and raisins are extremely toxic to dogs and can cause sudden kidney failure."
      catSummary="Grapes are toxic to cats as well. Even a small amount can be dangerous."
      dogDetails="Grapes and raisins are among the most dangerous foods for dogs. The exact toxic compound is still unknown, but even a few grapes can cause acute kidney failure in some dogs. There is no established safe amount — any ingestion should be treated as an emergency. Raisins are even more concentrated and therefore more dangerous by weight."
      catDetails="While cats are less likely to eat grapes due to their selective eating habits, grape toxicity has been reported in cats. The same risk of kidney failure applies. Keep grapes and raisins completely out of reach."
      symptoms={["Vomiting within hours of eating", "Diarrhea", "Lethargy and weakness", "Loss of appetite", "Abdominal pain", "Decreased or no urination", "Kidney failure signs within 24–72 hours"]}
      safeAlternatives={["Blueberries", "Sliced apple (no seeds)", "Watermelon (seedless)"]}
      amazonSearchTermDog="natural+fruit+dog+treats"
      amazonSearchTermCat="natural+healthy+cat+snacks"
      metaTitle="Can Dogs Eat Grapes? Can Cats Eat Grapes? | PetSafeChoice"
      metaDescription="Grapes and raisins are extremely toxic to dogs and cats — they can cause kidney failure. Learn the symptoms and what to do. Vet-reviewed."
    />
  );
}
