/**
 * MetricUI Global Types
 *
 * Shared interfaces used across every component.
 */

import type { FormatOption, Condition, GoalConfig, ComparisonMode } from "./format";

// ---------------------------------------------------------------------------
// Data row — the universal row constraint used across DataTable, CardShell,
// Export, DrillDown, and all chart components. Defined once here so changing
// the constraint propagates everywhere.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataRow = Record<string, any>;

// ---------------------------------------------------------------------------
// Shared base props — inherited by every MetricUI component
// ---------------------------------------------------------------------------

/** Props shared by ALL MetricUI components (filters, charts, KPIs, layout, UI) */
export interface BaseComponentProps {
  /** AI context — dev-provided hint about this component. Included in AI prompts for smarter analysis. */
  aiContext?: string;
  /** HTML id attribute */
  id?: string;
  /** Test id for testing frameworks */
  "data-testid"?: string;
  /** Additional CSS class names */
  className?: string;
}

/** Props shared by all DATA components (KPIs, charts, tables, status indicators) */
export interface DataComponentProps extends BaseComponentProps {
  /** Card variant */
  variant?: CardVariant;
  /** Compact/dense layout. Default: false */
  dense?: boolean;
  /** Loading state — shows skeleton placeholder */
  loading?: boolean;
  /** Empty state */
  empty?: EmptyState;
  /** Error state */
  error?: ErrorState;
  /** Stale data indicator */
  stale?: StaleState;
  /** Enable export. `true` enables image/CSV/clipboard. Pass `{ data }` to override CSV data. */
  exportable?: ExportableConfig;
  /** Data state configuration — alternative to individual loading/empty/error/stale props */
  state?: {
    loading?: boolean;
    empty?: EmptyState;
    error?: ErrorState;
    stale?: StaleState;
  };
}

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

export interface ComparisonConfig {
  /** Previous period value — we compute the change for you */
  value: number;
  /** Override the auto-generated label */
  label?: string;
  /** How to display the change */
  mode?: ComparisonMode;
  /** Flip the colors — for metrics where down is good (churn, bounce rate) */
  invertTrend?: boolean;
  /** Threshold-based coloring beyond simple +/- */
  threshold?: {
    warning: number;
    critical: number;
  };
}

// ---------------------------------------------------------------------------
// Trend icon customization
// ---------------------------------------------------------------------------

export interface TrendIconConfig {
  up?: React.ReactNode;
  down?: React.ReactNode;
  neutral?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Null / edge-value display
// ---------------------------------------------------------------------------

/**
 * How to display null, undefined, NaN, or Infinity values:
 *   - `"zero"` — show as 0 (formatted)
 *   - `"dash"` — show "—"
 *   - `"blank"` — show empty string
 *   - `"N/A"` — show "N/A"
 *   - any other string — show that literal string
 */
export type NullDisplay = "zero" | "dash" | "blank" | "N/A" | string;

/**
 * How charts handle null/missing data points:
 *   - `"gap"` — skip the point, creating a visible gap in the line/area (default)
 *   - `"zero"` — treat null as 0, drawing down to the baseline
 *   - `"connect"` — connect adjacent non-null points, bridging over the gap
 */
export type ChartNullMode = "gap" | "zero" | "connect";

// ---------------------------------------------------------------------------
// Sparkline type
// ---------------------------------------------------------------------------

export type SparklineType = "line" | "bar";

// ---------------------------------------------------------------------------
// Title position
// ---------------------------------------------------------------------------

/**
 * Where the title appears relative to the value:
 *   - `"top"` — above the value (default)
 *   - `"bottom"` — below the value and comparison
 *   - `"hidden"` — title is not rendered (useful for minimal dashboards)
 */
export type TitlePosition = "top" | "bottom" | "hidden";

/**
 * Horizontal alignment for the card content:
 *   - `"left"` — default, left-aligned
 *   - `"center"` — centered title, value, and comparisons
 *   - `"right"` — right-aligned
 */
export type TitleAlign = "left" | "center" | "right";

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

export interface TooltipConfig {
  /** Custom tooltip content — string or render function */
  content: React.ReactNode | ((context: Record<string, unknown>) => React.ReactNode);
  /** Tooltip position */
  position?: "top" | "right" | "bottom" | "left" | "cursor";
  /** Delay before showing (ms) */
  delay?: number;
  /** Max width in px */
  maxWidth?: number;
}

// ---------------------------------------------------------------------------
// Data states
// ---------------------------------------------------------------------------

export interface LoadingState {
  loading?: boolean;
}

export interface EmptyState {
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface ErrorState {
  message?: string;
  retry?: () => void;
}

export interface StaleState {
  since?: Date;
  warningAfter?: number; // minutes
}

export interface DataStates {
  loading?: boolean;
  empty?: EmptyState;
  error?: ErrorState;
  stale?: StaleState;
}

// ---------------------------------------------------------------------------
// Annotations (for charts)
// ---------------------------------------------------------------------------

export interface Annotation {
  type: "point" | "line" | "range";
  at?: string | number | Date;
  from?: string | number | Date;
  to?: string | number | Date;
  label: string;
  color?: string;
  style?: "solid" | "dashed";
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

/** Export configuration. `true` enables image/CSV/clipboard. Pass `{ data }` to override CSV data. */
export type ExportableConfig = boolean | { data: DataRow[] };

// ---------------------------------------------------------------------------
// Click / drill-down
// ---------------------------------------------------------------------------

export interface DrillDownConfig {
  label?: string;
  onClick: () => void;
}

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

export interface AnimationConfig {
  countUp?: boolean;
  delay?: number;
  duration?: number;
}

// ---------------------------------------------------------------------------
// Period / time intelligence
// ---------------------------------------------------------------------------

export interface PeriodConfig {
  current: { start: Date; end: Date };
  previous?: "auto" | { start: Date; end: Date };
  granularity?: "day" | "week" | "month" | "quarter" | "year";
  label?: string;
}

// ---------------------------------------------------------------------------
// Variant / theming
// ---------------------------------------------------------------------------

export type CardVariant = "default" | "outlined" | "ghost" | "elevated" | "flat" | (string & {});

