"use client";

import { useState } from "react";
import { SegmentToggle } from "@/components/filters/SegmentToggle";
import type { SegmentOption } from "@/components/filters/SegmentToggle";
import { FilterProvider, useMetricFilters } from "@/lib/FilterContext";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";
import { Activity, TrendingUp, BarChart3, Zap, Users, Bot } from "lucide-react";

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
  { id: "related", title: "Related", level: 2 },
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
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        {/* Hero */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
            Filters
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)]">
            SegmentToggle
          </h1>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--muted)]">
            A pill-style toggle for switching between segments. Supports single and multi-select,
            icons, badge counts, color-coded segments, and FilterContext integration.
          </p>
        </div>

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

        {/* Props Table */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "options", type: "SegmentOption[] | string[]", default: "(required)", description: "Segment options. Pass string[] as shorthand." },
              { prop: "value", type: "string | string[]", default: "\u2014", description: "Controlled active segment(s)." },
              { prop: "defaultValue", type: "string | string[]", default: "first option", description: "Default value for uncontrolled mode." },
              { prop: "onChange", type: "(value) => void", default: "\u2014", description: "Change handler. Receives string (single) or string[] (multiple)." },
              { prop: "multiple", type: "boolean", default: "false", description: "Allow multiple selections." },
              { prop: "field", type: "string", default: "\u2014", description: "FilterContext field name. Reads/writes to dimensions." },
              { prop: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout orientation." },
              { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size variant." },
              { prop: "fullWidth", type: "boolean", default: "false", description: "Stretch to fill container." },
              { prop: "dense", type: "boolean", default: "false", description: "Compact mode. Falls back to MetricProvider." },
              { prop: "className", type: "string", default: "\u2014", description: "Additional CSS classes." },
              { prop: "classNames", type: "{ root?, option?, indicator?, badge? }", default: "\u2014", description: "Sub-element class overrides." },
              { prop: "id", type: "string", default: "\u2014", description: "HTML id." },
              { prop: "data-testid", type: "string", default: "\u2014", description: "Test id." },
            ]}
            columns={[
              { key: "prop", header: "Prop", render: (v) => <code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{String(v)}</code> },
              { key: "type", header: "Type", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
              { key: "default", header: "Default", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
              { key: "description", header: "Description" },
            ]}
            dense
            variant="ghost"
          />
        </DocSection>

        {/* Notes */}
        <DocSection id="notes" title="Notes">
          <ul className="space-y-2">
            {[
              "SegmentToggle is UI only \u2014 it captures the user\u2019s selection and exposes it via context or onChange, but never filters your data.",
              "Without a FilterProvider, SegmentToggle still works via onChange. Context is optional.",
              "In single-select mode, a sliding indicator animates between segments using the unified motion system.",
              "In multi-select mode, at least one segment must always be selected \u2014 clicking the last active segment keeps it selected.",
              "Badge counts are formatted through the MetricUI format engine (compact by default).",
              "SegmentToggle uses forwardRef and passes through id, data-testid, className, and classNames.",
              "Dense mode can be set per-component or inherited from MetricProvider.",
            ].map((note, i) => (
              <li
                key={i}
                className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                {note}
              </li>
            ))}
          </ul>
        </DocSection>

        {/* Related */}
        <DocSection id="related" title="Related">
          <ul className="space-y-2">
            {[
              { name: "PeriodSelector", desc: "Date-range picker with presets and comparison toggle." },
              { name: "FilterProvider", desc: "Context provider that holds the active filter state. Wrap your dashboard in this." },
              { name: "useMetricFilters()", desc: "Hook to read the active period, comparison, and dimension filters from the nearest FilterProvider." },
              { name: "MetricProvider", desc: "Global config. SegmentToggle inherits dense mode from here." },
            ].map((item) => (
              <li key={item.name} className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                <span>
                  <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">{item.name}</code>
                  {" \u2014 "}{item.desc}
                </span>
              </li>
            ))}
          </ul>
        </DocSection>
      </div>

      {/* Right: On This Page */}
      <div className="hidden w-48 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
