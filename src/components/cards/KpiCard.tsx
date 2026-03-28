"use client";

import { cn, withOpacity } from "@/lib/utils";
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
  DrillDownEvent,
  ComparisonConfig,
  TooltipConfig,
  ExportableConfig,
  AnimationConfig,
  CardVariant,
  EmptyState,
  ErrorState,
  StaleState,
  TrendIconConfig,
  DataComponentProps,
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
import { useComponentConfig } from "@/lib/useComponentConfig";
import { useCountUp } from "@/lib/useCountUp";

import { useCopyToClipboard } from "@/lib/useCopyToClipboard";
import { Sparkline } from "@/components/charts/Sparkline";
import { DescriptionPopover } from "@/components/ui/DescriptionPopover";
import { CardShell } from "@/components/ui/CardShell";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Copy,
  Check,
} from "lucide-react";
import { forwardRef, useState, useCallback } from "react";
import { useComponentInteraction } from "@/lib/useComponentInteraction";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface KpiCardProps extends DataComponentProps {
  title: DynamicString;
  /** Pass `null` or `undefined` to trigger null-state display.
   *  Pass a string for non-numeric KPIs (times, labels, statuses) — displayed as-is. */
  value: number | string | null | undefined;
  format?: FormatOption;
  /** Single comparison or array of comparisons */
  comparison?: ComparisonConfig | ComparisonConfig[];
  goal?: GoalConfig;
  conditions?: Condition[];
  /** Sparkline configuration */
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
  /** Drill-down on card click.
   *  - `true`: auto-generates detail panel
   *  - `(context) => ReactNode`: custom drill content */
  drillDown?: true | ((event: DrillDownEvent) => React.ReactNode);
  copyable?: boolean;
  animate?: boolean | AnimationConfig;
  /** Attention ring. `true` uses accent color, or pass a CSS color. */
  highlight?: boolean | string;
  /** X-axis value this KPI represents — when linked hover matches, card highlights. */
  linkedIndex?: string | number;
  /** Cross-filter config — same shape as all other components. `value` is the specific value this card represents for dimming. */
  crossFilter?: boolean | { field?: string; value?: string | number };
  /** Custom trend icons for comparison badges */
  trendIcon?: TrendIconConfig;
  /** What to show when value is null/undefined/NaN/Infinity. Default: "dash" */
  nullDisplay?: NullDisplay;
  /** Where the title appears. Default: "top" */
  titlePosition?: TitlePosition;
  /** Horizontal alignment for card content. Default: "left" */
  titleAlign?: TitleAlign;
  /** Data state configuration — alternative to individual loading/empty/error/stale props */
  state?: {
    loading?: boolean;
    empty?: EmptyState;
    error?: ErrorState;
    stale?: StaleState;
  };
  accent?: string;
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
  crossFilter: crossFilterProp,
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
  aiContext,
  onCopy,
  bare,
}, ref) {
  const cc = useComponentConfig({ animate: typeof animate === "boolean" ? animate : undefined, variant, dense });

  const resolvedNullDisplay = nullDisplay ?? cc.config.nullDisplay;
  const resolvedVariant = cc.resolvedVariant;
  const resolvedAnimate = cc.resolvedAnimate;
  const resolvedDense = cc.resolvedDense;
  const exportData = typeof exportableProp === "object" && exportableProp.data ? exportableProp.data : undefined;

  const sparklineData = sparklineConfig?.data;
  const sparklinePreviousPeriod = sparklineConfig?.previousPeriod;
  const sparklineType = sparklineConfig?.type;
  const sparklineInteractive = sparklineConfig?.interactive;
  const loading = stateConfig?.loading ?? loadingProp ?? cc.config.loading;
  const empty = stateConfig?.empty ?? emptyProp;
  const error = stateConfig?.error ?? errorProp;
  const stale = stateConfig?.stale ?? staleProp;

  // --- Resolve crossFilter value for dimming ---
  const crossFilterValue = typeof crossFilterProp === "object" ? crossFilterProp.value : undefined;

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
    motionConfig: cc.config.motionConfig,
  });
  const displayValue = !valueIsString && !valueIsInert && animConfig?.countUp ? animatedValue : value;

  // --- Interaction (shared with all components) ---
  const interaction = useComponentInteraction({
    drillDown,
    crossFilter: crossFilterProp,
    defaultField: typeof title === "string" ? title.toLowerCase().replace(/\s+/g, "_") : "kpi",
    tooltipHint: undefined,
    data: exportData,
    crossFilterValue,
  });

  // --- Linked hover highlight ---
  const isLinkedHovered = linkedIndex != null && interaction.linkedHover?.hoveredIndex != null
    && String(interaction.linkedHover.hoveredIndex) === String(linkedIndex);

  // --- Formatting ---
  const formattedValue = valueIsString
    ? rawInputValue
    : valueIsInert
      ? resolveNullDisplay(resolvedNullDisplay)
      : formatValue(displayValue, format, cc.localeDefaults);
  const rawValue = valueIsString
    ? rawInputValue
    : valueIsInert
      ? resolveNullDisplay(resolvedNullDisplay)
      : formatValueRaw(value, format, cc.localeDefaults);

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
          localeDefaults: cc.localeDefaults,
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
    formattedValue: formatValue(value, format, cc.localeDefaults),
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

  // --- Derived values for render ---
  const hasSparkline = sparklineData && sparklineData.length > 0;

  const trendColors = {
    positive: "text-[var(--mu-color-positive)]",
    negative: "text-[var(--mu-color-negative)]",
    neutral: "text-[var(--muted)]",
  };

  const sparklineTooltipFormatter = (v: number) => formatValue(v, format, cc.localeDefaults);

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
        <p className={cn("mu-subtitle mt-0.5 text-[length:var(--mu-text-xs)] text-[var(--muted)] opacity-70", textAlignClass)}>
          {resolvedSubtitle}
        </p>
      )}
    </>
  );

  // --- Click handler (via shared interaction hook) ---
  const titleStr = typeof title === "string" ? title : "Detail";

  const handleComponentClick = useCallback(() => {
    interaction.handleClick({
      title: `${titleStr}: ${formattedValue}`,
      value: rawInputValue ?? 0,
      formattedValue,
    });
  }, [interaction, titleStr, formattedValue, rawInputValue]);

  return (
    <CardShell
      ref={ref as React.Ref<HTMLElement>}
      id={id}
      data-testid={dataTestId}
      componentName="KpiCard"
      aiTitle={typeof title === "string" ? title : undefined}
      aiContext={aiContext}
      onClick={onClick ?? (interaction.isInteractive ? handleComponentClick : undefined)}
      href={href}
      clickable={!!(onClick || href || interaction.isInteractive)}
      variant={resolvedVariant}
      dense={resolvedDense}
      bare={bare}
      accent={accent}
      highlight={highlight}
      skeletonType="kpi"
      loading={loading}
      empty={empty}
      error={error}
      stale={stale}
      exportable={exportableProp}
      exportData={exportData ?? [{ [typeof title === "string" ? title : "Metric"]: rawInputValue ?? formattedValue }]}
      copyValue={formattedValue}
      className={cn(
        conditionStyles?.glow && `shadow-lg ${conditionStyles.glow}`,
        className,
      )}
      classNames={classNames ? {
        root: classNames.root,
        footnote: cn("mu-footnote", textAlignClass, classNames.footnote),
      } : {
        footnote: cn("mu-footnote", textAlignClass),
      }}
      style={{
        ...(conditionIsCustom && conditionColor ? { boxShadow: `0 10px 15px -3px ${withOpacity(conditionColor, 0.1)}` } : {}),
        ...(isLinkedHovered ? { boxShadow: "0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent)", outline: "2px solid color-mix(in srgb, var(--accent) 30%, transparent)", outlineOffset: "2px" } : {}),
        ...(interaction.isCrossFilterDimmed ? { opacity: 0.35, transition: "opacity 200ms ease" } : {}),
      }}
      footnote={resolvedFootnote ?? undefined}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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
                        <span className="text-[length:var(--mu-text-xs)] text-[var(--muted)]">
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
            <div className="mu-sparkline-slot h-10 w-20 flex-shrink-0 opacity-40 transition-opacity duration-[var(--mu-transition-duration)] group-hover:opacity-80">
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
            "mu-sparkline-slot mt-3 h-8 w-24 opacity-40 transition-opacity duration-[var(--mu-transition-duration)] group-hover:opacity-80",
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
            <div className="flex items-center justify-between text-[length:var(--mu-text-xs)]">
              <span className="text-[var(--muted)]">
                {goal.label ?? "Target"}
                {goal.showTarget && (
                  <span className="ml-1 font-[family-name:var(--font-mono)]">
                    ({formatValue(goal.value, format, cc.localeDefaults)})
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
                  ? `${formatValue(goalProgress.remaining, format, cc.localeDefaults)} left`
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
      </div>
    </CardShell>
  );
});

// Grid layout hint for MetricGrid auto-layout
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const KpiCard = withErrorBoundary(KpiCardInner, "KpiCard");
(KpiCard as any).__gridHint = "kpi";
