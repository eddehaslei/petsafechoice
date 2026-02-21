import FoodPage from "./FoodPage";

export default function OnionsPage() {
  return (
    <FoodPage
      foodName="Onions & Garlic"
      emoji="🧅"
      dogStatus="dangerous"
      catStatus="dangerous"
      dogSummary="Onions and garlic are highly toxic to dogs and destroy red blood cells, causing life-threatening anemia."
      catSummary="Onions and garlic are even more toxic to cats than to dogs. Any amount is dangerous."
      dogDetails="All forms of onion and garlic — raw, cooked, powdered, or dehydrated — are toxic to dogs. They contain thiosulfate compounds that damage red blood cells and cause hemolytic anemia. Symptoms may not appear for several days after ingestion. Garlic is 5x more potent than onion by weight. Even garlic powder in small amounts used regularly in food can accumulate to toxic levels. Many baby foods and seasonings contain onion or garlic powder — always read labels."
      catDetails="Cats are more sensitive to onion and garlic toxicity than dogs. Even a small amount can cause severe hemolytic anemia. Cats who regularly eat food containing onion powder (some commercial foods contain trace amounts) are at risk. Symptoms include pale gums, weakness, rapid breathing, and collapse. This is a medical emergency."
      symptoms={["Vomiting and diarrhea", "Lethargy and weakness", "Pale or yellowish gums", "Rapid breathing", "Reduced appetite", "Reddish or brown urine", "Collapse (severe anemia)"]}
      safeAlternatives={["Plain cooked chicken", "Plain cooked beef", "Plain cooked vegetables like carrots or green beans"]}
      amazonSearchTermDog="plain+natural+dog+food+toppers"
      amazonSearchTermCat="plain+natural+cat+food+toppers"
      metaTitle="Can Dogs Eat Onions? Can Cats Eat Onions or Garlic? | PetSafeChoice"
      metaDescription="Onions and garlic are toxic to both dogs and cats — all forms including powdered. Learn the risks, symptoms, and safe alternatives. Vet-reviewed."
    />
  );
}
