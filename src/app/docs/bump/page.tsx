"use client";

import { Bump } from "@/components/charts/Bump";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

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
    <DocPageLayout tocItems={tocItems}>
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

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
