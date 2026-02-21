import FoodPage from "./FoodPage";

export default function StrawberriesPage() {
  return (
    <FoodPage
      foodName="Strawberries"
      emoji="🍓"
      dogStatus="safe"
      catStatus="caution"
      dogSummary="Strawberries are a healthy, antioxidant-rich treat for dogs when served fresh and in moderation."
      catSummary="Strawberries are not toxic to cats, but most cats show no interest and they offer minimal benefit."
      dogDetails="Fresh strawberries are a great treat for dogs. They contain vitamin C, fiber, potassium, and natural antioxidants. They also contain an enzyme that can help whiten teeth. Remove the stem and leaves and cut into small pieces to prevent choking. Limit to a few per day due to natural sugar content. Never give strawberry jam, syrup, or products with added sugar or xylitol."
      catDetails="Strawberries are non-toxic to cats. However, cats lack the taste receptors for sweetness so most cats will simply ignore them. If your cat does eat a small piece, it won't cause harm. Due to the sugar content, don't make it a regular treat — especially for cats prone to weight gain or diabetes."
      symptoms={["Digestive upset if too many are given", "Sugar-related issues for diabetic pets"]}
      safeAlternatives={["Blueberries", "Watermelon (seedless, no rind)", "Plain cooked pumpkin"]}
      amazonSearchTermDog="berry+dog+treats+antioxidant"
      amazonSearchTermCat="gentle+natural+cat+treats"
      metaTitle="Can Dogs Eat Strawberries? Can Cats Eat Strawberries? | PetSafeChoice"
      metaDescription="Strawberries are safe and healthy for dogs in moderation. Cats can eat them but get little benefit. Full vet-reviewed guide."
    />
  );
}
