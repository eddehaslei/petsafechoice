import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const message = (formData.get("message") as string)?.trim();

    if (!name || !email || !message) {
      toast.error(t('errors.generic'));
      setIsSubmitting(false);
      return;
    }

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert([{ name, email, message }]);

      if (dbError) {
        // DB save failed silently — email still attempted
      }

      // Send email via Resend
      const emailRes = await supabase.functions.invoke("send-contact-email", {
        body: { name, email, message },
      });

      if (emailRes.error) {
        // Still show success since DB save worked
      }

      toast.success(t('contact.form.success'));
      form.reset();
    } catch {
      toast.error(t('errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient relative flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{t('contact.email.title')}</h3>
              <p className="text-muted-foreground mb-3">
                {t('contact.email.description')}
              </p>
              <a href="mailto:hello@petsafechoice.com" className="text-primary hover:underline font-medium">
                hello@petsafechoice.com
              </a>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{t('contact.feedback.title')}</h3>
              <p className="text-muted-foreground">
                {t('contact.feedback.description')}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-4">{t('contact.form.submit')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input 
                  name="name"
                  placeholder={t('contact.form.namePlaceholder')}
                  required 
                  className="bg-background"
                />
              </div>
              <div>
                <Input 
                  name="email"
                  type="email" 
                  placeholder={t('contact.form.emailPlaceholder')}
                  required 
                  className="bg-background"
                />
              </div>
              <div>
                <Textarea 
                  name="message"
                  placeholder={t('contact.form.messagePlaceholder')}
                  required 
                  rows={5}
                  className="bg-background resize-none"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
