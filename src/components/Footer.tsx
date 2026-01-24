import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-8 border-t border-border/50 bg-card/30">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('footer.company')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('footer.resources')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/safe-foods" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.safeFoods')}
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.emergency')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('footer.support')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('nav.faq')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t('footer.disclaimer')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Medical Disclaimer Banner - Phase 20 Legal Requirement */}
        <div className="py-4 px-4 bg-muted/50 rounded-lg border border-border/50 mb-6">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong className="text-foreground">{t('footer.disclaimerTitle', 'Medical Disclaimer')}:</strong>{' '}
            {t('footer.disclaimerText', 'PetSafeChoice is for educational use only. Always consult a licensed veterinarian before changing your pet\'s diet or in an emergency.')}{' '}
            <Link to="/disclaimer" className="text-primary hover:underline font-medium">
              {t('footer.readMore', 'Read full disclaimer →')}
            </Link>
          </p>
        </div>

        <div className="pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            {t('common.madeWithLove')} <Heart className="w-4 h-4 inline text-primary" /> {t('common.forPets')}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            © {new Date().getFullYear()} {t('common.appName')} {t('common.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};
