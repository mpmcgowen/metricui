"use client";

import { useState } from "react";
import { Funnel } from "@/components/charts/Funnel";
import type { FunnelDatumInput } from "@/components/charts/Funnel";
import {
  Toggle,
  NumberInput,
  TextInput,
  Select,
  ControlSection,
  CodePreview,
} from "@/components/docs/PlaygroundControls";

// ---------------------------------------------------------------------------
// Sample datasets
// ---------------------------------------------------------------------------

const conversionData: FunnelDatumInput[] = [
  { id: "visited", label: "Visited", value: 10000 },
  { id: "signed-up", label: "Signed Up", value: 4200 },
  { id: "activated", label: "Activated", value: 2800 },
  { id: "subscribed", label: "Subscribed", value: 1400 },
  { id: "retained", label: "Retained", value: 980 },
];

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export function FunnelPlayground() {
  // --- Core ---
  const [title, setTitle] = useState("Signup Funnel");
  const [subtitle, setSubtitle] = useState("Q1 2026 conversion pipeline");

  // --- Appearance ---
  const [direction, setDirection] = useState<"vertical" | "horizontal">("vertical");
  const [interpolation, setInterpolation] = useState<"smooth" | "linear">("smooth");
  const [spacing, setSpacing] = useState(4);
  const [shapeBlending, setShapeBlending] = useState(0.66);
  const [enableLabel, setEnableLabel] = useState(true);
  const [enableSeparators, setEnableSeparators] = useState(true);
  const [showConversionRate, setShowConversionRate] = useState(false);
  const [height, setHeight] = useState(360);

  // --- Data States ---
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  // --- Theming ---
  const [variant, setVariant] = useState("default");

  // --- Code gen ---
  const codeLines = [`<Funnel`];
  codeLines.push(`  data={[`);
  conversionData.forEach((d) => {
    codeLines.push(`    { id: "${d.id}", label: "${d.label}", value: ${d.value} },`);
  });
  codeLines.push(`  ]}`);
  if (title) codeLines.push(`  title="${title}"`);
  if (subtitle) codeLines.push(`  subtitle="${subtitle}"`);
  if (direction !== "vertical") codeLines.push(`  direction="${direction}"`);
  if (interpolation !== "smooth") codeLines.push(`  interpolation="${interpolation}"`);
  if (spacing !== 4) codeLines.push(`  spacing={${spacing}}`);
  if (shapeBlending !== 0.66) codeLines.push(`  shapeBlending={${shapeBlending}}`);
  if (!enableLabel) codeLines.push(`  enableLabel={false}`);
  if (!enableSeparators) codeLines.push(`  enableSeparators={false}`);
  if (showConversionRate) codeLines.push(`  showConversionRate`);
  if (height !== 360) codeLines.push(`  height={${height}}`);
  if (loading) codeLines.push(`  loading`);
  if (empty) codeLines.push(`  empty={{ message: "No data" }}`);
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
            <Funnel
              data={conversionData}
              title={title || undefined}
              subtitle={subtitle || undefined}
              direction={direction}
              interpolation={interpolation}
              spacing={spacing}
              shapeBlending={shapeBlending}
              enableLabel={enableLabel}
              enableSeparators={enableSeparators}
              showConversionRate={showConversionRate}
              height={height}
              loading={loading}
              empty={empty ? { message: "No data" } : undefined}
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
            Adjust props to see the funnel update in real time
          </p>
        </div>

        {/* Core */}
        <ControlSection title="Core">
          <TextInput label="title" value={title} onChange={setTitle} />
          <TextInput label="subtitle" value={subtitle} onChange={setSubtitle} />
        </ControlSection>

        {/* Appearance */}
        <ControlSection title="Appearance">
          <Select
            label="direction"
            value={direction}
            onChange={(v) => setDirection(v as "vertical" | "horizontal")}
            options={[
              { label: "vertical", value: "vertical" },
              { label: "horizontal", value: "horizontal" },
            ]}
            description="Layout direction"
          />
          <Select
            label="interpolation"
            value={interpolation}
            onChange={(v) => setInterpolation(v as "smooth" | "linear")}
            options={[
              { label: "smooth", value: "smooth" },
              { label: "linear", value: "linear" },
            ]}
            description="Edge curve interpolation"
          />
          <NumberInput label="spacing" value={spacing} onChange={setSpacing} min={0} max={30} step={1} description="Gap between stages in px" />
          <NumberInput label="shapeBlending" value={shapeBlending} onChange={setShapeBlending} min={0} max={1} step={0.01} description="0 = rectangles, 1 = smooth funnel" />
          <Toggle label="enableLabel" value={enableLabel} onChange={setEnableLabel} description="Show value labels on each stage" />
          <Toggle label="enableSeparators" value={enableSeparators} onChange={setEnableSeparators} description="Lines between stages" />
          <Toggle label="showConversionRate" value={showConversionRate} onChange={setShowConversionRate} description="Show % conversion between stages" />
          <NumberInput label="height" value={height} onChange={setHeight} min={200} max={600} step={20} description="Chart height in px" />
        </ControlSection>

        {/* Data States */}
        <ControlSection title="Data States" defaultOpen={false}>
          <Toggle label="loading" value={loading} onChange={setLoading} description="Show skeleton placeholder" />
          <Toggle label="empty" value={empty} onChange={setEmpty} description="Show empty state message" />
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
