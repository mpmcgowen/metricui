"use client";

import { useState, useMemo } from "react";
import { LineChart } from "@/components/charts/LineChart";
import type { ReferenceLine, ThresholdBand } from "@/components/charts/AreaChart";
import {
  Toggle,
  TextInput,
  NumberInput,
  Select,
  ColorInput,
  ControlSection,
  CodePreview,
} from "@/components/docs/PlaygroundControls";

// ---------------------------------------------------------------------------
// Sample datasets
// ---------------------------------------------------------------------------

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const datasets: Record<string, { id: string; data: { x: string; y: number }[] }[]> = {
  revenue: [
    {
      id: "Revenue",
      data: monthLabels.map((m, i) => ({
        x: m,
        y: [42000, 45000, 48000, 51000, 49000, 55000, 58000, 62000, 59000, 65000, 71000, 78000][i],
      })),
    },
  ],
  multiSeries: [
    {
      id: "Revenue",
      data: monthLabels.map((m, i) => ({
        x: m,
        y: [42000, 45000, 48000, 51000, 49000, 55000, 58000, 62000, 59000, 65000, 71000, 78000][i],
      })),
    },
    {
      id: "Expenses",
      data: monthLabels.map((m, i) => ({
        x: m,
        y: [38000, 40000, 41000, 39000, 42000, 44000, 43000, 46000, 45000, 48000, 47000, 50000][i],
      })),
    },
  ],
  threeSeries: [
    {
      id: "Organic",
      data: monthLabels.map((m, i) => ({
        x: m,
        y: [1200, 1400, 1800, 2200, 2800, 3200, 3600, 4100, 3900, 4500, 5200, 5800][i],
      })),
    },
    {
      id: "Paid",
      data: monthLabels.map((m, i) => ({
        x: m,
        y: [800, 900, 1100, 1400, 1200, 1600, 1800, 2000, 1900, 2200, 2400, 2600][i],
      })),
    },
    {
      id: "Referral",
      data: monthLabels.map((m, i) => ({
        x: m,
        y: [400, 500, 600, 700, 650, 800, 900, 1000, 950, 1100, 1200, 1300][i],
      })),
    },
  ],
  users: [
    {
      id: "Users",
      data: monthLabels.map((m, i) => ({
        x: m,
        y: [820, 930, 1040, 1190, 1350, 1420, 1580, 1720, 1890, 2050, 2310, 2540][i],
      })),
    },
  ],
};

