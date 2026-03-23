"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import type { PieCustomLayerProps, PieLayer } from "@nivo/pie";
import { cn } from "@/lib/utils";
import {
  formatValue,
  computeComparison,
  type FormatOption,
} from "@/lib/format";
import type {
  ComparisonConfig,
  AnimationConfig,
  CardVariant,
  EmptyState,
  ErrorState,
  StaleState,
  NullDisplay,
} from "@/lib/types";
import { useTheme, useLocale, useMetricConfig } from "@/lib/MetricProvider";
import { useDenseValues } from "@/lib/useDenseValues";
import { useCountUp } from "@/lib/useCountUp";
import { assertPeer } from "@/lib/peerCheck";
import { useChartTheme } from "@/lib/useChartTheme";
import { useContainerSize } from "@/lib/useContainerSize";
import { ChartContainer } from "./ChartContainer";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GaugeThreshold {
  value: number;
  color: string;
}

export interface GaugeProps {
  value: number | null | undefined;
  min?: number;
  max?: number;
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  format?: FormatOption;
  comparison?: ComparisonConfig | ComparisonConfig[];
  comparisonLabel?: string;
  thresholds?: GaugeThreshold[];
  target?: number;
  targetLabel?: string;
  arcAngle?: 180 | 270;
  color?: string;
  showMinMax?: boolean;
  showValue?: boolean;
  icon?: React.ReactNode;
  /** Height in px. Default: 300 */
  height?: number;

  // Standard MetricUI props
  variant?: CardVariant;
  dense?: boolean;
  animate?: boolean | AnimationConfig;
  nullDisplay?: NullDisplay;
  loading?: boolean;
  empty?: EmptyState;
  error?: ErrorState;
  stale?: StaleState;
  className?: string;
  classNames?: { root?: string; header?: string; chart?: string };
  id?: string;
  "data-testid"?: string;
}

// ---------------------------------------------------------------------------
// Named color map
// ---------------------------------------------------------------------------

const namedColorMap: Record<string, string> = {
  emerald: "#10B981", green: "#10B981",
  red: "#EF4444",
  amber: "#F59E0B", yellow: "#F59E0B",
  blue: "#3B82F6",
  indigo: "#6366F1",
  purple: "#8B5CF6",
  pink: "#EC4899",
  cyan: "#06B6D4",
};

function resolveColor(c: string): string {
  return namedColorMap[c] ?? c;
}

// ---------------------------------------------------------------------------
// Null helpers
// ---------------------------------------------------------------------------

function isNullish(v: number | null | undefined): boolean {
  return v === null || v === undefined || Number.isNaN(v) || !Number.isFinite(v);
}

function resolveNullText(nd: NullDisplay = "dash"): string {
  switch (nd) {
    case "zero": return "";
    case "dash": return "\u2014";
    case "blank": return "";
    case "N/A": return "N/A";
    default: return nd;
  }
}

// ---------------------------------------------------------------------------
// Trend colors — identical to KpiCard
// ---------------------------------------------------------------------------

const trendColors = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-red-500 dark:text-red-400",
  neutral: "text-[var(--muted)]",
};

// ---------------------------------------------------------------------------
// Gauge datum
// ---------------------------------------------------------------------------

interface GaugeDatum {
  id: string;
  label: string;
  value: number;
}

// ---------------------------------------------------------------------------
// Center layer (same pattern as DonutChart's createCenterLayer)
// ---------------------------------------------------------------------------

