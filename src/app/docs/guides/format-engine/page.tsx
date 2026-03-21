import { DocSection } from "@/components/docs/DocSection";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { OnThisPage } from "@/components/docs/OnThisPage";
import type { TocItem } from "@/components/docs/OnThisPage";

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
    <div className="flex">
      <div className="min-w-0 flex-1 px-8 py-8 lg:max-w-3xl">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">
          Guide
        </span>
        <h1 className="mt-1 text-3xl font-bold text-[var(--foreground)]">
          Format Engine
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Every MetricUI component uses a built-in format engine. Pass a shorthand string
          or a full config object to any <code className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">format</code> prop.
        </p>

        <DocSection id="shorthand" title="Shorthand Strings">
          <p className="mb-4 text-[14px] leading-relaxed text-[var(--muted)]">
            The simplest way to format values. Pass a string to any <code className="font-[family-name:var(--font-mono)] text-[13px]">format</code> prop:
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--card-border)]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Shorthand</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Description</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Example</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {[
                  ['"number"', "Auto-compact with K/M/B/T suffixes", '"1.2K", "3.5M"'],
                  ['"compact"', 'Same as "number" with compact: true', '"1.2K", "3.5M"'],
                  ['"currency"', "Currency with compact suffixes", '"$1.2K", "$3.5M"'],
                  ['"percent"', "Percentage with 1 decimal", '"12.5%"'],
                  ['"duration"', "Human-readable duration from seconds", '"5m 30s"'],
                  ['"custom"', "Base format — use prefix/suffix", '"12.5 items"'],
                ].map(([shorthand, desc, example]) => (
                  <tr key={shorthand} className="border-b border-[var(--card-border)] last:border-0">
                    <td className="px-4 py-2.5"><code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{shorthand}</code></td>
                    <td className="px-4 py-2.5 text-[var(--foreground)]">{desc}</td>
                    <td className="px-4 py-2.5 text-[var(--muted)]">{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          <div className="overflow-x-auto rounded-xl border border-[var(--card-border)]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Value</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Behavior</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {[
                  ['true / "auto"', "Auto-pick K/M/B/T based on magnitude"],
                  ['"thousands"', "Always divide by 1,000 and append K"],
                  ['"millions"', "Always divide by 1,000,000 and append M"],
                  ['"billions"', "Always divide by 1,000,000,000 and append B"],
                  ['"trillions"', "Always divide by 1,000,000,000,000 and append T"],
                  ["false", "No compacting, show full number"],
                ].map(([val, behavior]) => (
                  <tr key={val} className="border-b border-[var(--card-border)] last:border-0">
                    <td className="px-4 py-2.5"><code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{val}</code></td>
                    <td className="px-4 py-2.5 text-[var(--foreground)]">{behavior}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>

        <DocSection id="duration" title="Duration Styles">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-[14px] font-semibold text-[var(--foreground)]">Styles</h3>
              <div className="overflow-x-auto rounded-xl border border-[var(--card-border)]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
                      <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Style</th>
                      <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Example</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px]">
                    {[
                      ['"compact"', '"5m 30s", "2h 15m"'],
                      ['"long"', '"5 minutes 30 seconds"'],
                      ['"clock"', '"5:30", "2:15:30"'],
                      ['"narrow"', '"5.5m", "2.3h"'],
                    ].map(([style, example]) => (
                      <tr key={style} className="border-b border-[var(--card-border)] last:border-0">
                        <td className="px-4 py-2.5"><code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{style}</code></td>
                        <td className="px-4 py-2.5 text-[var(--muted)]">{example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-[14px] font-semibold text-[var(--foreground)]">Precision (smallest unit shown)</h3>
              <div className="overflow-x-auto rounded-xl border border-[var(--card-border)]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
                      <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Precision</th>
                      <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Example</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px]">
                    {[
                      ['"milliseconds"', '"5m 30s 250ms"'],
                      ['"seconds"', '"5m 30s" (default)'],
                      ['"minutes"', '"2h 30m"'],
                      ['"hours"', '"3d 4h"'],
                      ['"days"', '"2w 3d"'],
                    ].map(([prec, example]) => (
                      <tr key={prec} className="border-b border-[var(--card-border)] last:border-0">
                        <td className="px-4 py-2.5"><code className="font-[family-name:var(--font-mono)] text-[var(--accent)]">{prec}</code></td>
                        <td className="px-4 py-2.5 text-[var(--muted)]">{example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
      </div>

      <div className="hidden w-48 flex-shrink-0 xl:block">
        <div className="sticky top-8 pt-8">
          <OnThisPage items={tocItems} />
        </div>
      </div>
    </div>
  );
}
