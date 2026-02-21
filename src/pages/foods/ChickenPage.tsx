import FoodPage from "./FoodPage";

export default function ChickenPage() {
  return (
    <FoodPage
      foodName="Chicken"
      emoji="🍗"
      dogStatus="safe"
      catStatus="safe"
      dogSummary="Plain cooked chicken is one of the best foods you can give your dog — high in protein and easy to digest."
      catSummary="Cooked chicken is an excellent protein source for cats and a great treat or food topper."
      dogDetails="Plain boiled or baked chicken (no bones, no seasoning, no garlic or onion) is safe and highly nutritious for dogs. It is a common ingredient in commercial dog food and is often recommended for dogs with upset stomachs. Avoid fried chicken, chicken cooked with onions or garlic, and always remove bones as cooked bones can splinter and cause internal injuries."
      catDetails="Cats are obligate carnivores, so chicken is a natural and ideal food. Plain cooked chicken — boiled or baked with no seasoning — is safe and beneficial. It provides essential amino acids including taurine. Never feed raw chicken due to salmonella risk, and always remove bones."
      symptoms={[]}
      safeAlternatives={["Turkey (plain cooked)", "Salmon (cooked, boneless)", "Tuna (in water, occasional treat)"]}
      amazonSearchTermDog="chicken+dog+treats+natural"
      amazonSearchTermCat="chicken+cat+treats+natural"
      metaTitle="Can Dogs Eat Chicken? Can Cats Eat Chicken? | PetSafeChoice"
      metaDescription="Plain cooked chicken is safe and healthy for both dogs and cats. Learn how to serve it safely and what to avoid. Vet-reviewed guide."
    />
  );
}
