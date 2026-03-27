"use client";

import { Radar } from "@/components/charts/Radar";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

const component = getComponent("radar")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "multiple-series", title: "Multiple Series", level: 2 },
  { id: "custom-fill", title: "Custom Fill Opacity", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const singleTeamData = [
  { skill: "Frontend", score: 92 },
  { skill: "Backend", score: 78 },
  { skill: "DevOps", score: 65 },
  { skill: "Design", score: 84 },
  { skill: "Testing", score: 71 },
  { skill: "Documentation", score: 58 },
];

const multiTeamData = [
  { skill: "Frontend", alpha: 92, beta: 68, gamma: 75 },
  { skill: "Backend", alpha: 78, beta: 90, gamma: 82 },
  { skill: "DevOps", alpha: 65, beta: 85, gamma: 60 },
  { skill: "Design", alpha: 84, beta: 52, gamma: 70 },
  { skill: "Testing", alpha: 71, beta: 77, gamma: 88 },
  { skill: "Documentation", alpha: 58, beta: 62, gamma: 45 },
];

const productData = [
  { feature: "Performance", product: 88 },
  { feature: "Usability", product: 76 },
  { feature: "Reliability", product: 92 },
  { feature: "Security", product: 84 },
  { feature: "Scalability", product: 70 },
  { feature: "Cost Efficiency", product: 62 },
];

export default function RadarDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use Radar for multi-dimensional comparison — team skill profiles, product feature
        scores, competitive analysis. Works best with 5-8 dimensions and 1-3 series.
        For two-variable correlation, use{" "}
        <a href="/docs/scatter-plot" className="font-medium text-[var(--accent)] hover:underline">
          ScatterPlot
        </a>
        ; for ranked comparison, use{" "}
        <a href="/docs/bar-chart" className="font-medium text-[var(--accent)] hover:underline">
          BarChart
        </a>.
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <ComponentExample
          code={`<Radar
  data={[
    { skill: "Frontend", score: 92 },
    { skill: "Backend", score: 78 },
    { skill: "DevOps", score: 65 },
    { skill: "Design", score: 84 },
    { skill: "Testing", score: 71 },
    { skill: "Documentation", score: 58 },
  ]}
  index="skill"
  categories={["score"]}
  title="Team Skills Assessment"
  height={350}
/>`}
        >
          <div className="w-full max-w-lg">
            <Radar
              data={singleTeamData}
              index="skill"
              categories={["score"]}
              title="Team Skills Assessment"
              height={350}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Multiple Series */}
      <DocSection id="multiple-series" title="Multiple Series">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass multiple <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">categories</code> to
          overlay several series. A legend is shown automatically for multi-series data.
        </p>
        <ComponentExample
          code={`<Radar
  data={[
    { skill: "Frontend", alpha: 92, beta: 68, gamma: 75 },
    { skill: "Backend", alpha: 78, beta: 90, gamma: 82 },
    { skill: "DevOps", alpha: 65, beta: 85, gamma: 60 },
    { skill: "Design", alpha: 84, beta: 52, gamma: 70 },
    { skill: "Testing", alpha: 71, beta: 77, gamma: 88 },
    { skill: "Documentation", alpha: 58, beta: 62, gamma: 45 },
  ]}
  index="skill"
  categories={["alpha", "beta", "gamma"]}
  title="Team Comparison"
  height={380}
/>`}
        >
          <div className="w-full max-w-lg">
            <Radar
              data={multiTeamData}
              index="skill"
              categories={["alpha", "beta", "gamma"]}
              title="Team Comparison"
              height={380}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Custom Fill Opacity */}
      <DocSection id="custom-fill" title="Custom Fill Opacity">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Adjust <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">fillOpacity</code> and{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">borderWidth</code> to
          control the visual density. Lower opacity works better for overlapping series.
        </p>
        <ComponentExample
          code={`<Radar
  data={productData}
  index="feature"
  categories={["product"]}
  title="Product Feature Scores"
  fillOpacity={0.5}
  borderWidth={3}
  dotSize={8}
  gridLevels={4}
  height={350}
/>`}
        >
          <div className="w-full max-w-lg">
            <Radar
              data={productData}
              index="feature"
              categories={["product"]}
              title="Product Feature Scores"
              fillOpacity={0.5}
              borderWidth={3}
              dotSize={8}
              gridLevels={4}
              height={350}
            />
          </div>
        </ComponentExample>
      </DocSection>

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
