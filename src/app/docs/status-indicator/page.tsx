"use client";

import { StatusIndicator } from "@/components/ui/StatusIndicator";
import type { StatusRule } from "@/components/ui/StatusIndicator";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocPageLayout } from "@/components/docs/DocPageLayout";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { ComponentDocFooter } from "@/components/docs/ComponentDocFooter";

const component = getComponent("status-indicator")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "all-sizes", title: "All Sizes", level: 2 },
  { id: "threshold-rules", title: "Threshold Rules", level: 2 },
  { id: "pulse-animation", title: "Pulse Animation", level: 2 },
  { id: "card-mode", title: "Card Mode", level: 2 },
  { id: "data-states", title: "Data States", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Sample rules
// ---------------------------------------------------------------------------

const healthRules: StatusRule[] = [
  { min: 90, color: "emerald", label: "Healthy", pulse: false },
  { min: 60, max: 90, color: "amber", label: "Degraded" },
  { max: 60, color: "red", label: "Critical", pulse: true },
];

const uptimeRules: StatusRule[] = [
  { min: 99.9, color: "emerald", label: "Operational" },
  { min: 99, max: 99.9, color: "amber", label: "Partial Outage" },
  { max: 99, color: "red", label: "Major Outage", pulse: true },
];

export default function StatusIndicatorDocs() {
  return (
    <DocPageLayout tocItems={tocItems}>
      <ComponentHero component={component} />

      {/* When to use */}
      <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
        Use StatusIndicator for rule-based health checks — evaluate a numeric
        value against threshold rules and render the matching status with color,
        icon, label, and optional pulse animation. Supports five size modes from
        tiny inline dots to full card shells. For simple labeled badges, use{" "}
        <a href="/docs/badge" className="font-medium text-[var(--accent)] hover:underline">
          Badge
        </a>
        . For numeric KPIs with sparklines and comparisons, use{" "}
        <a href="/docs/kpi-card" className="font-medium text-[var(--accent)] hover:underline">
          KpiCard
        </a>
        .
      </p>

      {/* Basic Example */}
      <DocSection id="basic-example" title="Basic Example">
        <ComponentExample
          code={`<StatusIndicator
  value={95}
  rules={[
    { min: 90, color: "emerald", label: "Healthy" },
    { min: 60, max: 90, color: "amber", label: "Degraded" },
    { max: 60, color: "red", label: "Critical", pulse: true },
  ]}
  size="md"
/>`}
        >
          <div className="w-full max-w-2xl">
            <StatusIndicator
              value={95}
              rules={healthRules}
              size="md"
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* All Sizes */}
      <DocSection id="all-sizes" title="All Sizes">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Five size modes cover every use case: <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">dot</code> for
          inline table cells, <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">sm</code> for
          compact labels, <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">md</code> (default)
          for standard displays, <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">lg</code> for
          prominent standalone indicators, and <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">card</code> for
          full card shells matching KpiCard.
        </p>
        <ComponentExample
          code={`<StatusIndicator value={95} rules={rules} size="dot" />
<StatusIndicator value={95} rules={rules} size="sm" />
<StatusIndicator value={95} rules={rules} size="md" />
<StatusIndicator value={95} rules={rules} size="lg" />`}
        >
          <div className="flex flex-wrap items-center gap-6">
            {(["dot", "sm", "md", "lg"] as const).map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-medium text-[var(--muted)]">{s}</span>
                <StatusIndicator value={95} rules={healthRules} size={s} />
              </div>
            ))}
          </div>
        </ComponentExample>
      </DocSection>

      {/* Threshold Rules */}
      <DocSection id="threshold-rules" title="Threshold Rules">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Rules are evaluated top-to-bottom; the first match wins. Each value
          below triggers a different rule, showing green/amber/red status with{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">showValue</code> enabled.
        </p>
        <ComponentExample
          code={`const rules: StatusRule[] = [
  { min: 90, color: "emerald", label: "Healthy" },
  { min: 60, max: 90, color: "amber", label: "Degraded" },
  { max: 60, color: "red", label: "Critical", pulse: true },
];

<StatusIndicator value={95} rules={rules} size="md" showValue />
<StatusIndicator value={75} rules={rules} size="md" showValue />
<StatusIndicator value={40} rules={rules} size="md" showValue />`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <StatusIndicator value={95} rules={healthRules} size="md" showValue />
            <StatusIndicator value={75} rules={healthRules} size="md" showValue />
            <StatusIndicator value={40} rules={healthRules} size="md" showValue />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Pulse Animation */}
      <DocSection id="pulse-animation" title="Pulse Animation">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Set <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">pulse: true</code> on
          a rule to draw attention to critical states. The icon animates with a
          pulsing ring when the rule matches.
        </p>
        <ComponentExample
          code={`// pulse: true on the critical rule causes the icon to animate
const rules: StatusRule[] = [
  { min: 90, color: "emerald", label: "Healthy" },
  { max: 90, color: "red", label: "Critical", pulse: true },
];

<StatusIndicator value={40} rules={rules} size="md" />
<StatusIndicator value={40} rules={rules} size="lg" title="System Health" />`}
        >
          <div className="flex flex-wrap items-center gap-6">
            <StatusIndicator
              value={40}
              rules={[
                { min: 90, color: "emerald", label: "Healthy" },
                { max: 90, color: "red", label: "Critical", pulse: true },
              ]}
              size="md"
            />
            <StatusIndicator
              value={40}
              rules={[
                { min: 90, color: "emerald", label: "Healthy" },
                { max: 90, color: "red", label: "Critical", pulse: true },
              ]}
              size="lg"
              title="System Health"
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Card Mode */}
      <DocSection id="card-mode" title="Card Mode">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Card mode renders a full card shell that sits naturally next to KpiCards.
          Combine with <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">title</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">subtitle</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">showValue</code>, and{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">trend</code> for
          a complete service health card.
        </p>
        <ComponentExample
          code={`<StatusIndicator
  value={99.98}
  rules={uptimeRules}
  size="card"
  title="API Gateway"
  showValue
  trend={[99.9, 99.95, 99.98]}
/>
<StatusIndicator
  value={99.5}
  rules={uptimeRules}
  size="card"
  title="Auth Service"
  subtitle="Intermittent latency spikes"
  showValue
  trend={[99.9, 99.7, 99.5]}
/>
<StatusIndicator
  value={97.2}
  rules={uptimeRules}
  size="card"
  title="Database"
  subtitle="Investigating root cause"
  showValue
  trend={[99.5, 98.8, 97.2]}
/>`}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatusIndicator
              value={99.98}
              rules={uptimeRules}
              size="card"
              title="API Gateway"
              showValue
              trend={[99.9, 99.95, 99.98]}
            />
            <StatusIndicator
              value={99.5}
              rules={uptimeRules}
              size="card"
              title="Auth Service"
              subtitle="Intermittent latency spikes"
              showValue
              trend={[99.9, 99.7, 99.5]}
            />
            <StatusIndicator
              value={97.2}
              rules={uptimeRules}
              size="card"
              title="Database"
              subtitle="Investigating root cause"
              showValue
              trend={[99.5, 98.8, 97.2]}
            />
          </div>
        </ComponentExample>
      </DocSection>

      {/* Data States */}
      <DocSection id="data-states" title="Data States">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Every component handles loading states. Pass the{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">loading</code> prop
          to show a skeleton placeholder.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Loading (md)</p>
            <StatusIndicator
              value={0}
              rules={healthRules}
              size="md"
              loading
            />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-[var(--muted)]">Loading (card)</p>
            <StatusIndicator
              value={0}
              rules={healthRules}
              size="card"
              title="API Gateway"
              loading
            />
          </div>
        </div>
        <CodeBlock
          code={`// Loading state — md size
<StatusIndicator value={0} rules={rules} size="md" loading />

// Loading state — card size
<StatusIndicator value={0} rules={rules} size="card" title="API Gateway" loading />`}
          className="mt-4"
        />
      </DocSection>

      <ComponentDocFooter component={component} />
    </DocPageLayout>
  );
}
