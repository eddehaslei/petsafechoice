import { Dog, Cat } from "lucide-react";
import { cn } from "@/lib/utils";

type PetType = "dog" | "cat";

interface PetToggleProps {
  value: PetType;
  onChange: (value: PetType) => void;
}

export function PetToggle({ value, onChange }: PetToggleProps) {
  return (
    <div className="inline-flex items-center bg-secondary rounded-full p-1.5 gap-1">
      <button
        onClick={() => onChange("dog")}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-full font-heading font-semibold text-sm transition-all duration-300",
          value === "dog"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <Dog className="w-5 h-5" />
        Dog
      </button>
      <button
        onClick={() => onChange("cat")}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-full font-heading font-semibold text-sm transition-all duration-300",
          value === "cat"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <Cat className="w-5 h-5" />
        Cat
      </button>
    </div>
  );
}
