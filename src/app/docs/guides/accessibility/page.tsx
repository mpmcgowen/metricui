import { DocSection } from "@/components/docs/DocSection";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

const tocItems: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "keyboard", title: "Keyboard Navigation", level: 2 },
  { id: "aria", title: "ARIA Labels & Roles", level: 2 },
  { id: "reduced-motion", title: "Reduced Motion", level: 2 },
  { id: "color-blind", title: "Color Blind Safe", level: 2 },
  { id: "focus", title: "Focus Management", level: 2 },
  { id: "testing", title: "Testing Attributes", level: 2 },
];

export default function AccessibilityGuide() {
  return (
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-3xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Guide
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">Accessibility</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          MetricUI is built with accessibility in mind. Every component supports keyboard
          navigation, ARIA attributes, and respects user motion preferences.
        </p>

        <DocSection id="overview" title="Overview">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            All MetricUI components include:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              "forwardRef — attach refs to any component root",
              "id and data-testid props on every component",
              "Keyboard-accessible interactive elements",
              "ARIA labels for screen readers",
              "prefers-reduced-motion support",
              "Global focus-visible ring styling",
              "Colorblind-safe default chart palette",
            ].map((item) => (
              <li key={item} className="flex gap-2 text-[14px] text-[var(--muted)]">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </DocSection>

        <DocSection id="keyboard" title="Keyboard Navigation">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            All interactive elements (drill-down links, copy buttons, toggleable legend items,
            pagination controls, sortable table headers) are reachable via Tab and activatable
            with Enter or Space.
          </p>
          <CodeBlock
            code={`// KpiCard with keyboard-accessible drill-down
<KpiCard
  title="Revenue"
  value={142300}
  drillDown={{ label: "View details", onClick: handleDrill }}
  copyable // Copy button is keyboard accessible
/>

// Legend items toggle on Enter/Space
<AreaChart data={data} legend={{ toggleable: true }} />`}
          />
        </DocSection>

        <DocSection id="aria" title="ARIA Labels & Roles">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Components use semantic ARIA attributes. Toggle switches use{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px]">role=&quot;switch&quot;</code> with{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px]">aria-checked</code>.
            Description popovers use proper trigger/content pairing.
            Error boundaries include <code className="font-[family-name:var(--font-mono)] text-[13px]">data-component</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px]">data-error</code> attributes.
          </p>
        </DocSection>

        <DocSection id="reduced-motion" title="Reduced Motion">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI respects the <code className="font-[family-name:var(--font-mono)] text-[13px]">prefers-reduced-motion</code> media
            query. When enabled, chart animations, count-up effects, and spring transitions
            are automatically disabled.
          </p>
          <CodeBlock
            code={`// You can also disable animation globally
<MetricProvider animate={false}>

// Or per-component
<KpiCard animate={false} title="Revenue" value={42000} />`}
          />
        </DocSection>

        <DocSection id="color-blind" title="Color Blind Safe">
          <p className="text-[14px] leading-relaxed text-[var(--muted)]">
            The default chart color palette (8 colors) is designed to be distinguishable
            for the most common forms of color blindness. The palette uses a mix of hue,
            saturation, and lightness differences — not just hue alone.
          </p>
        </DocSection>

        <DocSection id="focus" title="Focus Management">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            MetricUI includes a global <code className="font-[family-name:var(--font-mono)] text-[13px]">focus-visible</code> ring
            style. Interactive elements show a visible focus indicator only when navigating
            via keyboard — not on mouse click.
          </p>
        </DocSection>

        <DocSection id="testing" title="Testing Attributes">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Every component accepts <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">id</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">data-testid</code> props
            for integration with testing frameworks.
          </p>
          <CodeBlock
            code={`<KpiCard
  id="revenue-card"
  data-testid="revenue-kpi"
  title="Revenue"
  value={42000}
/>

// In your test:
screen.getByTestId("revenue-kpi")`}
          />
        </DocSection>
      </div>

      <div className="hidden w-48 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
