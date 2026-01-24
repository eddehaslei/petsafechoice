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
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground py-3 px-4 bg-secondary/50 rounded-lg border border-border/50">
      <div className="flex items-center gap-2">
        <Award className="w-4 h-4 text-primary" />
        <span>
          {t('trustBar.writtenBy', { author }) || `Written by ${author}`}
        </span>
      </div>
      <span className="hidden sm:inline text-border">|</span>
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-safe" />
        <span>
          {t('trustBar.reviewedBy', { reviewer, credentials: reviewerCredentials }) || 
           `Medically Reviewed by ${reviewer}, ${reviewerCredentials}`}
        </span>
      </div>
    </div>
  );
}
