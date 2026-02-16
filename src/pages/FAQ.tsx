import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const FAQ = () => {
  const { t } = useTranslation();

  const faqKeys = [
    'accuracy',
    'emergency',
    'difference',
    'levels',
    'updates',
    'suggest',
    'free',
    'dangerous'
  ] as const;

  return (
    <div className="min-h-screen hero-gradient relative flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-3xl mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
            {t('faq.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqKeys.map((key, index) => (
              <AccordionItem key={key} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-accent/50 text-start">
                  {t(`faq.questions.${key}.question`)}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  {t(`faq.questions.${key}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            {t('faq.stillHaveQuestions')}{" "}
            <Link 
              to="/contact#contact-form" 
              className="text-primary hover:underline font-medium"
            >
              {t('faq.contactUs')}
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
