import { Info, ShieldCheck, Phone, HelpCircle, ArrowLeft, PawPrint, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  const handleGoHome = () => {
    if (isHomePage) {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  return (
    <header 
      className="sticky top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
      role="banner"
      aria-label="Main navigation"
    >
      <div className="container max-w-5xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Left side - Logo and Back button stacked */}
        <div className="flex flex-col items-start gap-0">
          {/* Logo - always visible */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary/80 gap-1.5 font-heading font-bold text-lg px-2 min-h-[44px] min-w-[44px]"
            onClick={handleGoHome}
            aria-label="PetSafeChoice - Go to homepage"
          >
            <PawPrint className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">PetSafeChoice</span>
          </Button>

          {!isHomePage && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground gap-1 text-xs px-2 -mt-1 min-h-[44px]"
              onClick={handleGoHome}
              aria-label="Go back to homepage"
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              <span>{t('nav.back') || 'Back'}</span>
            </Button>
          )}
        </div>

        {/* Right side - Navigation */}
        <nav className="flex items-center gap-1" role="navigation" aria-label="Primary navigation">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground gap-1.5 min-h-[44px] min-w-[44px]" 
            asChild
          >
            <Link to="/about" aria-label="About PetSafeChoice">
              <Info className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">{t('nav.about')}</span>
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground gap-1.5 min-h-[44px] min-w-[44px]" 
            asChild
          >
            <Link to="/safe-foods" aria-label="Browse safe foods">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">{t('nav.safeFoods')}</span>
            </Link>
          </Button>
          
          {/* Red Emergency Button - prominent styling */}
          <Button 
            variant="destructive" 
            size="sm" 
            className="gap-1.5 font-semibold bg-danger hover:bg-danger/90 text-danger-foreground shadow-md min-h-[44px] min-w-[44px]"
            asChild
          >
            <Link to="/emergency" aria-label="Emergency help - find a vet">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t('nav.emergency')}</span>
            </Link>
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground gap-1.5 min-h-[44px] min-w-[44px]" 
            asChild
          >
            <Link to="/faq" aria-label="Frequently asked questions">
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">{t('nav.faq')}</span>
            </Link>
          </Button>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
};
