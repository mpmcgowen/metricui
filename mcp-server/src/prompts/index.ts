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
- Structured filter layout container (auto tags, badge, collapsible) → FilterBar
- Click-to-filter across charts (signal only) → CrossFilterProvider + useCrossFilter

**Drill-Down:**
- Click-to-detail on any chart, table, or card → DrillDown.Root + \`drillDown\` prop
- Zero-config auto-table: \`drillDown={true}\` → auto-generates summary KPI row + filtered DataTable
- Custom content: \`drillDown={(event) => <CustomContent />}\` → full control over panel
- Two modes: \`drillDownMode="slide-over"\` (default) or \`"modal"\`

**Coordination:**
- Synced hover/crosshairs across sibling charts → LinkedHoverProvider
- Flash CSS class when a value changes (live dashboards) → useValueFlash

## Architecture — ALWAYS follow this

1. Wrap in \`<MetricProvider theme="emerald">\` (or any preset: indigo, rose, amber, cyan, violet, slate, orange)
2. Wrap in \`<FilterProvider defaultPreset="30d">\` for time filtering. Add \`<CrossFilterProvider>\` if charts should cross-filter each other
3. Use \`<DashboardHeader title="..." lastUpdated={new Date()} actions={<PeriodSelector comparison />}>\` — NOT a raw \`<h1>\`
4. Use \`<MetricGrid>\` for layout with \`<MetricGrid.Section>\` dividers — NOT manual CSS grid
5. Every numeric value uses the format engine: \`format="currency"\`, \`format="percent"\`, etc.
6. Handle data states: \`loading\`, \`empty\`, \`error\` props — CardShell auto-detects empty data and shows a smart default message
7. Enable exports: \`<MetricProvider exportable>\` adds PNG/CSV/clipboard export to all data components. Override per-component with \`exportable={{ data: rows }}\` or \`exportable={false}\`
8. Use \`<FilterBar>\` with Primary/Secondary slots instead of manually laying out filter controls
9. All imports from \`"metricui"\`

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
- **Cross-filtering** — wrap in \`<CrossFilterProvider>\`, add \`crossFilter\` to charts. Click a bar/slice to set filter, read with \`useCrossFilter()\`, filter your data. Signal only — never changes chart appearance
- **Drill-down** — wrap in \`<DrillDown.Root>\`, add \`drillDown\` to charts/tables/cards. \`drillDown={true}\` auto-generates a summary + DataTable. \`drillDown={(event) => ...}\` for custom content. \`drillDownMode="slide-over"\` or \`"modal"\`. When both drillDown and crossFilter are set, drillDown wins
- **Linked hover** — wrap charts in \`<LinkedHoverProvider>\`. Crosshairs and tooltips sync across siblings automatically. No extra props needed
- **Value flash** — \`useValueFlash(value)\` returns "mu-value-flash" class when value changes. Great for live dashboards
- **Export** — \`<MetricProvider exportable>\` adds a dropdown (PNG/CSV/clipboard) to every data component. KPI cards export single value by default, override with \`exportable={{ data: detailRows }}\`. Charts auto-export source data. Clean filenames with filter context metadata
- **FilterBar** — \`<FilterBar collapsible badge={<Count />}>\` with \`FilterBar.Primary\` and \`FilterBar.Secondary\` slots. Auto-renders FilterTags, active filter count, clear-all
- **Auto empty states** — CardShell auto-detects empty data and shows "Nothing to show — try adjusting your filters". Override globally via MetricProvider.emptyState or per-component via \`empty\` prop
- **useCrossFilteredData** — one-line convenience: \`const data = useCrossFilteredData(allData, "country")\` — returns filtered or original data based on active cross-filter
- **referenceDate** — \`<FilterProvider referenceDate={new Date('2024-12-31')}>\` anchors preset calculations to a historical date instead of now

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

  // --- convert_dashboard ---
  server.prompt(
    "convert_dashboard",
    "Convert a screenshot, mockup, or hand-drawn sketch of a dashboard into MetricUI code",
    {
      description: z.string().optional().describe("Optional description of what the image shows or any specific requirements"),
    },
    ({ description }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are converting a visual dashboard — a screenshot, mockup, wireframe, or hand-drawn sketch — into production-quality MetricUI code.

The user has shared an image in this conversation. Analyze it carefully and generate a complete MetricUI dashboard that faithfully recreates what you see.

${description ? `**User notes:** ${description}\n` : ""}
## Step 1: Identify Visual Elements

Scan the image top-to-bottom, left-to-right. For each element, classify it:

| Visual Pattern | MetricUI Component |
|---|---|
| Big number with label, trend arrow, or percentage change | **KpiCard** |
| Row of metric boxes | **StatGroup** or multiple **KpiCard** in MetricGrid |
| Small inline trend line inside a card | KpiCard with **sparkline** prop |
| Progress bar or target indicator | KpiCard with **goal** prop |
| Color-coded metric (green/red based on value) | KpiCard with **conditions** prop |
| Filled area chart / trend over time | **AreaChart** |
| Line chart | **LineChart** |
| Vertical or horizontal bars | **BarChart** (use \`preset="horizontal"\` if horizontal) |
| Grouped or stacked bars | BarChart with \`preset="grouped"\` or \`preset="percent"\` |
| Bars with an overlaid line | **BarLineChart** |
| Pie or donut | **DonutChart** |
| Gauge / dial / score | **Gauge** |
| Funnel / conversion steps | **Funnel** |
| Waterfall / bridge chart | **Waterfall** |
| Bullet / target vs actual bars | **BulletChart** |
| Color-intensity grid (day/hour matrix) | **HeatMap** |
| Data table with rows and columns | **DataTable** |
| Status dot or health indicator | **StatusIndicator** |
| Alert box or callout message | **Callout** |
| Badge or tag label | **Badge** |
| Date range picker or period selector | **PeriodSelector** |
| Toggle/segment control | **SegmentToggle** |
| Dropdown filter | **DropdownFilter** |
| Filter chips/tags | **FilterTags** |
| Horizontal dashed line on a chart | **referenceLines** prop |
| Colored band/zone on a chart | **thresholds** prop |
| Title bar with status or timestamp | **DashboardHeader** |
| Section heading with optional action | **SectionHeader** or **MetricGrid.Section** |

## Step 2: Detect Layout

- Count columns of KPI cards → MetricGrid handles this automatically (up to 4 per row)
- Charts side by side → MetricGrid pairs them automatically
- Full-width table → MetricGrid gives tables full width
- Do NOT write custom CSS grid — use \`<MetricGrid>\` and let it handle layout

## Step 3: Infer Styling

- **Theme**: Match the dominant accent color to a preset:
  - Blue/indigo → \`theme="indigo"\`
  - Green/teal → \`theme="emerald"\`
  - Red/pink → \`theme="rose"\`
  - Yellow/orange → \`theme="amber"\`
  - Cyan/sky blue → \`theme="cyan"\`
  - Purple → \`theme="violet"\`
  - Gray/neutral → \`theme="slate"\`
  - Orange → \`theme="orange"\`
- **Dark mode**: If the background is dark, the theme handles this automatically via \`<html class="dark">\`
- **Card style**: If cards have borders → \`variant="outlined"\`, shadows → \`variant="elevated"\`, flat → \`variant="ghost"\`
- **Density**: If the layout looks compact/tight → \`dense\`

## Step 4: Infer Data Formats

Look at the values in the image and apply the right format:
- Dollar signs, currency symbols → \`format="currency"\`
- Percentage signs → \`format="percent"\`
- Large numbers with K/M/B suffixes → \`format="compact"\`
- Time durations (2h 30m, 45s) → \`format="duration"\`
- Regular numbers → \`format="number"\`
- Custom units (°F, mph, ms) → \`format={{ style: "number", suffix: "°F" }}\`

## Step 5: Generate Code

Build a complete, working page:

1. Wrap everything in \`<Dashboard theme="..." exportable filters={{ defaultPreset: "30d" }}>\`
2. Add \`<DashboardHeader>\` matching the title/subtitle you see
3. Use \`<MetricGrid>\` for layout
4. Generate realistic sample data that matches the visual — correct magnitudes, trends, labels
5. Use advanced features where the image suggests them (sparklines, conditions, goals, reference lines)
6. Handle data states: add \`loading\`, \`empty\`, \`error\` props
7. All imports from \`"metricui"\`

## Important

- **Be faithful to the image.** Don't add components that aren't visible. Don't remove things you can see.
- **Infer reasonable data.** If the image shows "Revenue: $1.2M" with an upward trend, generate sample data that reflects ~$1.2M with growth.
- **Use the MCP tools** to verify your work:
  - \`get_component_api("KpiCard")\` for exact props
  - \`validate_props("AreaChart", { ... })\` to check your config
  - \`suggest_format("revenue")\` for format config
  - \`generate_table_columns([...])\` for DataTable columns`,
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
