import { DocSection } from "@/components/docs/DocSection";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

const tocItems: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "basic-usage", title: "Basic Usage", level: 2 },
  { id: "zero-config", title: "Zero-Config Mode", level: 2 },
  { id: "category-config", title: "CategoryConfig", level: 2 },
  { id: "swap-chart-type", title: "Swap Chart Types", level: 2 },
  { id: "bar-line", title: "BarLineChart Unified", level: 2 },
  { id: "supported", title: "Supported Charts", level: 2 },
  { id: "legacy", title: "Legacy Format", level: 2 },
];

export default function DataFormatGuide() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-3xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Guide
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
          Data Format
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          MetricUI charts accept a simple, flat data format. Pass an array of rows
          with an <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">index</code> column
          and <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">categories</code> — the
          same data works across every chart type.
        </p>

        <DocSection id="overview" title="Overview">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Most charting libraries require you to reshape your data for each chart type —
            series arrays for line charts, keyed objects for bar charts, id/value pairs for
            donuts. MetricUI lets you pass the same flat rows to any chart. Just tell it which
            column is the index (x-axis) and which columns are the categories (series).
          </p>
        </DocSection>

        <DocSection id="basic-usage" title="Basic Usage">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass flat row data with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">index</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">categories</code>:
          </p>
          <CodeBlock
            code={`const data = [
  { month: "Jan", revenue: 4200, costs: 2100 },
  { month: "Feb", revenue: 5100, costs: 2400 },
  { month: "Mar", revenue: 4800, costs: 2200 },
  { month: "Apr", revenue: 6200, costs: 2800 },
];

// Same data, any chart
<AreaChart data={data} index="month" categories={["revenue", "costs"]} />
<BarChart  data={data} index="month" categories={["revenue", "costs"]} />
<LineChart data={data} index="month" categories={["revenue", "costs"]} />`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            <code className="font-[family-name:var(--font-mono)] text-[13px]">index</code> is
            the column used for the x-axis (or slice labels in a donut).{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px]">categories</code> are
            the numeric columns to plot as series.
          </p>
        </DocSection>

        <DocSection id="zero-config" title="Zero-Config Mode">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Omit both <code className="font-[family-name:var(--font-mono)] text-[13px]">index</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px]">categories</code> entirely.
            MetricUI auto-infers the schema from your data: the first string column becomes
            the index, all number columns become categories.
          </p>
          <CodeBlock
            code={`const data = [
  { month: "Jan", revenue: 4200, costs: 2100 },
  { month: "Feb", revenue: 5100, costs: 2400 },
];

// Zero config — "month" is auto-detected as index,
// "revenue" and "costs" as categories
<BarChart data={data} title="Monthly Breakdown" format="currency" />`}
          />
        </DocSection>

        <DocSection id="category-config" title="CategoryConfig">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Categories can be plain strings or rich config objects. Mix and match:
          </p>
          <CodeBlock
            code={`import type { Category } from "metricui";

// Plain strings
categories={["revenue", "costs"]}

// Rich config — per-category labels, formats, colors, axis
categories={[
  { key: "revenue", label: "Revenue", format: "currency", color: "#6366F1" },
  { key: "margin", label: "Margin %", format: "percent", axis: "right" },
]}

// Mixed
categories={[
  "revenue",
  { key: "margin", format: "percent", axis: "right" },
]}`}
          />
          <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--card-border)]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Field</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Type</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Description</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {[
                  ["key", "string", "Column key in the data row (required)"],
                  ["label", "string", "Display label — defaults to key"],
                  ["format", "FormatOption", "Format for this category's values"],
                  ["color", "string", "Override color for this series"],
                  ["axis", '"left" | "right"', "Assign to right Y-axis (BarLineChart, dual-axis)"],
                ].map(([field, type, desc]) => (
                  <tr key={field} className="border-b border-[var(--card-border)] last:border-0">
                    <td className="px-4 py-2.5"><code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{field}</code></td>
                    <td className="px-4 py-2.5"><code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{type}</code></td>
                    <td className="px-4 py-2.5 text-[var(--foreground)]">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>

        <DocSection id="swap-chart-type" title="Swap Chart Types">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The unified format means you can change visualization without changing data.
            This is the whole point — one data shape, any chart:
          </p>
          <CodeBlock
            code={`const data = [
  { browser: "Chrome", share: 65 },
  { browser: "Safari", share: 19 },
  { browser: "Firefox", share: 10 },
  { browser: "Edge", share: 6 },
];

// Bar chart
<BarChart data={data} index="browser" categories={["share"]} />

// Donut chart — same data, same props
<DonutChart data={data} index="browser" categories={["share"]} />

// HeatMap — same shape works here too
<HeatMap data={data} index="browser" categories={["share"]} />`}
          />
        </DocSection>

        <DocSection id="bar-line" title="BarLineChart Unified">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            BarLineChart uses <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">axis: &quot;right&quot;</code> in
            CategoryConfig to split categories into bars (left axis) and lines (right axis).
            No separate <code className="font-[family-name:var(--font-mono)] text-[13px]">barData</code>/<code className="font-[family-name:var(--font-mono)] text-[13px]">lineData</code> needed:
          </p>
          <CodeBlock
            code={`const data = [
  { month: "Jan", revenue: 42000, margin: 0.32 },
  { month: "Feb", revenue: 51000, margin: 0.35 },
  { month: "Mar", revenue: 48000, margin: 0.31 },
];

<BarLineChart
  data={data}
  index="month"
  categories={[
    { key: "revenue", format: "currency" },
    { key: "margin", label: "Margin %", format: "percent", axis: "right" },
  ]}
  title="Revenue & Margin"
/>`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Categories without <code className="font-[family-name:var(--font-mono)] text-[13px]">axis: &quot;right&quot;</code> become
            bars on the left axis. Categories with <code className="font-[family-name:var(--font-mono)] text-[13px]">axis: &quot;right&quot;</code> become
            line series on the right axis.
          </p>
        </DocSection>

        <DocSection id="supported" title="Supported Charts">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The unified format works with charts that plot tabular, multi-series data:
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--card-border)]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Component</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Unified Format</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Notes</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {[
                  ["AreaChart", "Yes", "index → x-axis, categories → series"],
                  ["LineChart", "Yes", "Same as AreaChart (wrapper with fill disabled)"],
                  ["BarChart", "Yes", "index → category axis, categories → bar groups"],
                  ["BarLineChart", "Yes", "axis: \"right\" splits bars vs lines"],
                  ["DonutChart", "Yes", "index → slice labels, first category → values"],
                  ["HeatMap", "Yes", "index → row labels, categories → columns"],
                  ["Gauge", "No", "Single value — not tabular data"],
                  ["Funnel", "No", "Sequential stages — its own shape (id/label/value)"],
                  ["Waterfall", "No", "Sequential deltas — its own shape (label/value/type)"],
                  ["Sparkline", "No", "Flat number array — already minimal"],
                  ["BulletChart", "No", "Actual vs target vs ranges — specialized shape"],
                ].map(([comp, unified, notes]) => (
                  <tr key={comp} className="border-b border-[var(--card-border)] last:border-0">
                    <td className="px-4 py-2.5"><code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{comp}</code></td>
                    <td className="px-4 py-2.5 text-[var(--foreground)]">{unified}</td>
                    <td className="px-4 py-2.5 text-[var(--muted)]">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Charts that don&apos;t support the unified format have fundamentally different data
            shapes — they&apos;re not plotting rows of comparable series. Each has its own
            purpose-built data interface documented on its component page.
          </p>
        </DocSection>

        <DocSection id="legacy" title="Legacy Format">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The legacy format (series arrays, <code className="font-[family-name:var(--font-mono)] text-[13px]">keys</code>/<code className="font-[family-name:var(--font-mono)] text-[13px]">indexBy</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px]">barData</code>/<code className="font-[family-name:var(--font-mono)] text-[13px]">lineData</code>)
            still works and is fully backward compatible. When both are provided, the legacy
            format takes priority.
          </p>
          <CodeBlock
            code={`// Legacy format — still works
<AreaChart
  data={[
    { id: "revenue", data: [{ x: "Jan", y: 4200 }, { x: "Feb", y: 5100 }] },
  ]}
/>

// Unified format — same result, simpler
<AreaChart
  data={[{ month: "Jan", revenue: 4200 }, { month: "Feb", revenue: 5100 }]}
  index="month"
  categories={["revenue"]}
/>`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            We recommend the unified format for new code. It&apos;s simpler, portable across
            chart types, and supports per-category configuration via CategoryConfig.
          </p>
        </DocSection>
      </div>

      <div className="hidden w-48 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
