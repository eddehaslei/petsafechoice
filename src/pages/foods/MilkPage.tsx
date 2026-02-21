import FoodPage from "./FoodPage";

export default function MilkPage() {
  return (
    <FoodPage
      foodName="Milk & Dairy"
      emoji="🥛"
      dogStatus="caution"
      catStatus="caution"
      dogSummary="Most adult dogs are lactose intolerant. Small amounts may be okay, but dairy often causes digestive upset."
      catSummary="Contrary to popular belief, most adult cats are lactose intolerant. Milk can cause diarrhea and stomach pain."
      dogDetails="Dogs do not produce enough lactase enzyme to digest lactose effectively as adults. Small amounts of milk, cheese, or plain yogurt may be tolerated by some dogs, but others will experience bloating, gas, diarrhea, and vomiting. If you want to give dairy, plain low-fat yogurt with live cultures is the safest option in small amounts. Avoid high-fat cheeses, ice cream, and flavored dairy products."
      catDetails="The image of a cat happily drinking a bowl of milk is a myth. Most adult cats are lactose intolerant. Their digestive systems cannot process the lactose in cow's milk, and it commonly causes diarrhea and stomach cramps. If you want to treat your cat, look for specially formulated 'cat milk' products that have the lactose removed."
      symptoms={["Diarrhea", "Vomiting", "Gas and bloating", "Abdominal discomfort", "Loose stools"]}
      safeAlternatives={["Lactose-free cat milk (specially formulated)", "Plain water", "Bone broth (low sodium, no onion/garlic)"]}
      amazonSearchTermDog="lactose+free+dog+treats+dairy"
      amazonSearchTermCat="cat+milk+lactose+free"
      metaTitle="Can Dogs Drink Milk? Can Cats Drink Milk? | PetSafeChoice"
      metaDescription="Most adult dogs and cats are lactose intolerant. Milk can cause diarrhea and stomach problems. Learn what's safe. Vet-reviewed guide."
    />
  );
}
