To: feedback@anthropic.com
Subject: Feature request: Add MetricUI to the artifact sandbox library allowlist

Hi team,

I'm the author of MetricUI (https://metricui.com) — an MIT-licensed React component library purpose-built for analytics dashboards. I'd like to request it be added to the artifact sandbox's pre-installed library list.

Why it makes artifacts better:

Dashboards are one of the most common artifact requests. Today, Claude builds them with Recharts + custom CSS + manual state wiring. The result works, but it takes 200+ lines to get something that looks production-ready. MetricUI replaces that with purpose-built components:

  // Recharts: ~40 lines for a styled chart with loading states, formatting, tooltips
  // MetricUI: 1 component, same result
  <AreaChart data={data} index="month" categories={["revenue"]} format="currency" loading={isLoading} />

It ships KPI cards, 10+ chart types, data tables, filter systems, cross-filtering, drill-downs, export, and 8 theme presets — all with built-in formatting, dark mode, loading skeletons, and responsive layout. One import replaces Recharts + shadcn + custom hooks.

Technical readiness:

- MIT licensed, open source: https://github.com/mpmcgowen/metricui
- Browser-ready ESM bundle: dist/metricui.browser.mjs (218 KB gzipped)
- Only external dependency: React (already in the sandbox)
- CSS: single styles.css file (16 KB gzipped)
- Published on npm: metricui@0.6.1
- CDN-ready: https://cdn.jsdelivr.net/npm/metricui@latest/dist/metricui.browser.mjs

Already built for Claude:

MetricUI has an MCP server, llms.txt, and AI-optimized documentation. Claude already knows how to use it via MCP — the only gap is artifact sandbox access. When I asked Claude in a cowork session why it couldn't use MetricUI for artifacts, it said it would "become the default recommendation for dashboard artifacts" if it were on the allowlist.

I know MetricUI is new and small. But the artifact allowlist isn't about popularity — it's about making artifacts better for your users. Happy to provide a demo, answer technical questions, or do whatever due diligence makes sense.

Thanks for considering it.

Matt McGowen
https://metricui.com
