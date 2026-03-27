"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";
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
    <DocPageLayout tocItems={tocItems}>
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

      <ComponentDocFooter component={component} playground={<SectionHeaderPlayground />} />
    </DocPageLayout>
  );
}
