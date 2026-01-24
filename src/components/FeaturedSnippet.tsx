import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { SafetyResultData } from "./SafetyResult";
import { VetVerifiedBadge } from "./VetVerifiedBadge";

interface FeaturedSnippetProps {
  data: SafetyResultData;
}

export function FeaturedSnippet({ data }: FeaturedSnippetProps) {
  const petName = data.petType === "dog" ? "dogs" : "cats";
  const foodName = data.food.charAt(0).toUpperCase() + data.food.slice(1);

  const config = {
    safe: {
      icon: CheckCircle,
      answer: `Yes, ${petName} can safely eat ${foodName.toLowerCase()}.`,
      bgClass: "bg-safe/5 border-safe/30",
      iconClass: "text-safe",
      answerClass: "text-safe",
    },
    caution: {
      icon: AlertTriangle,
      answer: `${foodName} should be given to ${petName} with caution.`,
      bgClass: "bg-caution/5 border-caution/30",
      iconClass: "text-caution",
      answerClass: "text-caution",
    },
    dangerous: {
      icon: XCircle,
      answer: `No! ${foodName} is toxic to ${petName}.`,
      bgClass: "bg-danger/5 border-danger/30",
      iconClass: "text-danger",
      answerClass: "text-danger",
    },
  };

  const { icon: Icon, answer, bgClass, iconClass, answerClass } = config[data.safetyLevel];

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 animate-fade-in">
      {/* Featured Snippet Box - Optimized for Google */}
      <div className={`rounded-2xl border-2 p-5 ${bgClass}`}>
        {/* Quick Answer - the "snippet" Google may display */}
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <Icon className={`w-8 h-8 ${iconClass}`} />
          </div>
          <div className="flex-1">
            {/* Primary Answer - Large and scannable */}
            <p className={`text-xl font-bold leading-tight mb-2 ${answerClass}`}>
              {answer}
            </p>
            
            {/* Supporting Summary */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.summary}
            </p>
            
            {/* Trust Signal */}
            <div className="mt-3 flex items-center gap-2">
              <VetVerifiedBadge variant="compact" />
              <span className="text-xs text-muted-foreground">
                Updated {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
