"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { isCustomColor } from "@/lib/format";

// ---------------------------------------------------------------------------
// Named color → hex resolution (same set as KpiCard)
// ---------------------------------------------------------------------------

const NAMED_COLORS: Record<string, string> = {
  emerald: "#10B981",
  green: "#10B981",
  red: "#EF4444",
  amber: "#F59E0B",
  yellow: "#F59E0B",
  blue: "#3B82F6",
  indigo: "#6366F1",
  purple: "#8B5CF6",
  pink: "#EC4899",
  cyan: "#06B6D4",
};

function resolveColor(color?: string): string | undefined {
  if (!color) return undefined;
  if (isCustomColor(color)) return color;
  return NAMED_COLORS[color] ?? color;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProgressBarProps {
  /** Progress value, 0-100 */
  value: number;
  /** CSS color or named color (emerald, red, amber, etc). Default: var(--accent) */
  color?: string;
  /** Bar height in px. Default: 3 */
  height?: number;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar({ value, color, height = 3, className }, ref) {
    const clampedValue = Math.max(0, Math.min(value, 100));
    const resolvedColor = resolveColor(color);

    return (
      <div
        ref={ref}
        className={cn(
          "w-full overflow-hidden rounded-full bg-[var(--card-border)]",
          className,
        )}
        style={{ height: `${height}px` }}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            !resolvedColor && "bg-[var(--accent)]",
          )}
          style={{
            width: `${clampedValue}%`,
            ...(resolvedColor ? { backgroundColor: resolvedColor } : {}),
          }}
        />
      </div>
    );
  },
);
