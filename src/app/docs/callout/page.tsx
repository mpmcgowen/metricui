"use client";

import { Callout } from "@/components/ui/Callout";
import type { CalloutRule } from "@/components/ui/Callout";
import { getComponent } from "@/lib/docs/component-data";
import { ComponentHero } from "@/components/docs/ComponentHero";
import { DocSection } from "@/components/docs/DocSection";
import { ComponentExample } from "@/components/docs/ComponentExample";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { PropsTable } from "@/components/docs/PropsTable";
import { RelatedComponents } from "@/components/docs/RelatedComponents";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";
import { CalloutPlayground } from "@/components/docs/playgrounds/CalloutPlayground";
import { useState } from "react";

const component = getComponent("callout")!;

const tocItems: TocItem[] = [
  { id: "basic-example", title: "Basic Example", level: 2 },
  { id: "variants", title: "All Variants", level: 2 },
  { id: "data-driven", title: "Data-Driven Rules", level: 2 },
  { id: "metric", title: "Metric Callout", level: 2 },
  { id: "detail", title: "Collapsible Detail", level: 2 },
  { id: "action", title: "Action Button", level: 2 },
  { id: "props", title: "Props", level: 2 },
  { id: "data-shape", title: "Data Shape", level: 2 },
  { id: "notes", title: "Notes", level: 2 },
  { id: "playground", title: "Playground", level: 2 },
  { id: "related", title: "Related Components", level: 2 },
];

// ---------------------------------------------------------------------------
// Data-driven rules for the interactive example
// ---------------------------------------------------------------------------

const performanceRules: CalloutRule[] = [
  { min: 90, variant: "success", title: "Performance excellent", message: "Score: {value}. All systems nominal." },
  { min: 70, max: 90, variant: "info", title: "Performance good", message: "Score: {value}. Minor optimizations possible." },
  { min: 50, max: 70, variant: "warning", title: "Performance degraded", message: "Score: {value}. Investigate recent changes." },
  { max: 50, variant: "error", title: "Performance critical", message: "Score: {value}. Immediate action required." },
];

// ---------------------------------------------------------------------------
// Wrapper for the data-driven slider example
// ---------------------------------------------------------------------------

