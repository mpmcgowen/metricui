"use client";

import { DocPageLayout } from "@/components/docs/DocPageLayout";
import { GuideHero } from "@/components/docs/GuideHero";
import { DocSection } from "@/components/docs/DocSection";
import { CodeBlock } from "@/components/docs/CodeBlock";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "css-variables", title: "CSS Variables", level: 2 },
  { id: "theme-presets", title: "Theme Presets", level: 2 },
  { id: "variants", title: "Card Variants", level: 2 },
  { id: "custom-variants", title: "Custom Variants", level: 2 },
  { id: "dark-mode", title: "Dark Mode", level: 2 },
  { id: "dense-mode", title: "Dense Mode", level: 2 },
  { id: "chart-colors", title: "Chart Colors", level: 2 },
  { id: "motion", title: "Motion / Animation", level: 2 },
];

export default function ThemingGuide() {
  return (
    <DocPageLayout tocItems={tocItems} maxWidth="prose">
      <GuideHero
        title="Theming"
        description="MetricUI uses CSS custom properties for theming, making it compatible with any CSS framework or design system."
      />

      <DocSection id="css-variables" title="CSS Variables">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Set these on your root element (or any parent container):
        </p>
        <CodeBlock
          code={`:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --card-bg: #ffffff;
  --card-border: #e2e8f0;
  --card-glow: #f8fafc;
  --muted: #64748b;
  --accent: #6366f1;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
}

.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --card-bg: #1e293b;
  --card-border: #334155;
  --card-glow: #1e293b;
  --muted: #94a3b8;
  --accent: #818cf8;
}`}
          language="css"
        />
        <DataTable
          data={[
            { variable: "--background", purpose: "Page background color" },
            { variable: "--foreground", purpose: "Primary text color" },
            { variable: "--card-bg", purpose: "Card/container background" },
            { variable: "--card-border", purpose: "Card border and divider color" },
            { variable: "--card-glow", purpose: "Hover/ghost variant background tint" },
            { variable: "--muted", purpose: "Secondary/muted text color" },
            { variable: "--accent", purpose: "Primary accent color" },
            { variable: "--font-mono", purpose: "Monospace font family for values" },
          ]}
          columns={[
            { key: "variable", header: "Variable", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
            { key: "purpose", header: "Purpose" },
          ]}
          dense
          variant="ghost"
        />
      </DocSection>

      <DocSection id="theme-presets" title="Theme Presets">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          MetricUI includes 8 built-in theme presets. Pass a preset name to MetricProvider:
        </p>
        <CodeBlock code={`<MetricProvider theme="emerald">`} />
        <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Available presets: <strong>indigo</strong> (default), <strong>emerald</strong>,{" "}
          <strong>rose</strong>, <strong>amber</strong>, <strong>cyan</strong>,{" "}
          <strong>violet</strong>, <strong>slate</strong>, <strong>orange</strong>.
          Each preset sets the accent color and an 8-color chart palette.
        </p>
      </DocSection>

      <DocSection id="variants" title="Card Variants">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Four built-in variants control card appearance via CSS custom properties:
        </p>
        <DataTable
          data={[
            { variant: "default", description: "Clean bordered card with card background" },
            { variant: "outlined", description: "Transparent background, 2px border, inset shadow" },
            { variant: "ghost", description: "Accent-tinted background, no border" },
            { variant: "elevated", description: "Card background with multi-layer shadow, no visible border" },
          ]}
          columns={[
            { key: "variant", header: "Variant", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
            { key: "description", header: "Description" },
          ]}
          dense
          variant="ghost"
        />
      </DocSection>

      <DocSection id="custom-variants" title="Custom Variants">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Create custom variants by defining CSS variables under a <code className="font-[family-name:var(--font-mono)] text-[13px]">[data-variant=&quot;...&quot;]</code> selector:
        </p>
        <CodeBlock
          code={`/* CSS */
[data-variant="glass"] {
  --mu-card-bg: rgba(255,255,255,0.08);
  --mu-card-border: rgba(255,255,255,0.15);
  --mu-card-border-w: 1px;
  --mu-card-shadow: 0 8px 32px rgba(0,0,0,0.1);
  --mu-card-radius: 1rem;
  backdrop-filter: blur(12px);
}`}
          language="css"
        />
        <CodeBlock
          code={`// Use it on any component
<KpiCard variant="glass" title="Revenue" value={42000} format="currency" />
<MetricProvider variant="glass">{children}</MetricProvider>`}
          className="mt-3"
        />
      </DocSection>

      <DocSection id="dark-mode" title="Dark Mode">
        <p className="text-[14px] leading-relaxed text-[var(--muted)]">
          MetricUI detects dark mode via the <code className="font-[family-name:var(--font-mono)] text-[13px]">dark</code> class
          on the document. All components automatically adapt using the CSS variables.
          Simply toggle the <code className="font-[family-name:var(--font-mono)] text-[13px]">.dark</code> class on your{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px]">&lt;html&gt;</code> or{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px]">&lt;body&gt;</code> element.
        </p>
      </DocSection>

      <DocSection id="dense-mode" title="Dense Mode">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Enable compact layouts globally or per-component. Dense mode reduces padding,
          font sizes, and chart heights.
        </p>
        <CodeBlock
          code={`// Global
<MetricProvider dense>

// Per-component
<KpiCard dense title="Revenue" value={42000} />`}
        />
      </DocSection>

      <DocSection id="chart-colors" title="Chart Colors">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Override the default 8-color series palette via MetricProvider:
        </p>
        <CodeBlock
          code={`<MetricProvider colors={["#3B82F6", "#EF4444", "#10B981", "#F59E0B"]}>
  {children}
</MetricProvider>`}
        />
        <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
          The default palette is colorblind-safe: indigo, cyan, amber, pink, emerald, orange, violet, teal.
        </p>
      </DocSection>

      <DocSection id="motion" title="Motion / Animation">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Animation timing uses spring physics via MotionConfig:
        </p>
        <CodeBlock
          code={`import { DEFAULT_MOTION_CONFIG } from "metricui";

// Slower, bouncier animations
<MetricProvider motionConfig={{ mass: 1.5, tension: 120, friction: 20, clamp: false }}>

// Faster, snappier animations
<MetricProvider motionConfig={{ mass: 0.8, tension: 250, friction: 30, clamp: true }}>

// Disable all animation
<MetricProvider animate={false}>`}
        />
        <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
          MetricUI respects <code className="font-[family-name:var(--font-mono)] text-[13px]">prefers-reduced-motion</code> automatically.
        </p>
      </DocSection>
    </DocPageLayout>
  );
}
