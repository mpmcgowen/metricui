"use client";

import { useState } from "react";
import { Waterfall } from "@/components/charts/Waterfall";
import type { WaterfallItem } from "@/components/charts/Waterfall";
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

const datasets: Record<string, { label: string; data: WaterfallItem[] }> = {
  pl: {
    label: "P&L Bridge",
    data: [
      { label: "Revenue", value: 500000 },
      { label: "COGS", value: -200000 },
      { label: "Gross Profit", type: "subtotal" },
      { label: "OpEx", value: -100000 },
      { label: "Marketing", value: -50000 },
      { label: "Net Income", type: "total" },
    ],
  },
  quarterly: {
    label: "Quarterly Changes",
    data: [
      { label: "Q1", value: 120000 },
      { label: "Q2", value: 45000 },
      { label: "Q3", value: -30000 },
      { label: "Q4", value: 65000 },
      { label: "FY Total", type: "total" },
    ],
  },
  budget: {
    label: "Budget Variance",
    data: [
      { label: "Budget", value: 400000 },
      { label: "Revenue Beat", value: 35000 },
      { label: "Cost Savings", value: 18000 },
      { label: "Overruns", value: -42000 },
      { label: "FX Impact", value: -8000 },
      { label: "Actual", type: "total" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export function WaterfallPlayground() {
  // --- Core ---
  const [datasetKey, setDatasetKey] = useState("pl");
  const [title, setTitle] = useState("P&L Bridge");
  const [subtitle, setSubtitle] = useState("FY 2026 summary");
  const [format, setFormat] = useState("currency");
  const [height, setHeight] = useState(320);

  // --- Appearance ---
  const [connectors, setConnectors] = useState(true);
  const [enableLabels, setEnableLabels] = useState(true);
  const [borderRadius, setBorderRadius] = useState(3);
  const [padding, setPadding] = useState(0.35);
  const [enableGridY, setEnableGridY] = useState(true);
  const [animate, setAnimate] = useState(true);

  // --- Colors ---
  const [positiveColor, setPositiveColor] = useState("");
  const [negativeColor, setNegativeColor] = useState("");
  const [totalColor, setTotalColor] = useState("");

  // --- Data States ---
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  // --- Theming ---
  const [variant, setVariant] = useState("default");

  const dataset = datasets[datasetKey];
  const data = empty ? [] : dataset.data;

  // --- Code gen ---
  const codeLines = [`<Waterfall`];
  codeLines.push(`  data={[`);
  dataset.data.forEach((d) => {
    const parts = [`label: "${d.label}"`];
    if (d.value !== undefined) parts.push(`value: ${d.value}`);
    if (d.type) parts.push(`type: "${d.type}"`);
    codeLines.push(`    { ${parts.join(", ")} },`);
  });
  codeLines.push(`  ]}`);
  if (title) codeLines.push(`  title="${title}"`);
  if (subtitle) codeLines.push(`  subtitle="${subtitle}"`);
  if (format !== "number") codeLines.push(`  format="${format}"`);
  if (height !== 300) codeLines.push(`  height={${height}}`);
  if (!connectors) codeLines.push(`  connectors={false}`);
  if (!enableLabels) codeLines.push(`  enableLabels={false}`);
  if (borderRadius !== 3) codeLines.push(`  borderRadius={${borderRadius}}`);
  if (padding !== 0.35) codeLines.push(`  padding={${padding}}`);
  if (!enableGridY) codeLines.push(`  enableGridY={false}`);
  if (!animate) codeLines.push(`  animate={false}`);
  if (positiveColor) codeLines.push(`  positiveColor="${positiveColor}"`);
  if (negativeColor) codeLines.push(`  negativeColor="${negativeColor}"`);
  if (totalColor) codeLines.push(`  totalColor="${totalColor}"`);
  if (loading) codeLines.push(`  loading`);
  if (empty) codeLines.push(`  empty={{ message: "No waterfall data" }}`);
  if (variant !== "default") codeLines.push(`  variant="${variant}"`);
  codeLines.push(`/>`);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left: Preview + Code */}
      <div className="flex flex-1 flex-col">
        {/* Live Preview */}
        <div className="px-2 py-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Live Preview
          </p>
          <div className="mx-auto max-w-2xl">
            <Waterfall
              data={data}
              title={title || undefined}
              subtitle={subtitle || undefined}
              format={format as "currency" | "number" | "percent"}
              height={height}
              connectors={connectors}
              enableLabels={enableLabels}
              borderRadius={borderRadius}
              padding={padding}
              enableGridY={enableGridY}
              animate={animate}
              positiveColor={positiveColor || undefined}
              negativeColor={negativeColor || undefined}
              totalColor={totalColor || undefined}
              loading={loading}
              empty={empty ? { message: "No waterfall data" } : undefined}
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
      <div className="w-full flex-shrink-0 overflow-y-auto border-t border-[var(--card-border)] bg-[var(--card-bg)] lg:w-80 lg:border-l lg:border-t-0">
        <div className="border-b border-[var(--card-border)] px-5 py-4">
          <p className="text-sm font-bold text-[var(--foreground)]">Props</p>
          <p className="mt-0.5 text-[11px] text-[var(--muted)]">
            Adjust props to see the chart update in real time
          </p>
        </div>

        {/* Core */}
        <ControlSection title="Core">
          <Select
            label="dataset"
            value={datasetKey}
            onChange={setDatasetKey}
            options={Object.entries(datasets).map(([k, v]) => ({
              label: v.label,
              value: k,
            }))}
            description="Switch between sample datasets"
          />
          <TextInput label="title" value={title} onChange={setTitle} />
          <TextInput label="subtitle" value={subtitle} onChange={setSubtitle} />
          <Select
            label="format"
            value={format}
            onChange={setFormat}
            options={[
              { label: "currency", value: "currency" },
              { label: "number", value: "number" },
              { label: "percent", value: "percent" },
            ]}
          />
          <NumberInput
            label="height"
            value={height}
            onChange={setHeight}
            min={200}
            max={600}
            step={20}
            description="Chart height in px"
          />
        </ControlSection>

        {/* Appearance */}
        <ControlSection title="Appearance">
          <Toggle
            label="connectors"
            value={connectors}
            onChange={setConnectors}
            description="Dashed connector lines between bars"
          />
          <Toggle
            label="enableLabels"
            value={enableLabels}
            onChange={setEnableLabels}
            description="Show value labels on bars"
          />
          <Toggle
            label="enableGridY"
            value={enableGridY}
            onChange={setEnableGridY}
            description="Show Y-axis grid lines"
          />
          <Toggle
            label="animate"
            value={animate}
            onChange={setAnimate}
            description="Enable entry animation"
          />
          <NumberInput
            label="borderRadius"
            value={borderRadius}
            onChange={setBorderRadius}
            min={0}
            max={12}
            step={1}
            description="Corner radius on bars"
          />
          <NumberInput
            label="padding"
            value={padding}
            onChange={setPadding}
            min={0.1}
            max={0.8}
            step={0.05}
            description="Padding between bars (0-1)"
          />
        </ControlSection>

        {/* Colors */}
        <ControlSection title="Colors" defaultOpen={false}>
          <ColorInput
            label="positiveColor"
            value={positiveColor}
            onChange={setPositiveColor}
            description="Override color for positive bars"
          />
          <ColorInput
            label="negativeColor"
            value={negativeColor}
            onChange={setNegativeColor}
            description="Override color for negative bars"
          />
          <ColorInput
            label="totalColor"
            value={totalColor}
            onChange={setTotalColor}
            description="Override color for subtotal/total bars"
          />
        </ControlSection>

        {/* Data States */}
        <ControlSection title="Data States" defaultOpen={false}>
          <Toggle
            label="loading"
            value={loading}
            onChange={setLoading}
            description="Show skeleton placeholder"
          />
          <Toggle
            label="empty"
            value={empty}
            onChange={setEmpty}
            description="Show empty state message"
          />
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
