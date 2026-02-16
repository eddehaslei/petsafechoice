import { ChevronRight, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BreadcrumbsProps {
  foodName?: string;
  safetyLevel?: string;
}

export function Breadcrumbs({ foodName, safetyLevel }: BreadcrumbsProps) {
  const { t } = useTranslation();

  if (!foodName) return null;

  const safetyLabel = safetyLevel
    ? t(`safety.${safetyLevel}`, safetyLevel)
    : t("search.button", "Safety Check");

  return (
    <nav aria-label="Breadcrumb" className="w-full max-w-2xl mx-auto mb-4">
      <ol className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
        <li className="flex items-center gap-1" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Home className="w-3 h-3" />
          <a href="/" itemProp="item" className="hover:text-foreground transition-colors">
            <span itemProp="name">{t("nav.home", "Home")}</span>
          </a>
          <meta itemProp="position" content="1" />
        </li>
        <ChevronRight className="w-3 h-3" />
        <li className="flex items-center gap-1" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <span itemProp="name">{safetyLabel}</span>
          <meta itemProp="position" content="2" />
        </li>
        <ChevronRight className="w-3 h-3" />
        <li className="flex items-center" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <span itemProp="name" className="font-medium text-foreground capitalize">{foodName}</span>
          <meta itemProp="position" content="3" />
        </li>
      </ol>
    </nav>
  );
}
