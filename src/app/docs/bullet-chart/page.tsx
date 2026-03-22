"use client";

import { DocSection } from "@/components/docs/DocSection";

export default function BulletChartPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <div className="space-y-4">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">Chart</span>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">BulletChart</h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Actual vs target with qualitative range bands.
        </p>
      </div>

      <DocSection id="what-it-does" title="What it does">
        <p className="text-[var(--muted)] leading-relaxed">
          Compare actual performance against targets with qualitative range bands.
          Ideal for OKR scorecards, KPI targets, and quota tracking.
        </p>
      </DocSection>

      <DocSection id="features" title="Features">
        <ul className="list-disc list-inside text-[var(--muted)] space-y-1.5">
          <li>Full and simple data formats</li>
          <li>Horizontal and vertical orientation</li>
          <li>Configurable range bands and measure bars</li>
          <li>Target marker lines</li>
          <li>Format engine integration</li>
          <li>Full theming and data state support</li>
        </ul>
      </DocSection>

      <DocSection id="usage" title="Usage">
        <pre className="mt-4 p-4 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] font-mono text-sm">
{`import { BulletChart } from "metricui";

<BulletChart
  data={[
    {
      id: "Revenue",
      ranges: [0, 50000, 80000, 100000],
      measures: [72000],
      markers: [85000],
    },
  ]}
  title="Revenue vs Target"
  format="currency"
  height={120}
/>`}
        </pre>
      </DocSection>
    </div>
  );
}
