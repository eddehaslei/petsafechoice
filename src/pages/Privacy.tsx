import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Shield, Eye, Database, Cookie, Globe, Mail, Lock } from "lucide-react";

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            {t('privacy.title', 'Privacy Policy')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('privacy.subtitle', 'Your privacy matters to us. Learn how we collect, use, and protect your information.')}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t('privacy.lastUpdated', 'Last Updated')}: January 27, 2026
          </p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <section className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('privacy.overview.title', '1. Overview')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.overview.content', 'PetSafeChoice ("we", "our", or "the Service") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data. By using our Service, you agree to the collection and use of information as described in this policy.')}
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('privacy.collect.title', '2. Information We Collect')}
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">{t('privacy.collect.auto', 'Automatically Collected Information')}</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {t('privacy.collect.bullet1', 'Search queries (food names and pet types) for service improvement and analytics.')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {t('privacy.collect.bullet2', 'General location information (country/region) derived from your IP address for language localization.')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {t('privacy.collect.bullet3', 'Browser type and device information for optimizing your experience.')}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">{t('privacy.collect.voluntary', 'Voluntarily Provided Information')}</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {t('privacy.collect.bullet4', 'Email address (if you subscribe to our newsletter).')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {t('privacy.collect.bullet5', 'Contact form submissions (name, email, message).')}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('privacy.use.title', '3. How We Use Your Information')}
              </h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {t('privacy.use.bullet1', 'To provide and improve our food safety checking service.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {t('privacy.use.bullet2', 'To personalize content based on your language and region.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {t('privacy.use.bullet3', 'To analyze usage patterns and improve our database.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {t('privacy.use.bullet4', 'To send newsletters (only if you opted in) and respond to inquiries.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {t('privacy.use.bullet5', 'To prevent abuse and protect the security of our Service.')}
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('privacy.cookies.title', '4. Cookies & Local Storage')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.cookies.content1', 'We use cookies and local storage to:')}
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {t('privacy.cookies.bullet1', 'Remember your language preference.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {t('privacy.cookies.bullet2', 'Store your recent searches for convenience.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {t('privacy.cookies.bullet3', 'Enable essential site functionality.')}
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              {t('privacy.cookies.content2', 'You can control cookies through your browser settings. Disabling cookies may affect some features of the Service.')}
            </p>
          </section>

          {/* Third Parties */}
          <section className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('privacy.thirdParty.title', '5. Third-Party Services')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.thirdParty.content', 'We may use third-party services that collect information:')}
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong>Amazon Associates:</strong> {t('privacy.thirdParty.amazon', 'For affiliate product recommendations. Amazon has its own privacy policy.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong>Supabase:</strong> {t('privacy.thirdParty.supabase', 'For secure data storage and backend services.')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong>Geolocation Services:</strong> {t('privacy.thirdParty.geo', 'For detecting your country to serve localized content.')}</span>
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="bg-card border border-border/50 rounded-2xl p-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              {t('privacy.retention.title', '6. Data Retention')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.retention.content', 'We retain search logs for analytics purposes for up to 12 months. Newsletter subscriptions and contact form data are retained until you request removal. You may request deletion of your data at any time by contacting us.')}
            </p>
          </section>

          {/* Your Rights */}
          <section className="bg-safe-bg border border-safe/30 rounded-2xl p-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              {t('privacy.rights.title', '7. Your Rights')}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.rights.content', 'Depending on your location, you may have the right to:')}
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-safe mt-2 shrink-0" />
                {t('privacy.rights.bullet1', 'Access the personal data we hold about you.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-safe mt-2 shrink-0" />
                {t('privacy.rights.bullet2', 'Request correction of inaccurate data.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-safe mt-2 shrink-0" />
                {t('privacy.rights.bullet3', 'Request deletion of your data.')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-safe mt-2 shrink-0" />
                {t('privacy.rights.bullet4', 'Opt out of marketing communications.')}
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {t('privacy.contact.title', '8. Contact Us')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.contact.content', 'For privacy-related questions or to exercise your rights, please contact us at hello@petsafechoice.com.')}
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
