"use client";

import { useState, useMemo } from "react";
import { Gauge } from "@/components/charts/Gauge";
import type { GaugeThreshold } from "@/components/charts/Gauge";
import {
  Toggle,
  NumberInput,
  TextInput,
  Select,
  ControlSection,
  CodePreview,
} from "@/components/docs/PlaygroundControls";

export function GaugePlayground() {
  // --- Core ---
  const [value, setValue] = useState(73);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [title, setTitle] = useState("CPU Usage");
  const [subtitle, setSubtitle] = useState("avg. last 5 min");

  // --- Format ---
  const [formatStyle, setFormatStyle] = useState("percent");

  // --- Appearance ---
  const [arcAngle, setArcAngle] = useState<"270" | "180">("270");
  const [strokeWidth, setStrokeWidth] = useState(12);
  const [color, setColor] = useState("");
  const [showMinMax, setShowMinMax] = useState(true);
  const [showValue, setShowValue] = useState(true);
  const [size, setSize] = useState(200);

  // --- Thresholds ---
  const [enableThresholds, setEnableThresholds] = useState(true);
  const [thresh1, setThresh1] = useState(0);
  const [thresh1Color, setThresh1Color] = useState("#10b981");
  const [thresh2, setThresh2] = useState(60);
  const [thresh2Color, setThresh2Color] = useState("#f59e0b");
  const [thresh3, setThresh3] = useState(85);
  const [thresh3Color, setThresh3Color] = useState("#ef4444");

  // --- Target ---
  const [enableTarget, setEnableTarget] = useState(false);
  const [targetValue, setTargetValue] = useState(80);
  const [targetLabel, setTargetLabel] = useState("Target");

  // --- Comparison ---
  const [enableComparison, setEnableComparison] = useState(false);
  const [comparisonValue, setComparisonValue] = useState(65);
  const [comparisonLabel, setComparisonLabel] = useState("vs last period");

  // --- Data States ---
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  // --- Theming ---
  const [variant, setVariant] = useState("default");

  // --- Derived ---
  const thresholds: GaugeThreshold[] | undefined = enableThresholds
    ? [
        { value: thresh1, color: thresh1Color },
        { value: thresh2, color: thresh2Color },
        { value: thresh3, color: thresh3Color },
      ]
    : undefined;

  const format = useMemo(
    () => ({ style: formatStyle as "number" | "percent" | "currency" }),
    [formatStyle],
  );

  const arcAngleNum = Number(arcAngle) as 180 | 270;

  // --- Code gen ---
  const codeLines = [`<Gauge`];
  codeLines.push(`  value={${value}}`);
  if (min !== 0) codeLines.push(`  min={${min}}`);
  if (max !== 100) codeLines.push(`  max={${max}}`);
  if (title) codeLines.push(`  title="${title}"`);
  if (subtitle) codeLines.push(`  subtitle="${subtitle}"`);
  codeLines.push(`  format={{ style: "${formatStyle}" }}`);
  if (arcAngleNum !== 270) codeLines.push(`  arcAngle={${arcAngleNum}}`);
  if (strokeWidth !== 12) codeLines.push(`  strokeWidth={${strokeWidth}}`);
  if (color) codeLines.push(`  color="${color}"`);
  if (!showMinMax) codeLines.push(`  showMinMax={false}`);
  if (!showValue) codeLines.push(`  showValue={false}`);
  if (size !== 200) codeLines.push(`  size={${size}}`);
  if (enableThresholds) {
    codeLines.push(`  thresholds={[`);
    codeLines.push(`    { value: ${thresh1}, color: "${thresh1Color}" },`);
    codeLines.push(`    { value: ${thresh2}, color: "${thresh2Color}" },`);
    codeLines.push(`    { value: ${thresh3}, color: "${thresh3Color}" },`);
    codeLines.push(`  ]}`);
  }
  if (enableTarget) {
    codeLines.push(`  target={${targetValue}}`);
    if (targetLabel) codeLines.push(`  targetLabel="${targetLabel}"`);
  }
  if (enableComparison) {
    codeLines.push(`  comparison={{ value: ${comparisonValue} }}`);
    if (comparisonLabel) codeLines.push(`  comparisonLabel="${comparisonLabel}"`);
  }
  if (loading) codeLines.push(`  loading`);
  if (empty) codeLines.push(`  empty={{ message: "No data" }}`);
  if (variant !== "default") codeLines.push(`  variant="${variant}"`);
  codeLines.push(`/>`);

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
            <Gauge
              value={loading || empty ? undefined : value}
              min={min}
              max={max}
              title={title || undefined}
              subtitle={subtitle || undefined}
              format={format}
              arcAngle={arcAngleNum}
              color={color || undefined}
              showMinMax={showMinMax}
              showValue={showValue}
              thresholds={thresholds}
              target={enableTarget ? targetValue : undefined}
              targetLabel={enableTarget ? targetLabel : undefined}
              comparison={enableComparison ? { value: comparisonValue } : undefined}
              comparisonLabel={enableComparison ? comparisonLabel : undefined}
              loading={loading}
              empty={empty ? { message: "No data" } : undefined}
              variant={variant as "default" | "outlined" | "ghost" | "elevated"}
              animate={{ countUp: true }}
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
            Adjust props to see the gauge update in real time
          </p>
        </div>

        {/* Core */}
        <ControlSection title="Core">
          <NumberInput label="value" value={value} onChange={setValue} min={-200} max={200} step={1} />
          <NumberInput label="min" value={min} onChange={setMin} min={-1000} max={0} step={10} />
          <NumberInput label="max" value={max} onChange={setMax} min={1} max={1000000} step={100} />
          <TextInput label="title" value={title} onChange={setTitle} />
          <TextInput label="subtitle" value={subtitle} onChange={setSubtitle} />
        </ControlSection>

        {/* Format */}
        <ControlSection title="Format">
          <Select
            label="format.style"
            value={formatStyle}
            onChange={setFormatStyle}
            options={[
              { label: "number", value: "number" },
              { label: "percent", value: "percent" },
              { label: "currency", value: "currency" },
            ]}
            description="How the value is displayed"
          />
        </ControlSection>

        {/* Appearance */}
        <ControlSection title="Appearance">
          <Select
            label="arcAngle"
            value={arcAngle}
            onChange={(v) => setArcAngle(v as "180" | "270")}
            options={[
              { label: "270 (default)", value: "270" },
              { label: "180 (half circle)", value: "180" },
            ]}
            description="Arc sweep angle"
          />
          <NumberInput label="strokeWidth" value={strokeWidth} onChange={setStrokeWidth} min={4} max={24} step={2} description="Thickness of the arc" />
          <TextInput label="color" value={color} onChange={setColor} placeholder="e.g. #6366f1 or leave blank" />
          <Toggle label="showMinMax" value={showMinMax} onChange={setShowMinMax} description="Min/max labels at arc ends" />
          <Toggle label="showValue" value={showValue} onChange={setShowValue} description="Centered value text" />
          <NumberInput label="size" value={size} onChange={setSize} min={100} max={400} step={20} description="SVG viewport size in px" />
        </ControlSection>

        {/* Thresholds */}
        <ControlSection title="Thresholds" defaultOpen={false}>
          <Toggle label="Enable thresholds" value={enableThresholds} onChange={setEnableThresholds} description="Color zones based on value ranges" />
          {enableThresholds && (
            <>
              <div className="flex items-center gap-2">
                <NumberInput label="Zone 1 at" value={thresh1} onChange={setThresh1} min={-1000} max={1000000} step={1} />
                <TextInput label="color" value={thresh1Color} onChange={setThresh1Color} />
              </div>
              <div className="flex items-center gap-2">
                <NumberInput label="Zone 2 at" value={thresh2} onChange={setThresh2} min={-1000} max={1000000} step={1} />
                <TextInput label="color" value={thresh2Color} onChange={setThresh2Color} />
              </div>
              <div className="flex items-center gap-2">
                <NumberInput label="Zone 3 at" value={thresh3} onChange={setThresh3} min={-1000} max={1000000} step={1} />
                <TextInput label="color" value={thresh3Color} onChange={setThresh3Color} />
              </div>
            </>
          )}
        </ControlSection>

        {/* Target */}
        <ControlSection title="Target" defaultOpen={false}>
          <Toggle label="Enable target" value={enableTarget} onChange={setEnableTarget} description="Tick mark on the arc at a target value" />
          {enableTarget && (
            <>
              <NumberInput label="target" value={targetValue} onChange={setTargetValue} min={-1000} max={1000000} step={1} />
              <TextInput label="targetLabel" value={targetLabel} onChange={setTargetLabel} />
            </>
          )}
        </ControlSection>

        {/* Comparison */}
        <ControlSection title="Comparison" defaultOpen={false}>
          <Toggle label="Enable comparison" value={enableComparison} onChange={setEnableComparison} description="Show trend badge below gauge" />
          {enableComparison && (
            <>
              <NumberInput label="comparison.value" value={comparisonValue} onChange={setComparisonValue} min={-1000} max={1000000} step={1} />
              <TextInput label="comparisonLabel" value={comparisonLabel} onChange={setComparisonLabel} />
            </>
          )}
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
