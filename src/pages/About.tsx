import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Brain, Heart, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen hero-gradient relative flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('about.mission.title')}</h3>
            <p className="text-muted-foreground">
              {t('about.mission.description')}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('about.science.title')}</h3>
            <p className="text-muted-foreground">
              {t('about.science.description')}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('about.love.title')}</h3>
            <p className="text-muted-foreground">
              {t('about.love.description')}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('about.community.title')}</h3>
            <p className="text-muted-foreground">
              {t('about.community.description')}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-4">{t('about.disclaimer.title')}</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('about.disclaimer.description')}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
