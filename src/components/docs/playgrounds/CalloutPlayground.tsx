"use client";

import { useState } from "react";
import { Callout } from "@/components/ui/Callout";
import type { CalloutVariant, CalloutRule } from "@/components/ui/Callout";
import {
  Toggle,
  NumberInput,
  TextInput,
  Select,
  ControlSection,
  CodePreview,
} from "@/components/docs/PlaygroundControls";

// ---------------------------------------------------------------------------
// Data-driven rules
// ---------------------------------------------------------------------------

const performanceRules: CalloutRule[] = [
  { min: 90, variant: "success", title: "Performance excellent", message: "Score: {value}. All systems nominal." },
  { min: 70, max: 90, variant: "info", title: "Performance good", message: "Score: {value}. Minor optimizations possible." },
  { min: 50, max: 70, variant: "warning", title: "Performance degraded", message: "Score: {value}. Investigate recent changes." },
  { max: 50, variant: "error", title: "Performance critical", message: "Score: {value}. Immediate action required." },
];

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export function CalloutPlayground() {
  // --- Core ---
  const [variant, setVariant] = useState<string>("info");
  const [title, setTitle] = useState("Heads up");
  const [dismissible, setDismissible] = useState(false);
  const [dense, setDense] = useState(false);

  // --- Data-driven ---
  const [ddEnabled, setDdEnabled] = useState(false);
  const [ddValue, setDdValue] = useState(85);

  // --- Code gen ---
  const codeLines: string[] = [];
  if (ddEnabled) {
    codeLines.push(`<Callout`);
    codeLines.push(`  value={${ddValue}}`);
    codeLines.push(`  rules={[`);
    codeLines.push(`    { min: 90, variant: "success", title: "Performance excellent", message: "Score: {value}." },`);
    codeLines.push(`    { min: 70, max: 90, variant: "info", title: "Performance good", message: "Score: {value}." },`);
    codeLines.push(`    { min: 50, max: 70, variant: "warning", title: "Performance degraded", message: "Score: {value}." },`);
    codeLines.push(`    { max: 50, variant: "error", title: "Performance critical", message: "Score: {value}." },`);
    codeLines.push(`  ]}`);
    if (dismissible) codeLines.push(`  dismissible`);
    if (dense) codeLines.push(`  dense`);
    codeLines.push(`/>`);
  } else {
    codeLines.push(`<Callout`);
    codeLines.push(`  variant="${variant}"`);
    if (title) codeLines.push(`  title="${title}"`);
    if (dismissible) codeLines.push(`  dismissible`);
    if (dense) codeLines.push(`  dense`);
    codeLines.push(`>`);
    codeLines.push(`  This is an example callout message.`);
    codeLines.push(`</Callout>`);
  }

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left: Preview + Code */}
      <div className="flex flex-1 flex-col">
        {/* Live Preview */}
        <div className="px-2 py-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Live Preview
          </p>
          <div className="mx-auto max-w-xl">
            {ddEnabled ? (
              <>
                <div className="mb-4 flex items-center gap-4">
                  <label className="text-sm font-medium text-[var(--foreground)]">
                    Score: {ddValue}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={ddValue}
                    onChange={(e) => setDdValue(Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
                <Callout
                  value={ddValue}
                  rules={performanceRules}
                  dismissible={dismissible}
                  dense={dense}
                />
              </>
            ) : (
              <Callout
                variant={variant as CalloutVariant}
                title={title || undefined}
                dismissible={dismissible}
                dense={dense}
              >
                This is an example callout message. Adjust the controls on the
                right to see it update in real time.
              </Callout>
            )}
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
            Adjust props to see the callout update in real time
          </p>
        </div>

        {/* Core */}
        <ControlSection title="Core">
          <Select
            label="variant"
            value={variant}
            onChange={setVariant}
            options={[
              { label: "info", value: "info" },
              { label: "warning", value: "warning" },
              { label: "success", value: "success" },
              { label: "error", value: "error" },
            ]}
            description="Visual variant (ignored when data-driven)"
          />
          <TextInput label="title" value={title} onChange={setTitle} placeholder="e.g. Heads up" />
        </ControlSection>

        {/* Interactions */}
        <ControlSection title="Interactions">
          <Toggle label="dismissible" value={dismissible} onChange={setDismissible} description="Show dismiss button" />
        </ControlSection>

        {/* Appearance */}
        <ControlSection title="Appearance">
          <Toggle label="dense" value={dense} onChange={setDense} description="Compact layout" />
        </ControlSection>

        {/* Data-Driven */}
        <ControlSection title="Data-Driven">
          <Toggle label="Enable rules" value={ddEnabled} onChange={setDdEnabled} description="Switch to data-driven mode" />
          {ddEnabled && (
            <NumberInput
              label="value"
              value={ddValue}
              onChange={setDdValue}
              step={5}
              description="Numeric value evaluated against rules"
            />
          )}
        </ControlSection>
      </div>
    </div>
  );
}
