import FoodPage from "./FoodPage";

export default function WatermelonPage() {
  return (
    <FoodPage
      foodName="Watermelon"
      emoji="🍉"
      dogStatus="safe"
      catStatus="safe"
      dogSummary="Watermelon is a refreshing, hydrating, and safe summer treat for dogs — just remove seeds and rind."
      catSummary="Watermelon flesh is safe for cats in small amounts. Remove all seeds and avoid the rind."
      dogDetails="Watermelon is 92% water, making it an excellent hydrating treat for dogs, especially in summer. It's low in calories and contains vitamins A, B6, and C, plus potassium. Always remove the seeds (can cause intestinal blockage) and the rind (hard to digest and can cause gastrointestinal upset). Serve in bite-sized chunks. Avoid watermelon-flavored candy or products with artificial sweeteners."
      catDetails="Watermelon flesh is non-toxic to cats and its high water content can help with hydration — useful for cats that don't drink enough water. Remove all seeds and rind before offering. Given that cats are obligate carnivores, watermelon should only be an occasional tiny treat rather than a dietary staple."
      symptoms={["Digestive upset from too much sugar", "Intestinal blockage from seeds if not removed"]}
      safeAlternatives={["Cucumber slices (very hydrating)", "Cantaloupe (small amount, no seeds)", "Plain cooked pumpkin"]}
      amazonSearchTermDog="summer+hydrating+dog+treats"
      amazonSearchTermCat="hydrating+natural+cat+treats"
      metaTitle="Can Dogs Eat Watermelon? Can Cats Eat Watermelon? | PetSafeChoice"
      metaDescription="Watermelon is safe for dogs and cats when seeds and rind are removed. A great hydrating summer treat. Full vet-reviewed guide."
    />
  );
}