const comparisonDatasets: Record<string, { id: string; data: { x: string; y: number }[] }[]> = {
  revenue: [
    {
      id: "Revenue",
      data: monthLabels.map((m, i) => ({
        x: m,
        y: [36000, 38000, 40000, 42000, 41000, 45000, 48000, 50000, 48000, 52000, 56000, 60000][i],
      })),
    },
  ],
  multiSeries: [
    {
      id: "Revenue",
      data: monthLabels.map((m, i) => ({
        x: m,
        y: [36000, 38000, 40000, 42000, 41000, 45000, 48000, 50000, 48000, 52000, 56000, 60000][i],
      })),
    },
    {
      id: "Expenses",
      data: monthLabels.map((m, i) => ({
        x: m,
        y: [35000, 36000, 37000, 36000, 38000, 39000, 38000, 40000, 39000, 41000, 40000, 42000][i],
      })),
    },
  ],
};

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export function LineChartPlayground() {
  // --- Data ---
  const [datasetKey, setDatasetKey] = useState("revenue");
  const [showComparison, setShowComparison] = useState(false);

  // --- Core ---
  const [title, setTitle] = useState("User Growth");
  const [subtitle, setSubtitle] = useState("Monthly active users");
  const [footnote, setFootnote] = useState("");
  const [description, setDescription] = useState("");

  // --- Format ---
  const [formatStyle, setFormatStyle] = useState("currency");
  const [compact, setCompact] = useState("auto");
  const [precision, setPrecision] = useState(1);

  // --- Chart options ---
  const [height, setHeight] = useState(300);
  const [curve, setCurve] = useState("monotoneX");
  const [enablePoints, setEnablePoints] = useState(false);
  const [enableGridX, setEnableGridX] = useState(false);
  const [enableGridY, setEnableGridY] = useState(true);

  // --- Line config ---
  const [lineWidth, setLineWidth] = useState(2);
  const [lineStyle, setLineStyle] = useState("solid");

  // --- Point config ---
  const [pointSize, setPointSize] = useState(0);
  const [pointColor, setPointColor] = useState("");
  const [pointBorderWidth, setPointBorderWidth] = useState(2);
  const [pointBorderColor, setPointBorderColor] = useState("");

  // --- Legend ---
  const [showLegend, setShowLegend] = useState(true);
  const [legendToggleable, setLegendToggleable] = useState(true);

  // --- Axes ---
  const [xAxisLabel, setXAxisLabel] = useState("");
  const [yAxisLabel, setYAxisLabel] = useState("");

  // --- Reference lines ---
  const [showRefLine, setShowRefLine] = useState(false);
  const [refLineValue, setRefLineValue] = useState(60000);
  const [refLineLabel, setRefLineLabel] = useState("Target");
  const [refLineColor, setRefLineColor] = useState("#EF4444");
  const [refLineStyle, setRefLineStyle] = useState("dashed");

  // --- Threshold bands ---
  const [showThreshold, setShowThreshold] = useState(false);
  const [thresholdFrom, setThresholdFrom] = useState(40000);
  const [thresholdTo, setThresholdTo] = useState(55000);
  const [thresholdColor, setThresholdColor] = useState("#F59E0B");
  const [thresholdLabel, setThresholdLabel] = useState("Warning zone");
  const [thresholdOpacity, setThresholdOpacity] = useState(0.08);

  // --- Variant ---
  const [variant, setVariant] = useState("default");

  // --- Derived ---
  const data = datasets[datasetKey] ?? datasets.revenue;
  const comparisonData = showComparison
    ? (comparisonDatasets[datasetKey] ?? comparisonDatasets.revenue)
    : undefined;

  const compactValue = compact === "false" ? false : compact === "auto" ? true : compact;
  const format = useMemo(
    () => ({
      style: formatStyle as "currency" | "number" | "percent",
      compact: compactValue as boolean | "auto" | "thousands" | "millions" | "billions" | "trillions",
      precision,
    }),
    [formatStyle, compactValue, precision]
  );

  const referenceLines: ReferenceLine[] | undefined = showRefLine
    ? [{ axis: "y" as const, value: refLineValue, label: refLineLabel, color: refLineColor, style: refLineStyle as "solid" | "dashed" }]
    : undefined;

  const thresholds: ThresholdBand[] | undefined = showThreshold
    ? [{ from: thresholdFrom, to: thresholdTo, color: thresholdColor, label: thresholdLabel, opacity: thresholdOpacity }]
    : undefined;

  const legendProp = showLegend ? { position: "bottom" as const, toggleable: legendToggleable } : false;

  // --- Code gen ---
  const codeLines = [
    `<LineChart`,
    `  data={${datasetKey === "revenue" ? "[{ id: \"Revenue\", data: [...] }]" : datasetKey === "multiSeries" ? "[{ id: \"Revenue\", ... }, { id: \"Expenses\", ... }]" : "[{ id: \"Organic\", ... }, ...]"}}`,
    `  title="${title}"`,
  ];
  if (subtitle) codeLines.push(`  subtitle="${subtitle}"`);
  const fmtParts = [`style: "${formatStyle}"`];
  if (compact !== "auto") fmtParts.push(`compact: ${compact === "false" ? "false" : `"${compact}"`}`);
  if (precision !== 1) fmtParts.push(`precision: ${precision}`);
  codeLines.push(`  format={{ ${fmtParts.join(", ")} }}`);
  if (height !== 300) codeLines.push(`  height={${height}}`);
  if (curve !== "monotoneX") codeLines.push(`  curve="${curve}"`);
  if (lineWidth !== 2) codeLines.push(`  lineWidth={${lineWidth}}`);
  if (lineStyle !== "solid") codeLines.push(`  lineStyle="${lineStyle}"`);
  if (!enablePoints) codeLines.push(`  enablePoints={false}`);
  if (enablePoints && pointSize !== 6) codeLines.push(`  pointSize={${pointSize}}`);
  if (enablePoints && pointColor) codeLines.push(`  pointColor="${pointColor}"`);
  if (enablePoints && pointBorderWidth !== 2) codeLines.push(`  pointBorderWidth={${pointBorderWidth}}`);
  if (enablePoints && pointBorderColor) codeLines.push(`  pointBorderColor="${pointBorderColor}"`);
  if (enableGridX) codeLines.push(`  enableGridX`);
  if (!enableGridY) codeLines.push(`  enableGridY={false}`);
  if (showComparison) codeLines.push(`  comparisonData={[{ id: "Revenue", data: [...previousPeriod] }]}`);
  if (showRefLine) codeLines.push(`  referenceLines={[{ axis: "y", value: ${refLineValue}, label: "${refLineLabel}", color: "${refLineColor}", style: "${refLineStyle}" }]}`);
  if (showThreshold) codeLines.push(`  thresholds={[{ from: ${thresholdFrom}, to: ${thresholdTo}, color: "${thresholdColor}", label: "${thresholdLabel}" }]}`);
  if (!showLegend) codeLines.push(`  legend={false}`);
  else if (!legendToggleable) codeLines.push(`  legend={{ toggleable: false }}`);
  if (xAxisLabel) codeLines.push(`  xAxisLabel="${xAxisLabel}"`);
  if (yAxisLabel) codeLines.push(`  yAxisLabel="${yAxisLabel}"`);
  if (description) codeLines.push(`  description="${description}"`);
  if (footnote) codeLines.push(`  footnote="${footnote}"`);
  if (variant !== "default") codeLines.push(`  variant="${variant}"`);
  codeLines.push(`/>`);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left: Preview + Code */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Live Preview */}
        <div className="flex-1 px-8 py-8">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Live Preview
          </p>
          <div className="mx-auto max-w-3xl">
              <LineChart
                data={data}
                comparisonData={comparisonData}
                title={title}
                subtitle={subtitle || undefined}
                description={description || undefined}
                footnote={footnote || undefined}
                format={format}
                height={height}
                curve={curve as "monotoneX" | "linear" | "step" | "natural" | "cardinal" | "catmullRom" | "basis" | "stepAfter" | "stepBefore" | "monotoneY"}
                lineWidth={lineWidth}
                lineStyle={lineStyle as "solid" | "dashed" | "dotted"}
                enablePoints={enablePoints}
                pointSize={pointSize}
                pointColor={pointColor || undefined}
                pointBorderWidth={pointBorderWidth}
                pointBorderColor={pointBorderColor || undefined}
                enableGridX={enableGridX}
                enableGridY={enableGridY}
                referenceLines={referenceLines}
                thresholds={thresholds}
                legend={legendProp}
                xAxisLabel={xAxisLabel || undefined}
                yAxisLabel={yAxisLabel || undefined}
                variant={variant as "default" | "outlined" | "ghost" | "elevated"}
              />
          </div>

          {/* Code */}
          <div className="mt-8">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Code
            </p>
            <CodePreview code={codeLines.join("\n")} />
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="w-full shrink-0 border-t border-[var(--card-border)] bg-[var(--card-bg)] lg:w-80 lg:shrink lg:overflow-y-auto lg:border-l lg:border-t-0">
        <div className="border-b border-[var(--card-border)] px-5 py-4">
          <p className="text-sm font-bold text-[var(--foreground)]">Props</p>
          <p className="mt-0.5 text-[11px] text-[var(--muted)]">
            Adjust props to see the chart update in real time
          </p>
        </div>

        {/* Data */}
        <ControlSection title="Data">
          <Select
            label="Dataset"
            value={datasetKey}
            onChange={setDatasetKey}
            options={[
              { label: "Single series (Revenue)", value: "revenue" },
              { label: "Two series (Revenue + Expenses)", value: "multiSeries" },
              { label: "Three series (Traffic channels)", value: "threeSeries" },
              { label: "Growth (Users)", value: "users" },
            ]}
            description="Switch between sample datasets"
          />
          <Toggle
            label="Comparison overlay"
            value={showComparison}
            onChange={setShowComparison}
            description="Dashed overlay showing previous period"
          />
        </ControlSection>

        {/* Core */}
        <ControlSection title="Core">
          <TextInput label="title" value={title} onChange={setTitle} />
          <TextInput label="subtitle" value={subtitle} onChange={setSubtitle} />
          <TextInput label="description" value={description} onChange={setDescription} placeholder="Shows as a ? popover" />
          <TextInput label="footnote" value={footnote} onChange={setFootnote} />
        </ControlSection>

        {/* Formatting */}
        <ControlSection title="Format">
          <Select
            label="format.style"
            value={formatStyle}
            onChange={setFormatStyle}
            options={[
              { label: "currency", value: "currency" },
              { label: "number", value: "number" },
              { label: "percent", value: "percent" },
            ]}
            description="Applied to Y-axis labels and tooltips"
          />
          <Select
            label="compact"
            value={compact}
            onChange={setCompact}
            options={[
              { label: "auto", value: "auto" },
              { label: "thousands (K)", value: "thousands" },
              { label: "millions (M)", value: "millions" },
              { label: "off", value: "false" },
            ]}
          />
          <NumberInput label="precision" value={precision} onChange={setPrecision} min={0} max={4} />
        </ControlSection>

        {/* Appearance */}
        <ControlSection title="Appearance">
          <NumberInput label="height" value={height} onChange={setHeight} min={150} max={600} step={50} />
          <Select
            label="curve"
            value={curve}
            onChange={setCurve}
            options={[
              { label: "monotoneX (smooth)", value: "monotoneX" },
              { label: "linear", value: "linear" },
              { label: "natural", value: "natural" },
              { label: "cardinal", value: "cardinal" },
              { label: "catmullRom", value: "catmullRom" },
              { label: "step", value: "step" },
              { label: "stepAfter", value: "stepAfter" },
              { label: "stepBefore", value: "stepBefore" },
              { label: "basis", value: "basis" },
            ]}
            description="Line interpolation method"
          />
          <NumberInput label="lineWidth" value={lineWidth} onChange={setLineWidth} min={1} max={6} step={0.5} description="Stroke width in px" />
          <Select
            label="lineStyle"
            value={lineStyle}
            onChange={setLineStyle}
            options={[
              { label: "solid", value: "solid" },
              { label: "dashed", value: "dashed" },
              { label: "dotted", value: "dotted" },
            ]}
            description="Stroke dash pattern"
          />
          <Toggle label="enablePoints" value={enablePoints} onChange={setEnablePoints} description="Show data point dots (ON by default for LineChart)" />
          <Toggle label="enableGridX" value={enableGridX} onChange={setEnableGridX} description="Vertical grid lines" />
          <Toggle label="enableGridY" value={enableGridY} onChange={setEnableGridY} description="Horizontal grid lines" />
        </ControlSection>

        {/* Points */}
        {enablePoints && (
          <ControlSection title="Points">
            <NumberInput label="pointSize" value={pointSize} onChange={setPointSize} min={2} max={16} step={1} description="Diameter in px" />
            <ColorInput label="pointColor" value={pointColor} onChange={setPointColor} />
            <NumberInput label="pointBorderWidth" value={pointBorderWidth} onChange={setPointBorderWidth} min={0} max={6} step={0.5} description="Border stroke width" />
            <ColorInput label="pointBorderColor" value={pointBorderColor} onChange={setPointBorderColor} />
          </ControlSection>
        )}

        {/* Legend */}
        <ControlSection title="Legend" defaultOpen={false}>
          <Toggle label="Show legend" value={showLegend} onChange={setShowLegend} description="Auto-shown for multi-series" />
          {showLegend && (
            <Toggle label="Toggleable" value={legendToggleable} onChange={setLegendToggleable} description="Click legend items to show/hide series" />
          )}
        </ControlSection>

        {/* Axes */}
        <ControlSection title="Axes" defaultOpen={false}>
          <TextInput label="xAxisLabel" value={xAxisLabel} onChange={setXAxisLabel} placeholder='e.g. "Month"' />
          <TextInput label="yAxisLabel" value={yAxisLabel} onChange={setYAxisLabel} placeholder='e.g. "Revenue ($)"' />
        </ControlSection>

        {/* Reference Lines */}
        <ControlSection title="Reference Lines" defaultOpen={false}>
          <Toggle label="Show reference line" value={showRefLine} onChange={setShowRefLine} description="Horizontal target/benchmark line" />
          {showRefLine && (
            <>
              <NumberInput label="value" value={refLineValue} onChange={setRefLineValue} step={5000} />
              <TextInput label="label" value={refLineLabel} onChange={setRefLineLabel} />
              <ColorInput label="color" value={refLineColor} onChange={setRefLineColor} />
              <Select
                label="style"
                value={refLineStyle}
                onChange={setRefLineStyle}
                options={[
                  { label: "dashed", value: "dashed" },
                  { label: "solid", value: "solid" },
                ]}
              />
            </>
          )}
        </ControlSection>

        {/* Threshold Bands */}
        <ControlSection title="Threshold Bands" defaultOpen={false}>
          <Toggle label="Show threshold band" value={showThreshold} onChange={setShowThreshold} description="Colored Y-axis range (e.g. danger zone)" />
          {showThreshold && (
            <>
              <NumberInput label="from" value={thresholdFrom} onChange={setThresholdFrom} step={5000} description="Lower bound" />
              <NumberInput label="to" value={thresholdTo} onChange={setThresholdTo} step={5000} description="Upper bound" />
              <TextInput label="label" value={thresholdLabel} onChange={setThresholdLabel} />
              <ColorInput label="color" value={thresholdColor} onChange={setThresholdColor} />
              <NumberInput label="opacity" value={thresholdOpacity} onChange={setThresholdOpacity} min={0.02} max={0.5} step={0.02} />
            </>
          )}
        </ControlSection>

        {/* Theming */}
        <ControlSection title="Theming" defaultOpen={false}>
          <Select
            label="variant"
            value={variant}
            onChange={setVariant}
            options={[
              { label: "default", value: "default" },
              { label: "outlined", value: "outlined" },
              { label: "ghost", value: "ghost" },
              { label: "elevated", value: "elevated" },
            ]}
          />
        </ControlSection>
      </div>
    </div>
  );
}
