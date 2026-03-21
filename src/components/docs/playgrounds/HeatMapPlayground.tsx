"use client";

import { useState, useMemo } from "react";
import { HeatMap } from "@/components/charts/HeatMap";
import type { HeatMapColorScale } from "@/components/charts/HeatMap";
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

type HeatMapSeries = { id: string; data: { x: string; y: number | null }[] };

const datasets: Record<string, HeatMapSeries[]> = {
  weeklyActivity: [
    { id: "Mon", data: [{ x: "9am", y: 12 }, { x: "10am", y: 45 }, { x: "11am", y: 78 }, { x: "12pm", y: 52 }, { x: "1pm", y: 38 }, { x: "2pm", y: 65 }, { x: "3pm", y: 89 }, { x: "4pm", y: 72 }, { x: "5pm", y: 34 }] },
    { id: "Tue", data: [{ x: "9am", y: 23 }, { x: "10am", y: 56 }, { x: "11am", y: 92 }, { x: "12pm", y: 48 }, { x: "1pm", y: 42 }, { x: "2pm", y: 78 }, { x: "3pm", y: 95 }, { x: "4pm", y: 68 }, { x: "5pm", y: 28 }] },
    { id: "Wed", data: [{ x: "9am", y: 18 }, { x: "10am", y: 62 }, { x: "11am", y: 85 }, { x: "12pm", y: 55 }, { x: "1pm", y: 35 }, { x: "2pm", y: 72 }, { x: "3pm", y: 88 }, { x: "4pm", y: 75 }, { x: "5pm", y: 42 }] },
    { id: "Thu", data: [{ x: "9am", y: 28 }, { x: "10am", y: 58 }, { x: "11am", y: 82 }, { x: "12pm", y: 45 }, { x: "1pm", y: 40 }, { x: "2pm", y: 68 }, { x: "3pm", y: 92 }, { x: "4pm", y: 70 }, { x: "5pm", y: 38 }] },
    { id: "Fri", data: [{ x: "9am", y: 15 }, { x: "10am", y: 48 }, { x: "11am", y: 72 }, { x: "12pm", y: 42 }, { x: "1pm", y: 30 }, { x: "2pm", y: 55 }, { x: "3pm", y: 68 }, { x: "4pm", y: 52 }, { x: "5pm", y: 22 }] },
  ],
  serverResponse: [
    { id: "/api/users", data: [{ x: "00:00", y: 120 }, { x: "04:00", y: 85 }, { x: "08:00", y: 210 }, { x: "12:00", y: 340 }, { x: "16:00", y: 290 }, { x: "20:00", y: 180 }] },
    { id: "/api/orders", data: [{ x: "00:00", y: 95 }, { x: "04:00", y: 60 }, { x: "08:00", y: 180 }, { x: "12:00", y: 420 }, { x: "16:00", y: 380 }, { x: "20:00", y: 150 }] },
    { id: "/api/products", data: [{ x: "00:00", y: 45 }, { x: "04:00", y: 30 }, { x: "08:00", y: 110 }, { x: "12:00", y: 195 }, { x: "16:00", y: 165 }, { x: "20:00", y: 70 }] },
    { id: "/api/auth", data: [{ x: "00:00", y: 200 }, { x: "04:00", y: 140 }, { x: "08:00", y: 350 }, { x: "12:00", y: 280 }, { x: "16:00", y: 310 }, { x: "20:00", y: 230 }] },
    { id: "/api/search", data: [{ x: "00:00", y: 310 }, { x: "04:00", y: 180 }, { x: "08:00", y: 490 }, { x: "12:00", y: 580 }, { x: "16:00", y: 520 }, { x: "20:00", y: 350 }] },
  ],
  correlation: [
    { id: "Revenue", data: [{ x: "Revenue", y: 1.0 }, { x: "Users", y: 0.85 }, { x: "Sessions", y: 0.72 }, { x: "Bounce", y: -0.64 }, { x: "NPS", y: 0.48 }] },
    { id: "Users", data: [{ x: "Revenue", y: 0.85 }, { x: "Users", y: 1.0 }, { x: "Sessions", y: 0.91 }, { x: "Bounce", y: -0.52 }, { x: "NPS", y: 0.63 }] },
    { id: "Sessions", data: [{ x: "Revenue", y: 0.72 }, { x: "Users", y: 0.91 }, { x: "Sessions", y: 1.0 }, { x: "Bounce", y: -0.38 }, { x: "NPS", y: 0.55 }] },
    { id: "Bounce", data: [{ x: "Revenue", y: -0.64 }, { x: "Users", y: -0.52 }, { x: "Sessions", y: -0.38 }, { x: "Bounce", y: 1.0 }, { x: "NPS", y: -0.71 }] },
    { id: "NPS", data: [{ x: "Revenue", y: 0.48 }, { x: "Users", y: 0.63 }, { x: "Sessions", y: 0.55 }, { x: "Bounce", y: -0.71 }, { x: "NPS", y: 1.0 }] },
  ],
};

