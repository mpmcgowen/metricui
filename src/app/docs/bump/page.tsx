"use client";

import { Bump } from "@/components/charts/Bump";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

const component = getComponent("bump")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "custom-line-width", title: "Custom Line Width", level: 2 },
  { id: "start-end-labels", title: "Start & End Labels", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const rankingData = [
  { quarter: "Q1", "Product A": 1, "Product B": 3, "Product C": 2, "Product D": 4 },
  { quarter: "Q2", "Product A": 2, "Product B": 1, "Product C": 3, "Product D": 4 },
  { quarter: "Q3", "Product A": 1, "Product B": 2, "Product C": 4, "Product D": 3 },
  { quarter: "Q4", "Product A": 3, "Product B": 1, "Product C": 2, "Product D": 4 },
];

export default function BumpDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use Bump for competitive rankings — product performance over quarters, team
          standings over sprints, feature adoption over releases. Supports flat-row mode
          (auto-ranking by value) and Nivo-native series format. For absolute value trends
          use{" "}
          <a href="/docs/line-chart" className="font-medium text-[var(--accent)] hover:underline">
            LineChart
          </a>
          ; for categorical comparison use{" "}
          <a href="/docs/bar-chart" className="font-medium text-[var(--accent)] hover:underline">
            BarChart
          </a>.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass flat rows with an <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">index</code> column
            and <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">categories</code> for
            each series. Values represent rank positions (1 = top).
          </p>
          <ComponentExample
            code={`<Bump
  data={[
    { quarter: "Q1", "Product A": 1, "Product B": 3, "Product C": 2, "Product D": 4 },
    { quarter: "Q2", "Product A": 2, "Product B": 1, "Product C": 3, "Product D": 4 },
    { quarter: "Q3", "Product A": 1, "Product B": 2, "Product C": 4, "Product D": 3 },
    { quarter: "Q4", "Product A": 3, "Product B": 1, "Product C": 2, "Product D": 4 },
  ]}
  index="quarter"
  categories={["Product A", "Product B", "Product C", "Product D"]}
  title="Product Rankings by Quarter"
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Bump
                data={rankingData}
                index="quarter"
                categories={["Product A", "Product B", "Product C", "Product D"]}
                title="Product Rankings by Quarter"
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Custom Line Width */}
        <DocSection id="custom-line-width" title="Custom Line Width">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Use the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">lineWidth</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">pointSize</code> props
            to control line thickness and dot size.
          </p>
          <ComponentExample
            code={`<Bump
  data={rankingData}
  index="quarter"
  categories={["Product A", "Product B", "Product C", "Product D"]}
  title="Thick Lines"
  lineWidth={5}
  pointSize={12}
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Bump
                data={rankingData}
                index="quarter"
                categories={["Product A", "Product B", "Product C", "Product D"]}
                title="Thick Lines"
                lineWidth={5}
                pointSize={12}
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Start & End Labels */}
        <DocSection id="start-end-labels" title="Start & End Labels">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Bump automatically displays start and end labels for each series, making it easy
            to identify lines without needing a separate legend. Labels are colored to match
            their series. Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">legend={"{false}"}</code> to
            rely solely on labels.
          </p>
          <ComponentExample
            code={`<Bump
  data={rankingData}
  index="quarter"
  categories={["Product A", "Product B", "Product C", "Product D"]}
  title="Rankings with Labels Only"
  legend={false}
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Bump
                data={rankingData}
                index="quarter"
                categories={["Product A", "Product B", "Product C", "Product D"]}
                title="Rankings with Labels Only"
                legend={false}
                height={300}
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
