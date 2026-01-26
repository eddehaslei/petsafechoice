import { Shield, Award, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface TrustBarProps {
  author?: string;
}

export function TrustBar({ 
  author = "PetSafeChoice Team"
}: TrustBarProps) {
  const { t } = useTranslation();

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground py-2 px-3 bg-secondary/50 rounded-lg border border-border/50">
      <div className="flex items-center gap-1.5">
        <Award className="w-4 h-4 text-primary" />
        <span>
          {t('trustBar.writtenBy', { author })}
        </span>
      </div>
      <span className="hidden sm:inline text-border/70">|</span>
      <Link 
        to="/about"
        className="flex items-center gap-1.5 hover:text-safe transition-colors"
      >
        <Shield className="w-4 h-4 text-safe flex-shrink-0" />
        <span>{t('trustBar.reviewedBy')}</span>
        <span className="font-medium text-foreground hover:text-safe">
          {t('trustBar.boardName')}
        </span>
        <ExternalLink className="w-3 h-3 opacity-50" />
      </Link>
    </div>
  );
}
