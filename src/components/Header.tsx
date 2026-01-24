import { Info, ShieldCheck, Phone, HelpCircle, ArrowLeft, PawPrint, AlertTriangle } from "lucide-react";
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
    if (isHomePage) {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container max-w-5xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Left side - Logo and Back button stacked */}
        <div className="flex flex-col items-start gap-0">
          {/* Logo - always visible */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary/80 gap-1.5 font-heading font-bold text-lg px-2"
            onClick={handleGoHome}
          >
            <PawPrint className="h-5 w-5" />
            <span className="hidden sm:inline">PetSafeChoice</span>
          </Button>

          {!isHomePage && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground gap-1 text-xs px-2 -mt-1"
              onClick={handleGoHome}
            >
              <ArrowLeft className="h-3 w-3" />
              <span>{t('nav.back') || 'Back'}</span>
            </Button>
          )}
        </div>

        {/* Right side - Navigation */}
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
            <Link to="/about">
              <Info className="h-4 w-4" />
              <span className="hidden md:inline">{t('nav.about')}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
            <Link to="/safe-foods">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden md:inline">{t('nav.safeFoods')}</span>
            </Link>
          </Button>
          
          {/* Red Emergency Button - prominent styling */}
          <Button 
            variant="destructive" 
            size="sm" 
            className="gap-1.5 font-semibold bg-danger hover:bg-danger/90 text-danger-foreground shadow-md"
            asChild
          >
            <Link to="/emergency">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{t('nav.emergency')}</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
            <Link to="/faq">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden md:inline">{t('nav.faq')}</span>
            </Link>
          </Button>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};
