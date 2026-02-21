import FoodPage from "./FoodPage";

export default function BananasPage() {
  return (
    <FoodPage
      foodName="Bananas"
      emoji="🍌"
      dogStatus="safe"
      catStatus="caution"
      dogSummary="Bananas are a safe, healthy treat for dogs when given in moderation due to their natural sugar content."
      catSummary="Bananas are not toxic to cats, but they are high in sugar and offer no real benefit to obligate carnivores."
      dogDetails="Bananas are a great occasional treat for dogs. They're rich in potassium, vitamin B6, vitamin C, and fiber. The high sugar content means they should be given in moderation — a few slices a day is plenty. Remove the peel before giving (it's not toxic but hard to digest). Avoid banana chips, which can have added sugar or artificial sweeteners."
      catDetails="Bananas are non-toxic to cats but not particularly beneficial. Cats cannot taste sweetness and get no real nutritional benefit from fruit. A small piece occasionally won't cause harm, but the high sugar content can contribute to weight gain and digestive upset. Cats with diabetes should avoid bananas entirely."
      symptoms={["Digestive upset if too much is given", "Blood sugar spike (diabetic pets)", "Constipation from the peel"]}
      safeAlternatives={["Blueberries", "Sliced melon (no seeds)", "Plain cooked sweet potato"]}
      amazonSearchTermDog="fruit+dog+treats+natural"
      amazonSearchTermCat="low+sugar+cat+treats"
      metaTitle="Can Dogs Eat Bananas? Can Cats Eat Bananas? | PetSafeChoice"
      metaDescription="Bananas are safe for dogs in moderation but offer little benefit for cats. Learn the right amounts and healthier alternatives. Vet-reviewed."
    />
  );
}
