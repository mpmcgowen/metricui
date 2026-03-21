"use client";

import { useState } from "react";
import { Divider } from "@/components/ui/Divider";
import { KpiCard } from "@/components/cards/KpiCard";
import {
  Toggle,
  TextInput,
  Select,
  ControlSection,
  CodePreview,
} from "@/components/docs/PlaygroundControls";

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export function DividerPlayground() {
  // --- Interactive Controls ---
  const [label, setLabel] = useState("");
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [variant, setVariant] = useState<"solid" | "dashed" | "dotted">("solid");
  const [spacing, setSpacing] = useState<"none" | "sm" | "md" | "lg">("md");
  const [accent, setAccent] = useState(false);
  const [dense, setDense] = useState(false);

  // --- Code gen ---
  const codeLines = [`<Divider`];
  if (label) codeLines.push(`  label="${label}"`);
  if (orientation !== "horizontal") codeLines.push(`  orientation="${orientation}"`);
  if (variant !== "solid") codeLines.push(`  variant="${variant}"`);
  if (spacing !== "md") codeLines.push(`  spacing="${spacing}"`);
  if (accent) codeLines.push(`  accent`);
  if (dense) codeLines.push(`  dense`);
  codeLines.push(`/>`);

  return (
    <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row">
      {/* Left: Preview + Examples */}
      <div className="flex flex-1 flex-col lg:overflow-y-auto">
        {/* Live Preview */}
        <div className="flex-1 px-8 py-8">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
            Live Preview
          </p>
          <div className="mx-auto max-w-3xl rounded-xl border border-[var(--card-border)] p-6">
            {orientation === "horizontal" ? (
              <div>
                <p className="text-sm text-[var(--muted)]">Content above</p>
                <Divider
                  label={label || undefined}
                  orientation={orientation}
                  variant={variant}
                  spacing={spacing}
                  accent={accent}
                  dense={dense}
                />
                <p className="text-sm text-[var(--muted)]">Content below</p>
              </div>
            ) : (
              <div className="flex h-24 items-center">
                <p className="text-sm text-[var(--muted)]">Left</p>
                <Divider
                  label={label || undefined}
                  orientation={orientation}
                  variant={variant}
                  spacing={spacing}
                  accent={accent}
                  dense={dense}
                />
                <p className="text-sm text-[var(--muted)]">Right</p>
              </div>
            )}
          </div>

          {/* Spacing Comparison */}
          <div className="mt-12">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Spacing Comparison
            </p>
            <div className="mx-auto max-w-3xl grid grid-cols-2 gap-6">
              <div>
                <p className="mb-2 text-[10px] font-medium text-[var(--muted)]">Normal (md)</p>
                <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                  <p className="text-xs text-[var(--muted)]">Above</p>
                  <Divider spacing="md" />
                  <p className="text-xs text-[var(--muted)]">Below</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-medium text-[var(--muted)]">Dense (md)</p>
                <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                  <p className="text-xs text-[var(--muted)]">Above</p>
                  <Divider spacing="md" dense />
                  <p className="text-xs text-[var(--muted)]">Below</p>
                </div>
              </div>
            </div>
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
            Adjust props to see the component update in real time
          </p>
        </div>

        {/* Core */}
        <ControlSection title="Core">
          <TextInput label="label" value={label} onChange={setLabel} placeholder="Optional label text" />
          <Select
            label="orientation"
            value={orientation}
            options={[
              { label: "horizontal", value: "horizontal" },
              { label: "vertical", value: "vertical" },
            ]}
            onChange={(v) => setOrientation(v as "horizontal" | "vertical")}
          />
        </ControlSection>

        {/* Style */}
        <ControlSection title="Style">
          <Select
            label="variant"
            value={variant}
            options={[
              { label: "solid", value: "solid" },
              { label: "dashed", value: "dashed" },
              { label: "dotted", value: "dotted" },
            ]}
            onChange={(v) => setVariant(v as "solid" | "dashed" | "dotted")}
          />
          <Select
            label="spacing"
            value={spacing}
            options={[
              { label: "none", value: "none" },
              { label: "sm", value: "sm" },
              { label: "md", value: "md" },
              { label: "lg", value: "lg" },
            ]}
            onChange={(v) => setSpacing(v as "none" | "sm" | "md" | "lg")}
          />
          <Toggle label="accent" value={accent} onChange={setAccent} description="Use accent color instead of muted" />
          <Toggle label="dense" value={dense} onChange={setDense} description="Compact spacing" />
        </ControlSection>
      </div>
    </div>
  );
}
