"use client";

import { Sparkline } from "@/components/charts/Sparkline";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

const component = getComponent("sparkline")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "bar-type", title: "Bar Type", level: 2 },
  { id: "reference-lines-bands", title: "Reference Lines & Bands", level: 2 },
  { id: "trend-coloring", title: "Trend Coloring", level: 2 },
  { id: "interactive-tooltips", title: "Interactive Tooltips", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

export default function SparklineDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use Sparkline when you need inline micro-charts inside cards, tables, or
        other tight spaces. It provides a compact trend visualization without axes
        or labels — ideal for showing direction and shape at a glance. For
        full-sized time-series charts with axes and legends, use{" "}
        <a href="/docs/line-chart" className="font-medium text-[var(--accent)] hover:underline">
          LineChart
        </a>{" "}
        or{" "}
        <a href="/docs/area-chart" className="font-medium text-[var(--accent)] hover:underline">
          AreaChart
        </a>{" "}
        instead.
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass an array of numbers to render a line sparkline. The component fills
          its container width and defaults to 40px tall.
        </p>
        <ComponentExample
          code={`<Sparkline
  data={[10, 15, 12, 18, 14, 22, 19]}
  trend="positive"
/>`}
        >
          <div className="w-full max-w-xs">
            <Sparkline
              data={[10, 15, 12, 18, 14, 22, 19]}
              trend="positive"
              height={40}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Bar Type */}
      <DocSection id="bar-type" title="Bar Type">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">type=&quot;bar&quot;</code> for
          a bar sparkline. Useful for discrete values like daily counts.
        </p>
        <ComponentExample
          code={`<Sparkline
  data={[4, 7, 3, 8, 5, 9, 6, 11, 8]}
  type="bar"
  color="#6366F1"
  height={40}
/>`}
        >
          <div className="w-full max-w-xs">
            <Sparkline
              data={[4, 7, 3, 8, 5, 9, 6, 11, 8]}
              type="bar"
              color="#6366F1"
              height={40}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Reference Lines & Bands */}
      <DocSection id="reference-lines-bands" title="Reference Lines & Bands">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Add a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">referenceLine</code> to
          mark a target or average, and a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">band</code> to
          shade a normal range. Both work with line and bar types.
        </p>
        <ComponentExample
          code={`<Sparkline
  data={[65, 72, 68, 80, 75, 82, 78, 90, 85]}
  trend="positive"
  height={48}
  referenceLine={{
    value: 75,
    label: "Avg",
    style: "dashed",
  }}
  band={{
    from: 70,
    to: 85,
    color: "#10B981",
    opacity: 0.08,
  }}
  interactive
  showEndpoints
/>`}
        >
          <div className="w-full max-w-xs">
            <Sparkline
              data={[65, 72, 68, 80, 75, 82, 78, 90, 85]}
              trend="positive"
              height={48}
              referenceLine={{
                value: 75,
                label: "Avg",
                style: "dashed",
              }}
              band={{
                from: 70,
                to: 85,
                color: "#10B981",
                opacity: 0.08,
              }}
              interactive
              showEndpoints
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Trend Coloring */}
      <DocSection id="trend-coloring" title="Trend Coloring">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Enable <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">trendColoring</code> to
          automatically color the line based on trend direction — green for positive,
          red for negative. Pass <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">&quot;invert&quot;</code> to
          flip the colors (useful when lower is better, like error rates).
        </p>
        <div className="flex flex-wrap gap-6">
          <ComponentExample
            code={`<Sparkline
  data={[20, 25, 28, 32, 38, 42]}
  trendColoring
  trend="positive"
  showEndpoints
/>`}
          >
            <div className="w-full max-w-xs">
              <Sparkline
                data={[20, 25, 28, 32, 38, 42]}
                trendColoring
                trend="positive"
                showEndpoints
                height={40}
              />
            </div>
          </ComponentExample>
          <ComponentExample
            code={`<Sparkline
  data={[45, 42, 38, 41, 35, 32]}
  trendColoring
  trend="negative"
  showEndpoints
/>`}
          >
            <div className="w-full max-w-xs">
              <Sparkline
                data={[45, 42, 38, 41, 35, 32]}
                trendColoring
                trend="negative"
                showEndpoints
                height={40}
              />
            </div>
          </ComponentExample>
        </div>
      </DocSection>

      {/* Interactive Tooltips */}
      <DocSection id="interactive-tooltips" title="Interactive Tooltips">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">interactive</code> to
          enable hover tooltips. Use the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">format</code> prop
          to control how values are displayed in the tooltip.
        </p>
        <ComponentExample
          code={`<Sparkline
  data={[1200, 1350, 1100, 1580, 1420, 1690, 1530]}
  trend="positive"
  interactive
  format="currency"
  height={48}
  showMinMax
/>`}
        >
          <div className="w-full max-w-xs">
            <Sparkline
              data={[1200, 1350, 1100, 1580, 1420, 1690, 1530]}
              trend="positive"
              interactive
              format="currency"
              height={48}
              showMinMax
            />
          </div>
        </ComponentExample>
      </DocSection>

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
