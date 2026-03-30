"use client";

import { forwardRef } from "react";
import { CardShell } from "@/components/ui/CardShell";
import type { CardVariant, DataRow, EmptyState, ErrorState, StaleState, ExportableConfig, DataComponentProps, HeadlineProp } from "@/lib/types";

// ---------------------------------------------------------------------------
// Props — accepts ALL card-level props via a single `shell` object,
// plus chart-specific overrides (height, componentName, exportData).
//
// When adding a new prop to DataComponentProps, it flows through
// automatically — no need to update 16 chart files.
// ---------------------------------------------------------------------------

export interface ChartContainerProps {
  /** All card/shell props — pass the component's entire props or a subset */
  shell: {
    title?: string;
    subtitle?: string;
    description?: string | React.ReactNode;
    footnote?: string;
    action?: React.ReactNode;
    headline?: HeadlineProp;
    className?: string;
    classNames?: { root?: string; header?: string; body?: string; chart?: string; footnote?: string };
    id?: string;
    "data-testid"?: string;
    aiContext?: string;
    loading?: boolean;
    empty?: EmptyState | string;
    error?: ErrorState | string;
    stale?: StaleState;
    state?: DataComponentProps["state"];
    exportable?: ExportableConfig;
    variant?: CardVariant;
    dense?: boolean;
  };
  /** Chart content */
  children: React.ReactNode;
  /** Content below the chart (legends) */
  below?: React.ReactNode;
  /** Component name for error boundaries and AI registration */
  componentName?: string;
  /** Resolved chart height */
  height?: number;
  /** Export data for CSV */
  exportData?: DataRow[];
  /** CSS class for value flash animation */
  flashClass?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(function ChartContainer(
  { shell, children, below, componentName, height, exportData, flashClass },
  ref,
) {
  const { classNames, state, loading, empty, error, stale, ...shellRest } = shell;

  // Resolve chart → body alias
  const resolvedClassNames = classNames
    ? { root: classNames.root, header: classNames.header, body: classNames.body ?? classNames.chart, footnote: classNames.footnote }
    : undefined;

  // Resolve state config — individual props take precedence
  const resolvedLoading = loading ?? state?.loading;
  const resolvedEmpty = empty ?? state?.empty;
  const resolvedError = error ?? state?.error;
  const resolvedStale = stale ?? state?.stale;

  // Auto-generate aria-label
  const ariaLabel = shellRest.title
    ? `${shellRest.title} ${componentName ?? "chart"}`
    : componentName
      ? `${componentName} chart`
      : "Chart";

  return (
    <CardShell
      ref={ref as React.Ref<HTMLElement>}
      {...shellRest}
      componentName={componentName}
      height={height}
      exportData={exportData}
      flashClass={flashClass}
      below={below}
      aria-label={ariaLabel}
      role="img"
      loading={resolvedLoading}
      empty={resolvedEmpty}
      error={resolvedError}
      stale={resolvedStale}
      classNames={resolvedClassNames}
      skeletonType="chart"
    >
      {children}
    </CardShell>
  );
});
