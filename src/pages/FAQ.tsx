import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How accurate is the food safety information?",
    answer: "Our information is powered by AI trained on veterinary research, scientific studies, and expert recommendations. However, we always recommend consulting with your veterinarian for specific dietary concerns, especially if your pet has health conditions or allergies."
  },
  {
    question: "Can I trust this tool for emergency situations?",
    answer: "While our tool provides helpful information, it should not be used as a substitute for professional veterinary care in emergencies. If your pet has ingested something potentially harmful, contact your veterinarian or an emergency animal poison control center immediately."
  },
  {
    question: "Why does the safety rating differ between dogs and cats?",
    answer: "Dogs and cats have different digestive systems and metabolic processes. Some foods that are safe for dogs can be toxic to cats, and vice versa. That's why we provide species-specific safety ratings for accurate guidance."
  },
  {
    question: "What do the safety levels mean?",
    answer: "We use three safety levels: Safe (green) means the food is generally safe for consumption in appropriate amounts. Caution (yellow) means the food may be okay in small quantities but has some risks. Dangerous (red) means the food is toxic or harmful and should be avoided completely."
  },
  {
    question: "How often is the information updated?",
    answer: "Our AI model is regularly updated with the latest veterinary research and nutritional studies. We continuously work to improve the accuracy and comprehensiveness of our food safety database."
  },
  {
    question: "Can I suggest a food to be added?",
    answer: "Absolutely! We're always looking to expand our database. Use our contact form to suggest foods you'd like us to cover, and we'll work on adding them to our system."
  },
  {
    question: "Is this service free?",
    answer: "Yes! Our basic food safety checker is completely free to use. We believe every pet owner should have access to important food safety information."
  },
  {
    question: "What should I do if my pet eats something dangerous?",
    answer: "If your pet consumes a dangerous food, don't panic. Note what they ate and how much, then immediately contact your veterinarian or call the ASPCA Animal Poison Control Center at (888) 426-4435 (US). Time is critical in poisoning cases."
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen hero-gradient relative flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-3xl mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our pet food safety checker.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-accent/50 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact us
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
