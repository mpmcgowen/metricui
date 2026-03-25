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
  classNames?: { root?: string; header?: string; body?: string; footnote?: string };
  id?: string;
  "data-testid"?: string;
  height?: number;
  variant?: CardVariant;
  dense?: boolean;
  componentName?: string;
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

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(function ChartContainer(props, ref) {
  return (
    <CardShell
      ref={ref as React.Ref<HTMLElement>}
      {...props}
      skeletonType="chart"
    />
  );
});
