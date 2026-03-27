"use client";

import { Sankey } from "@/components/charts/Sankey";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

const component = getComponent("sankey")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "custom-nodes", title: "Custom Node Colors", level: 2 },
  { id: "link-opacity", title: "Link Opacity", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
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
        <ComponentHero component={component} />

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
