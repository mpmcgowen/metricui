"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ResponsiveChoropleth } from "@nivo/geo";
import { ChartContainer } from "./ChartContainer";
import { ChartTooltip } from "./ChartTooltip";
import { useTheme, useLocale, useMetricConfig } from "@/lib/MetricProvider";
import { useChartInteraction } from "@/lib/useChartInteraction";
import { useDenseValues } from "@/lib/useDenseValues";
import { formatValue, type FormatOption } from "@/lib/format";
import { useChartTheme } from "@/lib/useChartTheme";
import { useContainerSize } from "@/lib/useContainerSize";
import { assertPeer } from "@/lib/peerCheck";
import type { LegendConfig } from "@/lib/chartTypes";
import type { DataRow, DataComponentProps, EmptyState, ErrorState, StaleState, CardVariant } from "@/lib/types";

export type { LegendConfig };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChoroplethDatum {
  /** ISO 3166-1 alpha-3 country code (e.g. "USA", "GBR"). */
  id: string;
  /** Numeric value for this region. */
  value: number;
}

export interface ChoroplethProps extends DataComponentProps {
  /**
   * Region data. Accepts either:
   * - ChoroplethDatum[]: `{ id, value }` (native Nivo format)
   * - DataRow[]: flat rows with `idField` and `valueField` columns
   */
  data?: ChoroplethDatum[] | DataRow[];
  /** Column name for region ISO code (flat format). Default: "id" */
  idField?: string;
  /** Column name for region value (flat format). Default: "value" */
  valueField?: string;
  /**
   * GeoJSON FeatureCollection for the map geometry.
   * **Required** — the dev provides their own GeoJSON (e.g. world-110m features).
   * Each feature must have `feature.id` matching the data `id`.
   */
  features: Array<{ type: string; id?: string; properties?: Record<string, unknown>; geometry: Record<string, unknown> }>;
  title?: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  footnote?: string;
  action?: React.ReactNode;
  /** Format for value labels and tooltips. */
  format?: FormatOption;
  /** Height in px. Default: 400 */
  height?: number;
  /** Color scheme for the sequential scale. Provide an array of color stops. */
  colors?: string[];
  /** Enable/disable animation. Default: true */
  animate?: boolean;
  /** Map projection type. Default: "mercator" */
  projectionType?: "mercator" | "naturalEarth1" | "equalEarth" | "orthographic";
  /** Projection scale. Default: 100 */
  projectionScale?: number;
  /** Projection translation [x, y]. Default: [0.5, 0.5] */
  projectionTranslation?: [number, number];
  /** Border width on features. Default: 0.5 */
  borderWidth?: number;
  /** Border color. Default: theme-aware */
  borderColor?: string;
  /** Domain for the color scale [min, max]. Auto-computed if omitted. */
  domain?: [number, number];
  /** Color scale type. "log" and "sqrt" compress skewed distributions (e.g. population). Default: "linear" */
  scaleType?: "linear" | "log" | "sqrt";
  /** Legend configuration. */
  legend?: boolean | LegendConfig;
  /** Enable cross-filtering. `true` uses id as field, or pass `{ field }`. */
  crossFilter?: boolean | { field?: string };
  /** Drill-down. `true` = auto table, function = custom content. */
  drillDown?: true | ((event: { id: string; value: number; label: string }) => React.ReactNode);
  /** Drill-down mode. Default: "slide-over". */
  drillDownMode?: "slide-over" | "modal";
  /** Label shown in the tooltip for the value (e.g. "Population", "Revenue"). Defaults to valueField name. */
  tooltipLabel?: string;
  /** Tooltip action hint. */
  tooltipHint?: boolean | string;
  /** Sub-element class name overrides. */
  classNames?: { root?: string; header?: string; chart?: string; body?: string };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isChoroplethData(data: unknown): data is ChoroplethDatum[] {
  if (!Array.isArray(data) || data.length === 0) return false;
  const first = data[0];
  return typeof first === "object" && first !== null && "id" in first && "value" in first && Object.keys(first).length <= 3;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ChoroplethInner = forwardRef<HTMLDivElement, ChoroplethProps>(function Choropleth(props, ref) {
  const {
    data: rawData = [],
    idField = "id",
    valueField = "value",
    features,
    title,
    subtitle,
    description,
    footnote,
    action,
    format,
    height,
    colors: chartColors,
    animate: animateProp,
    projectionType = "mercator",
    projectionScale = 100,
    projectionTranslation = [0.5, 0.5],
    borderWidth = 0.5,
    borderColor: borderColorProp,
    domain: domainProp,
    scaleType = "linear",
    legend: legendProp,
    crossFilter: crossFilterProp,
    drillDown,
    drillDownMode,
    tooltipLabel: tooltipLabelProp,
    tooltipHint,
    dense,
    variant,
    className,
    loading,
    empty,
    error,
    stale,
    classNames,
    id,
    "data-testid": dataTestId,
    aiContext,
  } = props;

  assertPeer(ResponsiveChoropleth, "@nivo/geo", "Choropleth");

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const localeDefaults = useLocale();
  const config = useMetricConfig();
  const resolvedAnimate = animateProp ?? config.animate;
  const resolvedVariant = variant ?? config.variant;
  const denseValues = useDenseValues();
  const resolvedHeight = height ?? Math.max(denseValues.chartHeight, 400);

  const { ref: containerRef, width: containerWidth } = useContainerSize();
  const nivoTheme = useChartTheme(containerWidth);

  // --- Resolve data ---
  const choroplethData = useMemo<ChoroplethDatum[]>(() => {
    if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) return [];
    if (isChoroplethData(rawData)) return rawData;
    // Flat DataRow format
    return (rawData as DataRow[]).map((row) => ({
      id: String(row[idField]),
      value: Number(row[valueField]) || 0,
    }));
  }, [rawData, idField, valueField]);

  // --- Scale transform for non-linear color mapping ---
  const transformValue = useCallback(
    (v: number): number => {
      if (scaleType === "log") return v > 0 ? Math.log10(v) : 0;
      if (scaleType === "sqrt") return v >= 0 ? Math.sqrt(v) : 0;
      return v;
    },
    [scaleType],
  );

  // Original values lookup for tooltips (keyed by id)
  const originalValues = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of choroplethData) map.set(d.id, d.value);
    return map;
  }, [choroplethData]);

  // Transformed data for Nivo color mapping
  const nivoData = useMemo<ChoroplethDatum[]>(
    () =>
      scaleType === "linear"
        ? choroplethData
        : choroplethData.map((d) => ({ id: d.id, value: transformValue(d.value) })),
    [choroplethData, scaleType, transformValue],
  );

  // --- Auto-compute domain (from transformed values) ---
  const domain = useMemo<[number, number]>(() => {
    if (domainProp && scaleType === "linear") return domainProp;
    if (nivoData.length === 0) return [0, 100];
    const values = nivoData.map((d) => d.value);
    return [Math.min(...values), Math.max(...values)];
  }, [domainProp, nivoData, scaleType]);

  // --- Colors ---
  const resolvedColors = chartColors ?? (isDark
    ? ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#e94560"]
    : ["#f7fbff", "#c6dbef", "#6baed6", "#2171b5", "#08306b"]);

  const borderColor = borderColorProp ?? (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)");

  // --- Feature name lookup (GeoJSON properties.name → human-readable labels) ---
  const featureNameMap = useMemo(() => {
    const map = new Map<string, string>();
    if (features) {
      for (const f of features) {
        const id = String((f as any).id ?? "");
        const name = (f as any).properties?.name;
        if (id && name) map.set(id, name);
      }
    }
    return map;
  }, [features]);

  // --- Export data ---
  const exportData = useMemo<DataRow[]>(
    () => choroplethData.map((d) => ({ [idField]: d.id, [valueField]: d.value })),
    [choroplethData, idField, valueField],
  );

  const interaction = useChartInteraction({
    drillDown,
    drillDownMode,
    crossFilter: crossFilterProp,
    defaultField: idField,
    tooltipHint,
    data: exportData,
  });

  // --- Format callback ---
  const formatFn = useCallback(
    (value: number) => formatValue(value, format, localeDefaults),
    [format, localeDefaults],
  );

  // --- Click handler ---
  const handleFeatureClick = useCallback(
    (feature: { id: string; value?: number; label?: string }) => {
      const featureId = String(feature.id);
      const regionName = featureNameMap.get(featureId) ?? feature.label ?? featureId;
      interaction.handleClick({ title: regionName, value: featureId, field: idField });
    },
    [interaction, idField, featureNameMap],
  );

  // --- Nivo legend ---
  const nivoLegends = useMemo(() => {
    if (legendProp === false) return [];
    return [
      {
        anchor: "bottom-left" as const,
        direction: "column" as const,
        translateX: 20,
        translateY: -40,
        itemWidth: 94,
        itemHeight: 18,
        itemsSpacing: 4,
        symbolSize: 8,
        itemDirection: "left-to-right" as const,
        itemTextColor: "var(--muted)",
        itemOpacity: 0.85,
      },
    ];
  }, [legendProp]);

  return (
    <div
      ref={ref}
      id={id}
      data-testid={dataTestId}
      style={{ minWidth: 120, height: "100%" }}
    >
      <div ref={containerRef} style={{ height: "100%" }}>
        <ChartContainer
          componentName="Choropleth"
          aiContext={aiContext}
          title={title}
          subtitle={subtitle}
          description={description}
          footnote={footnote}
          action={action}
          height={resolvedHeight}
          variant={resolvedVariant}
          className={classNames?.root ?? className}
          classNames={classNames ? { header: classNames.header, body: classNames.body ?? classNames.chart } : undefined}
          loading={loading}
          empty={empty}
          error={error}
          stale={stale}
          exportData={exportData}
        >
          <ResponsiveChoropleth
            data={nivoData}
            features={features}
            theme={nivoTheme}
            colors={resolvedColors}
            domain={domain}
            valueFormat={(v: number) => formatFn(v)}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            unknownColor={isDark ? "#1a1a2e" : "#f0f0f0"}
            projectionType={projectionType}
            projectionScale={projectionScale}
            projectionTranslation={projectionTranslation}
            borderWidth={borderWidth}
            borderColor={borderColor}
            legends={nivoLegends}
            tooltip={({ feature }: { feature: any }) => {
              // Emit linked hover
              if (interaction.linkedHover) {
                setTimeout(() => interaction.linkedHover!.setHoveredIndex(feature.id, interaction.linkedHoverId), 0);
              }
              // Use original value for tooltip (not the transformed one)
              const realVal = originalValues.get(String(feature.id)) ?? feature.value;
              const regionName = featureNameMap.get(String(feature.id)) ?? feature.label ?? String(feature.id);
              const metricLabel = tooltipLabelProp ?? (valueField !== "value" ? valueField : "Value");
              return (
                <ChartTooltip
                  header={regionName}
                  items={[
                    {
                      color: feature.color ?? "var(--muted)",
                      label: metricLabel,
                      value: realVal != null ? formatFn(realVal) : "\u2014",
                    },
                  ]}
                  actionHint={interaction.actionHint}
                />
              );
            }}
            onClick={(feature: any) => {
              if (interaction.isInteractive) {
                handleFeatureClick({
                  id: String(feature.id),
                  value: feature.value ?? undefined,
                  label: feature.label ?? undefined,
                });
              }
            }}
          />
        </ChartContainer>
      </div>
    </div>
  );
});

// Grid hint + error boundary
import { withErrorBoundary } from "@/components/ui/ErrorBoundary";
export const Choropleth = withErrorBoundary(ChoroplethInner, "Choropleth");
(Choropleth as any).__gridHint = "chart";
