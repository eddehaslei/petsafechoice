import { Shield, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TrustBarProps {
  author?: string;
  reviewer?: string;
  reviewerCredentials?: string;
}

export function TrustBar({ 
  author = "PetSafeChoice Team",
  reviewer = "Dr. Sarah Mitchell",
  reviewerCredentials = "DVM, Pet Nutrition Specialist"
}: TrustBarProps) {
  const { t } = useTranslation();

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground py-2 px-3 bg-secondary/50 rounded-lg border border-border/50">
      <div className="flex items-center gap-1.5">
        <Award className="w-4 h-4 text-primary" />
        <span>
          {t('trustBar.writtenBy', { author }) || `Written by ${author}`}
        </span>
      </div>
      <span className="hidden sm:inline text-border/70">|</span>
      <div className="flex items-center gap-1.5">
        <Shield className="w-4 h-4 text-safe flex-shrink-0" />
        <span>
          {t('trustBar.reviewedBy', { reviewer, credentials: reviewerCredentials }) || 
           `Medically Reviewed by ${reviewer}, ${reviewerCredentials}`}
        </span>
      </div>
    </div>
  );
}
