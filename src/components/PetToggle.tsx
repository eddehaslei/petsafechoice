import { Dog, Cat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type PetType = "dog" | "cat";

interface PetToggleProps {
  value: PetType;
  onChange: (value: PetType) => void;
}

export function PetToggle({ value, onChange }: PetToggleProps) {
  const { t } = useTranslation();

  return (
    <div 
      className="inline-flex items-center bg-secondary rounded-full p-1.5 gap-1"
      role="tablist"
      aria-label={t('petToggle.selectPet', 'Select pet type')}
    >
      <button
        onClick={() => onChange("dog")}
        role="tab"
        aria-selected={value === "dog"}
        aria-label={t('petToggle.dogLabel', 'Check food safety for dogs')}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-full font-heading font-semibold text-sm transition-all duration-300 min-h-[44px]",
          value === "dog"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <Dog className="w-5 h-5" aria-hidden="true" />
        {t('petToggle.dog')}
      </button>
      <button
        onClick={() => onChange("cat")}
        role="tab"
        aria-selected={value === "cat"}
        aria-label={t('petToggle.catLabel', 'Check food safety for cats')}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-full font-heading font-semibold text-sm transition-all duration-300 min-h-[44px]",
          value === "cat"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <Cat className="w-5 h-5" aria-hidden="true" />
        {t('petToggle.cat')}
      </button>
    </div>
  );
}
