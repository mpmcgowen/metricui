"use client";

import { cn, withOpacity } from "@/lib/utils";
import { CARD_CLASSES, HOVER_CLASSES } from "@/lib/styles";
import {
  formatValue,
  formatValueRaw,
  computeComparison,
  evaluateConditions,
  computeGoalProgress,
  isCustomColor,
  type FormatOption,
  type Condition,
  type GoalConfig,
} from "@/lib/format";
import type {
  ComparisonConfig,
  TooltipConfig,
  DrillDownConfig,
  ExportableConfig,
  AnimationConfig,
  CardVariant,
  EmptyState,
  ErrorState,
  StaleState,
  TrendIconConfig,
  NullDisplay,
  SparklineType,
  TitlePosition,
  TitleAlign,
} from "@/lib/types";
import {
  type DynamicString,
  type DynamicReactNode,
  resolveString,
  resolveReactNode,
  buildMetricContext,
} from "@/lib/template";
import { devWarnDeprecated } from "@/lib/devWarnings";
import { useLocale, useMetricConfig } from "@/lib/MetricProvider";
import { useCountUp } from "@/lib/useCountUp";

import { useLinkedHover } from "@/lib/LinkedHoverContext";
import { useCrossFilter } from "@/lib/CrossFilterContext";
import { useCopyToClipboard } from "@/lib/useCopyToClipboard";
import { Sparkline } from "@/components/charts/Sparkline";
import { DescriptionPopover } from "@/components/ui/DescriptionPopover";
import { ExportButton } from "@/components/ui/ExportButton";
import { DataStateWrapper, KpiSkeletonContent } from "@/components/ui/DataStateWrapper";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Copy,
  Check,
  ArrowUpRight as DrillIcon,
} from "lucide-react";
import { forwardRef, useState, useRef } from "react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface KpiCardProps {
  title: DynamicString;
  /** Pass `null` or `undefined` to trigger null-state display.
   *  Pass a string for non-numeric KPIs (times, labels, statuses) — displayed as-is. */
  value: number | string | null | undefined;
  format?: FormatOption;
  /** Single comparison or array of comparisons */
  comparison?: ComparisonConfig | ComparisonConfig[];
  goal?: GoalConfig;
  conditions?: Condition[];
  /** @deprecated Use `sparkline` config instead */
  sparklineData?: number[];
  /** @deprecated Use `sparkline` config instead */
  sparklinePreviousPeriod?: number[];
  /** @deprecated Use `sparkline` config instead */
  sparklineType?: SparklineType;
  /** @deprecated Use `sparkline` config instead */
  sparklineInteractive?: boolean;
  /** Sparkline configuration — alternative to individual sparkline* props */
  sparkline?: {
    data: number[];
    previousPeriod?: number[];
    type?: SparklineType;
    interactive?: boolean;
  };
  icon?: React.ReactNode;
  description?: DynamicReactNode;
  subtitle?: DynamicString;
  footnote?: DynamicString;
  comparisonLabel?: DynamicString;
  tooltip?: TooltipConfig;
  onClick?: () => void;
  href?: string;
  drillDown?: DrillDownConfig;
  copyable?: boolean;
  animate?: boolean | AnimationConfig;
  /** Attention ring. `true` uses accent color, or pass a CSS color. */
  highlight?: boolean | string;
  /** X-axis value this KPI represents — when linked hover matches, card highlights. */
  linkedIndex?: string | number;
  /** Cross-filter field this KPI represents — dims when a non-matching selection is active. */
  crossFilterField?: string;
  /** Cross-filter value this KPI represents — matches against active selection. */
  crossFilterValue?: string | number;
  /** Custom trend icons for comparison badges */
  trendIcon?: TrendIconConfig;
  /** What to show when value is null/undefined/NaN/Infinity. Default: "dash" */
  nullDisplay?: NullDisplay;
  /** Where the title appears. Default: "top" */
  titlePosition?: TitlePosition;
  /** Horizontal alignment for card content. Default: "left" */
  titleAlign?: TitleAlign;
  /** Enable export. `true` enables image/CSV/clipboard. Pass `{ data }` to override CSV data. Inherits from MetricProvider. */
  exportable?: ExportableConfig;
  loading?: boolean;
  empty?: EmptyState;
  error?: ErrorState;
  stale?: StaleState;
  /** Data state configuration — alternative to individual loading/empty/error/stale props */
  state?: {
    loading?: boolean;
    empty?: EmptyState;
    error?: ErrorState;
    stale?: StaleState;
  };
  variant?: CardVariant;
  /** Compact/dense layout. Default: false */
  dense?: boolean;
  accent?: string;
  className?: string;
  /** Sub-element class name overrides */
  classNames?: {
    root?: string;
    title?: string;
    value?: string;
    comparison?: string;
    sparkline?: string;
    goal?: string;
    footnote?: string;
  };
  /** HTML id attribute */
  id?: string;
  /** Test id for testing frameworks */
  "data-testid"?: string;
  /** Callback when value is copied (requires copyable) */
  onCopy?: (value: string) => void;
  /** Bare mode — strips the card wrapper (no border, no shadow, no noise texture).
   *  Used internally by StatGroup to render KpiCards as grid cells. */
  bare?: boolean;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const conditionColorMap: Record<string, { text: string; glow: string }> = {
  emerald: {
    text: "text-[var(--mu-color-positive)]",
    glow: "shadow-[var(--mu-color-positive)]/10",
  },
  green: {
    text: "text-[var(--mu-color-positive)]",
    glow: "shadow-[var(--mu-color-positive)]/10",
  },
  red: {
    text: "text-[var(--mu-color-negative)]",
    glow: "shadow-[var(--mu-color-negative)]/10",
  },
  amber: {
    text: "text-[var(--mu-color-warning)]",
    glow: "shadow-[var(--mu-color-warning)]/10",
  },
  yellow: {
    text: "text-[var(--mu-color-warning)]",
    glow: "shadow-[var(--mu-color-warning)]/10",
  },
  blue: {
    text: "text-[var(--mu-color-info)]",
    glow: "shadow-[var(--mu-color-info)]/10",
  },
  indigo: {
    text: "text-[var(--mu-color-indigo)]",
    glow: "shadow-[var(--mu-color-indigo)]/10",
  },
  purple: {
    text: "text-[var(--mu-color-purple)]",
    glow: "shadow-[var(--mu-color-purple)]/10",
  },
  pink: {
    text: "text-[var(--mu-color-pink)]",
    glow: "shadow-[var(--mu-color-pink)]/10",
  },
  cyan: {
    text: "text-[var(--mu-color-cyan)]",
    glow: "shadow-[var(--mu-color-cyan)]/10",
  },
};

