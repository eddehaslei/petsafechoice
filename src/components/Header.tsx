import { Info, ShieldCheck, Phone, HelpCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-10">
      <div className="container max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left side - Back/Home buttons */}
        <div className="flex items-center gap-1">
          {!isHomePage && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground gap-1.5"
                onClick={handleGoHome}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.back') || 'Back'}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground gap-1.5"
                onClick={handleGoHome}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">{t('nav.home') || 'Home'}</span>
              </Button>
            </>
          )}
        </div>

        {/* Right side - Navigation */}
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
            <Link to="/about">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.about')}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
            <Link to="/safe-foods">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.safeFoods')}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
            <Link to="/emergency">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.emergency')}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
            <Link to="/faq">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.faq')}</span>
            </Link>
          </Button>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};
