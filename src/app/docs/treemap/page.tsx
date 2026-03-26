"use client";

import { Treemap } from "@/components/charts/Treemap";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "custom-tiling", title: "Custom Tiling", level: 2 },
  { id: "flat-rows", title: "Flat Row Mode", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
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
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
            <a href="/docs" className="hover:text-[var(--foreground)]">Docs</a>
            <span>/</span>
            <span>Treemap</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Treemap</h1>
          <p className="mt-2 text-[14px] text-[var(--muted)]">
            Display hierarchical data as nested rectangles. Each tile&apos;s area is proportional to
            its value, making it easy to spot the largest contributors at a glance.
          </p>
        </div>

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
          <DataTable
            data={[
              { prop: "data", type: "TreemapDatum | DataRow[]", default: "—", description: "Hierarchical { name, value?, children? } or flat rows with index + value." },
              { prop: "index", type: "string", default: "—", description: "Category field name for flat DataRow[] input." },
              { prop: "value", type: "string", default: "—", description: "Value field name for flat DataRow[] input." },
              { prop: "title", type: "string", default: "—", description: "Card title." },
              { prop: "height", type: "number", default: "300", description: "Chart height in px." },
              { prop: "colors", type: "string[]", default: "theme palette", description: "Tile colors." },
              { prop: "format", type: "FormatOption", default: "—", description: "Format for value labels and tooltips." },
              { prop: "tile", type: '"squarify" | "binary" | "slice" | "dice" | "sliceDice"', default: '"squarify"', description: "Tiling algorithm." },
              { prop: "innerPadding", type: "number", default: "2", description: "Padding between sibling tiles (px)." },
              { prop: "outerPadding", type: "number", default: "4", description: "Padding around the root (px)." },
              { prop: "labelSkipSize", type: "number", default: "24", description: "Skip labels on tiles smaller than this (px)." },
              { prop: "animate", type: "boolean", default: "true", description: "Enable/disable animation." },
              { prop: "crossFilter", type: "boolean | { field? }", default: "—", description: "Enable cross-filtering on tile click." },
              { prop: "drillDown", type: "true | function", default: "—", description: "true for auto table, or custom render function." },
            ]}
            columns={[
              { key: "prop", header: "Prop", render: (v) => <code className="font-[family-name:var(--font-mono)] font-semibold text-[var(--accent)]">{String(v)}</code> },
              { key: "type", header: "Type", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
              { key: "default", header: "Default", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--muted)]">{String(v)}</code> },
              { key: "description", header: "Description" },
            ]}
            dense
            variant="ghost"
          />
        </DocSection>

        {/* Notes */}
        <DocSection id="notes" title="Notes">
          <ul className="space-y-2">
            {[
              "Hierarchical mode: pass a single root object with name and children. Leaf nodes must have a value.",
              "Flat mode: pass DataRow[] with index (label column) and value (numeric column). Auto-wrapped in a root node.",
              "The squarify algorithm (default) produces the most balanced aspect ratios. Use binary for more structured layouts.",
              "Labels are automatically hidden on tiles smaller than labelSkipSize (default 24px).",
              "Built on @nivo/treemap — all Nivo theming and tooltip conventions apply.",
            ].map((note, i) => (
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

        {/* Related */}
        <DocSection id="related" title="Related">
          <ul className="flex flex-wrap gap-2">
            {["DonutChart", "BarChart", "Funnel", "Sankey"].map((name) => (
              <li key={name}>
                <a
                  href={`/docs/${name.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "")}`}
                  className="inline-block rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
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
