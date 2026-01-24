import { SafetyResultData } from "./SafetyResult";

interface DynamicResultHeaderProps {
  data: SafetyResultData;
}

export function DynamicResultHeader({ data }: DynamicResultHeaderProps) {
  const petName = data.petType === "dog" ? "Dogs" : "Cats";
  const foodName = data.food.charAt(0).toUpperCase() + data.food.slice(1);

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 text-center">
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
        Can {petName} Eat {foodName}?
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Safety & Health Guide
      </p>
    </div>
  );
}
