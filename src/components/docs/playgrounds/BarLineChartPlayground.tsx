"use client";

import { useState, useMemo } from "react";
import { BarLineChart } from "@/components/charts/BarLineChart";
import {
  Toggle,
  TextInput,
  NumberInput,
  Select,
  ControlSection,
  CodePreview,
} from "@/components/docs/PlaygroundControls";

// ---------------------------------------------------------------------------
// Sample datasets
// ---------------------------------------------------------------------------

const revenueBarData = [
  { month: "Jan", revenue: 42000, costs: 28000 },
  { month: "Feb", revenue: 45200, costs: 30100 },
  { month: "Mar", revenue: 48100, costs: 29800 },
  { month: "Apr", revenue: 51800, costs: 31200 },
  { month: "May", revenue: 49200, costs: 32400 },
  { month: "Jun", revenue: 55400, costs: 33100 },
  { month: "Jul", revenue: 58900, costs: 34800 },
  { month: "Aug", revenue: 62100, costs: 35200 },
  { month: "Sep", revenue: 59800, costs: 33900 },
  { month: "Oct", revenue: 65200, costs: 36100 },
  { month: "Nov", revenue: 71000, costs: 38400 },
  { month: "Dec", revenue: 78400, costs: 40200 },
];

const growthLineData = [
  {
    id: "Growth Rate",
    data: [
      { x: "Jan", y: 8.2 },
      { x: "Feb", y: 7.6 },
      { x: "Mar", y: 6.4 },
      { x: "Apr", y: 7.7 },
      { x: "May", y: -5.0 },
      { x: "Jun", y: 12.6 },
      { x: "Jul", y: 6.3 },
      { x: "Aug", y: 5.4 },
      { x: "Sep", y: -3.7 },
      { x: "Oct", y: 9.0 },
      { x: "Nov", y: 8.9 },
      { x: "Dec", y: 10.4 },
    ],
  },
];

const marginLineData = [
  {
    id: "Profit Margin",
    data: [
      { x: "Jan", y: 33.3 },
      { x: "Feb", y: 33.4 },
      { x: "Mar", y: 38.0 },
      { x: "Apr", y: 39.8 },
      { x: "May", y: 34.1 },
      { x: "Jun", y: 40.3 },
      { x: "Jul", y: 40.9 },
      { x: "Aug", y: 43.3 },
      { x: "Sep", y: 43.3 },
      { x: "Oct", y: 44.6 },
      { x: "Nov", y: 45.9 },
      { x: "Dec", y: 48.7 },
    ],
  },
];

const datasets = {
  revenueGrowth: {
    barData: revenueBarData,
    barKeys: ["revenue"],
    lineData: growthLineData,
    indexBy: "month",
  },
  revenueCostsMargin: {
    barData: revenueBarData,
    barKeys: ["revenue", "costs"],
    lineData: marginLineData,
    indexBy: "month",
  },
};

