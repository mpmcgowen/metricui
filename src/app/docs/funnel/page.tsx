"use client";

import { DocSection } from "@/components/docs/DocSection";
import { Badge } from "@/components/ui/Badge";

export default function FunnelPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <div className="space-y-4">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">Chart</span>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Funnel</h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Conversion funnel chart showing value drop-off between stages.
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
          Visualize conversion funnels with automatic rate calculations between stages.
          Supports vertical and horizontal layouts, smooth and linear interpolation,
          conversion annotations, and the unified data format.
        </p>
      </DocSection>

      <DocSection id="features" title="Features">
        <ul className="list-disc list-inside text-[var(--muted)] space-y-1.5">
          <li>Vertical and horizontal layouts</li>
          <li>Automatic conversion rate annotations</li>
          <li>Smooth and linear interpolation</li>
          <li>Simple data shorthand format</li>
          <li>Click handlers with stage data</li>
          <li>Full theming and data state support</li>
        </ul>
      </DocSection>

      <DocSection id="get-pro" title="Get MetricUI Pro">
        <p className="text-[var(--muted)] leading-relaxed">
          Funnel is available in <code className="font-mono">@metricui/pro</code> alongside
          Waterfall, BulletChart, and more advanced features coming soon.
        </p>
        <pre className="mt-4 p-4 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] font-mono text-sm">
{`npm install @metricui/pro

import { Funnel } from "@metricui/pro";`}
        </pre>
      </DocSection>
    </div>
  );
}
