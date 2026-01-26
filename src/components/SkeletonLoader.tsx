import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  variant?: "result" | "card" | "text";
  className?: string;
}

export function SkeletonLoader({ variant = "result", className }: SkeletonLoaderProps) {
  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="h-4 bg-muted animate-pulse rounded-md w-3/4" />
        <div className="h-4 bg-muted animate-pulse rounded-md w-1/2" />
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("p-4 bg-card rounded-2xl border border-border/50", className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-muted animate-pulse rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted animate-pulse rounded-md w-1/2" />
            <div className="h-3 bg-muted animate-pulse rounded-md w-1/3" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded-md" />
          <div className="h-4 bg-muted animate-pulse rounded-md w-5/6" />
        </div>
      </div>
    );
  }

  // Full result skeleton
  return (
    <div className={cn("w-full max-w-2xl mx-auto animate-fade-in", className)}>
      {/* Main Result Card Skeleton */}
      <div className="rounded-3xl border-2 border-border/30 bg-card overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 flex items-center gap-4">
          <div className="w-16 h-16 bg-muted animate-pulse rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-7 bg-muted animate-pulse rounded-md w-32" />
              <div className="h-6 bg-muted animate-pulse rounded-full w-24" />
            </div>
            <div className="h-4 bg-muted animate-pulse rounded-md w-24" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Summary */}
          <div className="bg-background/80 rounded-2xl p-4 border border-border/30">
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded-md" />
              <div className="h-4 bg-muted animate-pulse rounded-md w-5/6" />
              <div className="h-4 bg-muted animate-pulse rounded-md w-4/6" />
            </div>
          </div>

          {/* Details */}
          <div className="bg-background/60 rounded-2xl p-4 border border-border/20">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-muted animate-pulse rounded-full mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted animate-pulse rounded-md" />
                <div className="h-3 bg-muted animate-pulse rounded-md w-4/5" />
              </div>
            </div>
          </div>

          {/* Recommendations skeleton */}
          <div className="bg-background/60 rounded-2xl p-4 border border-border/20">
            <div className="h-4 bg-muted animate-pulse rounded-md w-32 mb-3" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-muted animate-pulse rounded-full" />
                  <div className="h-3 bg-muted animate-pulse rounded-md flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vet Badge Skeleton */}
      <div className="mt-4 flex items-center justify-center">
        <div className="h-10 bg-muted animate-pulse rounded-xl w-64" />
      </div>
    </div>
  );
}
