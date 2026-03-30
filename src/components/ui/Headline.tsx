"use client";

import { cn } from "@/lib/utils";
import { formatValue, computeComparison, evaluateConditions } from "@/lib/format";
import { resolveNamedColor } from "@/lib/namedColors";
import { useLocale } from "@/lib/MetricProvider";
import { useCountUp } from "@/lib/useCountUp";
import type { HeadlineProp } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface HeadlineProps {
  headline: HeadlineProp;
  className?: string;
}

/**
 * Headline number rendered in the card header.
 *
 * Supports string shorthand ("$1.2M total") or rich config with
 * formatting, comparison badge, conditional coloring, and count-up animation.
 */
export function Headline({ headline, className }: HeadlineProps) {
  const localeDefaults = useLocale();

  // String shorthand
  if (typeof headline === "string") {
    return (
      <div className={cn("flex items-baseline gap-1.5 text-right", className)}>
        <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-[var(--foreground)]">
          {headline}
        </span>
      </div>
    );
  }

  // Rich config
  const { value, format = "compact", label, comparison, conditions } = headline;

  // Animation
  const animatedValue = useCountUp(value, { enabled: true });

  // Format
  const formatted = formatValue(animatedValue, format, localeDefaults);

  // Conditional color
  const condColor = conditions ? evaluateConditions(value, conditions) : null;
  const resolvedColor = condColor ? resolveNamedColor(condColor) : undefined;

  // Comparison
  const comp = comparison
    ? computeComparison(value, comparison.value, {
        mode: comparison.mode,
        invertTrend: comparison.invertTrend,
        format,
        localeDefaults,
      })
    : null;

  const TrendIcon = comp?.trend === "positive" ? TrendingUp
    : comp?.trend === "negative" ? TrendingDown
    : Minus;

  const trendColor = comp?.trend === "positive"
    ? "text-[var(--mu-color-positive)]"
    : comp?.trend === "negative"
      ? "text-[var(--mu-color-negative)]"
      : "text-[var(--muted)]";

  return (
    <div className={cn("flex flex-col items-end gap-0.5", className)}>
      <div className="flex items-baseline gap-1.5">
        {label && (
          <span className="text-[length:var(--mu-text-xs)] text-[var(--muted)]">{label}</span>
        )}
        <span
          className="font-[family-name:var(--font-mono)] text-xl font-bold tabular-nums"
          style={resolvedColor ? { color: resolvedColor } : { color: "var(--foreground)" }}
        >
          {formatted}
        </span>
      </div>
      {comp && (
        <div className={cn("flex items-center gap-1 text-[length:var(--mu-text-2xs)] font-medium", trendColor)}>
          <TrendIcon className="h-3 w-3" />
          <span className="font-[family-name:var(--font-mono)]">{comp.label}</span>
        </div>
      )}
    </div>
  );
}
