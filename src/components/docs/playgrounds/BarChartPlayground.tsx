"use client";

import { useState, useMemo } from "react";
import { BarChart } from "@/components/charts/BarChart";
import type { ReferenceLine, ThresholdBand } from "@/components/charts/BarChart";
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

const datasets: Record<string, { data: Record<string, string | number>[]; keys: string[]; indexBy: string; layout: "vertical" | "horizontal" }> = {
  revenue: {
    data: [
      { month: "Jan", revenue: 42000 },
      { month: "Feb", revenue: 45200 },
      { month: "Mar", revenue: 48100 },
      { month: "Apr", revenue: 51800 },
      { month: "May", revenue: 49200 },
      { month: "Jun", revenue: 55400 },
      { month: "Jul", revenue: 58900 },
      { month: "Aug", revenue: 62100 },
      { month: "Sep", revenue: 59800 },
      { month: "Oct", revenue: 65200 },
      { month: "Nov", revenue: 71000 },
      { month: "Dec", revenue: 78400 },
    ],
    keys: ["revenue"],
    indexBy: "month",
    layout: "vertical",
  },
  multiKey: {
    data: [
      { channel: "Organic", visitors: 14200, conversions: 1420 },
      { channel: "Direct", visitors: 8900, conversions: 1120 },
      { channel: "Referral", visitors: 6700, conversions: 670 },
      { channel: "Social", visitors: 5400, conversions: 380 },
      { channel: "Email", visitors: 4100, conversions: 820 },
      { channel: "Paid", visitors: 3200, conversions: 640 },
    ],
    keys: ["visitors", "conversions"],
    indexBy: "channel",
    layout: "vertical",
  },
  threeKey: {
    data: [
      { quarter: "Q1", organic: 12400, paid: 8200, referral: 4100 },
      { quarter: "Q2", organic: 15800, paid: 9600, referral: 5300 },
      { quarter: "Q3", organic: 18200, paid: 11400, referral: 6800 },
      { quarter: "Q4", organic: 22100, paid: 13200, referral: 8400 },
    ],
    keys: ["organic", "paid", "referral"],
    indexBy: "quarter",
    layout: "vertical",
  },
  negative: {
    data: [
      { quarter: "Q1 2024", profit: 12000 },
      { quarter: "Q2 2024", profit: -3400 },
      { quarter: "Q3 2024", profit: 8200 },
      { quarter: "Q4 2024", profit: -7800 },
      { quarter: "Q1 2025", profit: 15600 },
      { quarter: "Q2 2025", profit: 4200 },
    ],
    keys: ["profit"],
    indexBy: "quarter",
    layout: "vertical",
  },
  horizontal: {
    data: [
      { category: "Enterprise Plan", signups: 142 },
      { category: "Professional Plan", signups: 287 },
      { category: "Starter Plan", signups: 523 },
      { category: "Free Trial", signups: 891 },
      { category: "Open Source", signups: 1240 },
    ],
    keys: ["signups"],
    indexBy: "category",
    layout: "horizontal",
  },
};

