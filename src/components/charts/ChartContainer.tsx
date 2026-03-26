"use client";

import { forwardRef } from "react";
import { CardShell } from "@/components/ui/CardShell";
import type { CardVariant, DataRow, EmptyState, ErrorState, StaleState, ExportableConfig } from "@/lib/types";

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
  exportable?: ExportableConfig;
  exportData?: DataRow[];
}

// ---------------------------------------------------------------------------
// Component — now a thin pass-through to CardShell
// ---------------------------------------------------------------------------

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(function ChartContainer({ classNames, ...props }, ref) {
  // Resolve chart → body alias so CardShell gets the right key
  const resolvedClassNames = classNames
    ? { root: classNames.root, header: classNames.header, body: classNames.body ?? classNames.chart, footnote: classNames.footnote }
    : undefined;

  return (
    <CardShell
      ref={ref as React.Ref<HTMLElement>}
      {...props}
      classNames={resolvedClassNames}
      skeletonType="chart"
    />
  );
});
