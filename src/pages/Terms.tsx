import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { FileText, Shield, AlertTriangle, Scale, Mail } from "lucide-react";

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            {t('terms.title', 'Terms of Service')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('terms.subtitle', 'Please read these terms carefully before using PetSafeChoice.')}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t('terms.lastUpdated', 'Last Updated')}: January 27, 2026
          </p>
        </div>

        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <section className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('terms.acceptance.title', '1. Acceptance of Terms')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('terms.acceptance.content', 'By accessing or using PetSafeChoice ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to update these terms at any time, and your continued use of the Service constitutes acceptance of any changes.')}
            </p>
          </section>

          {/* Service Description */}
          <section className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('terms.service.title', '2. Service Description')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.service.content1', 'PetSafeChoice provides educational information about food safety for dogs and cats. Our Service uses AI-powered analysis combined with veterinary research to provide general guidance on whether certain foods are safe for pets.')}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t('terms.service.content2', 'The Service is provided "as is" for informational purposes only and should not be considered a substitute for professional veterinary advice, diagnosis, or treatment.')}
            </p>
          </section>

          {/* Medical Disclaimer */}
          <section className="bg-danger-bg border-2 border-danger/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-danger" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('terms.disclaimer.title', '3. Medical Disclaimer')}
              </h2>
            </div>
            <p className="text-foreground leading-relaxed font-medium mb-4">
              {t('terms.disclaimer.content1', 'IMPORTANT: PetSafeChoice is NOT a substitute for professional veterinary care.')}
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-danger mt-2 shrink-0" />
                {t('terms.disclaimer.bullet1', 'Always consult a licensed veterinarian before making dietary changes for your pet.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-danger mt-2 shrink-0" />
                {t('terms.disclaimer.bullet2', 'In case of emergency, contact your veterinarian or animal poison control immediately.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-danger mt-2 shrink-0" />
                {t('terms.disclaimer.bullet3', 'Individual pets may have unique sensitivities, allergies, or health conditions not accounted for in our general guidance.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-danger mt-2 shrink-0" />
                {t('terms.disclaimer.bullet4', 'We are not liable for any harm resulting from the use of information provided by this Service.')}
              </li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('terms.user.title', '4. User Responsibilities')}
              </h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {t('terms.user.bullet1', 'Use the Service responsibly and for lawful purposes only.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {t('terms.user.bullet2', 'Do not attempt to abuse, overload, or interfere with the Service.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {t('terms.user.bullet3', 'Verify critical information with a qualified veterinarian.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {t('terms.user.bullet4', 'Do not scrape, harvest, or bulk-download content from the Service.')}
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="bg-card border border-border/50 rounded-2xl p-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              {t('terms.ip.title', '5. Intellectual Property')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('terms.ip.content', 'All content, trademarks, and intellectual property on PetSafeChoice are owned by or licensed to us. You may not reproduce, distribute, or create derivative works without our express written permission.')}
            </p>
          </section>

          {/* Affiliate Disclosure */}
          <section className="bg-card border border-border/50 rounded-2xl p-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              {t('terms.affiliate.title', '6. Affiliate Disclosure')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('terms.affiliate.content', 'PetSafeChoice participates in affiliate programs, including the Amazon Associates Program. We may earn commissions from qualifying purchases made through links on our site. This does not affect the price you pay or our editorial independence in providing food safety information.')}
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-card border border-border/50 rounded-2xl p-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              {t('terms.liability.title', '7. Limitation of Liability')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('terms.liability.content', 'To the maximum extent permitted by law, PetSafeChoice and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid to use the Service (if any).')}
            </p>
          </section>

          {/* Contact */}
          <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('terms.contact.title', '8. Contact Us')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('terms.contact.content', 'If you have questions about these Terms of Service, please contact us through our Contact page or email us at legal@petsafechoice.com.')}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
