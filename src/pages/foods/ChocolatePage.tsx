import FoodPage from "./FoodPage";

export default function ChocolatePage() {
  return (
    <FoodPage
      foodName="Chocolate"
      emoji="🍫"
      dogStatus="dangerous"
      catStatus="dangerous"
      dogSummary="Chocolate is highly toxic to dogs and can be fatal even in small amounts."
      catSummary="Chocolate is toxic to cats. Though cats rarely eat it, any amount is dangerous."
      dogDetails="Chocolate contains theobromine and caffeine, both of which dogs cannot metabolize effectively. Dark chocolate and baking chocolate are the most dangerous. Even small amounts can cause vomiting, diarrhea, rapid heart rate, seizures, and in severe cases, death. A 10kg dog can be seriously harmed by as little as 100g of dark chocolate. If your dog ate any chocolate, contact your vet immediately."
      catDetails="Cats lack sweet taste receptors and rarely seek out chocolate, but if ingested it is still toxic. Theobromine affects cats similarly to dogs — causing vomiting, diarrhea, tremors, and heart problems. Any amount should be treated as an emergency."
      symptoms={["Vomiting", "Diarrhea", "Excessive thirst/urination", "Restlessness and hyperactivity", "Rapid or irregular heartbeat", "Muscle tremors or seizures", "Collapse"]}
      safeAlternatives={["Carob treats", "Blueberries", "Watermelon (seedless)"]}
      amazonSearchTermDog="safe+dog+treats+no+chocolate"
      amazonSearchTermCat="safe+cat+treats+healthy"
      metaTitle="Can Dogs Eat Chocolate? Can Cats Eat Chocolate? | PetSafeChoice"
      metaDescription="Chocolate is toxic to both dogs and cats. Learn the dangers, symptoms of poisoning, and safe treat alternatives. Vet-reviewed guide."
    />
  );
}
