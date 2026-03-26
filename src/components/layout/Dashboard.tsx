"use client";

import type { ReactNode } from "react";
import { MetricProvider } from "@/lib/MetricProvider";
import { FilterProvider, type PeriodPreset, type ComparisonMode } from "@/lib/FilterContext";
import { CrossFilterProvider } from "@/lib/CrossFilterContext";
import { LinkedHoverProvider } from "@/lib/LinkedHoverContext";
import { DrillDownProvider } from "@/lib/DrillDownContext";
import { DrillDownOverlay, type DrillDownOverlayProps } from "@/components/ui/DrillDownPanel";
import { AiProvider, type AiConfig } from "@/lib/AiContext";
import type { CardVariant, NullDisplay, ChartNullMode, ExportableConfig } from "@/lib/types";
import type { ThemePreset } from "@/lib/themes";
import type { ColorScheme } from "@/lib/MetricProvider";
import type { MotionConfig } from "@/lib/motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DashboardProps {
  children: ReactNode;

  // --- MetricProvider ---
  /** Theme preset name or custom ThemePreset object. */
  theme?: string | ThemePreset;
  /** Color scheme. "auto" detects system preference. Default: "auto". */
  colorScheme?: ColorScheme | "auto";
  /** Default card variant. Default: "default". */
  variant?: CardVariant;
  /** BCP 47 locale string. Default: "en-US". */
  locale?: string;
  /** ISO 4217 currency code. Default: "USD". */
  currency?: string;
  /** Global animation toggle. Default: true. */
  animate?: boolean;
  /** Spring physics config. */
  motionConfig?: MotionConfig;
  /** Default series color palette for charts. */
  colors?: string[];
  /** How null values display. Default: "dash". */
  nullDisplay?: NullDisplay;
  /** How charts handle null data points. Default: "gap". */
  chartNullMode?: ChartNullMode;
  /** Compact layout toggle. Default: false. */
  dense?: boolean;
  /** Default empty state template. */
  emptyState?: { message?: string; icon?: ReactNode };
  /** Default error state template. */
  errorState?: { message?: string };
  /** Global loading toggle. Default: false. */
  loading?: boolean;
  /** Noise texture on cards. Default: true. */
  texture?: boolean;
  /** Global export toggle. `true` enables image/CSV/clipboard. Pass `{ data }` to override CSV data. */
  exportable?: ExportableConfig;
  /** Show action hints in chart tooltips. Default: true. */
  tooltipHint?: boolean;

  // --- FilterProvider ---
  /** Filter configuration. Omit to skip FilterProvider entirely. */
  filters?: {
    /** Initial preset. */
    defaultPreset?: PeriodPreset;
    /** Initial comparison mode. Default: "none". */
    defaultComparison?: ComparisonMode;
    /** Reference date for preset calculations. Default: now. */
    referenceDate?: Date;
  };

  // --- AI ---
  /** AI configuration. Omit to disable AI features entirely. */
  ai?: AiConfig;

  // --- DrillDown ---
  /** Max drill-down nesting depth. Default: 4. */
  maxDrillDepth?: number;
  /** Render function for reactive drill content. */
  renderContent?: DrillDownOverlayProps["renderContent"];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * All-in-one dashboard wrapper. Replaces the 5-provider nesting pattern:
 * MetricProvider → FilterProvider → CrossFilterProvider → LinkedHoverProvider → DrillDown.Root
 *
 * Every prop is optional. Omit `filters` to skip FilterProvider entirely.
 * All hooks (useMetricFilters, useCrossFilter, useDrillDownAction, etc.) work inside.
 *
 * @example
 * ```tsx
 * <Dashboard theme="emerald" filters={{ defaultPreset: "30d" }} exportable>
 *   <DashboardHeader title="Sales" />
 *   <MetricGrid>
 *     <KpiCard title="Revenue" value={142800} format="currency" />
 *     <AreaChart data={data} index="month" categories={["revenue"]} />
 *   </MetricGrid>
 * </Dashboard>
 * ```
 */
export function Dashboard({
  children,
  // MetricProvider props
  theme,
  colorScheme,
  variant,
  locale,
  currency,
  animate,
  motionConfig,
  colors,
  nullDisplay,
  chartNullMode,
  dense,
  emptyState,
  errorState,
  loading,
  texture,
  exportable,
  tooltipHint,
  // FilterProvider props
  filters,
  // AI props
  ai,
  // DrillDown props
  maxDrillDepth,
  renderContent,
}: DashboardProps) {
  let content = (
    <DrillDownProvider maxDepth={maxDrillDepth}>
      {children}
      <DrillDownOverlay renderContent={renderContent} />
    </DrillDownProvider>
  );

  content = <LinkedHoverProvider>{content}</LinkedHoverProvider>;
  content = <CrossFilterProvider>{content}</CrossFilterProvider>;
  content = <AiProvider config={ai ?? null}>{content}</AiProvider>;

  if (filters) {
    content = (
      <FilterProvider
        defaultPreset={filters.defaultPreset}
        defaultComparison={filters.defaultComparison}
        referenceDate={filters.referenceDate}
      >
        {content}
      </FilterProvider>
    );
  }

  return (
    <MetricProvider
      theme={theme}
      colorScheme={colorScheme}
      variant={variant}
      locale={locale}
      currency={currency}
      animate={animate}
      motionConfig={motionConfig}
      colors={colors}
      nullDisplay={nullDisplay}
      chartNullMode={chartNullMode}
      dense={dense}
      emptyState={emptyState}
      errorState={errorState}
      loading={loading}
      texture={texture}
      exportable={!!exportable}
      tooltipHint={tooltipHint}
    >
      {content}
    </MetricProvider>
  );
}
