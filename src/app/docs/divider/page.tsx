"use client";

import { Divider } from "@/components/ui/Divider";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { DividerPlayground } from "@/components/docs/playgrounds/DividerPlayground";
import { Star } from "lucide-react";

const component = getComponent("divider")!;

const tocItems: TocItem[] = [
  { id: "basic", title: "Basic Horizontal Divider", level: 2 },
  { id: "with-label", title: "With Label", level: 2 },
  { id: "with-icon", title: "With Icon", level: 2 },
  { id: "variants", title: "Variants", level: 2 },
  { id: "accent", title: "Accent Mode", level: 2 },
  { id: "spacing", title: "Spacing", level: 2 },
  { id: "vertical", title: "Vertical Divider", level: 2 },
  { id: "dense", title: "Dense Mode", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

export default function DividerDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        {/* When to use */}
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use Divider to visually separate sections of a dashboard with a themed horizontal
          or vertical rule. Supports optional centered labels, icons, line style variants,
          accent coloring, and spacing control. Also available as a full-width element inside{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">
            MetricGrid
          </code>{" "}
          via its <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">__gridHint</code> of &ldquo;full&rdquo;.
        </p>

        {/* Basic Horizontal Divider */}
        <DocSection id="basic" title="Basic Horizontal Divider">
          <ComponentExample code={`<Divider />`}>
            <div className="w-full max-w-lg">
              <p className="text-sm text-[var(--muted)]">Content above</p>
              <Divider />
              <p className="text-sm text-[var(--muted)]">Content below</p>
            </div>
          </ComponentExample>
        </DocSection>

        {/* With Label */}
        <DocSection id="with-label" title="With Label">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass a{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">label</code>{" "}
            to render centered text between the two line segments.
          </p>
          <ComponentExample
            code={`<Divider label="or" />
<Divider label="Section Break" />`}
          >
            <div className="w-full max-w-lg space-y-4">
              <div>
                <p className="text-sm text-[var(--muted)]">Option A</p>
                <Divider label="or" />
                <p className="text-sm text-[var(--muted)]">Option B</p>
              </div>
              <Divider label="Section Break" />
            </div>
          </ComponentExample>
        </DocSection>

        {/* With Icon */}
        <DocSection id="with-icon" title="With Icon">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass an{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">icon</code>{" "}
            to render a React node (e.g. a Lucide icon) centered in the divider. Icon takes
            precedence over label.
          </p>
          <ComponentExample
            code={`<Divider icon={<Star className="h-3 w-3" />} />`}
          >
            <div className="w-full max-w-lg">
              <p className="text-sm text-[var(--muted)]">Above</p>
              <Divider icon={<Star className="h-3 w-3" />} />
              <p className="text-sm text-[var(--muted)]">Below</p>
            </div>
          </ComponentExample>
        </DocSection>

        {/* Variants */}
        <DocSection id="variants" title="Variants">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Choose from{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">solid</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">dashed</code>, or{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">dotted</code>{" "}
            line styles.
          </p>
          <ComponentExample
            code={`<Divider variant="solid" />
<Divider variant="dashed" />
<Divider variant="dotted" />`}
          >
            <div className="w-full max-w-lg space-y-2">
              <p className="text-[10px] font-medium text-[var(--muted)]">Solid (default)</p>
              <Divider variant="solid" spacing="sm" />
              <p className="text-[10px] font-medium text-[var(--muted)]">Dashed</p>
              <Divider variant="dashed" spacing="sm" />
              <p className="text-[10px] font-medium text-[var(--muted)]">Dotted</p>
              <Divider variant="dotted" spacing="sm" />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Accent */}
        <DocSection id="accent" title="Accent Mode">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Enable{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">accent</code>{" "}
            to color the line and label text with the theme accent color instead of the default muted border.
          </p>
          <ComponentExample
            code={`<Divider accent />
<Divider accent label="Featured" />`}
          >
            <div className="w-full max-w-lg">
              <Divider accent spacing="sm" />
              <Divider accent label="Featured" spacing="sm" />
            </div>
          </ComponentExample>
        </DocSection>

        {/* Spacing */}
        <DocSection id="spacing" title="Spacing">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Control vertical spacing with the{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">spacing</code>{" "}
            prop. Options: <code className="font-[family-name:var(--font-mono)] text-[13px]">none</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px]">sm</code>,{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px]">md</code> (default),{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px]">lg</code>.
          </p>
          <ComponentExample
            code={`<Divider spacing="none" />
<Divider spacing="sm" />
<Divider spacing="md" />
<Divider spacing="lg" />`}
          >
            <div className="w-full max-w-lg rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <p className="text-xs text-[var(--muted)]">spacing=&quot;none&quot;</p>
              <Divider spacing="none" />
              <p className="text-xs text-[var(--muted)]">spacing=&quot;sm&quot;</p>
              <Divider spacing="sm" />
              <p className="text-xs text-[var(--muted)]">spacing=&quot;md&quot; (default)</p>
              <Divider spacing="md" />
              <p className="text-xs text-[var(--muted)]">spacing=&quot;lg&quot;</p>
              <Divider spacing="lg" />
              <p className="text-xs text-[var(--muted)]">End</p>
            </div>
          </ComponentExample>
        </DocSection>

        {/* Vertical Divider */}
        <DocSection id="vertical" title="Vertical Divider">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Set{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">orientation=&quot;vertical&quot;</code>{" "}
            to render a vertical separator between side-by-side elements.
          </p>
          <ComponentExample
            code={`<div className="flex h-16 items-center">
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</div>`}
          >
            <div className="flex h-16 items-center gap-0">
              <span className="text-sm text-[var(--foreground)]">Left content</span>
              <Divider orientation="vertical" />
              <span className="text-sm text-[var(--foreground)]">Right content</span>
            </div>
          </ComponentExample>
        </DocSection>

        {/* Dense Mode */}
        <DocSection id="dense" title="Dense Mode">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Enable{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">dense</code>{" "}
            to halve the spacing values. Falls back to the global{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">config.dense</code>{" "}
            setting from MetricProvider.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Normal</p>
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                <p className="text-xs text-[var(--muted)]">Above</p>
                <Divider label="Section" />
                <p className="text-xs text-[var(--muted)]">Below</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Dense</p>
              <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                <p className="text-xs text-[var(--muted)]">Above</p>
                <Divider label="Section" dense />
                <p className="text-xs text-[var(--muted)]">Below</p>
              </div>
            </div>
          </div>
          <CodeBlock
            code={`// Normal
<Divider label="Section" />

// Dense
<Divider label="Section" dense />`}
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
            <DividerPlayground />
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
