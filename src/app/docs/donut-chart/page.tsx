"use client";

import { DonutChart } from "@/components/charts/DonutChart";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DonutChartPlayground } from "@/components/docs/playgrounds/DonutChartPlayground";

const component = getComponent("donut-chart")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "center-content", title: "Center Content", level: 2 },
  { id: "labels", title: "Arc & Link Labels", level: 2 },
  { id: "half-donut", title: "Half Donut", level: 2 },
  { id: "simple-data", title: "Simple Data Format", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// Sample data
const trafficData = [
  { id: "organic", label: "Organic", value: 42 },
  { id: "direct", label: "Direct", value: 26 },
  { id: "referral", label: "Referral", value: 16 },
  { id: "social", label: "Social", value: 10 },
  { id: "email", label: "Email", value: 6 },
];

const browserData = [
  { id: "chrome", label: "Chrome", value: 63.5 },
  { id: "safari", label: "Safari", value: 19.8 },
  { id: "firefox", label: "Firefox", value: 7.2 },
  { id: "edge", label: "Edge", value: 5.1 },
  { id: "other", label: "Other", value: 4.4 },
];

export default function DonutChartDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        {/* When to use */}
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use DonutChart to show proportional data — how parts relate to a whole.
          It supports center content for summary values, arc labels, link labels,
          interactive legends, and configurable inner radius (set to 0 for a pie chart).
          For categorical comparison with absolute values, use{" "}
          <a href="/docs/bar-chart" className="font-medium text-[var(--accent)] hover:underline">
            BarChart
          </a>{" "}
          instead.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<DonutChart
  data={[
    { id: "organic", label: "Organic", value: 42 },
    { id: "direct", label: "Direct", value: 26 },
    { id: "referral", label: "Referral", value: 16 },
    { id: "social", label: "Social", value: 10 },
    { id: "email", label: "Email", value: 6 },
  ]}
  title="Traffic Sources"
/>`}
          >
            <div className="w-full max-w-2xl">
              <DonutChart
                data={trafficData}
                title="Traffic Sources"
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Center Content */}
        <DocSection id="center-content" title="Center Content">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">centerValue</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">centerLabel</code> for
            simple text, or <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">centerContent</code> for
            a fully custom React node.
          </p>
          <ComponentExample
            code={`<DonutChart
  data={browserData}
  title="Browser Share"
  centerValue="63.5%"
  centerLabel="Chrome"
  showPercentage
/>`}
          >
            <div className="w-full max-w-2xl">
              <DonutChart
                data={browserData}
                title="Browser Share"
                centerValue="63.5%"
                centerLabel="Chrome"
                showPercentage
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Arc & Link Labels */}
        <DocSection id="labels" title="Arc & Link Labels">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Enable <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">enableArcLabels</code> to
            show values directly on slices, or <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">enableArcLinkLabels</code> for
            lines connecting slices to external labels. Use <code className="font-[family-name:var(--font-mono)] text-[12px]">arcLabelsSkipAngle</code> to
            hide labels on small slices.
          </p>
          <ComponentExample
            code={`<DonutChart
  data={trafficData}
  title="Traffic Sources"
  enableArcLabels
  enableArcLinkLabels
  arcLabelsSkipAngle={15}
  arcLinkLabelsSkipAngle={15}
/>`}
          >
            <div className="w-full max-w-2xl">
              <DonutChart
                data={trafficData}
                title="Traffic Sources"
                enableArcLabels
                enableArcLinkLabels
                arcLabelsSkipAngle={15}
                arcLinkLabelsSkipAngle={15}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Half Donut */}
        <DocSection id="half-donut" title="Half Donut">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">startAngle</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">endAngle</code> to
            create a semi-circle or gauge-style visualization.
          </p>
          <ComponentExample
            code={`<DonutChart
  data={trafficData}
  startAngle={-90}
  endAngle={90}
  innerRadius={0.7}
  centerValue="42%"
  centerLabel="Organic"
  sortSlices="none"
  title="Traffic Distribution"
/>`}
          >
            <div className="w-full max-w-2xl">
              <DonutChart
                data={trafficData}
                startAngle={-90}
                endAngle={90}
                innerRadius={0.7}
                centerValue="42%"
                centerLabel="Organic"
                sortSlices="none"
                title="Traffic Distribution"
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Simple Data Format */}
        <DocSection id="simple-data" title="Simple Data Format">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            For quick prototyping, pass a plain key-value object via{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">simpleData</code> instead
            of the full <code className="font-[family-name:var(--font-mono)] text-[12px]">DonutDatum[]</code> array.
            It&apos;s converted internally.
          </p>
          <ComponentExample
            code={`<DonutChart
  simpleData={{
    Desktop: 60,
    Mobile: 35,
    Tablet: 5,
  }}
  title="Traffic by Device"
  centerValue="60%"
  centerLabel="Desktop"
/>`}
          >
            <div className="w-full max-w-2xl">
              <DonutChart
                data={[]}
                simpleData={{
                  Desktop: 60,
                  Mobile: 35,
                  Tablet: 5,
                }}
                title="Traffic by Device"
                centerValue="60%"
                centerLabel="Desktop"
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Data States */}
        <DocSection id="data-states" title="Data States">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Every component handles loading, empty, and error states.
            Pass individual props or use the grouped <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">state</code> prop.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Loading</p>
              <DonutChart
                data={[]}
                title="Traffic Sources"
                loading
              />
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Error</p>
              <DonutChart
                data={[]}
                title="Traffic Sources"
                error={{ message: "Failed to load data" }}
              />
            </div>
          </div>
          <CodeBlock
            code={`// Loading state
<DonutChart data={[]} title="Traffic" loading />

// Error state
<DonutChart data={[]} title="Traffic" error={{ message: "Failed to load" }} />`}
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
            <li className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">aiContext</code> prop (inherited from BaseComponentProps) adds business context for AI Insights analysis. See the <a href="/docs/ai-insights" className="font-medium text-[var(--accent)] hover:underline">AI Insights guide</a> for details.
            </li>
            <li className="flex gap-2 text-[14px] leading-relaxed text-[var(--muted)]">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              {"When passing flat rows without "}
              <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">index</code>
              {" and "}
              <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">categories</code>
              {", DonutChart auto-infers the label column (first string) and value column (first number). A dev warning fires in development. Pass explicit "}
              <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">index</code>
              {" and "}
              <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">categories</code>
              {" to suppress it."}
            </li>
          </ul>
        </DocSection>

        {/* Playground */}
        <DocSection id="playground" title="Playground">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Experiment with every prop interactively. Adjust the controls on the right to see the
            component update in real time.
          </p>
          <div className="rounded-xl border border-[var(--card-border)]">
            <DonutChartPlayground />
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
