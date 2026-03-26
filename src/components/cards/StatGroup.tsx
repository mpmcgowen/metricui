"use client";

import { forwardRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { FormatOption, ComparisonMode } from "@/lib/format";
import type { CardVariant, DataComponentProps, DrillDownConfig } from "@/lib/types";
import { useMetricConfig } from "@/lib/MetricProvider";
import { KpiCard } from "./KpiCard";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatItem {
  /** Display label */
  label: string;
  /** Display value — number for auto-formatting, string for pre-formatted */
  value: string | number;
  /** Change percentage (legacy — kept for backward compat) */
  change?: number;
  /** Previous value for comparison computation */
  previousValue?: number;
  /** Comparison display mode */
  comparisonMode?: ComparisonMode;
  /** Flip trend colors (for metrics where down is good) */
  invertTrend?: boolean;
  /** Per-stat format override */
  format?: FormatOption;
  /** Optional icon (any ReactNode) */
  icon?: React.ReactNode;
  /** Drill-down config. When set, the stat item becomes clickable and opens the drill-down panel. */
  drillDown?: DrillDownConfig;
}

export interface StatGroupProps extends DataComponentProps {
  stats: StatItem[];
  /** Group title */
  title?: string;
  /** Group subtitle */
  subtitle?: string;
  /** Override column count (auto-detected from stat count by default) */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Default format applied to all numeric values (per-stat format overrides this) */
  format?: FormatOption;
  /** Sub-element class name overrides */
  classNames?: {
    root?: string;
    header?: string;
    grid?: string;
    cell?: string;
    label?: string;
    value?: string;
  };
  /** Click handler for individual stats */
  onStatClick?: (stat: StatItem, index: number) => void;
  /** What to show when a stat value is null/undefined. Default: "dash" */
  nullDisplay?: "dash" | "blank" | "N/A" | "zero" | string;
  /** Enable/disable animations. Default: true. */
  animate?: boolean;
}

// ---------------------------------------------------------------------------
// Grid column helper
// ---------------------------------------------------------------------------

function getGridCols(count: number, columns?: number): string {
  const cols = columns ?? count;
  const responsive = `grid-cols-2`;
  switch (cols) {
    case 1: return "grid-cols-1";
    case 2: return "grid-cols-2";
    case 3: return `${responsive} sm:grid-cols-3`;
    case 4: return `${responsive} sm:grid-cols-4`;
    case 5: return `${responsive} sm:grid-cols-3 lg:grid-cols-5`;
    case 6: return `${responsive} sm:grid-cols-3 lg:grid-cols-6`;
    default:
      if (cols > 6) return `${responsive} sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6`;
      return `${responsive} sm:grid-cols-4`;
  }
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function StatGroupSkeleton({
  count = 4,
  dense,
  columns,
  className,
}: {
  count?: number;
  dense?: boolean;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      data-dense={dense ? "true" : undefined}
      className={cn(
        "grid gap-px overflow-hidden rounded-xl border bg-[var(--card-border)] border-[var(--card-border)]",
        getGridCols(count, columns),
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "mu-shimmer bg-[var(--card-bg)]",
            "px-[var(--mu-padding-x-bare)] py-[var(--mu-padding-y-bare)] sm:px-[var(--mu-padding-x-bare-sm)]"
          )}
        >
          <div className="h-3 w-20 rounded bg-[var(--card-border)]" />
          <div className="mt-2 h-7 w-16 rounded bg-[var(--card-border)]" />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const StatGroupInner = forwardRef<HTMLDivElement, StatGroupProps>(function StatGroup({
  stats,
  title,
  subtitle,
  variant,
  dense,
  columns,
  format: groupFormat,
  loading = false,
  className,
  classNames,
  id,
  "data-testid": dataTestId,
  aiContext: _aiContext,
  onStatClick,
  nullDisplay,
  animate,
}, ref) {
  const config = useMetricConfig();

  const resolvedVariant = variant ?? config.variant;
  const resolvedDense = dense ?? config.dense;
  const resolvedNullDisplay = nullDisplay ?? config.nullDisplay;

  const resolvedLoading = loading ?? config.loading;

  if (resolvedLoading) {
    return (
      <StatGroupSkeleton
        count={stats.length || 4}
        dense={resolvedDense}
        columns={columns}
        className={className}
      />
    );
  }

  return (
    <div ref={ref} id={id} data-testid={dataTestId} className={cn(className, classNames?.root)}>
      {/* Group header */}
      {(title || subtitle) && (
        <div className={cn("mb-3", classNames?.header)}>
          {title && (
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-0.5 text-xs text-[var(--muted)]">{subtitle}</p>
          )}
        </div>
      )}

      {/* Grid of bare KpiCards */}
      <div
        data-variant={resolvedVariant}
        data-dense={resolvedDense ? "true" : undefined}
        data-stat-count={stats.length}
        className={cn(
          "mu-stat-grid grid gap-px overflow-hidden border",
          "rounded-[var(--mu-card-radius)] border-[length:var(--mu-card-border-w)] border-[color:var(--mu-card-border)]",
          "bg-[var(--mu-card-border)] shadow-[var(--mu-card-shadow)]",
          getGridCols(stats.length, columns),
          classNames?.grid,
        )}
      >
        {stats.map((stat, idx) => {
          // Map StatItem to KpiCard props
          const statFormat = stat.format ?? groupFormat;

          // Build comparison prop from previousValue or legacy change
          const comparison = stat.previousValue !== undefined && typeof stat.value === "number"
            ? {
                value: stat.previousValue,
                mode: stat.comparisonMode,
                invertTrend: stat.invertTrend,
              }
            : undefined;

          // Legacy change → comparisonLabel (pre-computed percentage)
          const legacyLabel = stat.change !== undefined
            ? `${stat.change >= 0 ? "+" : ""}${stat.change.toFixed(1)}%`
            : undefined;

          const isClickable = !!(onStatClick || stat.drillDown);

          return (
            <div
              key={`${stat.label}-${idx}`}
              className={cn(
                "mu-stat-cell bg-[var(--mu-cell-bg)]",
                isClickable && "cursor-pointer transition-colors hover:bg-[var(--card-glow)]",
                classNames?.cell,
              )}
              onClick={onStatClick ? () => onStatClick(stat, idx) : undefined}
            >
              <KpiCard
                bare
                dense={resolvedDense}
                title={stat.label}
                value={stat.value}
                format={typeof stat.value === "number" ? statFormat : undefined}
                icon={stat.icon}
                comparison={comparison}
                comparisonLabel={legacyLabel}
                nullDisplay={resolvedNullDisplay}
                animate={animate}
                drillDown={stat.drillDown}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const StatGroup = withErrorBoundary(StatGroupInner, "StatGroup");
(StatGroup as any).__gridHint = "stat"; // eslint-disable-line @typescript-eslint/no-explicit-any
