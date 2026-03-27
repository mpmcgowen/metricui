"use client";

import { Treemap } from "@/components/charts/Treemap";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

const component = getComponent("treemap")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "custom-tiling", title: "Custom Tiling", level: 2 },
  { id: "flat-rows", title: "Flat Row Mode", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample data — hierarchical (native Nivo)
// ---------------------------------------------------------------------------

const budgetData = {
  name: "Company",
  children: [
    {
      name: "Engineering",
      children: [
        { name: "Frontend", value: 420000 },
        { name: "Backend", value: 380000 },
        { name: "Platform", value: 290000 },
        { name: "QA", value: 140000 },
      ],
    },
    {
      name: "Sales",
      children: [
        { name: "Enterprise", value: 310000 },
        { name: "Mid-Market", value: 240000 },
        { name: "SDR Team", value: 180000 },
      ],
    },
    {
      name: "Marketing",
      children: [
        { name: "Paid Ads", value: 260000 },
        { name: "Content", value: 120000 },
        { name: "Events", value: 95000 },
      ],
    },
    {
      name: "Operations",
      children: [
        { name: "HR", value: 190000 },
        { name: "Finance", value: 160000 },
        { name: "Legal", value: 110000 },
      ],
    },
  ],
};

const flatTrafficData = [
  { page: "/pricing", views: 48200 },
  { page: "/docs", views: 36100 },
  { page: "/blog", views: 28400 },
  { page: "/features", views: 22800 },
  { page: "/about", views: 14600 },
  { page: "/changelog", views: 11200 },
  { page: "/contact", views: 8900 },
  { page: "/careers", views: 6400 },
];

export default function TreemapDocs() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use Treemap for part-to-whole analysis of hierarchical data — budget breakdowns,
          disk usage, traffic by section. Supports hierarchical Nivo data or flat DataRow[]
          with automatic aggregation. For non-hierarchical part-to-whole, consider{" "}
          <a href="/docs/donut-chart" className="font-medium text-[var(--accent)] hover:underline">
            DonutChart
          </a>.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<Treemap
  data={{
    name: "Company",
    children: [
      { name: "Engineering", children: [
        { name: "Frontend", value: 420000 },
        { name: "Backend", value: 380000 },
        { name: "Platform", value: 290000 },
        { name: "QA", value: 140000 },
      ]},
      { name: "Sales", children: [
        { name: "Enterprise", value: 310000 },
        { name: "Mid-Market", value: 240000 },
        { name: "SDR Team", value: 180000 },
      ]},
      // ...
    ],
  }}
  title="Department Budget Breakdown"
  format="currency"
  height={350}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Treemap
                data={budgetData}
                title="Department Budget Breakdown"
                format="currency"
                height={350}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Custom Tiling */}
        <DocSection id="custom-tiling" title="Custom Tiling">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">tile</code> prop
            controls the layout algorithm. Options: <code className="font-[family-name:var(--font-mono)] text-[12px]">squarify</code> (default),{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">binary</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">slice</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">dice</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[12px]">sliceDice</code>.
          </p>
          <ComponentExample
            code={`<Treemap
  data={budgetData}
  title="Binary Tiling"
  tile="binary"
  format="currency"
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Treemap
                data={budgetData}
                title="Binary Tiling"
                tile="binary"
                format="currency"
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Flat Row Mode */}
        <DocSection id="flat-rows" title="Flat Row Mode">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass flat DataRow[] with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">index</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">value</code> props.
            The component wraps them in a single-level hierarchy automatically.
          </p>
          <ComponentExample
            code={`<Treemap
  data={[
    { page: "/pricing", views: 48200 },
    { page: "/docs", views: 36100 },
    { page: "/blog", views: 28400 },
    { page: "/features", views: 22800 },
    { page: "/about", views: 14600 },
    { page: "/changelog", views: 11200 },
    { page: "/contact", views: 8900 },
    { page: "/careers", views: 6400 },
  ]}
  index="page"
  value="views"
  title="Website Traffic by Page"
  format="number"
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Treemap
                data={flatTrafficData}
                index="page"
                value="views"
                title="Website Traffic by Page"
                format="number"
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

      <div className="hidden w-40 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
