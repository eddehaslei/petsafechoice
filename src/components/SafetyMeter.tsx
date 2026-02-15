import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { SafetyLevel } from "./SafetyResult";

interface SafetyMeterProps {
  safetyLevel: SafetyLevel;
}

export function SafetyMeter({ safetyLevel }: SafetyMeterProps) {
  const [animatedDeg, setAnimatedDeg] = useState(0);
  const { t } = useTranslation();

  const targetDeg = safetyLevel === "safe" ? 30 : safetyLevel === "caution" ? 90 : 150;
  const label = safetyLevel === "safe" ? t('safety.safe').toUpperCase() : safetyLevel === "caution" ? t('safety.caution').toUpperCase() : t('safety.dangerous').toUpperCase();

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedDeg(targetDeg), 100);
    return () => clearTimeout(timer);
  }, [targetDeg]);

  const needleColor =
    safetyLevel === "safe" ? "hsl(var(--safe))" :
    safetyLevel === "caution" ? "hsl(var(--caution))" :
    "hsl(var(--danger))";

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 flex justify-center animate-fade-in">
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 200 120" className="w-48 h-28">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Green segment */}
          <path
            d="M 20 100 A 80 80 0 0 1 66 32"
            fill="none"
            stroke="hsl(var(--safe))"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Yellow segment */}
          <path
            d="M 66 32 A 80 80 0 0 1 134 32"
            fill="none"
            stroke="hsl(var(--caution))"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Red segment */}
          <path
            d="M 134 32 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--danger))"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2={100 + 65 * Math.cos(Math.PI - (animatedDeg * Math.PI) / 180)}
            y2={100 - 65 * Math.sin(Math.PI - (animatedDeg * Math.PI) / 180)}
            stroke={needleColor}
            strokeWidth="3"
            strokeLinecap="round"
            style={{ transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          />
          {/* Center dot */}
          <circle cx="100" cy="100" r="6" fill={needleColor} style={{ transition: "fill 0.5s" }} />
        </svg>
        <span
          className={cn(
            "text-xs font-bold tracking-widest mt-1",
            safetyLevel === "safe" && "text-safe",
            safetyLevel === "caution" && "text-caution",
            safetyLevel === "dangerous" && "text-danger"
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
