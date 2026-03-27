"use client";

import { useState } from "react";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";
import { Activity, TrendingUp, BarChart3 } from "lucide-react";

const component = getComponent("segment-toggle")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "with-icons", title: "With Icons", level: 2 },
  { id: "with-badges", title: "With Badge Counts", level: 2 },
  { id: "multi-select", title: "Multi-Select Mode", level: 2 },
  { id: "sizes", title: "Size Variants", level: 2 },
  { id: "full-width", title: "Full Width", level: 2 },
  { id: "vertical", title: "Vertical Orientation", level: 2 },
  { id: "color-coded", title: "Color-Coded Segments", level: 2 },
  { id: "connected", title: "Connected (FilterProvider)", level: 2 },
  { id: "interactive", title: "Interactive Controls", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Connected example — shows FilterProvider + useMetricFilters
// ---------------------------------------------------------------------------

function ConnectedInner() {
  const filters = useMetricFilters();
  const viewValues = filters?.dimensions?.["view"] ?? [];
  return (
    <div className="w-full max-w-xl space-y-4">
      <SegmentToggle options={["Overview", "Details", "Logs"]} field="view" />
      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 font-[family-name:var(--font-mono)] text-xs text-[var(--muted)]">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
          useMetricFilters() output
        </p>
        <p>
          <span className="text-[var(--foreground)]">dimensions.view:</span>{" "}
          {viewValues.length > 0 ? `["${viewValues.join('", "')}"]` : "[]"}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interactive controls playground
// ---------------------------------------------------------------------------

function InteractivePlayground() {
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [multiple, setMultiple] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");

  return (
    <div className="w-full max-w-xl space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-medium text-[var(--muted)]">Size</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as "sm" | "md" | "lg")}
            className="h-6 rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-1.5 text-[11px] text-[var(--foreground)] outline-none"
          >
            <option value="sm">sm</option>
            <option value="md">md</option>
            <option value="lg">lg</option>
          </select>
        </div>
        <ToggleControl label="Multiple" value={multiple} onChange={setMultiple} />
        <ToggleControl label="Full Width" value={fullWidth} onChange={setFullWidth} />
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-medium text-[var(--muted)]">Orientation</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as "horizontal" | "vertical")}
            className="h-6 rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-1.5 text-[11px] text-[var(--foreground)] outline-none"
          >
            <option value="horizontal">horizontal</option>
            <option value="vertical">vertical</option>
          </select>
        </div>
      </div>
      {/* Toggle preview */}
      <SegmentToggle
        options={["Daily", "Weekly", "Monthly"]}
        size={size}
        multiple={multiple}
        fullWidth={fullWidth}
        orientation={orientation}
      />
    </div>
  );
}

function ToggleControl({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-[11px] font-medium text-[var(--muted)]">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-4 w-7 rounded-full transition-colors ${value ? "bg-[var(--accent)]" : "bg-[var(--card-border)]"}`}
      >
        <span className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${value ? "translate-x-3" : ""}`} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SegmentToggleDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use SegmentToggle to let users switch between views, granularities, or filter
        dimensions. It writes to FilterContext via the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">field</code> prop,
        or fires <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">onChange</code> for
        standalone usage. See the{" "}
        <a href="/docs/guides/filtering" className="font-medium text-[var(--accent)] hover:underline">
          Filtering guide
        </a>{" "}
        for the full architecture.
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <ComponentExample
          code={`<SegmentToggle options={["Daily", "Weekly", "Monthly"]} />`}
        >
          <SegmentToggle options={["Daily", "Weekly", "Monthly"]} />
        </ComponentExample>
      </DocSection>

      {/* With Icons */}
      <DocSection id="with-icons" title="With Icons">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Each segment option can include an icon rendered before the label.
        </p>
        <ComponentExample
          code={`<SegmentToggle options={[
  { value: "activity", label: "Activity", icon: <Activity className="h-3.5 w-3.5" /> },
  { value: "trends", label: "Trends", icon: <TrendingUp className="h-3.5 w-3.5" /> },
  { value: "stats", label: "Stats", icon: <BarChart3 className="h-3.5 w-3.5" /> },
]} />`}
        >
          <SegmentToggle
            options={[
              { value: "activity", label: "Activity", icon: <Activity className="h-3.5 w-3.5" /> },
              { value: "trends", label: "Trends", icon: <TrendingUp className="h-3.5 w-3.5" /> },
              { value: "stats", label: "Stats", icon: <BarChart3 className="h-3.5 w-3.5" /> },
            ]}
          />
        </ComponentExample>
      </DocSection>

      {/* With Badge Counts */}
      <DocSection id="with-badges" title="With Badge Counts">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Show formatted badge counts on each segment. Numbers pass through the MetricUI format engine.
        </p>
        <ComponentExample
          code={`<SegmentToggle options={[
  { value: "active", label: "Active", badge: 1234 },
  { value: "inactive", label: "Inactive", badge: 56 },
  { value: "archived", label: "Archived", badge: 8 },
]} />`}
        >
          <SegmentToggle
            options={[
              { value: "active", label: "Active", badge: 1234 },
              { value: "inactive", label: "Inactive", badge: 56 },
              { value: "archived", label: "Archived", badge: 8 },
            ]}
          />
        </ComponentExample>
      </DocSection>

      {/* Multi-Select Mode */}
      <DocSection id="multi-select" title="Multi-Select Mode">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Enable <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">multiple</code> to
          allow selecting more than one segment. At least one segment always stays selected.
        </p>
        <ComponentExample
          code={`<SegmentToggle
  options={["Frontend", "Backend", "Mobile", "DevOps"]}
  multiple
  defaultValue={["Frontend", "Backend"]}
/>`}
        >
          <SegmentToggle
            options={["Frontend", "Backend", "Mobile", "DevOps"]}
            multiple
            defaultValue={["Frontend", "Backend"]}
          />
        </ComponentExample>
      </DocSection>

      {/* Size Variants */}
      <DocSection id="sizes" title="Size Variants">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Three sizes: <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">sm</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">md</code> (default),{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">lg</code>.
        </p>
        <div className="space-y-4">
          {(["sm", "md", "lg"] as const).map((s) => (
            <div key={s}>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">{s}</p>
              <SegmentToggle options={["Daily", "Weekly", "Monthly"]} size={s} />
            </div>
          ))}
        </div>
        <CodeBlock
          code={`<SegmentToggle options={["Daily", "Weekly", "Monthly"]} size="sm" />
<SegmentToggle options={["Daily", "Weekly", "Monthly"]} size="md" />
<SegmentToggle options={["Daily", "Weekly", "Monthly"]} size="lg" />`}
          className="mt-4"
        />
      </DocSection>

      {/* Full Width */}
      <DocSection id="full-width" title="Full Width">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">fullWidth</code> to
          stretch segments to fill the container.
        </p>
        <ComponentExample
          code={`<SegmentToggle options={["Daily", "Weekly", "Monthly"]} fullWidth />`}
        >
          <div className="w-full max-w-xl">
            <SegmentToggle options={["Daily", "Weekly", "Monthly"]} fullWidth />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Vertical */}
      <DocSection id="vertical" title="Vertical Orientation">
        <ComponentExample
          code={`<SegmentToggle
  options={["Overview", "Details", "Settings"]}
  orientation="vertical"
/>`}
        >
          <SegmentToggle
            options={["Overview", "Details", "Settings"]}
            orientation="vertical"
          />
        </ComponentExample>
      </DocSection>

      {/* Color-Coded */}
      <DocSection id="color-coded" title="Color-Coded Segments">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Each segment can have its own color accent when active.
        </p>
        <ComponentExample
          code={`<SegmentToggle options={[
  { value: "success", label: "Healthy", color: "#10B981" },
  { value: "warning", label: "Warning", color: "#F59E0B" },
  { value: "error", label: "Critical", color: "#EF4444" },
]} />`}
        >
          <SegmentToggle
            options={[
              { value: "success", label: "Healthy", color: "#10B981" },
              { value: "warning", label: "Warning", color: "#F59E0B" },
              { value: "error", label: "Critical", color: "#EF4444" },
            ]}
          />
        </ComponentExample>
      </DocSection>

      {/* Connected (FilterProvider) */}
      <DocSection id="connected" title="Connected (FilterProvider)">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          When you set the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">field</code> prop,
          SegmentToggle reads and writes to FilterContext dimensions. Any component can read the active value via{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useMetricFilters().dimensions[field]</code>.
        </p>
        <ComponentExample
          code={`import { FilterProvider, useMetricFilters, SegmentToggle } from "metricui";

function Dashboard() {
  return (
    <FilterProvider>
      <SegmentToggle options={["Overview", "Details", "Logs"]} field="view" />
      <MyContent />
    </FilterProvider>
  );
}

function MyContent() {
  const filters = useMetricFilters();
  const view = filters?.dimensions?.view ?? [];
  // Render content based on active segment
  return <div>Active: {view.join(", ")}</div>;
}`}
        >
          <FilterProvider>
            <ConnectedInner />
          </FilterProvider>
        </ComponentExample>
      </DocSection>

      {/* Interactive Controls */}
      <DocSection id="interactive" title="Interactive Controls">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Experiment with size, multiple, fullWidth, and orientation.
        </p>
        <InteractivePlayground />
      </DocSection>

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
