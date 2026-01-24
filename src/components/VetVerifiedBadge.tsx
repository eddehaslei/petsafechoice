import { Shield, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

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
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-safe/10 border border-safe/30 rounded-full ${className}`}>
        <Shield className="w-3.5 h-3.5 text-safe" />
        <span className="text-xs font-semibold text-safe">
          Vet-Verified
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 p-3 bg-safe/5 border border-safe/20 rounded-xl ${className}`}>
      <div className="w-10 h-10 rounded-full bg-safe/20 flex items-center justify-center shrink-0">
        <Shield className="w-5 h-5 text-safe" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-foreground">Veterinary Advisory Board</span>
          <CheckCircle className="w-4 h-4 text-safe" />
        </div>
        <p className="text-xs text-muted-foreground">
          Reviewed by our team of licensed veterinary professionals
        </p>
      </div>
    </div>
  );
}
