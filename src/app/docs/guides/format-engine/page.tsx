"use client";

import { DocPageLayout } from "@/components/docs/DocPageLayout";
import { GuideHero } from "@/components/docs/GuideHero";
import { DocSection } from "@/components/docs/DocSection";
import { CodeBlock } from "@/components/docs/CodeBlock";
import type { TocItem } from "@/components/docs/DocPageLayout";
import { DataTable } from "@/components/tables/DataTable";

const tocItems: TocItem[] = [
  { id: "shorthand", title: "Shorthand Strings", level: 2 },
  { id: "format-config", title: "FormatConfig Objects", level: 2 },
  { id: "fmt-helper", title: "The fmt() Helper", level: 2 },
  { id: "compact", title: "Compact Modes", level: 2 },
  { id: "duration", title: "Duration Styles", level: 2 },
  { id: "conditions", title: "Conditional Formatting", level: 2 },
  { id: "locale", title: "Locale Integration", level: 2 },
];

export default function FormatEngineGuide() {
  return (
    <DocPageLayout tocItems={tocItems} maxWidth="prose">
      <GuideHero
        title="Format Engine"
        description={`Every MetricUI component uses a built-in format engine. Pass a shorthand string or a full config object to any format prop.`}
      />

      <DocSection id="shorthand" title="Shorthand Strings">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          The simplest way to format values. Pass a string to any <code className="font-[family-name:var(--font-mono)] text-[13px]">format</code> prop:
        </p>
        <DataTable
          data={[
            { shorthand: '"number"', description: "Auto-compact with K/M/B/T suffixes", example: '"1.2K", "3.5M"' },
            { shorthand: '"compact"', description: 'Same as "number" with compact: true', example: '"1.2K", "3.5M"' },
            { shorthand: '"currency"', description: "Currency with compact suffixes", example: '"$1.2K", "$3.5M"' },
            { shorthand: '"percent"', description: "Percentage with 1 decimal", example: '"12.5%"' },
            { shorthand: '"duration"', description: "Human-readable duration from seconds", example: '"5m 30s"' },
            { shorthand: '"custom"', description: "Base format — use prefix/suffix", example: '"12.5 items"' },
          ]}
          columns={[
            { key: "shorthand", header: "Shorthand", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
            { key: "description", header: "Description" },
            { key: "example", header: "Example" },
          ]}
          dense
          variant="ghost"
        />
      </DocSection>

      <DocSection id="format-config" title="FormatConfig Objects">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          For fine control, pass an object with the fields you need:
        </p>
        <CodeBlock
          code={`// Currency in EUR with 2 decimals, no compacting
format={{ style: "currency", currency: "EUR", compact: false, precision: 2 }}

// Percent where input is decimal (0.12 = 12%)
format={{ style: "percent", percentInput: "decimal" }}

// Duration from milliseconds, clock style
format={{ style: "duration", durationInput: "milliseconds", durationStyle: "clock" }}

// Compact to millions only
format={{ style: "number", compact: "millions" }}

// Custom prefix/suffix
format={{ style: "number", prefix: "~", suffix: " users", compact: false }}`}
        />
      </DocSection>

      <DocSection id="fmt-helper" title="The fmt() Helper">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Build FormatConfig objects with less boilerplate:
        </p>
        <CodeBlock
          code={`import { fmt } from "metricui";

format={fmt("currency", { precision: 2 })}
format={fmt("compact")}
format={fmt("percent", { percentInput: "decimal" })}`}
        />
      </DocSection>

      <DocSection id="compact" title="Compact Modes">
        <DataTable
          data={[
            { value: 'true / "auto"', behavior: "Auto-pick K/M/B/T based on magnitude" },
            { value: '"thousands"', behavior: "Always divide by 1,000 and append K" },
            { value: '"millions"', behavior: "Always divide by 1,000,000 and append M" },
            { value: '"billions"', behavior: "Always divide by 1,000,000,000 and append B" },
            { value: '"trillions"', behavior: "Always divide by 1,000,000,000,000 and append T" },
            { value: "false", behavior: "No compacting, show full number" },
          ]}
          columns={[
            { key: "value", header: "Value", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
            { key: "behavior", header: "Behavior" },
          ]}
          dense
          variant="ghost"
        />
      </DocSection>

      <DocSection id="duration" title="Duration Styles">
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-[14px] font-semibold text-[var(--foreground)]">Styles</h3>
            <DataTable
              data={[
                { style: '"compact"', example: '"5m 30s", "2h 15m"' },
                { style: '"long"', example: '"5 minutes 30 seconds"' },
                { style: '"clock"', example: '"5:30", "2:15:30"' },
                { style: '"narrow"', example: '"5.5m", "2.3h"' },
              ]}
              columns={[
                { key: "style", header: "Style", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
                { key: "example", header: "Example" },
              ]}
              dense
              variant="ghost"
            />
          </div>
          <div>
            <h3 className="mb-3 text-[14px] font-semibold text-[var(--foreground)]">Precision (smallest unit shown)</h3>
            <DataTable
              data={[
                { precision: '"milliseconds"', example: '"5m 30s 250ms"' },
                { precision: '"seconds"', example: '"5m 30s" (default)' },
                { precision: '"minutes"', example: '"2h 30m"' },
                { precision: '"hours"', example: '"3d 4h"' },
                { precision: '"days"', example: '"2w 3d"' },
              ]}
              columns={[
                { key: "precision", header: "Precision", render: (v) => <code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{String(v)}</code> },
                { key: "example", header: "Example" },
              ]}
              dense
              variant="ghost"
            />
          </div>
        </div>
      </DocSection>

      <DocSection id="conditions" title="Conditional Formatting">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          Use the <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">conditions</code> prop
          on KpiCard to color values based on thresholds. Rules are evaluated top-to-bottom — first match wins.
        </p>
        <CodeBlock
          code={`conditions={[
  { when: "above", value: 100, color: "emerald" },
  { when: "between", min: 50, max: 100, color: "amber" },
  { when: "below", value: 50, color: "red" },
]}`}
        />
        <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
          <strong>Operators:</strong> <code className="font-[family-name:var(--font-mono)] text-[12px]">above</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[12px]">below</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[12px]">between</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[12px]">equals</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[12px]">not_equals</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[12px]">at_or_above</code>,{" "}
          <code className="font-[family-name:var(--font-mono)] text-[12px]">at_or_below</code>
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">
          <strong>Named colors:</strong> emerald, red, amber, blue, indigo, purple, pink, cyan.
          Or use any CSS color string.
        </p>
        <p className="mt-4 text-[14px] font-semibold text-[var(--foreground)]">Compound conditions</p>
        <CodeBlock
          code={`conditions={[
  {
    when: "and",
    rules: [
      { operator: "above", value: 50 },
      { operator: "below", value: 100 },
    ],
    color: "amber",
  },
]}`}
          className="mt-3"
        />
      </DocSection>

      <DocSection id="locale" title="Locale Integration">
        <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
          The format engine respects MetricProvider&apos;s <code className="font-[family-name:var(--font-mono)] text-[13px]">locale</code> and{" "}
          <code className="font-[family-name:var(--font-mono)] text-[13px]">currency</code> settings.
          Individual format configs can override with their own locale/currency fields.
        </p>
        <CodeBlock
          code={`<MetricProvider locale="de-DE" currency="EUR">
  <KpiCard title="Umsatz" value={142300} format="currency" />
  {/* Renders: "142,3 Tsd. €" */}
</MetricProvider>`}
        />
      </DocSection>
    </DocPageLayout>
  );
}
