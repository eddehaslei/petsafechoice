import FoodPage from "./FoodPage";

export default function PeanutButterPage() {
  return (
    <FoodPage
      foodName="Peanut Butter"
      emoji="🥜"
      dogStatus="caution"
      catStatus="caution"
      dogSummary="Plain peanut butter is generally safe for dogs in small amounts — but NEVER if it contains xylitol."
      catSummary="Cats can have a tiny amount of plain peanut butter but it offers little nutritional value and some cats are allergic."
      dogDetails="Plain, unsalted peanut butter without xylitol is a popular dog treat and can be given in moderation. It contains protein, healthy fats, and vitamins B and E. However, ALWAYS check the ingredients label — xylitol (an artificial sweetener) is deadly to dogs. Brands like Jif and Skippy original are generally xylitol-free, but always verify. Limit to a teaspoon at a time due to high fat content."
      catDetails="Peanut butter is not toxic to cats in tiny amounts, but it has little nutritional benefit for obligate carnivores. The sticky texture can also be a choking hazard. Some cats have nut allergies. If you give it at all, limit to a tiny lick and always verify it contains no xylitol."
      symptoms={["Xylitol poisoning: vomiting", "Weakness and collapse (xylitol)", "Seizures (xylitol — very serious)", "Diarrhea (from too much fat)", "Lethargy"]}
      safeAlternatives={["Plain cooked chicken", "Dog-safe peanut butter treats (xylitol-free)", "Banana slices (small amount)"]}
      amazonSearchTermDog="xylitol+free+peanut+butter+dog+treats"
      amazonSearchTermCat="protein+cat+treats+healthy"
      metaTitle="Can Dogs Eat Peanut Butter? Can Cats Eat Peanut Butter? | PetSafeChoice"
      metaDescription="Peanut butter is safe for dogs ONLY if it's xylitol-free. Learn which brands are safe, how much to give, and what to watch for. Vet-reviewed."
    />
  );
}
