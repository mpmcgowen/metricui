"use client";

import { useState, useEffect } from "react";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { BarChart } from "@/components/charts/BarChart";
import { AreaChart } from "@/components/charts/AreaChart";
import { KpiCard } from "@/components/cards/KpiCard";
import { MetricGrid } from "@/components/layout/MetricGrid";
import { LinkedHoverProvider } from "@/lib/LinkedHoverContext";
import { useValueFlash } from "@/lib/useValueFlash";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "linked-hover", title: "Linked Hover", level: 2 },
  { id: "linked-hover-demo", title: "Demo", level: 3 },
  { id: "linked-hover-setup", title: "Setup", level: 3 },
  { id: "linked-hover-reading", title: "Reading State", level: 3 },
  { id: "value-flash", title: "Value Flash", level: 2 },
  { id: "value-flash-demo", title: "Demo", level: 3 },
  { id: "value-flash-usage", title: "Usage", level: 3 },
  { id: "value-flash-options", title: "Options", level: 3 },
  { id: "combining", title: "Combining Both", level: 2 },
];

// ── Demo Data ─────────────────────────────────────────────────────

const monthlyData = [
  { month: "Jan", revenue: 18200, orders: 412, conversion: 3.2 },
  { month: "Feb", revenue: 21400, orders: 487, conversion: 3.5 },
  { month: "Mar", revenue: 19800, orders: 453, conversion: 3.1 },
  { month: "Apr", revenue: 24100, orders: 521, conversion: 3.8 },
  { month: "May", revenue: 27600, orders: 589, conversion: 4.1 },
  { month: "Jun", revenue: 31200, orders: 634, conversion: 4.4 },
];

// ── Value Flash Demo ──────────────────────────────────────────────