const comparisonDatasets: Record<string, Record<string, string | number>[]> = {
  revenue: [
    { month: "Jan", revenue: 36000 },
    { month: "Feb", revenue: 38200 },
    { month: "Mar", revenue: 40100 },
    { month: "Apr", revenue: 42800 },
    { month: "May", revenue: 41200 },
    { month: "Jun", revenue: 45400 },
    { month: "Jul", revenue: 48900 },
    { month: "Aug", revenue: 50100 },
    { month: "Sep", revenue: 48800 },
    { month: "Oct", revenue: 52200 },
    { month: "Nov", revenue: 56000 },
    { month: "Dec", revenue: 60400 },
  ],
  multiKey: [
    { channel: "Organic", visitors: 11200, conversions: 1120 },
    { channel: "Direct", visitors: 7400, conversions: 920 },
    { channel: "Referral", visitors: 5200, conversions: 520 },
    { channel: "Social", visitors: 4100, conversions: 290 },
    { channel: "Email", visitors: 3200, conversions: 640 },
    { channel: "Paid", visitors: 2600, conversions: 520 },
  ],
};

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export function BarChartPlayground() {
  // --- Data ---
  const [datasetKey, setDatasetKey] = useState("revenue");
  const [showComparison, setShowComparison] = useState(false);
  const handleDatasetChange = (key: string) => {
    setDatasetKey(key);
    setLayout(datasets[key]?.layout ?? "vertical");
  };

  // --- Core ---
  const [title, setTitle] = useState("Monthly Revenue");
  const [subtitle, setSubtitle] = useState("2025 fiscal year");
  const [footnote, setFootnote] = useState("");
  const [description, setDescription] = useState("");

  // --- Format ---
  const [formatStyle, setFormatStyle] = useState("currency");
  const [compact, setCompact] = useState("auto");
  const [precision, setPrecision] = useState(1);

  // --- Preset ---
  const [preset, setPreset] = useState("");
  const handlePresetChange = (val: string) => {
    setPreset(val);
    if (val === "grouped") { setGroupMode("grouped"); setLayout("vertical"); }
    else if (val === "stacked") { setGroupMode("stacked"); setLayout("vertical"); }
    else if (val === "percent") { setGroupMode("percent"); setLayout("vertical"); }
    else if (val === "horizontal") { setLayout("horizontal"); setGroupMode("stacked"); }
    else if (val === "horizontal-grouped") { setLayout("horizontal"); setGroupMode("grouped"); }
    else { setGroupMode("stacked"); setLayout("vertical"); }
  };

  // --- Appearance ---
  const [height, setHeight] = useState(300);
  const [layout, setLayout] = useState("vertical");
  const [groupMode, setGroupMode] = useState("stacked");
  const [barPadding, setBarPadding] = useState(0.3);
  const [innerPadding, setInnerPadding] = useState(4);
  const [borderRadius, setBorderRadius] = useState(4);
  const [enableLabels, setEnableLabels] = useState(false);
  const [labelPosition, setLabelPosition] = useState("auto");
  const [sort, setSort] = useState("none");

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
  const dataset = datasets[datasetKey] ?? datasets.revenue;
  const comparisonData = showComparison
    ? (comparisonDatasets[datasetKey] ?? undefined)
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
    ? [
        {
          axis: (layout === "vertical" ? "y" : "x") as "x" | "y",
          value: refLineValue,
          label: refLineLabel,
          color: refLineColor,
          style: refLineStyle as "solid" | "dashed",
        },
      ]
    : undefined;

  const thresholds: ThresholdBand[] | undefined = showThreshold
    ? [
        {
          from: thresholdFrom,
          to: thresholdTo,
          color: thresholdColor,
          label: thresholdLabel,
          opacity: thresholdOpacity,
        },
      ]
    : undefined;

  const legendProp = showLegend
    ? { position: "bottom" as const, toggleable: legendToggleable }
    : false;

  // --- Code gen ---
  const codeLines = [
    `<BarChart`,
  ];
  if (preset) codeLines.push(`  preset="${preset}"`);
  codeLines.push(
    `  data={${datasetKey === "revenue" ? '[{ month: "Jan", revenue: 42000 }, ...]' : datasetKey === "multiKey" ? '[{ channel: "Organic", visitors: 14200, conversions: 1420 }, ...]' : "..."}}`,
    `  keys={${JSON.stringify(dataset.keys)}}`,
    `  indexBy="${dataset.indexBy}"`,
    `  title="${title}"`,
  );
  if (subtitle) codeLines.push(`  subtitle="${subtitle}"`);
  const fmtParts = [`style: "${formatStyle}"`];
  if (compact !== "auto") fmtParts.push(`compact: ${compact === "false" ? "false" : `"${compact}"`}`);
  if (precision !== 1) fmtParts.push(`precision: ${precision}`);
  codeLines.push(`  format={{ ${fmtParts.join(", ")} }}`);
  if (height !== 300) codeLines.push(`  height={${height}}`);
  if (layout !== "vertical") codeLines.push(`  layout="${layout}"`);
  if (groupMode !== "stacked") codeLines.push(`  groupMode="${groupMode}"`);
  if (barPadding !== 0.3) codeLines.push(`  padding={${barPadding}}`);
  if (innerPadding !== 4) codeLines.push(`  innerPadding={${innerPadding}}`);
  if (borderRadius !== 4) codeLines.push(`  borderRadius={${borderRadius}}`);
  if (enableLabels) codeLines.push(`  enableLabels`);
  if (enableLabels && labelPosition !== "auto") codeLines.push(`  labelPosition="${labelPosition}"`);
  if (sort !== "none") codeLines.push(`  sort="${sort}"`);
  if (showComparison) codeLines.push(`  comparisonData={[...previousPeriod]}`);
  if (showRefLine) codeLines.push(`  referenceLines={[{ axis: "${layout === "vertical" ? "y" : "x"}", value: ${refLineValue}, label: "${refLineLabel}", color: "${refLineColor}", style: "${refLineStyle}" }]}`);
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
      <div className="flex flex-1 flex-col lg:overflow-y-auto">
        {/* Live Preview */}
        <div className="flex-1 px-6 py-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Live Preview
          </p>
          <div className="mx-auto max-w-3xl">
              <BarChart
                preset={preset ? preset as "default" | "grouped" | "stacked" | "percent" | "horizontal" | "horizontal-grouped" : undefined}
                data={dataset.data}
                keys={dataset.keys}
                indexBy={dataset.indexBy}
                comparisonData={comparisonData}
                title={title}
                subtitle={subtitle || undefined}
                description={description || undefined}
                footnote={footnote || undefined}
                format={format}
                height={height}
                layout={layout as "vertical" | "horizontal"}
                groupMode={groupMode as "stacked" | "grouped" | "percent"}
                padding={barPadding}
                innerPadding={groupMode === "grouped" ? innerPadding : undefined}
                borderRadius={borderRadius}
                enableLabels={enableLabels}
                labelPosition={labelPosition as "inside" | "outside" | "auto"}
                sort={sort as "none" | "asc" | "desc"}
                referenceLines={referenceLines}
                thresholds={thresholds}
                legend={legendProp}
                xAxisLabel={xAxisLabel || undefined}
                yAxisLabel={yAxisLabel || undefined}
                variant={variant as "default" | "outlined" | "ghost" | "elevated"}
                enableNegative={datasetKey === "negative"}
              />
          </div>

          {/* Code */}
          <div className="mt-6">
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

        {/* Preset */}
        <ControlSection title="Preset">
          <Select
            label="preset"
            value={preset}
            onChange={handlePresetChange}
            options={[
              { label: "(none \u2014 manual config)", value: "" },
              { label: "default", value: "default" },
              { label: "grouped", value: "grouped" },
              { label: "stacked", value: "stacked" },
              { label: "percent", value: "percent" },
              { label: "horizontal", value: "horizontal" },
              { label: "horizontal-grouped", value: "horizontal-grouped" },
            ]}
            description="Sets layout + groupMode defaults. Individual props still override."
          />
        </ControlSection>

        {/* Data */}
        <ControlSection title="Data">
          <Select
            label="Dataset"
            value={datasetKey}
            onChange={handleDatasetChange}
            options={[
              { label: "Single key (Monthly Revenue)", value: "revenue" },
              { label: "Two keys (Visitors + Conversions)", value: "multiKey" },
              { label: "Three keys (Organic, Paid, Referral)", value: "threeKey" },
              { label: "Negative values (Profit/Loss)", value: "negative" },
              { label: "Horizontal (Plan Signups)", value: "horizontal" },
            ]}
            description="Switch between sample datasets"
          />
          <Toggle
            label="Comparison overlay"
            value={showComparison}
            onChange={setShowComparison}
            description="Dashed outline showing previous period"
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
            description="Applied to value-axis labels and tooltips"
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
            label="layout"
            value={layout}
            onChange={setLayout}
            options={[
              { label: "vertical", value: "vertical" },
              { label: "horizontal", value: "horizontal" },
            ]}
            description="Bar orientation"
          />
          <Select
            label="groupMode"
            value={groupMode}
            onChange={setGroupMode}
            options={[
              { label: "stacked", value: "stacked" },
              { label: "grouped", value: "grouped" },
              { label: "percent (normalized)", value: "percent" },
            ]}
            description="How multiple keys are displayed"
          />
          <NumberInput label="padding" value={barPadding} onChange={setBarPadding} min={0} max={0.9} step={0.05} description="Gap between bar groups (0-0.9)" />
          <NumberInput label="innerPadding" value={innerPadding} onChange={setInnerPadding} min={0} max={16} step={1} description="Gap between bars in a group" />
          <NumberInput label="borderRadius" value={borderRadius} onChange={setBorderRadius} min={0} max={20} step={1} description="Corner radius on bars" />
          <Toggle label="enableLabels" value={enableLabels} onChange={setEnableLabels} description="Show formatted value labels on bars" />
          {enableLabels && (
            <Select
              label="labelPosition"
              value={labelPosition}
              onChange={setLabelPosition}
              options={[
                { label: "auto", value: "auto" },
                { label: "inside", value: "inside" },
                { label: "outside", value: "outside" },
              ]}
              description="Where labels appear relative to bars"
            />
          )}
          <Select
            label="sort"
            value={sort}
            onChange={setSort}
            options={[
              { label: "none (data order)", value: "none" },
              { label: "ascending", value: "asc" },
              { label: "descending", value: "desc" },
            ]}
            description="Sort bars by total value"
          />
        </ControlSection>

        {/* Legend */}
        <ControlSection title="Legend" defaultOpen={false}>
          <Toggle label="Show legend" value={showLegend} onChange={setShowLegend} description="Auto-shown for multi-key data" />
          {showLegend && (
            <Toggle label="Toggleable" value={legendToggleable} onChange={setLegendToggleable} description="Click legend items to show/hide keys" />
          )}
        </ControlSection>

        {/* Axes */}
        <ControlSection title="Axes" defaultOpen={false}>
          <TextInput label="xAxisLabel" value={xAxisLabel} onChange={setXAxisLabel} placeholder='e.g. "Channel"' />
          <TextInput label="yAxisLabel" value={yAxisLabel} onChange={setYAxisLabel} placeholder='e.g. "Revenue ($)"' />
        </ControlSection>

        {/* Reference Lines */}
        <ControlSection title="Reference Lines" defaultOpen={false}>
          <Toggle label="Show reference line" value={showRefLine} onChange={setShowRefLine} description="Target/benchmark line on value axis" />
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
          <Toggle label="Show threshold band" value={showThreshold} onChange={setShowThreshold} description="Colored value-axis range (e.g. danger zone)" />
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
