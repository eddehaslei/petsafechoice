import FoodPage from "./FoodPage";

export default function AvocadoPage() {
  return (
    <FoodPage
      foodName="Avocado"
      emoji="🥑"
      dogStatus="caution"
      catStatus="dangerous"
      dogSummary="Avocado flesh is mildly toxic to dogs. The pit, skin, and leaves are more dangerous. Avoid feeding it."
      catSummary="Avocado contains persin which is toxic to cats and can cause serious digestive and respiratory issues."
      dogDetails="Avocado contains persin, a fungicidal toxin. In dogs, the flesh contains lower levels of persin and may only cause mild vomiting and diarrhea in small amounts, but the risk is not worth taking. The pit is extremely dangerous — it can cause obstruction and contains higher persin levels. The skin and leaves are also toxic. Keep avocado away from dogs entirely."
      catDetails="Cats are more sensitive to persin than dogs. Ingestion can cause vomiting, diarrhea, difficulty breathing, fluid accumulation around the lungs and heart, and in severe cases death. Avocado in any form — flesh, pit, skin, or guacamole — should be kept completely away from cats."
      symptoms={["Vomiting", "Diarrhea", "Difficulty breathing", "Fluid buildup in chest", "Lethargy", "Inability to perch or stand normally (cats)"]}
      safeAlternatives={["Cucumber slices", "Cooked sweet potato", "Pumpkin puree (plain)"]}
      amazonSearchTermDog="healthy+vegetable+dog+treats"
      amazonSearchTermCat="healthy+natural+cat+treats"
      metaTitle="Can Dogs Eat Avocado? Can Cats Eat Avocado? | PetSafeChoice"
      metaDescription="Avocado is dangerous for cats and risky for dogs due to persin toxin. Learn what parts are toxic and safer alternatives. Vet-reviewed."
    />
  );
}
