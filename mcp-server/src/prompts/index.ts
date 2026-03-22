import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { COMPONENTS } from "../knowledge/components.js";

export function registerPrompts(server: McpServer): void {

  // --- build_dashboard ---
  server.prompt(
    "build_dashboard",
    "Guide for building a MetricUI dashboard from scratch",
    { description: z.string().describe("What the dashboard should show") },
    ({ description }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are building a production-quality dashboard using MetricUI — a premium React component library for analytics dashboards.

## Component Selection Guide

**KPI & Metrics:**
- Single metric with sparkline, goal progress, conditional coloring → KpiCard
- Multiple metrics summary bar → StatGroup

**Charts:**
- Trend over time (with reference lines, comparison overlays, threshold bands) → AreaChart or LineChart
- Category comparison (grouped, stacked, horizontal, sorted, with targets) → BarChart
- Part of whole / composition → DonutChart
- Bars + line dual-axis overlay → BarLineChart
- Inline trend in a card or table cell → Sparkline
- Gauge / health score / progress → Gauge
- Day/hour activity matrix → HeatMap
- Conversion pipeline → Funnel
- P&L bridge / sequential changes → Waterfall
- Multiple measures vs targets → BulletChart

**Data & Status:**
- Tabular data with sort, search, pagination, expandable rows → DataTable
- Data-driven alerts that auto-pick severity from a value → Callout
- Service health / uptime with threshold rules → StatusIndicator
- Styled labels/tags → Badge

**Layout:**
- Dashboard title bar with live/stale status, "Updated Xm ago" → DashboardHeader
- Section labels with action slots → SectionHeader / MetricGrid.Section
- Visual separators → Divider
- Auto-layout grid (drop components in, zero CSS needed) → MetricGrid

**Filters:**
- Date range with comparison toggle → PeriodSelector
- Pill-style segment/view switcher → SegmentToggle
- Multi-select dimension filter → DropdownFilter
- Active filter chip display → FilterTags
- Shared filter state context → FilterProvider

## Architecture — ALWAYS follow this

1. Wrap in \`<MetricProvider theme="emerald">\` (or any preset: indigo, rose, amber, cyan, violet, slate, orange)
2. Wrap in \`<FilterProvider defaultPreset="30d">\` for time filtering
3. Use \`<DashboardHeader title="..." lastUpdated={new Date()} actions={<PeriodSelector comparison />}>\` — NOT a raw \`<h1>\`
4. Use \`<MetricGrid>\` for layout with \`<MetricGrid.Section>\` dividers — NOT manual CSS grid
5. Every numeric value uses the format engine: \`format="currency"\`, \`format="percent"\`, etc.
6. Handle data states: \`loading\`, \`empty\`, \`error\` props
7. All imports from \`"metricui"\`

## Make It Impressive — Use These Features

- **KpiCard conditions** — auto-color values: \`conditions={[{ when: "above", value: X, color: "emerald" }, ...]}\`
- **KpiCard goal** — progress bar: \`goal={{ value: target, showTarget: true }}\`
- **KpiCard multiple comparisons** — \`comparison={[{ value: X, label: "vs last month" }, { value: Y, label: "vs last year" }]}\`
- **KpiCard sparkline with overlay** — \`sparkline={{ data: [...], previousPeriod: [...], interactive: true }}\`
- **Reference lines** on charts — \`referenceLines={[{ axis: "y", value: 50000, label: "Target", style: "dashed" }]}\`
- **Threshold bands** on charts — \`thresholds={[{ from: 0, to: 30000, color: "#EF4444", opacity: 0.05 }]}\`
- **Comparison overlay** — \`comparisonData={previousPeriodData}\` for period-over-period chart comparison
- **BarChart presets** — \`preset="grouped"\`, \`"horizontal"\`, \`"percent"\`
- **Callout with rules** — data-driven alerts: \`rules={[{ min: 10, variant: "success", message: "Growth at {value}%" }]}\`
- **StatusIndicator with pulse** — \`rules={[{ min: 99, color: "emerald" }, { max: 99, color: "red", pulse: true }]}\`
- **Axis labels** — \`xAxisLabel="Month"\` and \`yAxisLabel="Revenue ($)"\` for context

## Format Mapping
- Revenue/money → \`format="currency"\`
- Percentages → \`format="percent"\`
- Large counts → \`format="compact"\`
- Counts → \`format="number"\`
- Time spans → \`format="duration"\`

## Your Task
Build a dashboard for: ${description}

Use the MCP tools to look up specific component APIs:
- \`get_component_api("KpiCard")\` for prop details
- \`get_component_example("AreaChart", ["referenceLines", "thresholds"])\` for advanced examples
- \`suggest_format("revenue")\` for format config
- \`generate_table_columns(...)\` for DataTable columns
- \`validate_props(...)\` to check your work`,
        },
      }],
    })
  );

  // --- review_dashboard ---
  server.prompt(
    "review_dashboard",
    "Review existing MetricUI code for best practices and common issues",
    { code: z.string().describe("The MetricUI code to review") },
    ({ code }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Review this MetricUI code for best practices:

\`\`\`tsx
${code}
\`\`\`

## Check for:

### Errors
- Missing required props (e.g. BarChart without \`keys\`/\`indexBy\`)
- Wrong data shapes (e.g. AreaChart data without \`id\` and \`data\` fields)
- Type mismatches (string where number expected)

### Deprecations
- \`sparklineData\` → use \`sparkline={{ data: [...] }}\`
- \`compact\` on StatGroup → use \`dense\`
- \`grouped\` on BarChart → use \`groupMode="grouped"\`
- \`label\` on Column → use \`header\`

### Best Practices
- Missing \`<MetricProvider>\` wrapper
- Numeric values without format prop
- Missing loading/error/empty states
- Hardcoded colors instead of variant system
- Missing comparison labels
- Opportunities to use \`simpleData\` shorthand on DonutChart/AreaChart

### Accessibility
- Missing descriptions on charts
- Interactive elements without labels

Use \`validate_props\` tool to verify specific components.`,
        },
      }],
    })
  );

  // --- migrate_to_metricui ---
  server.prompt(
    "migrate_to_metricui",
    "Help migrate dashboard code from another library to MetricUI",
    {
      source_library: z.string().describe("Source library: tremor, shadcn, recharts, nivo, etc."),
      code: z.string().describe("The existing code to migrate"),
    },
    ({ source_library, code }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Migrate this ${source_library} code to MetricUI:

\`\`\`tsx
${code}
\`\`\`

## Migration Guide

### From Tremor
| Tremor | MetricUI |
|--------|----------|
| \`<Card>\` with metric | \`<KpiCard>\` |
| \`<AreaChart>\` | \`<AreaChart>\` (different data shape: \`{ id, data: [{ x, y }] }\`) |
| \`<BarChart>\` | \`<BarChart>\` (needs \`keys\` + \`indexBy\`) |
| \`<DonutChart>\` | \`<DonutChart>\` (or use \`simpleData\` shorthand) |
| \`<Table>\` | \`<DataTable>\` (uses \`Column\` definitions) |
| \`<Metric>\` | \`<KpiCard>\` with format |
| \`<BadgeDelta>\` | \`<KpiCard comparison={...}>\` |

### From Recharts
| Recharts | MetricUI |
|----------|----------|
| \`<LineChart>\` + \`<Line>\` | \`<LineChart data={[{ id, data }]}>\` |
| \`<AreaChart>\` + \`<Area>\` | \`<AreaChart data={[{ id, data }]}>\` |
| \`<BarChart>\` + \`<Bar>\` | \`<BarChart data={rows} keys={keys} indexBy={idx}>\` |
| \`<PieChart>\` + \`<Pie>\` | \`<DonutChart data={slices}>\` |

### Key Differences
1. **Data shape**: MetricUI charts use Nivo's data format, not Recharts format
2. **Formatting**: MetricUI has a built-in format engine — use \`format="currency"\` instead of manual formatting
3. **Theming**: MetricUI uses CSS variables + \`variant\` prop instead of inline styles
4. **State management**: MetricUI has built-in \`loading\`/\`empty\`/\`error\` props
5. **Global config**: Wrap in \`<MetricProvider>\` for shared defaults

Use \`get_component_api\` to look up the exact props for each component.`,
        },
      }],
    })
  );
}