const datasetDefaults: Record<string, { title: string; subtitle: string; colorScale: HeatMapColorScale }> = {
  weeklyActivity: { title: "Weekly Activity", subtitle: "User sessions by day and hour", colorScale: "sequential" },
  serverResponse: { title: "Server Response Times", subtitle: "P95 latency (ms) by endpoint and hour", colorScale: "sequential" },
  correlation: { title: "Correlation Matrix", subtitle: "Metric-to-metric correlations", colorScale: "diverging" },
};

export function HeatMapPlayground() {
  // --- Data ---
  const [datasetKey, setDatasetKey] = useState("weeklyActivity");
  const handleDatasetChange = (key: string) => {
    setDatasetKey(key);
    const d = datasetDefaults[key];
    if (d) {
      setTitle(d.title);
      setSubtitle(d.subtitle);
      setColorScale(d.colorScale);
    }
  };

  // --- Core ---
  const [title, setTitle] = useState("Weekly Activity");
  const [subtitle, setSubtitle] = useState("User sessions by day and hour");
  const [footnote, setFootnote] = useState("");
  const [description, setDescription] = useState("");

  // --- Appearance ---
  const [height, setHeight] = useState(300);
  const [borderRadius, setBorderRadius] = useState(4);
  const [enableLabels, setEnableLabels] = useState(false);
  const [forceSquare, setForceSquare] = useState(false);
  const [cellPadding, setCellPadding] = useState(0.05);
  const [colorScale, setColorScale] = useState<HeatMapColorScale>("sequential");

  // --- Variant ---
  const [variant, setVariant] = useState("default");

  // --- Derived ---
  const data = datasets[datasetKey] ?? datasets.weeklyActivity;

  // --- Code gen ---
  const codeLines = useMemo(() => {
    const lines = [`<HeatMap`];
    lines.push(`  data={${datasetKey}Data}`);
    lines.push(`  title="${title}"`);
    if (subtitle) lines.push(`  subtitle="${subtitle}"`);
    if (height !== 300) lines.push(`  height={${height}}`);
    if (borderRadius !== 4) lines.push(`  borderRadius={${borderRadius}}`);
    if (enableLabels) lines.push(`  enableLabels`);
    if (forceSquare) lines.push(`  forceSquare`);
    if (cellPadding !== 0.05) lines.push(`  cellPadding={${cellPadding}}`);
    if (colorScale !== "sequential") lines.push(`  colorScale="${colorScale}"`);
    if (description) lines.push(`  description="${description}"`);
    if (footnote) lines.push(`  footnote="${footnote}"`);
    if (variant !== "default") lines.push(`  variant="${variant}"`);
    lines.push(`/>`);
    return lines;
  }, [datasetKey, title, subtitle, height, borderRadius, enableLabels, forceSquare, cellPadding, colorScale, description, footnote, variant]);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left: Preview + Code */}
      <div className="flex flex-1 flex-col lg:overflow-y-auto">
        {/* Live Preview */}
        <div className="flex-1 px-8 py-8">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Live Preview
          </p>
          <div className="mx-auto max-w-3xl">
            <HeatMap
              data={data}
              title={title}
              subtitle={subtitle || undefined}
              description={description || undefined}
              footnote={footnote || undefined}
              height={height}
              borderRadius={borderRadius}
              enableLabels={enableLabels}
              forceSquare={forceSquare}
              cellPadding={cellPadding}
              colorScale={colorScale}
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
            onChange={handleDatasetChange}
            options={[
              { label: "Weekly Activity", value: "weeklyActivity" },
              { label: "Server Response Times", value: "serverResponse" },
              { label: "Correlation Matrix", value: "correlation" },
            ]}
            description="Switch between sample datasets"
          />
        </ControlSection>

        {/* Core */}
        <ControlSection title="Core">
          <TextInput label="title" value={title} onChange={setTitle} />
          <TextInput label="subtitle" value={subtitle} onChange={setSubtitle} />
          <TextInput label="description" value={description} onChange={setDescription} placeholder="Shows as a ? popover" />
          <TextInput label="footnote" value={footnote} onChange={setFootnote} />
        </ControlSection>

        {/* Appearance */}
        <ControlSection title="Appearance">
          <NumberInput label="height" value={height} onChange={setHeight} min={150} max={600} step={50} />
          <NumberInput label="borderRadius" value={borderRadius} onChange={setBorderRadius} min={0} max={20} step={1} description="Cell corner radius in px" />
          <Toggle label="enableLabels" value={enableLabels} onChange={setEnableLabels} description="Show formatted values inside cells" />
          <Toggle label="forceSquare" value={forceSquare} onChange={setForceSquare} description="Force cells to be square" />
          <NumberInput label="cellPadding" value={cellPadding} onChange={setCellPadding} min={0} max={0.5} step={0.01} description="Inner padding between cells (0-1 ratio)" />
          <Select
            label="colorScale"
            value={colorScale}
            onChange={(v) => setColorScale(v as HeatMapColorScale)}
            options={[
              { label: "sequential", value: "sequential" },
              { label: "diverging", value: "diverging" },
            ]}
            description="sequential = single hue, diverging = two-tone with midpoint"
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
