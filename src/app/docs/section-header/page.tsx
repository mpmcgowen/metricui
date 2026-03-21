"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { SectionHeaderPlayground } from "@/components/docs/playgrounds/SectionHeaderPlayground";

const component = getComponent("section-header")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "subtitle-border", title: "With Subtitle & Border", level: 2 },
  { id: "description-popover", title: "Description Popover", level: 2 },
  { id: "action-badge", title: "Action & Badge Slots", level: 2 },
  { id: "dense-mode", title: "Dense Mode", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

export default function SectionHeaderDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        {/* When to use */}
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use SectionHeader to visually separate groups of related content in a dashboard.
          It handles title styling, optional subtitles, contextual descriptions, action slots,
          and inline badges. Also available as{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">
            MetricGrid.Section
          </code>{" "}
          — a convenience wrapper that delegates to SectionHeader with automatic full-width
          grid span inside a MetricGrid.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<SectionHeader title="Key Metrics" />`}
          >
            <div className="w-full max-w-lg">
              <SectionHeader title="Key Metrics" spacing={false} />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Subtitle & Border */}
        <DocSection id="subtitle-border" title="With Subtitle & Border">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Add a{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">subtitle</code>{" "}
            for additional context and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">border</code>{" "}
            for visual separation between sections.
          </p>
          <ComponentExample
            code={`<SectionHeader
  title="Performance"
  subtitle="Last 30 days compared to previous period"
  border
/>`}
          >
            <div className="w-full max-w-lg">
              <SectionHeader
                title="Performance"
                subtitle="Last 30 days compared to previous period"
                border
                spacing={false}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Description Popover */}
        <DocSection id="description-popover" title="Description Popover">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">description</code>{" "}
            prop renders a &ldquo;?&rdquo; icon next to the title that shows a popover with
            contextual information on hover.
          </p>
          <ComponentExample
            code={`<SectionHeader
  title="Revenue"
  subtitle="All channels combined"
  description="Revenue includes recurring subscriptions, one-time purchases, and professional services. Refunds are excluded."
/>`}
          >
            <div className="w-full max-w-lg">
              <SectionHeader
                title="Revenue"
                subtitle="All channels combined"
                description="Revenue includes recurring subscriptions, one-time purchases, and professional services. Refunds are excluded."
                spacing={false}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Action & Badge Slots */}
        <DocSection id="action-badge" title="Action & Badge Slots">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">action</code>{" "}
            slot renders content right-aligned — perfect for links, buttons, or toggles. The{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">badge</code>{" "}
            slot renders inline after the title.
          </p>
          <ComponentExample
            code={`<SectionHeader
  title="Recent Orders"
  subtitle="Last 7 days"
  action={<button className="text-xs text-[var(--accent)]">View all</button>}
  badge={<Badge variant="info" size="sm">3 new</Badge>}
/>`}
          >
            <div className="w-full max-w-lg">
              <SectionHeader
                title="Recent Orders"
                subtitle="Last 7 days"
                action={
                  <button className="text-xs font-medium text-[var(--accent)] hover:underline">
                    View all
                  </button>
                }
                badge={<Badge variant="info" size="sm">3 new</Badge>}
                spacing={false}
              />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Dense Mode */}
        <DocSection id="dense-mode" title="Dense Mode">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Enable{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">dense</code>{" "}
            for compact layouts. Title shrinks from 10px to 9px and subtitle from text-sm to text-xs.
            Falls back to the global{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">config.dense</code>{" "}
            setting from MetricProvider.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Normal</p>
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                <SectionHeader
                  title="Performance"
                  subtitle="Last 30 days"
                  border
                  spacing={false}
                />
              </div>
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Dense</p>
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                <SectionHeader
                  title="Performance"
                  subtitle="Last 30 days"
                  border
                  dense
                  spacing={false}
                />
              </div>
            </div>
          </div>
          <CodeBlock
            code={`// Normal
<SectionHeader title="Performance" subtitle="Last 30 days" border />

// Dense
<SectionHeader title="Performance" subtitle="Last 30 days" border dense />`}
            className="mt-4"
          />
        </DocSection>

        {/* Props Table */}
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
          </ul>
        </DocSection>

        {/* Playground */}
        <DocSection id="playground" title="Playground">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Experiment with every prop interactively. Adjust the controls on the right to see the
            component update in real time.
          </p>
          <div className="rounded-xl border border-[var(--card-border)]">
            <SectionHeaderPlayground />
          </div>
        </DocSection>

        {/* Related Components */}
        <DocSection id="related" title="Related Components">
          <RelatedComponents names={component.relatedComponents} />
        </DocSection>
      </div>

      {/* Right: On This Page */}
      <div className="hidden w-48 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
