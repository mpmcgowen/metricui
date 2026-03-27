import type { MetadataRoute } from "next";

const SITE_URL = "https://metricui.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Core pages ──
  const core = [
    { url: SITE_URL, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${SITE_URL}/docs`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/roadmap`, changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  // ── Guides (high value for organic) ──
  const guides = [
    "getting-started",
    "data-format",
    "format-engine",
    "theming",
    "filtering",
    "interactions",
    "data-states",
    "accessibility",
    "ai-tools",
    "mcp-server",
    "cookbook",
  ].map((slug) => ({
    url: `${SITE_URL}/docs/guides/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // ── Compare pages (SEO magnets) ──
  const compare = ["recharts", "tremor", "shadcn", "chartjs", "grafana"].map(
    (slug) => ({
      url: `${SITE_URL}/docs/compare/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }),
  );

  // ── Component docs ──
  const components = [
    "kpi-card",
    "stat-group",
    "area-chart",
    "bar-chart",
    "line-chart",
    "donut-chart",
    "gauge",
    "bullet-chart",
    "heatmap",
    "funnel",
    "bar-line-chart",
    "waterfall",
    "sparkline",
    "scatter-plot",
    "treemap",
    "calendar",
    "radar",
    "sankey",
    "choropleth",
    "bump",
    "dashboard",
    "dashboard-nav",
    "dashboard-header",
    "section-header",
    "divider",
    "metric-grid",
    "ai-insights",
    "drill-down",
    "export",
    "status-indicator",
    "callout",
    "badge",
    "filter-bar",
    "period-selector",
    "segment-toggle",
    "dropdown-filter",
    "filter-tags",
    "data-table",
  ].map((slug) => ({
    url: `${SITE_URL}/docs/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Demos ──
  const demos = ["analytics", "saas", "github", "wikipedia", "world"].map(
    (slug) => ({
      url: `${SITE_URL}/demos/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  return [...core, ...compare, ...guides, ...components, ...demos].map(
    (entry) => ({
      ...entry,
      lastModified: now,
    }),
  );
}