// ---------------------------------------------------------------------------
// Null / edge value helpers
// ---------------------------------------------------------------------------

function isNullish(value: number | string | null | undefined): value is null | undefined {
  if (typeof value === "string") return false;
  return value === null || value === undefined || Number.isNaN(value) || !Number.isFinite(value);
}

function resolveNullDisplay(nullDisplay: NullDisplay = "dash"): string {
  switch (nullDisplay) {
    case "zero": return ""; // handled separately — we format 0
    case "dash": return "—";
    case "blank": return "";
    case "N/A": return "N/A";
    default: return nullDisplay; // custom string
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const KpiCardInner = forwardRef<HTMLDivElement, KpiCardProps>(function KpiCard({
  title,
  value: rawInputValue,
  format,
  comparison,
  goal,
  conditions,
  sparklineData: sparklineDataProp,
  sparklinePreviousPeriod: sparklinePreviousPeriodProp,
  sparklineType: sparklineTypeProp,
  sparklineInteractive: sparklineInteractiveProp,
  sparkline: sparklineConfig,
  icon,
  description,
  subtitle,
  footnote,
  comparisonLabel,
  tooltip,
  onClick,
  href,
  drillDown,
  exportable: exportableProp,
  copyable,
  animate,
  highlight,
  linkedIndex,
  crossFilterField,
  crossFilterValue,
  trendIcon,
  nullDisplay,
  titlePosition = "top",
  titleAlign = "left",
  loading: loadingProp,
  empty: emptyProp,
  error: errorProp,
  stale: staleProp,
  state: stateConfig,
  variant,
  dense,
  accent,
  className,
  classNames,
  id,
  "data-testid": dataTestId,
  onCopy,
  bare,
}, ref) {
  const localeDefaults = useLocale();
  const config = useMetricConfig();

  const resolvedNullDisplay = nullDisplay ?? config.nullDisplay;
  const resolvedVariant = variant ?? config.variant;
  const resolvedAnimate = animate ?? config.animate;
  const resolvedDense = dense ?? config.dense;
  const resolvedExportable = exportableProp !== undefined ? !!exportableProp : config.exportable;
  const exportData = typeof exportableProp === "object" && exportableProp.data ? exportableProp.data : undefined;
  const cardRef = useRef<HTMLDivElement>(null);

  // --- Merge config groupings with flat props (configs take precedence) ---
  const sparklineData = sparklineConfig?.data ?? sparklineDataProp;
  const sparklinePreviousPeriod = sparklineConfig?.previousPeriod ?? sparklinePreviousPeriodProp;
  const sparklineType = sparklineConfig?.type ?? sparklineTypeProp;
  const sparklineInteractive = sparklineConfig?.interactive ?? sparklineInteractiveProp;
  const loading = stateConfig?.loading ?? loadingProp ?? config.loading;
  const empty = stateConfig?.empty ?? emptyProp;
  const error = stateConfig?.error ?? errorProp;
  const stale = stateConfig?.stale ?? staleProp;

  // --- Deprecation warnings ---
  if (process.env.NODE_ENV !== "production") {
    if (sparklineDataProp !== undefined) devWarnDeprecated("KpiCard", "sparklineData", "sparkline={{ data: [...] }}");
  }

  // --- String value passthrough ---
  const valueIsString = typeof rawInputValue === "string";

  // --- Null / edge value handling ---
  const valueIsNull = isNullish(rawInputValue);
  // When null and nullDisplay is "zero", treat as 0. Otherwise use 0 as a
  // safe numeric placeholder — downstream code guards with `valueIsNull`.
  const value: number = valueIsString ? 0 : valueIsNull ? 0 : rawInputValue!;
  // Whether the value should be treated as "no data" for display purposes.
  // When nullDisplay is "zero", null values display as 0 and participate in
  // conditions/comparisons/goals. Otherwise they are inert.
  const valueIsInert = !valueIsString && valueIsNull && resolvedNullDisplay !== "zero";

  // --- Animation ---
  const animConfig: AnimationConfig | undefined =
    resolvedAnimate === true ? { countUp: true }
      : resolvedAnimate === false || resolvedAnimate === undefined ? undefined
      : resolvedAnimate;

  const animatedValue = useCountUp(value, {
    enabled: !valueIsString && !valueIsInert && (animConfig?.countUp ?? false),
    duration: animConfig?.duration,
    delay: animConfig?.delay,
    motionConfig: config.motionConfig,
  });
  const displayValue = !valueIsString && !valueIsInert && animConfig?.countUp ? animatedValue : value;

  // --- Linked hover highlight ---
  const linkedHover = useLinkedHover();
  const isLinkedHovered = linkedIndex != null && linkedHover?.hoveredIndex != null
    && String(linkedHover.hoveredIndex) === String(linkedIndex);

  // --- Cross-filter (signal only — emits on click, no visual changes) ---
  const crossFilter = useCrossFilter();

  // --- Formatting ---
  const formattedValue = valueIsString
    ? rawInputValue
    : valueIsInert
      ? resolveNullDisplay(resolvedNullDisplay)
      : formatValue(displayValue, format, localeDefaults);
  const rawValue = valueIsString
    ? rawInputValue
    : valueIsInert
      ? resolveNullDisplay(resolvedNullDisplay)
      : formatValueRaw(value, format, localeDefaults);

  // --- Normalize comparison to array ---
  const comparisons: ComparisonConfig[] = comparison
    ? (Array.isArray(comparison) ? comparison : [comparison])
    : [];

  // --- Compute all comparisons ---
  const compResults = !valueIsInert
    ? comparisons.map((c) =>
        computeComparison(value, c.value, {
          mode: c.mode,
          invertTrend: c.invertTrend,
          format,
          localeDefaults,
        })
      )
    : [];

  // Use the first comparison's trend for sparkline coloring
  const primaryTrend = compResults[0]?.trend ?? "neutral";

  // --- Trend icon resolver ---
  const getTrendIcon = (trend: "positive" | "negative" | "neutral") => {
    if (trendIcon) {
      if (trend === "positive" && trendIcon.up) return trendIcon.up;
      if (trend === "negative" && trendIcon.down) return trendIcon.down;
      if (trend === "neutral" && trendIcon.neutral) return trendIcon.neutral;
    }
    const DefaultIcon =
      trend === "positive" ? TrendingUp
        : trend === "negative" ? TrendingDown
        : Minus;
    return <DefaultIcon className="h-3 w-3" />;
  };

  // --- Conditional color ---
  const conditionColor = !valueIsInert ? evaluateConditions(value, conditions) : null;
  const conditionIsCustom = conditionColor ? isCustomColor(conditionColor) : false;
  const conditionStyles = conditionColor && !conditionIsCustom ? conditionColorMap[conditionColor] : null;
  const valueColorClass = valueIsInert
    ? "text-[var(--muted)]"
    : conditionIsCustom
      ? ""
      : (conditionStyles?.text ?? "text-[var(--foreground)]");

  // --- Goal ---
  const goalProgress = goal && !valueIsInert ? computeGoalProgress(value, goal) : null;

  // --- Build context ---
  const ctx = buildMetricContext({
    value,
    formattedValue: formatValue(value, format, localeDefaults),
    rawValue,
    comparison: compResults[0] ?? null,
    goalProgress,
    goalConfig: goal ?? null,
    conditionColor,
  });

  const resolvedTitle = resolveString(title, ctx) ?? "";
  const resolvedSubtitle = resolveString(subtitle, ctx);
  const resolvedFootnote = resolveString(footnote, ctx);
  const resolvedDescription = resolveReactNode(description, ctx);
  const resolvedComparisonLabel = resolveString(
    comparisonLabel ?? comparisons[0]?.label,
    ctx
  );

  const { copied, copy } = useCopyToClipboard();
  const [hovered, setHovered] = useState(false);

  // --- Data state early returns (must be AFTER all hooks) ---
  if (loading) return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      id={id}
      data-testid={dataTestId}
      data-metric-card=""
      data-variant={bare ? undefined : resolvedVariant}
      data-dense={resolvedDense ? "true" : undefined}
      className={cn(
        bare
          ? cn("mu-container group relative", "px-[var(--mu-padding-x-bare)] py-[var(--mu-padding-y-bare)] sm:px-[var(--mu-padding-x-bare-sm)]")
          : cn(
              "noise-texture group relative border transition-all duration-300",
              CARD_CLASSES,
              "p-[var(--mu-padding)]",
            ),
        className,
        classNames?.root,
      )}
    >
      <KpiSkeletonContent />
    </div>
  );
  if (error) return <DataStateWrapper error={error}><div /></DataStateWrapper>;
  if (empty) return <DataStateWrapper empty={empty}><div /></DataStateWrapper>;

  const isClickable = !!(onClick || href || drillDown);
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href } : {};

  const hasSparkline = sparklineData && sparklineData.length > 0;

  // --- Trend badge colors ---
  const trendColors = {
    positive: "text-[var(--mu-color-positive)]",
    negative: "text-[var(--mu-color-negative)]",
    neutral: "text-[var(--muted)]",
  };

  // --- Sparkline tooltip formatter ---
  const sparklineTooltipFormatter = (v: number) => formatValue(v, format, localeDefaults);

  const showTitle = titlePosition !== "hidden";
  const alignClass =
    titleAlign === "center" ? "justify-center text-center"
      : titleAlign === "right" ? "justify-end text-right"
      : "";
  const textAlignClass =
    titleAlign === "center" ? "text-center"
      : titleAlign === "right" ? "text-right"
      : "";

  // --- Title block (reused in top / bottom) ---
  const titleBlock = showTitle && (
    <>
      <div className={cn("flex items-center gap-1.5", alignClass)}>
        {icon && (
          <span className="text-[var(--muted)]">
            {icon}
          </span>
        )}
        <span className={cn(
          "font-medium tracking-wide uppercase text-[var(--muted)]",
          "text-[length:var(--mu-title-size)]",
          classNames?.title,
        )}>
          {resolvedTitle}
        </span>
        {resolvedDescription && (
          <DescriptionPopover content={resolvedDescription} />
        )}
      </div>
      {resolvedSubtitle && (
        <p className={cn("mu-subtitle mt-0.5 text-[11px] text-[var(--muted)] opacity-70", textAlignClass)}>
          {resolvedSubtitle}
        </p>
      )}
    </>
  );

  return (
    <Wrapper
      {...wrapperProps}
      ref={!href ? ((el: unknown) => {
        (cardRef as React.MutableRefObject<HTMLElement | null>).current = el as HTMLElement | null;
        if (typeof ref === "function") ref(el as never);
        else if (ref) (ref as React.MutableRefObject<never>).current = el as never;
      }) as never : undefined}
      id={id}
      data-testid={dataTestId}
      data-metric-card=""
      onClick={onClick ?? (drillDown ? drillDown.onClick : undefined)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-variant={bare ? undefined : resolvedVariant}
      data-dense={resolvedDense ? "true" : undefined}
      className={cn(
        "h-full",
        bare
          ? cn("mu-container group relative", "px-[var(--mu-padding-x-bare)] py-[var(--mu-padding-y-bare)] sm:px-[var(--mu-padding-x-bare-sm)]")
          : cn(
              "noise-texture group relative border transition-all duration-300",
              CARD_CLASSES,
              "p-[var(--mu-padding)]",
              isClickable && "cursor-pointer",
              HOVER_CLASSES,
              conditionStyles?.glow && `shadow-lg ${conditionStyles.glow}`,
            ),
        className,
        classNames?.root,
      )}
      style={bare ? undefined : {
        ...(accent ? { borderColor: accent } : {}),
        ...(highlight && typeof highlight !== "string" ? {
          boxShadow: "0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent)",
          outline: "2px solid color-mix(in srgb, var(--accent) 30%, transparent)",
          outlineOffset: "2px",
        } : {}),
        ...(typeof highlight === "string" ? {
          boxShadow: `0 0 0 2px ${withOpacity(highlight, 0.3)}`,
          outline: `2px solid ${withOpacity(highlight, 0.3)}`,
          outlineOffset: "2px",
        } : {}),
        ...(conditionIsCustom && conditionColor ? {
          boxShadow: `0 10px 15px -3px ${withOpacity(conditionColor, 0.1)}`,
        } : {}),
        ...(isLinkedHovered ? {
          boxShadow: "0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent)",
          outline: "2px solid color-mix(in srgb, var(--accent) 30%, transparent)",
          outlineOffset: "2px",
        } : {}),
      } as React.CSSProperties}
    >
      {/* Export button */}
      {resolvedExportable && (
        <div className="absolute right-2 top-2 z-10">
          <ExportButton
            title={typeof title === "string" ? title : "KPI"}
            targetRef={cardRef}
            data={exportData ?? [{ [typeof title === "string" ? title : "Metric"]: formattedValue }]}
            copyValue={formattedValue}
            dense={resolvedDense}
          />
        </div>
      )}
      {/* Stale indicator */}
      {stale && (
        <div className="absolute right-3 top-3">
          <DataStateWrapper stale={stale}><div /></DataStateWrapper>
        </div>
      )}

      {/* ── Title (top) ── */}
      {titlePosition === "top" && titleBlock}

      {/* ── Value + Sparkline row ── */}
      <div className={cn(
        "flex items-end gap-4",
        titleAlign === "center" ? "justify-center" : titleAlign === "right" ? "justify-end" : "justify-between",
        showTitle && titlePosition === "top" ? "mt-3" : "",
      )}>
        <div className={cn("min-w-0", textAlignClass)}>
          {/* Value */}
          <div className={cn("flex items-baseline gap-1.5", alignClass)}>
            <span
              className={cn(
                "font-[family-name:var(--font-mono)] font-semibold leading-none tracking-tight transition-colors",
                bare ? "text-[length:var(--mu-value-size-bare)]" : "text-[length:var(--mu-value-size)]",
                valueColorClass,
                classNames?.value,
              )}
              style={conditionIsCustom && conditionColor ? { color: conditionColor } : undefined}
              title={
                tooltip?.content && typeof tooltip.content === "string"
                  ? tooltip.content
                  : rawValue
              }
            >
              {formattedValue}
            </span>

            {copyable && !valueIsInert && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copy(rawValue);
                  onCopy?.(rawValue);
                }}
                className="mu-hover-action -m-2.5 flex-shrink-0 p-2.5 text-[var(--muted)] opacity-0 transition-opacity group-hover:opacity-60 hover:!opacity-100 focus:opacity-100"
                aria-label="Copy value"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            )}
          </div>

          {/* Comparisons */}
          {compResults.length > 0 && (
            <div className={cn("mt-2 flex flex-col gap-1", titleAlign === "center" && "items-center", titleAlign === "right" && "items-end")}>
              {compResults.map((comp, idx) => {
                const trend = comp.trend;
                const label = idx === 0 ? resolvedComparisonLabel : comparisons[idx]?.label;
                return (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 text-xs font-semibold",
                        trendColors[trend]
                      )}
                    >
                      {getTrendIcon(trend)}
                      {comp.label}
                    </span>
                    {label && (
                      <span className="text-[11px] text-[var(--muted)]">
                        {label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sparkline — right side (only in left-align mode) */}
        {titleAlign === "left" && hasSparkline && (
          <div className="mu-sparkline-slot h-10 w-20 flex-shrink-0 opacity-40 transition-opacity duration-300 group-hover:opacity-80">
            {(
              <div className="relative h-full w-full">
                {sparklinePreviousPeriod && sparklinePreviousPeriod.length > 0 && (
                  <div className="absolute inset-0 opacity-25">
                    <Sparkline
                      data={sparklinePreviousPeriod}
                      trend="neutral"
                      type={sparklineType}
                    />
                  </div>
                )}
                <div className={cn(
                  "h-full w-full",
                  sparklinePreviousPeriod && "absolute inset-0"
                )}>
                  <Sparkline
                    data={sparklineData!}
                    trend={primaryTrend}
                    type={sparklineType}
                    interactive={sparklineInteractive}
                    formatTooltip={sparklineTooltipFormatter}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Sparkline below value (center/right align) ── */}
      {hasSparkline && titleAlign !== "left" && (
        <div className={cn(
          "mu-sparkline-slot mt-3 h-8 w-24 opacity-40 transition-opacity duration-300 group-hover:opacity-80",
          titleAlign === "center" ? "mx-auto" : "ml-auto"
        )}>
          <div className="relative h-full w-full">
            {sparklinePreviousPeriod && sparklinePreviousPeriod.length > 0 && (
              <div className="absolute inset-0 opacity-25">
                <Sparkline data={sparklinePreviousPeriod} trend="neutral" type={sparklineType} />
              </div>
            )}
            <div className={cn("h-full w-full", sparklinePreviousPeriod && "absolute inset-0")}>
              <Sparkline
                data={sparklineData!}
                trend={primaryTrend}
                type={sparklineType}
                interactive={sparklineInteractive}
                formatTooltip={sparklineTooltipFormatter}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Title (bottom) ── */}
      {titlePosition === "bottom" && (
        <div className="mt-3">
          {titleBlock}
        </div>
      )}

      {/* ── Goal progress ── */}
      {goalProgress && goal && (goal.showProgress !== false) && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[var(--muted)]">
              {goal.label ?? "Target"}
              {goal.showTarget && (
                <span className="ml-1 font-[family-name:var(--font-mono)]">
                  ({formatValue(goal.value, format, localeDefaults)})
                </span>
              )}
            </span>
            <span
              className={cn(
                "font-[family-name:var(--font-mono)] font-semibold",
                !goalProgress.isComplete && "text-[var(--foreground)] opacity-70"
              )}
              style={goalProgress.isComplete
                ? { color: goal.completeColor && isCustomColor(goal.completeColor) ? goal.completeColor : undefined }
                : undefined
              }
            >
              {goal.showRemaining && !goalProgress.isComplete
                ? `${formatValue(goalProgress.remaining, format, localeDefaults)} left`
                : `${Math.round(goalProgress.progress)}%`
              }
            </span>
          </div>
          <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-[var(--card-border)]">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                !goal.color && !goalProgress.isComplete && "bg-[var(--accent)]",
                !goal.completeColor && goalProgress.isComplete && "bg-emerald-500"
              )}
              style={{
                width: `${Math.min(goalProgress.progress, 100)}%`,
                ...(goalProgress.isComplete && goal.completeColor
                  ? { backgroundColor: isCustomColor(goal.completeColor) ? goal.completeColor : undefined }
                  : goal.color
                    ? { backgroundColor: isCustomColor(goal.color) ? goal.color : undefined }
                    : {}
                ),
              }}
            />
          </div>
        </div>
      )}

      {/* ── Footnote ── */}
      {resolvedFootnote && (
        <p className={cn("mu-footnote mt-3 text-[10px] leading-snug text-[var(--muted)] opacity-75", textAlignClass)}>
          {resolvedFootnote}
        </p>
      )}

      {/* Drill-down indicator — subtle corner icon on hover */}
      {drillDown && (
        <span className="absolute bottom-2 right-2 text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-60" aria-hidden>
          <DrillIcon className="h-3 w-3" />
        </span>
      )}
    </Wrapper>
  );
});

// Grid layout hint for MetricGrid auto-layout
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const KpiCard = withErrorBoundary(KpiCardInner, "KpiCard");
(KpiCard as any).__gridHint = "kpi";
