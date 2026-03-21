"use client";

import { DocSection } from "@/components/docs/DocSection";
import { Badge } from "@/components/ui/Badge";

export default function WaterfallPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <div className="space-y-4">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">Chart</span>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Waterfall</h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Sequential positive and negative changes from a starting value.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="info">Pro</Badge>
        <span className="text-sm text-[var(--muted)]">
          Part of <code className="font-mono">@metricui/pro</code>
        </span>
      </div>

      <DocSection id="what-it-does" title="What it does">
        <p className="text-[var(--muted)] leading-relaxed">
          Visualize how an initial value is affected by a series of positive and negative changes.
          Perfect for P&amp;L breakdowns, revenue bridges, and budget analysis.
        </p>
      </DocSection>

      <DocSection id="features" title="Features">
        <ul className="list-disc list-inside text-[var(--muted)] space-y-1.5">
          <li>Automatic running total calculation</li>
          <li>Subtotal and total markers</li>
          <li>Connector lines between bars</li>
          <li>Positive/negative/total color coding</li>
          <li>Value labels with format engine</li>
          <li>Full theming and data state support</li>
        </ul>
      </DocSection>

      <DocSection id="get-pro" title="Get MetricUI Pro">
        <p className="text-[var(--muted)] leading-relaxed">
          Waterfall is available in <code className="font-mono">@metricui/pro</code> alongside
          Funnel, BulletChart, and more advanced features coming soon.
        </p>
        <pre className="mt-4 p-4 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] font-mono text-sm">
{`npm install @metricui/pro

import { Waterfall } from "@metricui/pro";`}
        </pre>
      </DocSection>
    </div>
  );
}
