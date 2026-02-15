import { BadgeCheck, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

interface VerifiedDataBadgeProps {
  className?: string;
}

export function VerifiedDataBadge({ className = "" }: VerifiedDataBadgeProps) {
  const { t, i18n } = useTranslation();
  
  // Format date based on locale
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString(i18n.language, { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full ${className}`}>
      <BadgeCheck className="w-4 h-4 text-primary" />
      <span className="text-xs font-medium text-foreground">
        {t('verifiedBadge.verified', 'Verified Data')}
      </span>
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {formatDate()}
      </span>
    </div>
  );
}
