"use client";

import { forwardRef } from "react";
import { CardShell } from "@/components/ui/CardShell";
import type { CardVariant, DataRow, EmptyState, ErrorState, StaleState, ExportableConfig, DataComponentProps } from "@/lib/types";

// ---------------------------------------------------------------------------
// Props — thin wrapper over CardShell for backward compatibility
// ---------------------------------------------------------------------------

interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  below?: React.ReactNode;
  className?: string;
  classNames?: { root?: string; header?: string; body?: string; /** Alias for `body` — accepted for chart-level consistency */ chart?: string; footnote?: string };
  id?: string;
  "data-testid"?: string;
  height?: number;
  variant?: CardVariant;
  dense?: boolean;
  componentName?: string;
  aiContext?: string;
  flashClass?: string;
  loading?: boolean;
  empty?: EmptyState;
  error?: ErrorState;
  stale?: StaleState;
  /** Unified data state config — individual loading/empty/error/stale props take precedence */
  state?: DataComponentProps["state"];
  exportable?: ExportableConfig;
  exportData?: DataRow[];
}

// ---------------------------------------------------------------------------
// Component — now a thin pass-through to CardShell
// ---------------------------------------------------------------------------

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(function ChartContainer({ classNames, state, loading, empty, error, stale, ...props }, ref) {
  // Resolve chart → body alias so CardShell gets the right key
  const resolvedClassNames = classNames
    ? { root: classNames.root, header: classNames.header, body: classNames.body ?? classNames.chart, footnote: classNames.footnote }
    : undefined;

  // Resolve state config — individual props take precedence over state bag
  const resolvedLoading = loading ?? state?.loading;
  const resolvedEmpty = empty ?? state?.empty;
  const resolvedError = error ?? state?.error;
  const resolvedStale = stale ?? state?.stale;

  // Auto-generate aria-label for chart accessibility
  const ariaLabel = props.title
    ? `${props.title} ${props.componentName ?? "chart"}`
    : props.componentName
      ? `${props.componentName} chart`
      : "Chart";

  return (
    <CardShell
      ref={ref as React.Ref<HTMLElement>}
      {...props}
      aria-label={ariaLabel}
      role="img"
      loading={resolvedLoading}
      empty={resolvedEmpty}
      error={resolvedError}
      stale={resolvedStale}
      classNames={resolvedClassNames}
      skeletonType="chart"
    />
  );
});
