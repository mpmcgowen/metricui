"use client";

import { StatGroup } from "@/components/cards/StatGroup";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { StatGroupPlayground } from "@/components/docs/playgrounds/StatGroupPlayground";
import {
  DollarSign,
  Users,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";

const component = getComponent("stat-group")!;

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "comparisons", title: "Comparisons & Icons", level: 2 },
  { id: "layout", title: "Layout & Columns", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StatGroupDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        {/* When to use */}
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use StatGroup when you need to display multiple metrics in a compact row or grid.
          It&apos;s perfect for summary bars at the top of dashboards — showing key numbers
          with trend indicators at a glance. For a single prominent metric with sparklines
          and goals, use{" "}
          <a href="/docs/kpi-card" className="font-medium text-[var(--accent)] hover:underline">
            KpiCard
          </a>{" "}
          instead.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass an array of <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">stats</code> with{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">label</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">value</code>, and optional{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">format</code>.
            Columns auto-detect from the stat count.
          </p>
          <ComponentExample
            code={`<StatGroup
  stats={[
    { label: "Revenue", value: 142300, format: "currency" },
    { label: "Users", value: 12450, format: "number" },
    { label: "Conversion", value: 4.2, format: "percent" },
  ]}
/>`}
          >
            <div className="w-full">
              <StatGroup
                stats={[
                  { label: "Revenue", value: 142300, format: "currency" },
                  { label: "Users", value: 12450, format: "number" },
                  { label: "Conversion", value: 4.2, format: "percent" },
                ]}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Comparisons & Icons */}
        <DocSection id="comparisons" title="Comparisons & Icons">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Add <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">previousValue</code> to
            each stat item for auto-computed trend badges. Include{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">icon</code> for visual
            context. Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">invertTrend</code> for
            metrics where down is good (e.g. cost, churn).
          </p>
          <ComponentExample
            code={`<StatGroup
  title="This Week"
  stats={[
    { label: "Revenue", value: 142800, previousValue: 128400,
      format: "currency", icon: <DollarSign /> },
    { label: "Active Users", value: 3200, previousValue: 2710,
      format: "number", icon: <Users /> },
    { label: "Conversion", value: 4.2, previousValue: 3.4,
      format: "percent", icon: <MousePointerClick /> },
    { label: "Avg. Order", value: 84.6, previousValue: 78.2,
      format: "currency", icon: <TrendingUp /> },
  ]}
/>`}
          >
            <div className="w-full">
              <StatGroup
                title="This Week"
                stats={[
                  {
                    label: "Revenue",
                    value: 142800,
                    previousValue: 128400,
                    format: "currency",
                    icon: <DollarSign className="h-3 w-3" />,
                  },
                  {
                    label: "Active Users",
                    value: 3200,
                    previousValue: 2710,
                    format: "number",
                    icon: <Users className="h-3 w-3" />,
                  },
                  {
                    label: "Conversion",
                    value: 4.2,
                    previousValue: 3.4,
                    format: "percent",
                    icon: <MousePointerClick className="h-3 w-3" />,
                  },
                  {
                    label: "Avg. Order",
                    value: 84.6,
                    previousValue: 78.2,
                    format: "currency",
                    icon: <TrendingUp className="h-3 w-3" />,
                  },
                ]}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Layout & Columns */}
        <DocSection id="layout" title="Layout & Columns">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            By default, columns auto-detect from the stat count. Override with the{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">columns</code> prop.
            Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">dense</code> for
            a more compact layout, and <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">variant</code> to
            change the card style.
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Dense + Ghost variant (2 columns)</p>
              <StatGroup
                stats={[
                  { label: "Revenue", value: 142300, format: "currency" },
                  { label: "Users", value: 12450, format: "number" },
                  { label: "Conversion", value: 4.2, format: "percent" },
                  { label: "Avg. Order", value: 84.6, format: "currency" },
                ]}
                dense
                variant="ghost"
                columns={2}
              />
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Elevated variant (3 columns)</p>
              <StatGroup
                stats={[
                  { label: "Uptime", value: 99.97, format: "percent" },
                  { label: "Requests/sec", value: 1240, format: "number" },
                  { label: "Error Rate", value: 0.12, format: "percent" },
                ]}
                variant="elevated"
                columns={3}
              />
            </div>
          </div>
          <CodeBlock
            code={`// Dense + ghost variant with explicit columns
<StatGroup stats={stats} dense variant="ghost" columns={2} />

// Elevated variant
<StatGroup stats={stats} variant="elevated" columns={3} />`}
            className="mt-4"
          />
        </DocSection>

        {/* Data States */}
        <DocSection id="data-states" title="Data States">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            StatGroup supports loading state with skeleton placeholders. Also supports
            legacy <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">change</code> values
            and string values for pre-formatted data.
          </p>
          <div className="grid gap-4">
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Loading</p>
              <StatGroup
                stats={[
                  { label: "Revenue", value: 0 },
                  { label: "Users", value: 0 },
                  { label: "Conversion", value: 0 },
                ]}
                loading
              />
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Legacy format (string values + change)</p>
              <StatGroup
                stats={[
                  { label: "Pageviews", value: "1.2M", change: 14.2 },
                  { label: "Bounce Rate", value: "34.7%", change: -2.3 },
                  { label: "Avg. Session", value: "4m 32s", change: 8.1 },
                ]}
              />
            </div>
          </div>
          <CodeBlock
            code={`// Loading state
<StatGroup stats={stats} loading />

// Legacy format with string values and direct change percentages
<StatGroup stats={[
  { label: "Pageviews", value: "1.2M", change: 14.2 },
  { label: "Bounce Rate", value: "34.7%", change: -2.3 },
]} />`}
            className="mt-4"
          />
        </DocSection>

        {/* Props Table */}
        <DocSection id="props" title="Props">
          <PropsTable props={component.props} />
        </DocSection>

        {/* Data Shape */}
        {component.dataShape && (
          <DocSection id="data-shape" title="Data Shape">
            <CodeBlock code={component.dataShape} language="typescript" />
          </DocSection>
        )}

        {/* Notes */}
        <DocSection id="notes" title="Notes">
          <ul className="space-y-2">
            {component.notes.map((note, i) => (
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

        {/* Playground */}
        <DocSection id="playground" title="Playground">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Experiment with every prop interactively. Adjust the controls on the right to see the
            component update in real time.
          </p>
          <div className="rounded-xl border border-[var(--card-border)]">
            <StatGroupPlayground />
          </div>
        </DocSection>

        {/* Related Components */}
        <DocSection id="related" title="Related Components">
          <RelatedComponents names={component.relatedComponents} />
        </DocSection>
      </div>

      {/* Right: On This Page */}
      <div className="hidden w-40 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
