"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useMetricConfig } from "@/lib/MetricProvider";
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";

// ---------------------------------------------------------------------------
// DetailGrid.Item
// ---------------------------------------------------------------------------

interface DetailGridItemProps {
  /** Label displayed above the content */
  label: string;
  /** Content — text, badges, any ReactNode */
  children: React.ReactNode;
  className?: string;
}

function DetailGridItem({ label, children, className }: DetailGridItemProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </p>
      <div className="mt-1 text-sm text-[var(--foreground)]">
        {children}
      </div>
    </div>
  );
}
DetailGridItem.displayName = "DetailGrid.Item";

// ---------------------------------------------------------------------------
// DetailGrid
// ---------------------------------------------------------------------------

export interface DetailGridProps {
  /** Number of columns. Default: auto-fit based on children count */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Dense layout */
  dense?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
  "data-testid"?: string;
}

const colsClass: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

const DetailGridInner = forwardRef<HTMLDivElement, DetailGridProps>(function DetailGrid({
  columns,
  dense,
  children,
  className,
  id,
  "data-testid": dataTestId,
}, ref) {
  const config = useMetricConfig();
  const resolvedDense = dense ?? config.dense;

  // Auto-detect column count from children if not specified
  const childCount = Array.isArray(children) ? children.filter(Boolean).length : 1;
  const cols = columns ?? Math.min(childCount, 4);

  return (
    <div
      ref={ref}
      id={id}
      data-testid={dataTestId}
      data-dense={resolvedDense ? "true" : undefined}
      className={cn(
        "grid gap-4",
        resolvedDense && "gap-3",
        colsClass[cols] ?? colsClass[4],
        className,
      )}
    >
      {children}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const DetailGrid = Object.assign(
  withErrorBoundary(DetailGridInner, "DetailGrid"),
  { Item: DetailGridItem },
);
