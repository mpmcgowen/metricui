"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/cards/KpiCard";
import {
  Toggle,
  TextInput,
  ControlSection,
  CodePreview,
} from "@/components/docs/PlaygroundControls";

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export function SectionHeaderPlayground() {
  // --- Interactive Controls ---
  const [title, setTitle] = useState("Revenue Overview");
  const [subtitle, setSubtitle] = useState("Monthly breakdown by region");
  const [border, setBorder] = useState(false);
  const [spacing, setSpacing] = useState(true);
  const [dense, setDense] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  // --- Code gen ---
  const codeLines = [`<SectionHeader`];
  codeLines.push(`  title="${title}"`);
  if (subtitle) codeLines.push(`  subtitle="${subtitle}"`);
  if (border) codeLines.push(`  border`);
  if (!spacing) codeLines.push(`  spacing={false}`);
  if (dense) codeLines.push(`  dense`);
  if (showAction) codeLines.push(`  action={<button className="text-xs text-[var(--accent)]">View all</button>}`);
  if (showBadge) codeLines.push(`  badge={<Badge variant="info" size="sm">3 new</Badge>}`);
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
            <SectionHeader
              title={title}
              subtitle={subtitle || undefined}
              border={border}
              spacing={false}
              dense={dense}
              action={
                showAction ? (
                  <button className="text-xs font-medium text-[var(--accent)] hover:underline">
                    View all
                  </button>
                ) : undefined
              }
              badge={showBadge ? <Badge variant="info" size="sm">3 new</Badge> : undefined}
            />
          </div>

          {/* Side-by-Side in 2-Column Grid */}
          <div className="mt-12">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Side-by-Side in a 2-Column Grid
            </p>
            <div className="mx-auto max-w-3xl grid grid-cols-2 gap-6">
              <div>
                <SectionHeader
                  title="Revenue"
                  subtitle="This month"
                  border
                  spacing={false}
                />
                <div className="mt-3">
                  <KpiCard title="Total" value={142300} format="currency" />
                </div>
              </div>
              <div>
                <SectionHeader
                  title="Users"
                  subtitle="Active this month"
                  border
                  spacing={false}
                />
                <div className="mt-3">
                  <KpiCard title="Total" value={12450} format="compact" />
                </div>
              </div>
            </div>
          </div>

          {/* Dense Mode Comparison */}
          <div className="mt-12">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
              Dense Mode Comparison
            </p>
            <div className="mx-auto max-w-3xl grid grid-cols-2 gap-6">
              <div>
                <p className="mb-2 text-[10px] font-medium text-[var(--muted)]">Normal</p>
                <SectionHeader
                  title="Performance"
                  subtitle="Last 30 days"
                  border
                  spacing={false}
                />
              </div>
              <div>
                <p className="mb-2 text-[10px] font-medium text-[var(--muted)]">Dense</p>
                <SectionHeader
                  title="Performance"
                  subtitle="Last 30 days"
                  border
                  dense
                  spacing={false}
                />
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
          <TextInput label="title" value={title} onChange={setTitle} placeholder="Section title" />
          <TextInput label="subtitle" value={subtitle} onChange={setSubtitle} placeholder="Optional subtitle" />
        </ControlSection>

        {/* Layout */}
        <ControlSection title="Layout">
          <Toggle label="border" value={border} onChange={setBorder} description="Bottom border for visual separation" />
          <Toggle label="spacing" value={spacing} onChange={setSpacing} description="Top margin (default: true)" />
          <Toggle label="dense" value={dense} onChange={setDense} description="Compact mode with smaller text" />
        </ControlSection>

        {/* Slots */}
        <ControlSection title="Slots">
          <Toggle label="action" value={showAction} onChange={setShowAction} description="Right-aligned action link" />
          <Toggle label="badge" value={showBadge} onChange={setShowBadge} description="Inline badge after title" />
        </ControlSection>
      </div>
    </div>
  );
}
