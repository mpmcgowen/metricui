"use client";

import { Sankey } from "@/components/charts/Sankey";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "custom-nodes", title: "Custom Node Colors", level: 2 },
  { id: "link-opacity", title: "Link Opacity", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample data — traffic flow
// ---------------------------------------------------------------------------

const trafficFlow = {
  nodes: [
    { id: "Organic Search" },
    { id: "Paid Ads" },
    { id: "Social Media" },
    { id: "Direct" },
    { id: "Referral" },
    { id: "Landing Page" },
    { id: "Pricing Page" },
    { id: "Blog" },
    { id: "Docs" },
    { id: "Signup" },
    { id: "Demo Request" },
    { id: "Bounce" },
  ],
  links: [
    { source: "Organic Search", target: "Landing Page", value: 4200 },
    { source: "Organic Search", target: "Blog", value: 2800 },
    { source: "Organic Search", target: "Docs", value: 1600 },
    { source: "Paid Ads", target: "Landing Page", value: 3100 },
    { source: "Paid Ads", target: "Pricing Page", value: 1900 },
    { source: "Social Media", target: "Blog", value: 1400 },
    { source: "Social Media", target: "Landing Page", value: 800 },
    { source: "Direct", target: "Pricing Page", value: 2200 },
    { source: "Direct", target: "Docs", value: 1100 },
    { source: "Referral", target: "Landing Page", value: 900 },
    { source: "Referral", target: "Blog", value: 600 },
    { source: "Landing Page", target: "Signup", value: 3800 },
    { source: "Landing Page", target: "Demo Request", value: 1200 },
    { source: "Landing Page", target: "Bounce", value: 4000 },
    { source: "Pricing Page", target: "Signup", value: 2400 },
    { source: "Pricing Page", target: "Demo Request", value: 800 },
    { source: "Pricing Page", target: "Bounce", value: 900 },
    { source: "Blog", target: "Signup", value: 1200 },
    { source: "Blog", target: "Bounce", value: 3600 },
    { source: "Docs", target: "Signup", value: 800 },
    { source: "Docs", target: "Bounce", value: 1900 },
  ],
};

const simpleFlow = {
  nodes: [
    { id: "Website" },
    { id: "App Store" },
    { id: "Free Trial" },
    { id: "Paid Plan" },
    { id: "Churned" },
  ],
  links: [
    { source: "Website", target: "Free Trial", value: 8200 },
    { source: "App Store", target: "Free Trial", value: 3400 },
    { source: "Free Trial", target: "Paid Plan", value: 4800 },
    { source: "Free Trial", target: "Churned", value: 6800 },
  ],
};

export default function SankeyDocs() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
            <a href="/docs" className="hover:text-[var(--foreground)]">Docs</a>
            <span>/</span>
            <span>Sankey</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Sankey</h1>
          <p className="mt-2 text-[14px] text-[var(--muted)]">
            Visualize flow and distribution between nodes. Links connect source to target
            with width proportional to value, making it easy to trace how quantities split and merge.
          </p>
        </div>

        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use Sankey for flow analysis — traffic sources to conversions, budget allocation,
          user journey paths, energy distribution. For sequential stage conversion, use{" "}
          <a href="/docs/funnel" className="font-medium text-[var(--accent)] hover:underline">
            Funnel
          </a>
          ; for hierarchical part-to-whole, use{" "}
          <a href="/docs/treemap" className="font-medium text-[var(--accent)] hover:underline">
            Treemap
          </a>.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<Sankey
  data={{
    nodes: [
      { id: "Organic Search" },
      { id: "Paid Ads" },
      { id: "Landing Page" },
      { id: "Signup" },
      { id: "Bounce" },
      // ...
    ],
    links: [
      { source: "Organic Search", target: "Landing Page", value: 4200 },
      { source: "Paid Ads", target: "Landing Page", value: 3100 },
      { source: "Landing Page", target: "Signup", value: 3800 },
      { source: "Landing Page", target: "Bounce", value: 4000 },
      // ...
    ],
  }}
  title="Traffic Flow: Source to Conversion"
  format="number"
  height={400}
/>`}
          >
            <div className="w-full">
              <Sankey
                data={trafficFlow}
                title="Traffic Flow: Source to Conversion"
                format="number"
                height={400}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Custom Node Colors */}
        <DocSection id="custom-nodes" title="Custom Node Colors">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">colors</code> array
            to control node coloring. Colors are assigned in order of node appearance.
          </p>
          <ComponentExample
            code={`<Sankey
  data={simpleFlow}
  title="Acquisition Funnel"
  format="number"
  colors={["#6366F1", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444"]}
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Sankey
                data={simpleFlow}
                title="Acquisition Funnel"
                format="number"
                colors={["#6366F1", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444"]}
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Link Opacity */}
        <DocSection id="link-opacity" title="Link Opacity">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Adjust <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">linkOpacity</code> to
            control link transparency. Lower values help when many links overlap; higher values make
            individual flows easier to trace.
          </p>
          <ComponentExample
            code={`<Sankey
  data={simpleFlow}
  title="High Contrast Links"
  format="number"
  linkOpacity={0.7}
  nodeThickness={24}
  nodePadding={16}
  height={300}
/>`}
          >
            <div className="w-full max-w-2xl">
              <Sankey
                data={simpleFlow}
                title="High Contrast Links"
                format="number"
                linkOpacity={0.7}
                nodeThickness={24}
                nodePadding={16}
                height={300}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Props */}
        <DocSection id="props" title="Props">
          <DataTable
            data={[
              { prop: "data", type: "SankeyData | DataRow[]", default: "—", description: "{ nodes, links } format or flat rows with source/target/value fields." },
              { prop: "sourceField", type: "string", default: '"source"', description: "Column name for source node (flat format)." },
              { prop: "targetField", type: "string", default: '"target"', description: "Column name for target node (flat format)." },
              { prop: "valueField", type: "string", default: '"value"', description: "Column name for link value (flat format)." },
              { prop: "title", type: "string", default: "—", description: "Card title." },
              { prop: "height", type: "number", default: "300", description: "Chart height in px." },
              { prop: "colors", type: "string[]", default: "theme palette", description: "Node colors." },
              { prop: "format", type: "FormatOption", default: "—", description: "Format for value labels and tooltips." },
              { prop: "nodeThickness", type: "number", default: "18", description: "Thickness of each node rect (px)." },
              { prop: "nodePadding", type: "number", default: "12", description: "Vertical padding between nodes (px)." },
              { prop: "linkOpacity", type: "number", default: "0.4", description: "Opacity of the links." },
              { prop: "animate", type: "boolean", default: "true", description: "Enable/disable animation." },
              { prop: "legend", type: "boolean | LegendConfig", default: "—", description: "Legend configuration." },
              { prop: "crossFilter", type: "boolean | { field? }", default: "—", description: "Enable cross-filtering on node click." },
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
              "Native format: { nodes: [{ id }], links: [{ source, target, value }] }. Node ids must match link source/target strings.",
              "Flat format: pass DataRow[] with sourceField, targetField, and valueField. Nodes are auto-inferred from unique source/target values.",
              "Links cannot form cycles — Sankey requires a directed acyclic graph. The component will error on circular references.",
              "Node order is determined by Nivo's layout algorithm. Links flow left-to-right by default.",
              "Built on @nivo/sankey — all Nivo theming and tooltip conventions apply.",
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
            {["Funnel", "Treemap", "DonutChart", "BarChart"].map((name) => (
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
