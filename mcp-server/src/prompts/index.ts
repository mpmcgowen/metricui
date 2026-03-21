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
          text: `You are building a dashboard using MetricUI — a React component library for analytics dashboards.

## Available Components
${COMPONENTS.map((c) => `- **${c.name}** (${c.category}): ${c.description}`).join("\n")}

## Architecture
1. Wrap everything in \`<MetricProvider>\` for global config (variant, dense, animate, locale, currency)
2. Use CSS grid for layout: \`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4\`
3. Every numeric value should use the format engine: \`format="currency"\`, \`format="percent"\`, etc.
4. Handle data states: pass \`loading\`, \`empty\`, \`error\` props
5. All imports come from \`"metricui"\`

## Component Selection Guide
- Single metric → KpiCard
- Multiple metrics at a glance → StatGroup
- Trend over time → AreaChart or LineChart
- Category comparison → BarChart
- Part of whole → DonutChart
- Bars + line overlay → BarLineChart
- Inline trend → Sparkline
- Detailed data → DataTable
- Labels/tags → Badge

## Format Mapping
- Revenue/money → \`format="currency"\`
- Percentages → \`format="percent"\`
- Counts → \`format="number"\`
- Time spans → \`format="duration"\`

## Your Task
Build a dashboard for: ${description}

Use the MCP tools to look up specific component APIs:
- \`get_component_api("KpiCard")\` for prop details
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
