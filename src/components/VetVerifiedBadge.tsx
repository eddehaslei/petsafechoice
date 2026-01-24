import { Shield, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface VetVerifiedBadgeProps {
  variant?: "compact" | "full";
  className?: string;
}

export function VetVerifiedBadge({ 
  variant = "compact",
  className = ""
}: VetVerifiedBadgeProps) {
  const { t } = useTranslation();

  if (variant === "compact") {
    return (
      <Link 
        to="/about" 
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-safe/10 border border-safe/30 rounded-full hover:bg-safe/20 transition-colors ${className}`}
      >
        <Shield className="w-3.5 h-3.5 text-safe" />
        <span className="text-xs font-semibold text-safe">
          {t('vetBadge.verified', 'Vet-Verified')}
        </span>
      </Link>
    );
  }

  return (
    <Link 
      to="/about" 
      className={`flex items-center gap-3 p-3 bg-safe/5 border border-safe/20 rounded-xl hover:bg-safe/10 transition-colors ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-safe/20 flex items-center justify-center shrink-0">
        <Shield className="w-5 h-5 text-safe" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-foreground">
            {t('vetBadge.boardName', 'PetSafeChoice Veterinary Advisory Board')}
          </span>
          <CheckCircle className="w-4 h-4 text-safe" />
        </div>
        <p className="text-xs text-muted-foreground">
          {t('vetBadge.reviewedBy', 'Medically reviewed by licensed veterinary professionals')}
        </p>
      </div>
    </Link>
  );
}