export function BarLineChartPlayground() {
  const [datasetKey, setDatasetKey] = useState("revenueGrowth");
  const [title, setTitle] = useState("Revenue & Growth");
  const [subtitle, setSubtitle] = useState("Monthly revenue with growth rate overlay");

  const [formatStyle, setFormatStyle] = useState("currency");
  const [lineFormatStyle, setLineFormatStyle] = useState("percent");
  const [height, setHeight] = useState(350);
  const [groupMode, setGroupMode] = useState("stacked");
  const [barPadding, setBarPadding] = useState(0.3);
  const [borderRadius, setBorderRadius] = useState(4);

  const [lw, setLw] = useState(2);
  const [showPoints, setShowPoints] = useState(true);
  const [pointSize, setPointSize] = useState(5);
  const [curveSel, setCurveSel] = useState("monotoneX");
  const [showArea, setShowArea] = useState(false);

  const [showLegend, setShowLegend] = useState(true);
  const [xAxisLabel, setXAxisLabel] = useState("");
  const [yAxisLabel, setYAxisLabel] = useState("");
  const [rightAxisLabel, setRightAxisLabel] = useState("");
  const [variant, setVariant] = useState("default");

  const ds = datasets[datasetKey as keyof typeof datasets] ?? datasets.revenueGrowth;

  const format = useMemo(
    () => ({ style: formatStyle as "currency" | "number" | "percent", compact: true as const }),
    [formatStyle]
  );
  const lineFormat = useMemo(
    () => ({ style: lineFormatStyle as "currency" | "number" | "percent", compact: false as const, precision: 1 }),
    [lineFormatStyle]
  );

  const legendProp = showLegend ? { position: "bottom" as const, toggleable: true } : false;

  const codeLines = [
    `<BarLineChart`,
    `  barData={[{ month: "Jan", revenue: 42000 }, ...]}`,
    `  barKeys={${JSON.stringify(ds.barKeys)}}`,
    `  index="${ds.indexBy}"`,
    `  lineData={[{ id: "Growth Rate", data: [{ x: "Jan", y: 8.2 }, ...] }]}`,
    `  title="${title}"`,
  ];
  if (subtitle) codeLines.push(`  subtitle="${subtitle}"`);
  codeLines.push(`  format={{ style: "${formatStyle}", compact: true }}`);
  codeLines.push(`  lineFormat={{ style: "${lineFormatStyle}", precision: 1 }}`);
  if (height !== 300) codeLines.push(`  height={${height}}`);
  if (groupMode !== "stacked") codeLines.push(`  groupMode="${groupMode}"`);
  if (showArea) codeLines.push(`  enableArea`);
  if (!showPoints) codeLines.push(`  enablePoints={false}`);
  if (rightAxisLabel) codeLines.push(`  rightAxisLabel="${rightAxisLabel}"`);
  if (variant !== "default") codeLines.push(`  variant="${variant}"`);
  codeLines.push(`/>`);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left: Preview + Code */}
      <div className="flex flex-1 flex-col lg:overflow-y-auto">
        <div className="flex-1 px-8 py-8">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Live Preview
          </p>
          <div className="mx-auto max-w-3xl">
            <BarLineChart
              barData={ds.barData}
              barKeys={ds.barKeys}
              index={ds.indexBy}
              lineData={ds.lineData}
              title={title}
              subtitle={subtitle || undefined}
              format={format}
              lineFormat={lineFormat}
              height={height}
              groupMode={groupMode as "stacked" | "grouped"}
              padding={barPadding}
              borderRadius={borderRadius}
              lineWidth={lw}
              enablePoints={showPoints}
              pointSize={pointSize}
              curve={curveSel as "monotoneX" | "linear" | "natural" | "step"}
              enableArea={showArea}
              xAxisLabel={xAxisLabel || undefined}
              yAxisLabel={yAxisLabel || undefined}
              rightAxisLabel={rightAxisLabel || undefined}
              legend={legendProp}
              variant={variant as "default" | "outlined" | "ghost" | "elevated"}
            />
          </div>

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

        <ControlSection title="Data">
          <Select
            label="Dataset"
            value={datasetKey}
            onChange={setDatasetKey}
            options={[
              { label: "Revenue + Growth Rate", value: "revenueGrowth" },
              { label: "Revenue & Costs + Profit Margin", value: "revenueCostsMargin" },
            ]}
          />
        </ControlSection>

        <ControlSection title="Core">
          <TextInput label="title" value={title} onChange={setTitle} />
          <TextInput label="subtitle" value={subtitle} onChange={setSubtitle} />
        </ControlSection>

        <ControlSection title="Bar Format">
          <Select
            label="format.style"
            value={formatStyle}
            onChange={setFormatStyle}
            options={[
              { label: "currency", value: "currency" },
              { label: "number", value: "number" },
            ]}
          />
          <Select
            label="groupMode"
            value={groupMode}
            onChange={setGroupMode}
            options={[
              { label: "stacked", value: "stacked" },
              { label: "grouped", value: "grouped" },
            ]}
          />
          <NumberInput label="padding" value={barPadding} onChange={setBarPadding} min={0} max={0.9} step={0.05} />
          <NumberInput label="borderRadius" value={borderRadius} onChange={setBorderRadius} min={0} max={20} />
          <NumberInput label="height" value={height} onChange={setHeight} min={200} max={600} step={50} />
        </ControlSection>

        <ControlSection title="Line Format">
          <Select
            label="lineFormat.style"
            value={lineFormatStyle}
            onChange={setLineFormatStyle}
            options={[
              { label: "percent", value: "percent" },
              { label: "number", value: "number" },
              { label: "currency", value: "currency" },
            ]}
          />
          <NumberInput label="lineWidth" value={lw} onChange={setLw} min={1} max={6} step={0.5} />
          <Select
            label="curve"
            value={curveSel}
            onChange={setCurveSel}
            options={[
              { label: "monotoneX", value: "monotoneX" },
              { label: "linear", value: "linear" },
              { label: "natural", value: "natural" },
              { label: "step", value: "step" },
            ]}
          />
          <Toggle label="enablePoints" value={showPoints} onChange={setShowPoints} />
          {showPoints && (
            <NumberInput label="pointSize" value={pointSize} onChange={setPointSize} min={2} max={12} />
          )}
          <Toggle label="enableArea" value={showArea} onChange={setShowArea} description="Fill area under lines" />
        </ControlSection>

        <ControlSection title="Legend" defaultOpen={false}>
          <Toggle label="Show legend" value={showLegend} onChange={setShowLegend} />
        </ControlSection>

        <ControlSection title="Axes" defaultOpen={false}>
          <TextInput label="xAxisLabel" value={xAxisLabel} onChange={setXAxisLabel} />
          <TextInput label="yAxisLabel" value={yAxisLabel} onChange={setYAxisLabel} placeholder="Left axis (bars)" />
          <TextInput label="rightAxisLabel" value={rightAxisLabel} onChange={setRightAxisLabel} placeholder="Right axis (lines)" />
        </ControlSection>

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
