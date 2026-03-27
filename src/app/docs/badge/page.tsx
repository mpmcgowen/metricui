"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

const component = getComponent("badge")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "sizes", title: "Sizes", level: 2 },
  { id: "with-icon", title: "With Icon", level: 2 },
  { id: "dot-indicator", title: "Dot Indicator", level: 2 },
  { id: "dismissible", title: "Dismissible", level: 2 },
  { id: "custom-color", title: "Custom Color", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

export default function BadgeDocs() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use Badge for labels, tags, and status indicators. It works well inside
        table cells, card headers, and alongside text to convey state at a glance.
        For threshold-based status with pulse animation, use{" "}
        <a href="/docs/status-indicator" className="font-medium text-[var(--accent)] hover:underline">
          StatusIndicator
        </a>{" "}
        instead.
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Badge ships with six semantic variants: default, success, warning, danger,
          info, and outline.
        </p>
        <ComponentExample
          code={`<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="outline">Outline</Badge>`}
        >
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </ComponentExample>
      </DocSection>

      {/* Sizes */}
      <DocSection id="sizes" title="Sizes">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Three sizes are available: <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">sm</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">md</code> (default), and{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">lg</code>.
        </p>
        <ComponentExample
          code={`<Badge size="sm" variant="info">Small</Badge>
<Badge size="md" variant="info">Medium</Badge>
<Badge size="lg" variant="info">Large</Badge>`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge size="sm" variant="info">Small</Badge>
            <Badge size="md" variant="info">Medium</Badge>
            <Badge size="lg" variant="info">Large</Badge>
          </div>
        </ComponentExample>
      </DocSection>

      {/* With Icon */}
      <DocSection id="with-icon" title="With Icon">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass any React node as the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">icon</code> prop
          to render it before the text. Icons from Lucide or any icon library work well.
        </p>
        <ComponentExample
          code={`<Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>
  Verified
</Badge>
<Badge variant="warning" icon={<AlertTriangle className="h-3 w-3" />}>
  Review
</Badge>
<Badge variant="info" icon={<Zap className="h-3 w-3" />}>
  Fast
</Badge>`}
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>
              Verified
            </Badge>
            <Badge variant="warning" icon={<AlertTriangle className="h-3 w-3" />}>
              Review
            </Badge>
            <Badge variant="info" icon={<Zap className="h-3 w-3" />}>
              Fast
            </Badge>
          </div>
        </ComponentExample>
      </DocSection>

      {/* Dot Indicator */}
      <DocSection id="dot-indicator" title="Dot Indicator">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">dot</code> prop
          adds a small colored circle before the text — useful for status indicators
          in tables or lists.
        </p>
        <ComponentExample
          code={`<Badge variant="success" dot>Active</Badge>
<Badge variant="warning" dot>Pending</Badge>
<Badge variant="danger" dot>Offline</Badge>`}
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="success" dot>Active</Badge>
            <Badge variant="warning" dot>Pending</Badge>
            <Badge variant="danger" dot>Offline</Badge>
          </div>
        </ComponentExample>
      </DocSection>

      {/* Dismissible */}
      <DocSection id="dismissible" title="Dismissible">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Pass an <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">onDismiss</code> callback
          to show a dismiss button. Useful for removable tags or filters.
        </p>
        <ComponentExample
          code={`<Badge
  variant="info"
  onDismiss={() => handleDismiss()}
>
  Removable Tag
</Badge>`}
        >
          <div className="flex flex-wrap gap-2">
            {!dismissed ? (
              <Badge variant="info" onDismiss={() => setDismissed(true)}>
                Click X to dismiss
              </Badge>
            ) : (
              <button
                onClick={() => setDismissed(false)}
                className="text-[12px] text-[var(--accent)] hover:underline"
              >
                Reset
              </button>
            )}
            <Badge variant="success" onDismiss={() => {}}>
              Filter: Active
            </Badge>
            <Badge variant="outline" onDismiss={() => {}}>
              Tag: v2.0
            </Badge>
          </div>
        </ComponentExample>
      </DocSection>

      {/* Custom Color */}
      <DocSection id="custom-color" title="Custom Color">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">color</code> prop
          accepts any CSS color string. It sets the text color and generates a tinted
          background using <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">color-mix</code>.
          When set, variant styles are bypassed.
        </p>
        <ComponentExample
          code={`<Badge color="#6366F1">Indigo</Badge>
<Badge color="#EC4899">Pink</Badge>
<Badge color="#F59E0B">Amber</Badge>
<Badge color="#06B6D4" dot>Cyan</Badge>`}
        >
          <div className="flex flex-wrap gap-2">
            <Badge color="#6366F1">Indigo</Badge>
            <Badge color="#EC4899">Pink</Badge>
            <Badge color="#F59E0B">Amber</Badge>
            <Badge color="#06B6D4" dot>Cyan</Badge>
          </div>
        </ComponentExample>
      </DocSection>

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