function DataDrivenExample() {
  const [ddValue, setDdValue] = useState(85);
  return (
    <div className="w-full max-w-xl">
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-[var(--foreground)]">
          Score: {ddValue}
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={ddValue}
          onChange={(e) => setDdValue(Number(e.target.value))}
          className="flex-1"
        />
      </div>
      <Callout value={ddValue} rules={performanceRules} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CalloutDocs() {
  return (
    <div className="flex">
      {/* Main content */}
      <div className="min-w-0 flex-1 px-8 py-8">
        <ComponentHero component={component} />

        {/* When to use */}
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--muted)]">
          Use Callout to surface contextual messages, alerts, and status notifications inside
          dashboards. It supports four semantic variants, data-driven rules that auto-select
          variant and message based on a numeric value, embedded formatted metrics, collapsible
          detail sections, action buttons, and auto-dismiss timers.
        </p>

        {/* Basic Example */}
        <DocSection id="basic-example" title="Basic Example">
          <ComponentExample
            code={`<Callout variant="info" title="Heads up">
  This is an informational message for the user.
</Callout>`}
          >
            <div className="w-full max-w-xl">
              <Callout variant="info" title="Heads up">
                This is an informational message for the user.
              </Callout>
            </div>
          </ComponentExample>
        </DocSection>

        {/* All Variants */}
        <DocSection id="variants" title="All Variants">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Four semantic variants cover the most common dashboard alert scenarios. Each has a
            distinct icon, border color, and background tint.
          </p>
          <div className="space-y-3">
            <div className="w-full max-w-xl">
              <Callout variant="info" title="Info">
                This is an informational message for the user.
              </Callout>
            </div>
            <div className="w-full max-w-xl">
              <Callout variant="warning" title="Warning">
                Something needs your attention but is not critical.
              </Callout>
            </div>
            <div className="w-full max-w-xl">
              <Callout variant="success" title="Success">
                The operation completed successfully.
              </Callout>
            </div>
            <div className="w-full max-w-xl">
              <Callout variant="error" title="Error">
                Something went wrong. Please try again.
              </Callout>
            </div>
          </div>
          <CodeBlock
            code={`<Callout variant="info" title="Info">...</Callout>
<Callout variant="warning" title="Warning">...</Callout>
<Callout variant="success" title="Success">...</Callout>
<Callout variant="error" title="Error">...</Callout>`}
            className="mt-4"
          />
        </DocSection>

        {/* Data-Driven Rules */}
        <DocSection id="data-driven" title="Data-Driven Rules">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Pass a <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">value</code> and{" "}
            <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">rules</code> array
            to let the Callout auto-select its variant and message. Rules are evaluated top-to-bottom;
            first match wins. Use <code className="font-[family-name:var(--font-mono)] text-[12px]">{"{value}"}</code> in
            title or message for interpolation.
          </p>
          <ComponentExample
            code={`<Callout
  value={85}
  rules={[
    { min: 90, variant: "success", title: "Excellent", message: "Score: {value}." },
    { min: 70, max: 90, variant: "info", title: "Good", message: "Score: {value}." },
    { min: 50, max: 70, variant: "warning", title: "Degraded", message: "Score: {value}." },
    { max: 50, variant: "error", title: "Critical", message: "Score: {value}." },
  ]}
/>`}
          >
            <DataDrivenExample />
          </ComponentExample>
        </DocSection>

        {/* Metric Callout */}
        <DocSection id="metric" title="Metric Callout">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">metric</code> prop
            embeds a formatted numeric value inside the callout, using the same format engine as
            KpiCard (currency, percent, compact, etc.).
          </p>
          <ComponentExample
            code={`<Callout
  variant="success"
  title="Revenue milestone reached"
  metric={{ value: 1000000, format: "currency", label: "total revenue" }}
>
  Your team crossed the $1M revenue mark this quarter.
</Callout>`}
          >
            <div className="w-full max-w-xl">
              <Callout
                variant="success"
                title="Revenue milestone reached"
                metric={{ value: 1000000, format: "currency", label: "total revenue" }}
              >
                Your team crossed the $1M revenue mark this quarter.
              </Callout>
            </div>
          </ComponentExample>
        </DocSection>

        {/* Collapsible Detail */}
        <DocSection id="detail" title="Collapsible Detail">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            Use <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">detail</code> to
            tuck verbose information behind a toggle. Great for error stack traces, service
            breakdowns, or audit logs.
          </p>
          <ComponentExample
            code={`<Callout
  variant="warning"
  title="3 services experiencing elevated latency"
  detail={
    <div className="space-y-1">
      <p>API Gateway: p99 latency 450ms (threshold: 200ms)</p>
      <p>Auth Service: p99 latency 320ms (threshold: 150ms)</p>
      <p>Search: p99 latency 280ms (threshold: 100ms)</p>
    </div>
  }
>
  Some services are responding slower than expected.
</Callout>`}
          >
            <div className="w-full max-w-xl">
              <Callout
                variant="warning"
                title="3 services experiencing elevated latency"
                detail={
                  <div className="space-y-1">
                    <p>API Gateway: p99 latency 450ms (threshold: 200ms)</p>
                    <p>Auth Service: p99 latency 320ms (threshold: 150ms)</p>
                    <p>Search: p99 latency 280ms (threshold: 100ms)</p>
                  </div>
                }
              >
                Some services are responding slower than expected.
              </Callout>
            </div>
          </ComponentExample>
        </DocSection>

        {/* Action Button */}
        <DocSection id="action" title="Action Button">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">action</code> prop
            adds a button to the callout for inline user actions like retrying a failed operation or
            navigating to a detail view.
          </p>
          <ComponentExample
            code={`<Callout
  variant="error"
  title="Payment failed"
  action={{ label: "Retry payment", onClick: () => alert("Retrying...") }}
>
  The last payment attempt was declined.
</Callout>`}
          >
            <div className="w-full max-w-xl">
              <Callout
                variant="error"
                title="Payment failed"
                action={{ label: "Retry payment", onClick: () => alert("Retrying...") }}
              >
                The last payment attempt was declined. Please update your billing
                information or retry.
              </Callout>
            </div>
          </ComponentExample>
        </DocSection>

        {/* Props Table */}
        <DocSection id="props" title="Props">
          <PropsTable props={component.props} />
        </DocSection>

        {/* Data Shape */}
        {component.dataShape && (
          <DocSection id="data-shape" title="Data Shape">
            <CodeBlock code={component.dataShape} language="typescript" />
          </DocSection>
        )}

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
            <CalloutPlayground />
          </div>
        </DocSection>

        {/* Related Components */}
        <DocSection id="related" title="Related Components">
          <RelatedComponents names={component.relatedComponents} />
        </DocSection>
      </div>

      {/* Right: On This Page */}
      <div className="hidden w-40 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