function createCenterLayer(
  formattedValue: string,
  gaugeSubtitle?: string,
  isNull?: boolean,
  showMinMax?: boolean,
  formattedMin?: string,
  formattedMax?: string,
  arcAngle?: 180 | 270,
) {
  return function CenterLayer({
    centerX,
    centerY,
    innerRadius,
    radius,
  }: PieCustomLayerProps<GaugeDatum>) {
    const valueFontSize = Math.min(Math.max(innerRadius * 0.42, 16), 42);
    const labelFontSize = Math.min(Math.max(innerRadius * 0.16, 9), 13);
    const minMaxFontSize = Math.min(Math.max(radius * 0.08, 8), 11);

    // Position min/max at the arc endpoints
    const angle = arcAngle === 180 ? 90 : 135;
    const startRad = (-angle * Math.PI) / 180;
    const endRad = (angle * Math.PI) / 180;
    const labelRadius = radius + minMaxFontSize * 0.8;

    return (
      <g>
        <text
          x={centerX}
          y={gaugeSubtitle ? centerY - labelFontSize * 0.5 : centerY}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: `${valueFontSize}px`,
            fontWeight: 700,
            fill: isNull ? "var(--muted)" : "var(--foreground)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "-0.02em",
          }}
        >
          {formattedValue}
        </text>
        {gaugeSubtitle && (
          <text
            x={centerX}
            y={centerY + valueFontSize * 0.55}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontSize: `${labelFontSize}px`,
              fontWeight: 500,
              fill: "var(--muted)",
              letterSpacing: "0.02em",
            }}
          >
            {gaugeSubtitle}
          </text>
        )}
        {/* Min/Max labels at arc endpoints — scaled with gauge size */}
        {showMinMax && minMaxFontSize >= 9 && (
          <>
            <text
              x={centerX + Math.cos(startRad) * labelRadius}
              y={centerY + Math.sin(startRad) * labelRadius}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontSize: `${minMaxFontSize}px`,
                fontWeight: 500,
                fill: "var(--muted)",
                fontFamily: "var(--font-mono)",
                opacity: 0.5,
              }}
            >
              {formattedMin}
            </text>
            <text
              x={centerX + Math.cos(endRad) * labelRadius}
              y={centerY + Math.sin(endRad) * labelRadius}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontSize: `${minMaxFontSize}px`,
                fontWeight: 500,
                fill: "var(--muted)",
                fontFamily: "var(--font-mono)",
                opacity: 0.5,
              }}
            >
              {formattedMax}
            </text>
          </>
        )}
      </g>
    );
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const GaugeInner = forwardRef<HTMLDivElement, GaugeProps>(function Gauge({
  value: rawValue,
  min = 0,
  max = 100,
  title,
  subtitle,
  description,
  footnote,
  format,
  comparison,
  comparisonLabel,
  thresholds,
  target,
  targetLabel,
  arcAngle = 270,
  color,
  showMinMax = false,
  showValue = true,
  icon,
  height,
  variant,
  dense,
  animate,
  nullDisplay,
  loading,
  empty,
  error,
  stale,
  className,
  classNames,
  id,
  "data-testid": dataTestId,
}, ref) {
  assertPeer(ResponsivePie, "@nivo/pie", "Gauge");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const localeDefaults = useLocale();
  const config = useMetricConfig();
  const { ref: containerRef, width: containerWidth } = useContainerSize();
  const nivoTheme = useChartTheme(containerWidth);

  // --- Config resolution ---
  const resolvedNullDisplay = nullDisplay ?? config.nullDisplay;
  const resolvedAnimate = animate ?? config.animate;
  const resolvedVariant = variant ?? config.variant;
  const denseValues = useDenseValues();
  const resolvedDense = dense ?? config.dense;
  const resolvedHeight = height ?? denseValues.chartHeight;

  const animConfig: AnimationConfig | undefined =
    resolvedAnimate === true ? { countUp: true }
      : resolvedAnimate === false || resolvedAnimate === undefined ? undefined
      : resolvedAnimate;

  // --- Null handling ---
  const valueIsNull = isNullish(rawValue);
  const value = valueIsNull ? 0 : rawValue!;

  // --- Animation ---
  const animatedValue = useCountUp(value, {
    enabled: !valueIsNull && (animConfig?.countUp ?? false),
    duration: animConfig?.duration,
    delay: animConfig?.delay,
    motionConfig: config.motionConfig,
  });
  const displayValue = !valueIsNull && animConfig?.countUp ? animatedValue : value;

  // --- Formatting ---
  const formattedValue = valueIsNull && resolvedNullDisplay !== "zero"
    ? resolveNullText(resolvedNullDisplay)
    : formatValue(displayValue, format, localeDefaults);
  const formattedMin = formatValue(min, format, localeDefaults);
  const formattedMax = formatValue(max, format, localeDefaults);

  // --- Threshold color auto-pick ---
  const resolvedColor = useMemo(() => {
    if (color) return resolveColor(color);
    if (thresholds && thresholds.length > 0 && !valueIsNull) {
      const sorted = [...thresholds].sort((a, b) => a.value - b.value);
      let picked = sorted[0].color;
      for (const t of sorted) {
        if (value >= t.value) picked = t.color;
      }
      return resolveColor(picked);
    }
    return "#6366F1";
  }, [color, thresholds, value, valueIsNull]);

  // --- Nivo data ---
  const percentage = valueIsNull ? 0 : Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  const nivoData = useMemo((): GaugeDatum[] => {
    const filled = Math.max(0.5, percentage * 100);
    const remaining = Math.max(0.5, 100 - filled);
    return [
      { id: "value", label: "Value", value: filled },
      { id: "track", label: "Track", value: remaining },
    ];
  }, [percentage]);

  // --- Colors ---
  const colorFn = useCallback(
    (datum: { id: string | number }) => {
      if (datum.id === "value") return resolvedColor;
      return isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    },
    [resolvedColor, isDark],
  );

  // --- Arc angles ---
  const startAngle = arcAngle === 180 ? -90 : -135;
  const endAngle = arcAngle === 180 ? 90 : 135;

  // --- Margin ---
  const denseScale = resolvedDense ? 0.5 : 1;
  const margin = useMemo(() => {
    const m = Math.round((containerWidth < 300 ? 8 : 16) * denseScale);
    return { top: m, right: m + (showMinMax ? 12 : 0), bottom: m, left: m + (showMinMax ? 12 : 0) };
  }, [containerWidth, denseScale, showMinMax]);

  // --- Center layer ---
  const layers = useMemo((): PieLayer<GaugeDatum>[] => {
    const l: PieLayer<GaugeDatum>[] = ["arcs"];
    if (showValue || showMinMax) {
      l.push(createCenterLayer(
        formattedValue, subtitle, valueIsNull,
        showMinMax, formattedMin, formattedMax, arcAngle,
      ) as PieLayer<GaugeDatum>);
    }
    return l;
  }, [showValue, showMinMax, formattedValue, subtitle, valueIsNull, formattedMin, formattedMax, arcAngle]);

  // --- Comparisons ---
  const comparisons: ComparisonConfig[] = comparison
    ? (Array.isArray(comparison) ? comparison : [comparison])
    : [];

  const compResults = !valueIsNull
    ? comparisons.map((c) =>
        computeComparison(value, c.value, {
          mode: c.mode,
          invertTrend: c.invertTrend,
          format,
          localeDefaults,
        })
      )
    : [];

  const resolvedComparisonLabel = comparisonLabel ?? comparisons[0]?.label;

  const getTrendIcon = (trend: "positive" | "negative" | "neutral") => {
    const Icon = trend === "positive" ? TrendingUp : trend === "negative" ? TrendingDown : Minus;
    return <Icon className="h-3 w-3" />;
  };

  return (
    <div ref={ref} id={id} data-testid={dataTestId} style={{ minWidth: 120, height: "100%" }}>
    <div ref={containerRef} style={{ height: "100%" }}>
      <ChartContainer componentName="Gauge"
        title={title}
        subtitle={undefined}
        description={description}
        footnote={footnote}
        height={resolvedHeight}
        variant={resolvedVariant}

        className={classNames?.root ?? className}
        classNames={classNames ? { header: classNames.header, body: classNames.chart } : undefined}
        loading={loading}
        empty={empty}
        error={error}
        stale={stale}
        below={<>
          {/* Comparison badges */}
          {compResults.length > 0 && (
            <div className="mt-2 flex flex-col items-center gap-1">
              {compResults.map((comp, idx) => {
                const trend = comp.trend;
                const label = idx === 0 ? resolvedComparisonLabel : comparisons[idx]?.label;
                return (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-semibold",
                      trendColors[trend]
                    )}>
                      {getTrendIcon(trend)}
                      {comp.label}
                    </span>
                    {label && (
                      <span className="text-[11px] text-[var(--muted)]">{label}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>}
      >
        <div style={{ height: resolvedHeight }} role="meter" aria-valuenow={valueIsNull ? undefined : value} aria-valuemin={min} aria-valuemax={max}>
          <ResponsivePie
            data={nivoData}
            theme={nivoTheme}
            colors={colorFn}
            margin={margin}
            innerRadius={0.72}
            padAngle={0}
            cornerRadius={6}
            startAngle={startAngle}
            endAngle={endAngle}
            sortByValue={false}
            activeOuterRadiusOffset={0}
            borderWidth={0}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            isInteractive={false}
            animate={!!resolvedAnimate}
            motionConfig={resolvedAnimate ? config.motionConfig : undefined}
            layers={layers}
          />
        </div>
      </ChartContainer>
    </div>
    </div>
  );
});

// Grid layout hint for MetricGrid auto-layout
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const Gauge = withErrorBoundary(GaugeInner, "Gauge");
(Gauge as any).__gridHint = "gauge";
