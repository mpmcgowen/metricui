"use client";

import {
  forwardRef,
  useCallback,
  useMemo,
  useId,
} from "react";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import type { SparklineType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTheme, useLocale, useMetricConfig } from "@/lib/MetricProvider";
import { formatValue, type FormatOption } from "@/lib/format";
import { useChartTheme } from "@/lib/useChartTheme";
import { assertPeer } from "@/lib/peerCheck";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CurveType = "monotoneX" | "linear" | "step" | "natural";

export interface SparklineReferenceLine {
  value: number;
  color?: string;
  style?: "solid" | "dashed";
  label?: string;
}

export interface SparklineBand {
  from: number;
  to: number;
  color?: string;
  opacity?: number;
}

export interface SparklineProps {
  /** Business context for AI-powered insights. */
  aiContext?: string;
  /** Data points. `null` values create gaps in the line. */
  data: (number | null)[];
  /** Trend direction for auto-coloring. */
  trend?: "positive" | "negative" | "neutral";
  /** Override color (CSS color string). Defaults to theme-aware trend color. */
  color?: string;
  /** "line" (default) or "bar". */
  type?: SparklineType;
  /** Height in px. Default: 40. When placed inside a sized container, set to undefined to fill. */
  height?: number;
  /** Width in px. Default: undefined (fills container). */
  width?: number;
  /** Curve interpolation for line type. Default: "monotoneX". */
  curve?: CurveType;
  /** Show gradient area fill under the line. Default: true. */
  fill?: boolean;
  /** Entrance animation. Default: true. */
  animate?: boolean;
  /** Show dots on first and last data points. Default: false. */
  showEndpoints?: boolean;
  /** Show dots + subtle labels on min/max values. Default: false. */
  showMinMax?: boolean;
  /** Auto-color based on trend direction (green up / red down). Default: false. */
  trendColoring?: boolean | "invert";
  /** Horizontal reference line (e.g., average or target). */
  referenceLine?: SparklineReferenceLine;
  /** Shaded band region (e.g., normal range). */
  band?: SparklineBand;
  /** Enable interactive tooltip on hover. Default: false. */
  interactive?: boolean;
  /** Format option for tooltip values. */
  format?: FormatOption;
  /** Legacy: direct tooltip formatter function (takes precedence over `format`). */
  formatTooltip?: (value: number) => string;
  /** Line stroke width in px. Default: 1.5 */
  strokeWidth?: number;
  /** Additional CSS class for the root container. */
  className?: string;
  /** Sub-element class name overrides */
  classNames?: {
    root?: string;
    svg?: string;
    tooltip?: string;
  };
  /** HTML id attribute */
  id?: string;
  /** Test id for testing frameworks */
  "data-testid"?: string;
}

// ---------------------------------------------------------------------------
// Color constants
// ---------------------------------------------------------------------------

const TREND_COLORS = {
  positive: "#10B981", // emerald-500
  negative: "#EF4444", // red-500
  neutral: "#6B7280", // gray-500
} as const;

const TREND_COLORS_INVERT = {
  positive: "#EF4444",
  negative: "#10B981",
  neutral: "#6B7280",
} as const;

