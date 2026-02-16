import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PawPrint, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="text-center px-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
          <PawPrint className="w-10 h-10 text-primary" />
        </div>
        <h1 className="mb-2 text-6xl font-heading font-extrabold text-primary">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">{t('notFound.message')}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5"
        >
          <Home className="w-4 h-4" />
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
