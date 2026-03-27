"use client";

import { ScatterPlot } from "@/components/charts/ScatterPlot";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

const component = getComponent("scatter-plot")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "node-sizing", title: "Node Sizing", level: 2 },
  { id: "multiple-series", title: "Multiple Series", level: 2 },
  { id: "reference-lines", title: "Reference Lines", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const accountData = [
  { account: "Acme Corp", mrr: 12400, seats: 45 },
  { account: "Globex Inc", mrr: 8200, seats: 68 },
  { account: "Initech", mrr: 15600, seats: 22 },
  { account: "Umbrella Ltd", mrr: 6800, seats: 18 },
  { account: "Stark Industries", mrr: 22100, seats: 55 },
  { account: "Wayne Enterprises", mrr: 18400, seats: 120 },
  { account: "Cyberdyne", mrr: 28500, seats: 32 },
  { account: "Oscorp", mrr: 11200, seats: 41 },
  { account: "LexCorp", mrr: 4800, seats: 85 },
  { account: "Wonka Inc", mrr: 7300, seats: 12 },
  { account: "Dunder Mifflin", mrr: 5400, seats: 35 },
  { account: "Pied Piper", mrr: 19800, seats: 28 },
  { account: "Hooli", mrr: 14600, seats: 110 },
  { account: "Prestige Worldwide", mrr: 3200, seats: 8 },
  { account: "Sterling Cooper", mrr: 16700, seats: 48 },
  { account: "Bluth Co", mrr: 2100, seats: 52 },
  { account: "Massive Dynamic", mrr: 31200, seats: 42 },
];

const multiSeriesData = [
  { id: "Enterprise", data: [
    { x: 120, y: 22000 }, { x: 95, y: 18400 }, { x: 74, y: 15600 },
    { x: 62, y: 12400 }, { x: 110, y: 24600 },
  ]},
  { id: "Mid-Market", data: [
    { x: 45, y: 8200 }, { x: 38, y: 7300 }, { x: 32, y: 6800 },
    { x: 28, y: 5400 }, { x: 41, y: 9500 },
  ]},
  { id: "SMB", data: [
    { x: 15, y: 3200 }, { x: 18, y: 4100 }, { x: 12, y: 2800 },
    { x: 22, y: 5100 }, { x: 8, y: 1900 },
  ]},
];

export default function ScatterPlotDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use ScatterPlot to explore correlations — MRR vs seats, revenue vs headcount, spend vs
          conversion rate. Supports multiple series, node sizing, reference lines, cross-filtering,
          and drill-down. For categorical comparison use{" "}
          <a href="/docs/bar-chart" className="font-medium text-[var(--accent)] hover:underline">
            BarChart
          </a>
          ; for time-series trends use{" "}
          <a href="/docs/line-chart" className="font-medium text-[var(--accent)] hover:underline">
            LineChart
          </a>.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<ScatterPlot
  data={accountData}
  index="mrr"
  categories={["seats"]}
  title="MRR vs Seats"
  xFormat="currency"
  yFormat="number"
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <ScatterPlot
                data={accountData}
                index="mrr"
                categories={["seats"]}
                title="MRR vs Seats"
                xFormat="currency"
                yFormat="number"
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Node Sizing */}
        <DocSection id="node-sizing" title="Node Sizing">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Use the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">nodeSize</code> prop
            to control dot size in pixels.
          </p>
          <ComponentExample
            code={`<ScatterPlot
  data={accountData}
  index="mrr"
  categories={["seats"]}
  title="Large Nodes"
  nodeSize={14}
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <ScatterPlot
                data={accountData}
                index="mrr"
                categories={["seats"]}
                title="Large Nodes"
                nodeSize={14}
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Multiple Series */}
        <DocSection id="multiple-series" title="Multiple Series">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass Nivo-native series data with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">id</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">data</code> arrays to
            render multiple colored series with a legend.
          </p>
          <ComponentExample
            code={`<ScatterPlot
  data={[
    { id: "Enterprise", data: [{ x: 120, y: 22000 }, ...] },
    { id: "Mid-Market", data: [{ x: 45, y: 8200 }, ...] },
    { id: "SMB", data: [{ x: 15, y: 3200 }, ...] },
  ]}
  title="Accounts by Segment"
  xFormat="number"
  yFormat="currency"
  height={350}
/>`}
          >
            <div className="w-full max-w-2xl">
              <ScatterPlot
                data={multiSeriesData}
                title="Accounts by Segment"
                xFormat="number"
                yFormat="currency"
                height={350}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Reference Lines */}
        <DocSection id="reference-lines" title="Reference Lines">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Add horizontal or vertical reference lines for targets or thresholds.
          </p>
          <ComponentExample
            code={`<ScatterPlot
  data={accountData}
  index="mrr"
  categories={["seats"]}
  title="MRR vs Seats — with Target"
  xFormat="currency"
  height={300}
  referenceLines={[
    { axis: "x", value: 15000, label: "Target MRR", color: "#EF4444", style: "dashed" },
  ]}
/>`}
          >
            <div className="w-full max-w-2xl">
              <ScatterPlot
                data={accountData}
                index="mrr"
                categories={["seats"]}
                title="MRR vs Seats — with Target"
                xFormat="currency"
                height={300}
                referenceLines={[
                  { axis: "x", value: 15000, label: "Target MRR", color: "#EF4444", style: "dashed" },
                ]}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Props */}
        <DocSection id="props" title="Props">
          <PropsTable props={component.props} />
        </DocSection>

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
            <li className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">aiContext</code> prop (inherited from BaseComponentProps) adds business context for AI-powered insights. Pass a string describing what this component shows.
            </li>
          </ul>
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
