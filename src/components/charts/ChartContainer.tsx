"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { CARD_CLASSES, HOVER_CLASSES } from "@/lib/styles";
import { DescriptionPopover } from "@/components/ui/DescriptionPopover";
import { ChartSkeletonContent, DataStateWrapper } from "@/components/ui/DataStateWrapper";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useMetricConfig } from "@/lib/MetricProvider";
import type { CardVariant, EmptyState, ErrorState, StaleState } from "@/lib/types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  /** Content rendered below the chart area (outside the fixed height). Used for legends. */
  below?: React.ReactNode;
  className?: string;
  /** Sub-element class name overrides */
  classNames?: { root?: string; header?: string; body?: string; footnote?: string };
  /** HTML id attribute */
  id?: string;
  /** Test id for testing frameworks */
  "data-testid"?: string;
  height?: number;
  variant?: CardVariant;
  dense?: boolean;
  /** Component name for error boundary diagnostics */
  componentName?: string;
  /** CSS class for value flash animation (from useValueFlash) */
  flashClass?: string;
  loading?: boolean;
  empty?: EmptyState;
  error?: ErrorState;
  stale?: StaleState;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(function ChartContainer({
  title,
  subtitle,
  description,
  footnote,
  action,
  children,
  below,
  className,
  classNames,
  id,
  "data-testid": dataTestId,
  height = 300,
  variant,
  dense,
  componentName,
  flashClass,
  loading,
  empty,
  error,
  stale,
}, ref) {
  const config = useMetricConfig();
  const resolvedVariant = variant ?? config.variant;
  const resolvedDense = dense ?? config.dense;
  const resolvedLoading = loading ?? config.loading;

  if (resolvedLoading) return (
    <div data-variant={resolvedVariant} data-dense={resolvedDense ? "true" : undefined} className={cn("noise-texture border p-[var(--mu-padding)]", CARD_CLASSES)}>
      <ChartSkeletonContent height={height} />
    </div>
  );
  if (error) return (
    <div data-variant={resolvedVariant} data-dense={resolvedDense ? "true" : undefined} className={cn("noise-texture border p-[var(--mu-padding)]", CARD_CLASSES)}>
      <DataStateWrapper error={error}><div /></DataStateWrapper>
    </div>
  );
  if (empty) return (
    <div data-variant={resolvedVariant} data-dense={resolvedDense ? "true" : undefined} className={cn("noise-texture border p-[var(--mu-padding)]", CARD_CLASSES)}>
      <DataStateWrapper empty={empty}><div /></DataStateWrapper>
    </div>
  );

  return (
    <div
      ref={ref}
      id={id}
      data-testid={dataTestId}
      data-component={componentName}
      data-metric-card=""
      data-variant={resolvedVariant}
      data-dense={resolvedDense ? "true" : undefined}
      className={cn(
        "noise-texture group relative flex h-full flex-col border p-[var(--mu-padding)] transition-all duration-300",
        CARD_CLASSES,
        HOVER_CLASSES,
        flashClass,
        classNames?.root,
        className
      )}
    >
      {/* Stale indicator */}
      {stale && (
        <div className="absolute right-3 top-3 z-10">
          <DataStateWrapper stale={stale}><div /></DataStateWrapper>
        </div>
      )}

      {/* Header */}
      {(title || action) && (
        <div className={cn("mb-4 flex items-start justify-between", classNames?.header)}>
          <div>
            <div className="flex items-center gap-1.5">
              {title && (
                <span className="truncate text-[length:var(--mu-title-size)] font-medium tracking-wide uppercase text-[var(--muted)]">
                  {title}
                </span>
              )}
              {description && (
                <DescriptionPopover
                  content={typeof description === "string" ? description : description}
                />
              )}
            </div>
            {subtitle && (
              <p className="mu-chart-subtitle mt-0.5 text-[11px] text-[var(--muted)] opacity-80">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}

      {/* Chart area */}
      <div className={cn("flex-1", classNames?.body)} style={{ minHeight: height }}>
        <ErrorBoundary componentName={componentName ?? "Chart"}>
          {children}
        </ErrorBoundary>
      </div>

      {/* Below chart (legend, etc.) */}
      {below}

      {/* Footnote */}
      {footnote && (
        <p className={cn("mu-footnote mt-3 text-[10px] leading-snug text-[var(--muted)] opacity-75", classNames?.footnote)}>
          {footnote}
        </p>
      )}
    </div>
  );
});