function ValueFlashDemo() {
  const [revenue, setRevenue] = useState(128400);
  const [customers, setCustomers] = useState(3842);
  const flashRevenue = useValueFlash(revenue);
  const flashCustomers = useValueFlash(customers);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue((prev) => prev + Math.floor(Math.random() * 2000 - 500));
      setCustomers((prev) => prev + Math.floor(Math.random() * 20 - 5));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <MetricGrid>
      <div className={flashRevenue}>
        <KpiCard title="Revenue" value={revenue} format="currency" />
      </div>
      <div className={flashCustomers}>
        <KpiCard title="Customers" value={customers} format="compact" />
      </div>
    </MetricGrid>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default function InteractionsGuide() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-3xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Guide
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
          Interactions
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Visual coordination between dashboard components. Linked hover syncs
          crosshairs across charts. Value flash highlights data changes in real time.
          For click-based filtering, see{" "}
          <a href="/docs/guides/filtering#cross-filtering" className="font-medium text-[var(--accent)] hover:underline">
            Cross-Filtering
          </a>{" "}
          in the Filtering guide.
        </p>

        <DocSection id="overview" title="Overview">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI provides two visual interaction primitives, each opt-in and independent:
          </p>
          <DataTable
            data={[
              { feature: "Linked Hover", description: "Hover a data point → crosshairs sync across all charts", trigger: "Hover" },
              { feature: "Value Flash", description: "Data changes → brief highlight animation on the value", trigger: "Data update" },
            ]}
            columns={[
              { key: "feature", header: "Feature", render: (v) => <span className="font-semibold text-[var(--foreground)]">{String(v)}</span> },
              { key: "description", header: "What It Does" },
              { key: "trigger", header: "Trigger", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
            ]}
            dense
            variant="ghost"
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Both are purely visual — they coordinate what users see across components
            without touching your data. Wrap in a Provider, and the components handle the rest.
          </p>
        </DocSection>

        {/* ── Linked Hover ───────────────────────────────────────────── */}

        <DocSection id="linked-hover" title="Linked Hover">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Linked hover syncs hover state across all charts in a provider. Hover over
            &ldquo;March&rdquo; in an area chart, and the bar chart, line chart, and any other
            sibling highlights March too — synced crosshairs, synced tooltips, synced emphasis.
          </p>
        </DocSection>

        <DocSection id="linked-hover-demo" title="Try It" level={3}>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Hover over any chart — the other follows your cursor.
          </p>
          <ComponentExample
            code={`<LinkedHoverProvider>
  <AreaChart
    title="Revenue"
    data={monthlyData}
    index="month"
    categories={[{ key: "revenue", format: "currency" }]}
  />
  <BarChart
    title="Orders"
    data={monthlyData}
    index="month"
    categories={["orders"]}
  />
</LinkedHoverProvider>`}
          >
            <LinkedHoverProvider>
              <MetricGrid>
                <AreaChart
                  title="Revenue"
                  data={monthlyData}
                  index="month"
                  categories={[{ key: "revenue", format: "currency" }]}
                  height={240}
                />
                <BarChart
                  title="Orders"
                  data={monthlyData}
                  index="month"
                  categories={["orders"]}
                  height={240}
                />
              </MetricGrid>
            </LinkedHoverProvider>
          </ComponentExample>
        </DocSection>

        <DocSection id="linked-hover-setup" title="Setup" level={3}>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Wrap in{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">LinkedHoverProvider</code>.
            Charts inside it automatically participate — no extra prop needed:
          </p>
          <CodeBlock
            code={`import {
  LinkedHoverProvider,
  AreaChart,
  BarChart,
  LineChart,
} from "metricui";

function Dashboard() {
  return (
    <LinkedHoverProvider>
      <AreaChart
        title="Revenue"
        data={data}
        index="month"
        categories={["revenue"]}
      />
      <BarChart
        title="Orders"
        data={data}
        index="month"
        categories={["orders"]}
      />
    </LinkedHoverProvider>
  );
}`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Hover over any chart and the others follow. The charts share the same{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">index</code> values
            (&ldquo;Jan&rdquo;, &ldquo;Feb&rdquo;, etc.), so linked hover matches by index.
          </p>
        </DocSection>

        <DocSection id="linked-hover-reading" title="Reading Hover State" level={3}>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Use{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useLinkedHover()</code> to
            read hover state in custom components:
          </p>
          <CodeBlock
            code={`import { useLinkedHover } from "metricui";

function HoverDebug() {
  const lh = useLinkedHover();

  if (!lh?.hoveredIndex) return null;

  return (
    <div>
      Hovering: {lh.hoveredIndex}
      {lh.hoveredSeries && <> / Series: {lh.hoveredSeries}</>}
    </div>
  );
}`}
          />
          <DataTable
            data={[
              { prop: "hoveredIndex", type: "string | number | null", description: "The x-axis value being hovered (e.g. \"Mar\")" },
              { prop: "hoveredSeries", type: "string | null", description: "The series/category being hovered (e.g. \"revenue\")" },
              { prop: "sourceId", type: "string | undefined", description: "Which component emitted the hover event" },
              { prop: "setHoveredIndex", type: "(index, sourceId?) => void", description: "Programmatically set the hovered index" },
              { prop: "setHoveredSeries", type: "(seriesId, sourceId?) => void", description: "Programmatically set the hovered series" },
            ]}
            columns={[
              { key: "prop", header: "Property", render: (v) => <code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{String(v)}</code> },
              { key: "type", header: "Type", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
              { key: "description", header: "Description" },
            ]}
            dense
            variant="ghost"
          />
        </DocSection>

        {/* ── Value Flash ────────────────────────────────────────────── */}

        <DocSection id="value-flash" title="Value Flash">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            Value flash is a hook that adds a brief highlight animation when watched data changes.
            You choose which components flash and what data to watch — it&apos;s not automatic.
            Useful for real-time dashboards where individual values update via polling or websockets.
          </p>
        </DocSection>

        <DocSection id="value-flash-demo" title="Try It" level={3}>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            These KPI cards update every 2.5 seconds. Watch for the flash when values change.
          </p>
          <ComponentExample
            code={`function LiveKpi({ value, ...props }) {
  const flashClass = useValueFlash(value);
  return (
    <div className={flashClass}>
      <KpiCard value={value} {...props} />
    </div>
  );
}`}
          >
            <ValueFlashDemo />
          </ComponentExample>
        </DocSection>

        <DocSection id="value-flash-usage" title="Usage" level={3}>
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">useValueFlash</code> is
            a hook that returns a CSS class name. Apply it to the container you want to flash:
          </p>
          <CodeBlock
            code={`import { useValueFlash } from "metricui";

function LiveMetric({ value }: { value: number }) {
  const flashClass = useValueFlash(value);

  return (
    <div className={flashClass}>
      {value.toLocaleString()}
    </div>
  );
}`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The hook watches the value you pass. On the first render, nothing happens.
            When the value changes, it returns <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">&quot;mu-value-flash&quot;</code> for
            the duration of the animation, then reverts to an empty string.
          </p>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            It works with any data type — numbers, strings, arrays, objects. For complex values
            it uses deep comparison internally.
          </p>
        </DocSection>

        <DocSection id="value-flash-options" title="Options" level={3}>
          <CodeBlock
            code={`const flashClass = useValueFlash(value, {
  duration: 800,    // Flash duration in ms (default: 600)
  disabled: false,  // Disable flash entirely
});`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Value flash automatically respects:
          </p>
          <ul className="mt-2 space-y-1.5">
            {[
              "MetricProvider's animate setting — if animations are off, no flash",
              "prefers-reduced-motion — respects the user's OS preference",
              "First render — no flash on mount, only on subsequent changes",
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
                <span className="text-[var(--accent)]">•</span>
                {item}
              </li>
            ))}
          </ul>
        </DocSection>

        {/* ── Combining ──────────────────────────────────────────────── */}

        <DocSection id="combining" title="Combining Both">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The providers nest naturally. Linked hover and value flash work together:
          </p>
          <CodeBlock
            code={`import {
  MetricProvider,
  LinkedHoverProvider,
  MetricGrid,
  KpiCard,
  AreaChart,
  BarChart,
  useValueFlash,
} from "metricui";

function Dashboard({ data }) {
  return (
    <MetricProvider theme="indigo">
      <LinkedHoverProvider>
        <MetricGrid>
          {/* KPIs flash when data updates */}
          <LiveKpi title="Revenue" value={data.revenue} format="currency" />
          <LiveKpi title="Orders" value={data.orders} format="compact" />

          {/* Charts sync hover automatically */}
          <AreaChart
            title="Revenue Over Time"
            data={data.timeSeries}
            index="month"
            categories={["revenue"]}
          />
          <BarChart
            title="Orders by Month"
            data={data.timeSeries}
            index="month"
            categories={["orders"]}
          />
        </MetricGrid>
      </LinkedHoverProvider>
    </MetricProvider>
  );
}

function LiveKpi({ title, value, format }) {
  const flashClass = useValueFlash(value);
  return (
    <div className={flashClass}>
      <KpiCard title={title} value={value} format={format} />
    </div>
  );
}`}
          />
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Linked hover is visual coordination. Value flash is a CSS animation hook.
            For click-based filtering, see{" "}
            <a href="/docs/guides/filtering#cross-filtering" className="font-medium text-[var(--accent)] hover:underline">
              Cross-Filtering
            </a>{" "}
            in the Filtering guide.
          </p>
        </DocSection>
      </div>

      <div className="hidden w-40 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
