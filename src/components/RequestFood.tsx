import { useState } from "react";
import { MessageSquarePlus, Check, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RequestFoodProps {
  foodName: string;
  petType: "dog" | "cat";
}

export function RequestFood({ foodName, petType }: RequestFoodProps) {
  const { t, i18n } = useTranslation();
  const [isRequested, setIsRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      await supabase.from("food_requests" as any).insert({
        food_name: foodName.toLowerCase().trim(),
        species: petType,
        language: i18n.language,
      });
      setIsRequested(true);
      toast.success(t("requestFood.success", "Thanks! We'll review this food soon."));
    } catch {
      toast.error(t("requestFood.error", "Failed to submit request. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  if (isRequested) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-4 bg-safe/5 border border-safe/20 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-safe/20 flex items-center justify-center shrink-0">
          <Check className="w-5 h-5 text-safe" />
        </div>
        <p className="text-sm font-medium text-foreground">
          {t("requestFood.received", "Request received! We'll add this food to our database soon.")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <button
        onClick={handleRequest}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-accent/80 border border-border rounded-xl text-sm font-medium text-foreground transition-colors min-h-[48px] disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MessageSquarePlus className="w-4 h-4" />
        )}
        {t("requestFood.button", "Request '{{food}}' to be reviewed", { food: foodName })}
      </button>
    </div>
  );
}