const THEME_DEFAULTS = {
  light: { accent: "#6366F1" },
  dark: { accent: "#818CF8" },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SparklineInner = forwardRef<HTMLDivElement, SparklineProps>(function Sparkline({
  data = [],
  trend = "neutral",
  color,
  type = "line",
  height,
  width,
  curve = "monotoneX",
  fill = true,
  animate,
  showEndpoints = false,
  showMinMax = false,
  trendColoring,
  referenceLine,
  band,
  interactive = false,
  format,
  formatTooltip,
  strokeWidth: strokeWidthProp,
  className,
  classNames,
  id,
  "data-testid": dataTestId,
}, ref) {
  assertPeer(ResponsiveLine, "@nivo/line", "Sparkline");
  assertPeer(ResponsiveBar, "@nivo/bar", "Sparkline");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const localeDefaults = useLocale();
  const config = useMetricConfig();
  const nivoTheme = useChartTheme(); // Sparkline has no axes, no need for responsive font scaling
  const uid = useId().replace(/:/g, "");

  const resolvedAnimate = animate ?? config.animate;
  const sw = strokeWidthProp ?? 1.5;

  // Resolve color
  const resolvedColor = useMemo(() => {
    if (trendColoring) {
      const palette = trendColoring === "invert" ? TREND_COLORS_INVERT : TREND_COLORS;
      return palette[trend];
    }
    if (color) return color;
    if (trend === "positive") return THEME_DEFAULTS[theme].accent;
    if (trend === "negative") return "#F87171";
    return "#6B7280";
  }, [color, trend, trendColoring, theme]);

  // Tooltip formatter
  const formatFn = useCallback(
    (v: number): string => {
      if (formatTooltip) return formatTooltip(v);
      if (format) return formatValue(v, format, localeDefaults);
      return String(v);
    },
    [formatTooltip, format, localeDefaults],
  );

  // Container style
  const containerStyle: React.CSSProperties = {
    width: width !== undefined ? width : "100%",
    height: height !== undefined ? height : "100%",
    minHeight: 16,
  };

  // --- Bar sparkline ---
  if (type === "bar") {
    const barData = useMemo(() =>
      data.map((v, i) => ({
        index: String(i),
        value: v ?? 0,
      })),
      [data],
    );

    return (
      <div
        ref={ref}
        id={id}
        data-testid={dataTestId}
        className={cn(className, classNames?.root)}
        style={containerStyle}
      >
        <ResponsiveBar
          data={barData}
          keys={["value"]}
          indexBy="index"
          theme={{
            ...nivoTheme,
            axis: { ...nivoTheme.axis, ticks: { line: { stroke: "transparent" }, text: { fill: "transparent" } } },
          }}
          colors={[resolvedColor]}
          margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
          padding={0.15}
          borderRadius={1}
          borderWidth={0}
          enableGridX={false}
          enableGridY={false}
          enableLabel={false}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={null}
          isInteractive={interactive}
          tooltip={interactive ? ({ data: d }) => (
            <div
              style={{
                background: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
                color: isDark ? "#000" : "#fff",
                padding: "4px 8px",
                borderRadius: 4,
                fontSize: 10,
                fontFamily: "var(--font-mono)",
              }}
            >
              {formatFn(d.value as number)}
            </div>
          ) : undefined}
          animate={!!resolvedAnimate}
          motionConfig={resolvedAnimate ? config.motionConfig : undefined}
        />
      </div>
    );
  }

  // --- Line sparkline ---
  const lineData = useMemo(() => [{
    id: `spark-${uid}`,
    data: data.map((v, i) => ({ x: i, y: v })),
  }], [data, uid]);

  // Gradient defs for area fill
  const defs = fill ? [
    {
      id: `spark-gradient-${uid}`,
      type: "linearGradient" as const,
      colors: [
        { offset: 0, color: resolvedColor, opacity: 0.2 },
        { offset: 100, color: resolvedColor, opacity: 0 },
      ],
    },
  ] : [];

  const fillConfig = fill ? [
    { match: { id: `spark-${uid}` }, id: `spark-gradient-${uid}` },
  ] : [];

  return (
    <div
      ref={ref}
      id={id}
      data-testid={dataTestId}
      className={cn(className, classNames?.root)}
      style={containerStyle}
    >
      <ResponsiveLine
        data={lineData}
        theme={{
          ...nivoTheme,
          axis: { ...nivoTheme.axis, ticks: { line: { stroke: "transparent" }, text: { fill: "transparent" } } },
          grid: { line: { stroke: "transparent" } },
        }}
        colors={[resolvedColor]}
        margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
        xScale={{ type: "linear" }}
        yScale={{ type: "linear", min: "auto", max: "auto" }}
        curve={curve}
        lineWidth={sw}
        enablePoints={showEndpoints || showMinMax}
        pointSize={showEndpoints || showMinMax ? 4 : 0}
        pointColor={resolvedColor}
        pointBorderWidth={0}
        enableArea={fill}
        areaOpacity={1}
        enableGridX={false}
        enableGridY={false}
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        axisLeft={null}
        enableSlices={interactive ? "x" : false}
        sliceTooltip={interactive ? ({ slice }) => {
          const point = slice.points[0];
          if (!point) return null;
          const val = point.data.y as number;
          return (
            <div
              style={{
                background: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
                color: isDark ? "#000" : "#fff",
                padding: "4px 8px",
                borderRadius: 4,
                fontSize: 10,
                fontFamily: "var(--font-mono)",
              }}
            >
              {formatFn(val)}
            </div>
          );
        } : undefined}
        crosshairType="bottom-left"
        animate={!!resolvedAnimate}
        motionConfig={resolvedAnimate ? config.motionConfig : undefined}
        defs={defs}
        fill={fillConfig}
        legends={[]}
      />
    </div>
  );
});

import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const Sparkline = withErrorBoundary(SparklineInner, "Sparkline");
(Sparkline as any).__gridHint = "kpi"; // eslint-disable-line @typescript-eslint/no-explicit-any
