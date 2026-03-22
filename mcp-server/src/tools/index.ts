import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { COMPONENTS, type ComponentDef } from "../knowledge/components.js";
import { TYPES } from "../knowledge/types.js";
import { FORMAT_EXAMPLES } from "../knowledge/format-examples.js";
import { searchDocs } from "../knowledge/search.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function findComponent(name: string): ComponentDef | undefined {
  return COMPONENTS.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}

function scoreComponent(comp: ComponentDef, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  if (comp.name.toLowerCase().includes(q)) score += 10;
  if (comp.description.toLowerCase().includes(q)) score += 5;
  if (comp.longDescription.toLowerCase().includes(q)) score += 3;
  const words = q.split(/\s+/);
  for (const w of words) {
    if (w.length < 2) continue;
    if (comp.name.toLowerCase().includes(w)) score += 4;
    if (comp.category.includes(w)) score += 3;
    if (comp.description.toLowerCase().includes(w)) score += 2;
    if (comp.longDescription.toLowerCase().includes(w)) score += 1;
    for (const p of comp.props) {
      if (p.name.toLowerCase().includes(w)) score += 1;
    }
    for (const n of comp.notes) {
      if (n.toLowerCase().includes(w)) score += 1;
    }
  }
  return score;
}

function text(content: string) {
  return { content: [{ type: "text" as const, text: content }] };
}


// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

export function registerTools(server: McpServer): void {

  // --- list_components ---
  server.tool(
    "list_components",
    "List all MetricUI components, optionally filtered by category",
    { category: z.enum(["chart", "card", "table", "ui"]).optional().describe("Filter by category") },
    async ({ category }) => {
      const filtered = category
        ? COMPONENTS.filter((c) => c.category === category)
        : COMPONENTS;
      const list = filtered.map((c) => ({
        name: c.name,
        category: c.category,
        description: c.description,
        propCount: c.props.length,
      }));
      return text(JSON.stringify(list, null, 2));
    }
  );

  // --- search_components ---
  server.tool(
    "search_components",
    "Search MetricUI components by use case description. Returns ranked results.",
    { query: z.string().describe("Natural language, e.g. 'show revenue over time' or 'pie chart'") },
    async ({ query }) => {
      const scored = COMPONENTS.map((c) => ({ comp: c, score: scoreComponent(c, query) }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      if (scored.length === 0) {
        return text(`No components matched "${query}". Try: "chart", "metric", "table".`);
      }

      const results = scored.map((s) => ({
        name: s.comp.name,
        category: s.comp.category,
        description: s.comp.description,
        relevance: s.score,
      }));
      return text(JSON.stringify(results, null, 2));
    }
  );

  // --- get_component_api ---
  server.tool(
    "get_component_api",
    "Get the full API reference for a specific MetricUI component — all props, types, defaults, examples",
    { component: z.string().describe("Component name, e.g. 'KpiCard', 'AreaChart', 'DataTable'") },
    async ({ component }) => {
      const comp = findComponent(component);
      if (!comp) {
        return text(`Unknown component "${component}". Available: ${COMPONENTS.map((c) => c.name).join(", ")}`);
      }

      const propsTable = comp.props
        .map((p) => `- **${p.name}** (\`${p.type}\`${p.required ? ", required" : ""})${p.default ? ` — default: \`${p.default}\`` : ""}: ${p.description}${p.deprecated ? ` *(deprecated: ${p.deprecated})*` : ""}`)
        .join("\n");

      const importPkg = "metricui";
      const sections = [
        `# ${comp.name}\n`,
        `${comp.longDescription}\n`,
        `**Import:** \`import { ${comp.importName} } from "${importPkg}"\`\n`,
        `## Props\n\n${propsTable}\n`,
      ];

      if (comp.dataShape) {
        sections.push(`## Data Shape\n\`\`\`typescript\n${comp.dataShape}\n\`\`\`\n`);
      }

      sections.push(`## Minimal Example\n\`\`\`tsx\n${comp.minimalExample}\n\`\`\`\n`);

      for (const ex of comp.examples) {
        sections.push(`### ${ex.title}\n${ex.description}\n\`\`\`tsx\n${ex.code}\n\`\`\`\n`);
      }

      if (comp.configFields.length > 0) {
        sections.push(`## MetricConfig Fields\nReads: ${comp.configFields.join(", ")}\n`);
      }

      return text(sections.join("\n"));
    }
  );

  // --- get_component_example — returns the richest working example for a use case ---
  server.tool(
    "get_component_example",
    "Returns a complete, working code example for a MetricUI component with the requested features enabled. The example uses realistic sample data and has every relevant prop annotated. You adapt the values/labels to your specific use case — the structure and props are correct as-is.",
    {
      component: z.string().describe("Component name: KpiCard, AreaChart, BarChart, DonutChart, LineChart, DataTable, StatGroup, Sparkline, Badge"),
      features: z.array(z.string()).optional().describe("Features to include in the example: comparison, sparkline, goal, conditions, dense, animation, stacked, grouped, horizontal, footer, pagination, etc."),
    },
    async ({ component, features }) => {
      const comp = findComponent(component);
      if (!comp) {
        return text(`Unknown component "${component}". Available: ${COMPONENTS.map((c) => c.name).join(", ")}`);
      }

      const featureSet = new Set((features ?? []).map((f) => f.toLowerCase()));

      // Find the best matching example — prefer examples that match requested features
      let bestExample = comp.minimalExample;
      let bestScore = 0;

      for (const ex of comp.examples) {
        let score = 0;
        const exLower = (ex.title + " " + ex.description + " " + ex.code).toLowerCase();
        for (const f of featureSet) {
          if (exLower.includes(f)) score += 2;
        }
        // Prefer examples with more features (richer = more useful as a template)
        score += (ex.code.match(/\n/g) || []).length * 0.1;
        if (score > bestScore) {
          bestScore = score;
          bestExample = ex.code;
        }
      }

      // If no features matched, use the richest example (most lines of code)
      if (bestScore === 0 && comp.examples.length > 0) {
        bestExample = comp.examples.reduce((best, ex) =>
          ex.code.length > best.code.length ? ex : best
        ).code;
      }

      // Build the response: working example + prop reference for customization
      const importPkg = "metricui";
      const sections: string[] = [
        `# ${comp.name} — Working Example\n`,
        `**Import:** \`import { ${comp.importName} } from "${importPkg}"\`\n`,
        `## Complete Example\n`,
        `Adapt the values, labels, and data to your use case. The structure and props are correct as-is.\n`,
        "```tsx",
        bestExample,
        "```\n",
      ];

      // Add data shape if applicable
      if (comp.dataShape) {
        sections.push(`## Data Shape\n`, "```typescript", comp.dataShape, "```\n");
      }

      // Add key props reference inline — only the most important ones
      const keyProps = comp.props.filter((p) =>
        p.required ||
        featureSet.has(p.name.toLowerCase()) ||
        ["format", "comparison", "sparkline", "goal", "conditions", "title", "value", "data", "keys", "indexBy", "columns", "variant", "dense", "animate"].includes(p.name)
      );

      if (keyProps.length > 0) {
        sections.push(`## Key Props\n`);
        for (const p of keyProps) {
          sections.push(`- **${p.name}** (\`${p.type}\`)${p.default ? ` — default: \`${p.default}\`` : ""}: ${p.description}`);
        }
        sections.push("");
      }

      // Add all other examples as "More patterns"
      if (comp.examples.length > 1) {
        sections.push(`## More Patterns\n`);
        for (const ex of comp.examples) {
          if (ex.code === bestExample) continue;
          sections.push(`### ${ex.title}`, ex.description, "```tsx", ex.code, "```\n");
        }
      }

      if (comp.configFields.length > 0) {
        sections.push(`## MetricConfig\nThis component reads from MetricProvider: ${comp.configFields.join(", ")}\n`);
      }

      return text(sections.join("\n"));
    }
  );

  // --- generate_dashboard (REWRITTEN — production-quality with advanced features) ---
  server.tool(
    "generate_dashboard",
    "Generate a COMPLETE, production-quality MetricUI dashboard with theme presets, MetricGrid auto-layout, DashboardHeader with live status, FilterProvider + PeriodSelector, advanced KpiCards (conditions, goals, sparkline overlays), charts with reference lines and threshold bands, data-driven Callout alerts, and rich DataTable. Returns a full page.tsx file ready to use.",
    {
      description: z.string().describe("Dashboard description: 'SaaS metrics with MRR, churn, user growth, revenue breakdown, and top customers table'"),
      metrics: z.array(z.string()).optional().describe("Specific metrics/sections to include"),
      style: z.enum(["dense", "spacious"]).optional().describe("Layout density"),
      variant: z.enum(["default", "outlined", "ghost", "elevated"]).optional(),
      theme: z.enum(["indigo", "emerald", "rose", "amber", "cyan", "violet", "slate", "orange"]).optional().describe("Theme preset (default: indigo)"),
    },
    async ({ description, metrics, style, variant, theme }) => {
      const dense = style === "dense";
      const v = variant || "default";
      const t = theme || "indigo";
      const descLower = description.toLowerCase();

      // Determine what components to include based on description
      const wantAreaChart = descLower.includes("growth") || descLower.includes("trend") || descLower.includes("over time") || descLower.includes("monthly") || descLower.includes("time series") || descLower.includes("revenue");
      const wantBarChart = descLower.includes("comparison") || descLower.includes("by channel") || descLower.includes("by category") || descLower.includes("performance") || descLower.includes("leaderboard");
      const wantDonut = descLower.includes("breakdown") || descLower.includes("distribution") || descLower.includes("by plan") || descLower.includes("by source") || descLower.includes("composition");
      const wantTable = descLower.includes("table") || descLower.includes("customer") || descLower.includes("product") || descLower.includes("list") || descLower.includes("detail");
      const wantGauge = descLower.includes("gauge") || descLower.includes("health") || descLower.includes("score") || descLower.includes("uptime") || descLower.includes("monitoring");
      const wantFunnel = descLower.includes("funnel") || descLower.includes("pipeline") || descLower.includes("conversion funnel");
      const wantWaterfall = descLower.includes("waterfall") || descLower.includes("bridge") || descLower.includes("p&l") || descLower.includes("profit");

      // If nothing specific was mentioned, include a good mix
      const includeAreaChart = wantAreaChart || (!wantBarChart && !wantDonut);
      const includeDonut = wantDonut || (!wantBarChart);
      const includeBarChart = wantBarChart || true;
      const includeTable = wantTable || true;
      const includeGauge = wantGauge;
      const includeFunnel = wantFunnel;
      const includeWaterfall = wantWaterfall;

      // Determine KPI metrics from description
      const kpiMetrics: { title: string; value: number; prev: number; prev2?: number; format: string; invert: boolean; sparkline: number[]; prevSparkline?: number[]; goalValue?: number; }[] = [];

      if (descLower.includes("mrr") || descLower.includes("revenue")) {
        kpiMetrics.push({ title: "Monthly Revenue", value: 127450, prev: 113500, prev2: 98200, format: "currency", invert: false, sparkline: [89000, 94200, 98800, 103400, 108900, 113500, 127450], prevSparkline: [78000, 82000, 85000, 88000, 91000, 95000, 98200], goalValue: 150000 });
      }
      if (descLower.includes("churn")) {
        kpiMetrics.push({ title: "Churn Rate", value: 3.2, prev: 3.7, format: "percent", invert: true, sparkline: [5.1, 4.8, 4.2, 3.9, 3.7, 3.7, 3.2], goalValue: 2.5 });
      }
      if (descLower.includes("user") || descLower.includes("customer")) {
        kpiMetrics.push({ title: "Active Users", value: 8420, prev: 7680, prev2: 6200, format: "number", invert: false, sparkline: [5200, 5800, 6400, 6900, 7200, 7680, 8420] });
      }
      if (descLower.includes("conversion") || descLower.includes("cvr")) {
        kpiMetrics.push({ title: "Conversion Rate", value: 4.8, prev: 4.2, format: "percent", invert: false, sparkline: [3.1, 3.4, 3.8, 4.0, 4.1, 4.2, 4.8] });
      }
      if (descLower.includes("arpu") || descLower.includes("average")) {
        kpiMetrics.push({ title: "Avg. Revenue / User", value: 37.78, prev: 35.60, format: "currency", invert: false, sparkline: [32.10, 33.40, 34.00, 34.80, 35.20, 35.60, 37.78] });
      }
      if (descLower.includes("arr")) {
        kpiMetrics.push({ title: "Annual Recurring Revenue", value: 1529400, prev: 1362000, format: "currency", invert: false, sparkline: [980000, 1050000, 1120000, 1200000, 1280000, 1362000, 1529400] });
      }

      // Default KPIs if none matched
      if (kpiMetrics.length === 0) {
        kpiMetrics.push(
          { title: "Total Revenue", value: 127450, prev: 113500, prev2: 98200, format: "currency", invert: false, sparkline: [89000, 94200, 98800, 103400, 108900, 113500, 127450], prevSparkline: [78000, 82000, 85000, 88000, 91000, 95000, 98200], goalValue: 150000 },
          { title: "Active Users", value: 8420, prev: 7680, prev2: 6200, format: "number", invert: false, sparkline: [5200, 5800, 6400, 6900, 7200, 7680, 8420] },
          { title: "Conversion", value: 4.8, prev: 4.2, format: "percent", invert: false, sparkline: [3.1, 3.4, 3.8, 4.0, 4.1, 4.2, 4.8] },
          { title: "Churn Rate", value: 3.2, prev: 3.7, format: "percent", invert: true, sparkline: [5.1, 4.8, 4.2, 3.9, 3.7, 3.7, 3.2], goalValue: 2.5 },
        );
      }

      // Build imports
      const imports = new Set(["MetricProvider", "FilterProvider", "DashboardHeader", "PeriodSelector", "MetricGrid", "KpiCard", "Callout"]);
      if (includeAreaChart) imports.add("AreaChart");
      if (includeDonut) imports.add("DonutChart");
      if (includeBarChart) imports.add("BarChart");
      if (includeTable) { imports.add("DataTable"); imports.add("Badge"); }
      if (includeGauge) imports.add("Gauge");
      if (includeFunnel) imports.add("Funnel");
      if (includeWaterfall) imports.add("Waterfall");

      const dashTitle = description.split(/[,.]|\bwith\b/)[0].trim();

      // Build complete file as a single template string for cleaner output
      const code: string[] = [];
      code.push(`"use client";`);
      code.push(``);
      code.push(`import { ${Array.from(imports).join(", ")} } from "metricui";`);
      code.push(`import "metricui/styles.css";`);
      code.push(``);

      // ─── Sample Data ─────────────────────────────────────────
      code.push(`// ─── Sample Data ───────────────────────────────────────────`);
      code.push(``);

      if (includeAreaChart) {
        code.push(`const revenueData = [`);
        code.push(`  { id: "Revenue", data: [`);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const values = [42000, 45200, 48100, 51800, 55400, 58900];
        code.push(`    ${months.map((m, i) => `{ x: "${m}", y: ${values[i]} }`).join(", ")},`);
        code.push(`  ]},`);
        code.push(`];`);
        code.push(``);
        code.push(`const comparisonData = [`);
        code.push(`  { id: "Revenue", data: [`);
        const prevValues = [38000, 39500, 41200, 43800, 45100, 47600];
        code.push(`    ${months.map((m, i) => `{ x: "${m}", y: ${prevValues[i]} }`).join(", ")},`);
        code.push(`  ]},`);
        code.push(`];`);
        code.push(``);
      }

      if (includeDonut) {
        code.push(`const breakdownData = [`);
        code.push(`  { id: "enterprise", label: "Enterprise", value: 48200 },`);
        code.push(`  { id: "pro", label: "Pro", value: 32800 },`);
        code.push(`  { id: "starter", label: "Starter", value: 18400 },`);
        code.push(`];`);
        code.push(``);
      }

      if (includeBarChart) {
        code.push(`const channelData = [`);
        code.push(`  { channel: "Organic", revenue: 28400, conversions: 680 },`);
        code.push(`  { channel: "Paid", revenue: 18200, conversions: 420 },`);
        code.push(`  { channel: "Referral", revenue: 12600, conversions: 312 },`);
        code.push(`  { channel: "Social", revenue: 8400, conversions: 245 },`);
        code.push(`  { channel: "Email", revenue: 6200, conversions: 288 },`);
        code.push(`];`);
        code.push(``);
      }

      if (includeTable) {
        code.push(`const tableData = [`);
        const customers = [
          ["Acme Corp", "Enterprise", 4200, 15.2, "active"],
          ["Globex Inc", "Enterprise", 3800, 8.7, "active"],
          ["Initech", "Pro", 3200, -2.1, "at-risk"],
          ["Umbrella Co", "Pro", 2900, 22.4, "active"],
          ["Stark Industries", "Enterprise", 2750, -5.6, "churning"],
        ];
        for (const [name, plan, mrr, growth, status] of customers) {
          code.push(`  { name: "${name}", plan: "${plan}", mrr: ${mrr}, growth: ${growth}, status: "${status}" },`);
        }
        code.push(`];`);
        code.push(``);
      }

      if (includeFunnel) {
        code.push(`const funnelData = [`);
        code.push(`  { id: "Visitors", label: "Visitors", value: 14200 },`);
        code.push(`  { id: "Signups", label: "Signups", value: 4800 },`);
        code.push(`  { id: "Trials", label: "Trials", value: 2400 },`);
        code.push(`  { id: "Paid", label: "Paid", value: 680 },`);
        code.push(`];`);
        code.push(``);
      }

      if (includeWaterfall) {
        code.push(`const waterfallData = [`);
        code.push(`  { label: "Starting MRR", value: 85000, type: "value" as const },`);
        code.push(`  { label: "New Sales", value: 28400, type: "value" as const },`);
        code.push(`  { label: "Expansion", value: 12600, type: "value" as const },`);
        code.push(`  { label: "Churn", value: -8200, type: "value" as const },`);
        code.push(`  { label: "Contraction", value: -3400, type: "value" as const },`);
        code.push(`  { label: "Ending MRR", value: 0, type: "total" as const },`);
        code.push(`];`);
        code.push(``);
      }

      code.push(`const revenueGrowth = 12.3;`);
      code.push(``);

      // ─── Dashboard Component ─────────────────────────────────
      code.push(`// ─── Dashboard ───────────────────────────────────────────`);
      code.push(``);
      code.push(`export default function Dashboard() {`);
      code.push(`  return (`);
      code.push(`    <MetricProvider theme="${t}"${v !== "default" ? ` variant="${v}"` : ""}${dense ? " dense" : ""}>`);
      code.push(`      <FilterProvider defaultPreset="30d">`);
      code.push(`        <div className="min-h-screen bg-[var(--background)] p-6 lg:p-8">`);
      code.push(`          <div className="mx-auto max-w-7xl">`);
      code.push(``);

      // DashboardHeader
      code.push(`            <DashboardHeader`);
      code.push(`              title="${dashTitle}"`);
      code.push(`              subtitle="Real-time metrics overview"`);
      code.push(`              lastUpdated={new Date()}`);
      code.push(`              actions={<PeriodSelector comparison />}`);
      code.push(`            />`);
      code.push(``);

      code.push(`            <MetricGrid>`);

      // KPI Section
      code.push(`              <MetricGrid.Section title="Key Metrics" />`);
      code.push(``);

      // Generate varied KpiCards — each with different advanced features
      for (let i = 0; i < kpiMetrics.length; i++) {
        const kpi = kpiMetrics[i];
        code.push(`              <KpiCard`);
        code.push(`                title="${kpi.title}"`);
        code.push(`                value={${kpi.value}}`);
        code.push(`                format="${kpi.format}"`);

        // Vary the advanced features per card
        if (i === 0) {
          // Card 1: sparkline with previousPeriod + conditions
          code.push(`                comparison={{ value: ${kpi.prev} }}`);
          code.push(`                comparisonLabel="vs last month"`);
          code.push(`                sparkline={{ data: [${kpi.sparkline.join(", ")}]${kpi.prevSparkline ? `, previousPeriod: [${kpi.prevSparkline.join(", ")}]` : ""}, interactive: true }}`);
          if (kpi.invert) {
            code.push(`                conditions={[`);
            code.push(`                  { when: "below", value: ${kpi.value * 0.8}, color: "emerald" },`);
            code.push(`                  { when: "above", value: ${kpi.value * 1.5}, color: "red" },`);
            code.push(`                ]}`);
          } else {
            code.push(`                conditions={[`);
            code.push(`                  { when: "above", value: ${Math.round(kpi.value * 0.9)}, color: "emerald" },`);
            code.push(`                  { when: "between", min: ${Math.round(kpi.value * 0.7)}, max: ${Math.round(kpi.value * 0.9)}, color: "amber" },`);
            code.push(`                  { when: "below", value: ${Math.round(kpi.value * 0.7)}, color: "red" },`);
            code.push(`                ]}`);
          }
        } else if (i === 1 && kpi.prev2) {
          // Card 2: multiple comparisons + highlight
          code.push(`                comparison={[`);
          code.push(`                  { value: ${kpi.prev}, label: "vs last month" },`);
          code.push(`                  { value: ${kpi.prev2}, label: "vs last year", mode: "both" },`);
          code.push(`                ]}`);
          code.push(`                highlight`);
        } else if (kpi.goalValue) {
          // Card with goal + conditions
          code.push(`                comparison={{ value: ${kpi.prev}${kpi.invert ? ", invertTrend: true" : ""} }}`);
          code.push(`                comparisonLabel="vs last month"`);
          code.push(`                goal={{ value: ${kpi.goalValue}, showTarget: true, showRemaining: true }}`);
          if (kpi.invert) {
            code.push(`                conditions={[`);
            code.push(`                  { when: "below", value: ${kpi.goalValue}, color: "emerald" },`);
            code.push(`                  { when: "above", value: ${kpi.goalValue * 1.5}, color: "red" },`);
            code.push(`                ]}`);
          }
        } else {
          // Card with copyable + drillDown
          code.push(`                comparison={{ value: ${kpi.prev}${kpi.invert ? ", invertTrend: true" : ""} }}`);
          code.push(`                comparisonLabel="vs last month"`);
          code.push(`                sparkline={{ data: [${kpi.sparkline.join(", ")}] }}`);
          code.push(`                copyable`);
          code.push(`                drillDown={{ label: "View breakdown", onClick: () => {} }}`);
        }

        code.push(`                animate={{ countUp: true }}`);
        code.push(`              />`);
        code.push(``);
      }

      // Callout insight
      code.push(`              <Callout`);
      code.push(`                value={revenueGrowth}`);
      code.push(`                rules={[`);
      code.push(`                  { min: 15, variant: "success", title: "Exceptional Growth", message: "Revenue grew {value}% — exceeding target by 50%." },`);
      code.push(`                  { min: 5, max: 15, variant: "info", title: "Healthy Growth", message: "Revenue grew {value}% month-over-month." },`);
      code.push(`                  { min: 0, max: 5, variant: "warning", title: "Slow Growth", message: "Revenue grew only {value}%. Review pipeline." },`);
      code.push(`                  { max: 0, variant: "error", title: "Revenue Declined", message: "Revenue dropped {value}%. Immediate attention needed." },`);
      code.push(`                ]}`);
      code.push(`                action={{ label: "View growth report", onClick: () => {} }}`);
      code.push(`              />`);
      code.push(``);

      // Charts section
      code.push(`              <MetricGrid.Section title="Trends" subtitle="Last 30 days" border />`);
      code.push(``);

      if (includeAreaChart) {
        code.push(`              <AreaChart`);
        code.push(`                data={revenueData}`);
        code.push(`                comparisonData={comparisonData}`);
        code.push(`                format="currency"`);
        code.push(`                title="Revenue Trend"`);
        code.push(`                subtitle="Current vs previous period"`);
        code.push(`                referenceLines={[`);
        code.push(`                  { axis: "y", value: 50000, label: "Target", color: "#10B981", style: "dashed" },`);
        code.push(`                ]}`);
        code.push(`                thresholds={[`);
        code.push(`                  { from: 0, to: 40000, color: "#EF4444", opacity: 0.05 },`);
        code.push(`                ]}`);
        code.push(`                xAxisLabel="Month"`);
        code.push(`                yAxisLabel="Revenue ($)"`);
        code.push(`                height={360}`);
        code.push(`                legend`);
        code.push(`              />`);
        code.push(``);
      }

      if (includeDonut) {
        code.push(`              <DonutChart`);
        code.push(`                data={breakdownData}`);
        code.push(`                format="currency"`);
        code.push(`                title="Revenue by Plan"`);
        code.push(`                centerValue="$99.4K"`);
        code.push(`                centerLabel="Total MRR"`);
        code.push(`                height={360}`);
        code.push(`              />`);
        code.push(``);
      }

      if (includeBarChart) {
        code.push(`              <MetricGrid.Item span="full">`);
        code.push(`                <BarChart`);
        code.push(`                  preset="grouped"`);
        code.push(`                  data={channelData}`);
        code.push(`                  keys={["revenue", "conversions"]}`);
        code.push(`                  indexBy="channel"`);
        code.push(`                  sort="desc"`);
        code.push(`                  format="currency"`);
        code.push(`                  title="Channel Performance"`);
        code.push(`                  subtitle="Revenue and conversions by acquisition channel"`);
        code.push(`                  legend`);
        code.push(`                />`);
        code.push(`              </MetricGrid.Item>`);
        code.push(``);
      }

      if (includeFunnel) {
        code.push(`              <Funnel`);
        code.push(`                data={funnelData}`);
        code.push(`                title="Conversion Funnel"`);
        code.push(`                showConversionRate`);
        code.push(`                format="compact"`);
        code.push(`                height={320}`);
        code.push(`              />`);
        code.push(``);
      }

      if (includeWaterfall) {
        code.push(`              <Waterfall`);
        code.push(`                data={waterfallData}`);
        code.push(`                title="MRR Bridge"`);
        code.push(`                subtitle="Monthly recurring revenue changes"`);
        code.push(`                format="currency"`);
        code.push(`                connectors`);
        code.push(`                height={320}`);
        code.push(`              />`);
        code.push(``);
      }

      if (includeGauge) {
        code.push(`              <Gauge`);
        code.push(`                value={99.2}`);
        code.push(`                title="System Uptime"`);
        code.push(`                format="percent"`);
        code.push(`                thresholds={[`);
        code.push(`                  { value: 99.9, color: "emerald" },`);
        code.push(`                  { value: 99, color: "amber" },`);
        code.push(`                  { value: 100, color: "red" },`);
        code.push(`                ]}`);
        code.push(`                target={99.9}`);
        code.push(`                targetLabel="SLA"`);
        code.push(`                comparison={{ value: 98.8 }}`);
        code.push(`                comparisonLabel="vs last month"`);
        code.push(`              />`);
        code.push(``);
      }

      // Table section
      if (includeTable) {
        code.push(`              <MetricGrid.Section title="Details" border />`);
        code.push(``);
        code.push(`              <DataTable`);
        code.push(`                data={tableData}`);
        code.push(`                title="Top Customers"`);
        code.push(`                subtitle="By monthly recurring revenue"`);
        code.push(`                columns={[`);
        code.push(`                  { key: "name", header: "Customer", sortable: true },`);
        code.push(`                  { key: "plan", header: "Plan",`);
        code.push(`                    render: (v) => <Badge variant={v === "Enterprise" ? "info" : "default"}>{String(v)}</Badge> },`);
        code.push(`                  { key: "mrr", header: "MRR", format: "currency", sortable: true, align: "right" },`);
        code.push(`                  { key: "growth", header: "Growth", sortable: true, align: "right",`);
        code.push(`                    render: (v) => (`);
        code.push(`                      <span className={Number(v) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}>`);
        code.push(`                        {Number(v) >= 0 ? "+" : ""}{v}%`);
        code.push(`                      </span>`);
        code.push(`                    ) },`);
        code.push(`                  { key: "status", header: "Status",`);
        code.push(`                    render: (v) => (`);
        code.push(`                      <Badge variant={v === "active" ? "success" : v === "at-risk" ? "warning" : "danger"}>`);
        code.push(`                        {String(v)}`);
        code.push(`                      </Badge>`);
        code.push(`                    ) },`);
        code.push(`                ]}`);
        code.push(`                searchable`);
        code.push(`                pageSize={10}`);
        code.push(`                footer={{ name: "Total", plan: "", mrr: "$16,850", growth: "", status: "" }}`);
        code.push(`              />`);
      }

      code.push(``);
      code.push(`            </MetricGrid>`);
      code.push(`          </div>`);
      code.push(`        </div>`);
      code.push(`      </FilterProvider>`);
      code.push(`    </MetricProvider>`);
      code.push(`  );`);
      code.push(`}`);

      return text(code.join("\n"));
    }
  );

  // --- generate_data_shape ---
  server.tool(
    "generate_data_shape",
    "Generate the TypeScript interface for a component's required data shape",
    {
      component: z.string().describe("Component name"),
      series: z.array(z.string()).optional().describe("Series/field names to include"),
    },
    async ({ component, series }) => {
      const comp = findComponent(component);
      if (!comp) return text(`Unknown component "${component}".`);
      if (!comp.dataShape) return text(`${component} does not have a specific data shape requirement.`);
      let shape = comp.dataShape;
      if (series?.length) shape += `\n\n// With your series: ${series.join(", ")}`;
      return text(`// Data shape for ${comp.name}\n${shape}`);
    }
  );

  // --- generate_table_columns ---
  server.tool(
    "generate_table_columns",
    "Generate DataTable column definitions from a list of fields",
    {
      fields: z.array(z.object({
        key: z.string(),
        label: z.string().optional(),
        type: z.enum(["string", "number", "currency", "percent", "date", "boolean"]),
        sortable: z.boolean().optional(),
      })).describe("Field definitions"),
    },
    async ({ fields }) => {
      const columns = fields.map((f) => {
        const col: Record<string, unknown> = {
          key: f.key,
          header: f.label ?? f.key.charAt(0).toUpperCase() + f.key.slice(1),
        };
        if (f.sortable !== false) col.sortable = true;
        if (f.type === "currency") col.format = "currency";
        if (f.type === "percent") col.format = "percent";
        if (f.type === "number") col.format = "number";
        if (["number", "currency", "percent"].includes(f.type)) col.align = "right";
        return col;
      });

      const code = [
        `import { DataTable, type Column } from "metricui";`,
        ``,
        `const columns: Column<YourDataType>[] = ${JSON.stringify(columns, null, 2)};`,
        ``,
        `<DataTable data={data} columns={columns} />`,
      ];
      return text(code.join("\n"));
    }
  );

  // --- generate_provider_config ---
  server.tool(
    "generate_provider_config",
    "Generate MetricProvider configuration JSX with only the fields you need",
    {
      locale: z.string().optional(),
      currency: z.string().optional(),
      animate: z.boolean().optional(),
      variant: z.string().optional(),
      dense: z.boolean().optional(),
      nullDisplay: z.string().optional(),
    },
    async (args) => {
      const props: string[] = [];
      if (args.locale) props.push(`locale="${args.locale}"`);
      if (args.currency) props.push(`currency="${args.currency}"`);
      if (args.animate === false) props.push(`animate={false}`);
      if (args.variant && args.variant !== "default") props.push(`variant="${args.variant}"`);
      if (args.dense) props.push(`dense`);
      if (args.nullDisplay && args.nullDisplay !== "dash") props.push(`nullDisplay="${args.nullDisplay}"`);

      const code = props.length > 0
        ? `<MetricProvider ${props.join(" ")}>\n  {/* Your dashboard components */}\n</MetricProvider>`
        : `<MetricProvider>\n  {/* Uses all defaults — no config needed */}\n</MetricProvider>`;

      return text(code);
    }
  );

  // --- validate_props ---
  server.tool(
    "validate_props",
    "Validate a MetricUI component's prop configuration — catches unknown props, type mismatches, deprecated usage, and common mistakes",
    {
      component: z.string(),
      props: z.record(z.string(), z.unknown()).describe("Props to validate as key-value pairs"),
    },
    async ({ component, props }) => {
      const comp = findComponent(component);
      if (!comp) return text(`Unknown component "${component}".`);

      const errors: string[] = [];
      const warnings: string[] = [];
      const propNames = new Set(comp.props.map((p) => p.name));

      for (const key of Object.keys(props)) {
        if (!propNames.has(key) && !["key", "ref", "className", "style", "children"].includes(key)) {
          errors.push(`Unknown prop "${key}" on ${comp.name}`);
        }
      }

      for (const p of comp.props) {
        if (p.deprecated && p.name in props) warnings.push(`Deprecated prop "${p.name}": ${p.deprecated}`);
        if (p.required && !(p.name in props)) errors.push(`Missing required prop "${p.name}" (${p.type})`);
      }

      if (component.toLowerCase() === "kpicard") {
        if ("sparklineData" in props) warnings.push('Use sparkline={{ data: [...] }} instead of sparklineData (deprecated)');
        if ("comparison" in props && !("value" in props)) warnings.push("comparison requires a numeric value");
      }
      if (component.toLowerCase() === "barchart") {
        if (!("keys" in props)) errors.push("BarChart requires 'keys' prop");
        if (!("indexBy" in props)) errors.push("BarChart requires 'indexBy' prop");
        if ("grouped" in props) warnings.push('Use groupMode="grouped" instead of grouped (deprecated)');
      }
      if (component.toLowerCase() === "statgroup") {
        if ("compact" in props) warnings.push('Use dense instead of compact (deprecated)');
      }

      const result: Record<string, unknown> = { valid: errors.length === 0 };
      if (errors.length > 0) result.errors = errors;
      if (warnings.length > 0) result.warnings = warnings;
      return text(JSON.stringify(result, null, 2));
    }
  );

  // --- suggest_format ---
  server.tool(
    "suggest_format",
    "Suggest the right format configuration for a value type",
    {
      valueType: z.string().describe("What kind of value: revenue, percentage, time, count, etc."),
      sampleValue: z.number().optional().describe("A sample value to show formatted output"),
    },
    async ({ valueType, sampleValue }) => {
      const vt = valueType.toLowerCase();
      const matches = FORMAT_EXAMPLES.filter(
        (f) => f.valueType.toLowerCase().includes(vt) ||
               f.keywords.some((k) => k.toLowerCase().includes(vt) || vt.includes(k.toLowerCase()))
      );

      if (matches.length === 0) {
        return text(`No format suggestion for "${valueType}". Available: ${FORMAT_EXAMPLES.map((f) => f.valueType).join(", ")}`);
      }

      return text(JSON.stringify(matches.map((m) => ({
        valueType: m.valueType,
        formatOption: m.formatOption,
        example: m.example,
      })), null, 2));
    }
  );

  // --- get_setup_guide (NEW) ---
  server.tool(
    "get_setup_guide",
    "Get complete setup instructions for MetricUI — install commands, peer dependencies, provider setup, CSS imports, and framework-specific configuration for Next.js, Vite, or CRA.",
    {
      framework: z.enum(["nextjs", "vite", "cra", "remix", "generic"]).optional().describe("Target framework (default: nextjs)"),
    },
    async ({ framework = "nextjs" }) => {
      const guide: string[] = [
        `# MetricUI Setup Guide (${framework})\n`,
        `## 1. Install\n`,
        "```bash",
        `npm install metricui`,
        `# Peer dependencies (install if not already present):`,
        `npm install react react-dom @nivo/line @nivo/bar @nivo/pie @nivo/core lucide-react clsx tailwind-merge`,
        "```\n",
        `## 2. Import CSS\n`,
      ];

      if (framework === "nextjs") {
        guide.push(
          "In your root layout (`app/layout.tsx`):\n",
          "```tsx",
          `import "metricui/styles.css";`,
          "```\n",
          "Or in `app/globals.css`:\n",
          "```css",
          `@import "metricui/styles.css";`,
          "```\n",
        );
      } else if (framework === "vite") {
        guide.push(
          "In your `main.tsx` or `App.tsx`:\n",
          "```tsx",
          `import "metricui/styles.css";`,
          "```\n",
        );
      } else {
        guide.push(
          "Import the CSS in your entry file:\n",
          "```tsx",
          `import "metricui/styles.css";`,
          "```\n",
        );
      }

      guide.push(
        `## 3. Add MetricProvider\n`,
        "Wrap your app (or dashboard section) with MetricProvider:\n",
        "```tsx",
        `import { MetricProvider } from "metricui";`,
        ``,
        `export default function Layout({ children }) {`,
        `  return (`,
        `    <MetricProvider`,
        `      locale="en-US"`,
        `      currency="USD"`,
        `      // variant="elevated"  // optional: global card style`,
        `      // dense               // optional: compact layout`,
        `      // animate={false}     // optional: disable animations`,
        `    >`,
        `      {children}`,
        `    </MetricProvider>`,
        `  );`,
        `}`,
        "```\n",
        `## 4. Use Components\n`,
        "```tsx",
        `import { KpiCard, AreaChart, BarChart, DonutChart, DataTable, StatGroup, Badge } from "metricui";`,
        ``,
        `<KpiCard`,
        `  title="Revenue"`,
        `  value={78400}`,
        `  format="currency"`,
        `  comparison={{ value: 69700 }}`,
        `  comparisonLabel="vs last month"`,
        `  sparkline={{ data: [42, 45, 48, 51, 55, 58, 78] }}`,
        `  animate={{ countUp: true }}`,
        `/>`,
        "```\n",
        `## 5. Dark Mode\n`,
        "Add the `dark` class to your `<html>` element to enable dark mode. MetricUI uses CSS variables that automatically adapt.\n",
        "```tsx",
        `<html className="dark">`,
        "```\n",
        `## Tailwind CSS\n`,
        "MetricUI uses Tailwind internally but ships pre-built CSS. You do NOT need Tailwind in your project. If you do use Tailwind, MetricUI's CSS variables integrate seamlessly.\n",
        `## TypeScript\n`,
        "All components are fully typed. Import types alongside components:\n",
        "```tsx",
        `import { DataTable, type Column, type MetricConfig } from "metricui";`,
        "```",
      );

      return text(guide.join("\n"));
    }
  );

  // --- init_project ---
  server.tool(
    "init_project",
    "Initialize a project for MetricUI — generates CLAUDE.md content with usage instructions so AI tools always use MetricUI components. Run this once per project.",
    {},
    async () => {
      const claudeMd = `# MetricUI Project

This project uses **MetricUI** for all dashboard components. Do NOT use Recharts, Chart.js, raw HTML tables, or hand-rolled visualization components.

## Imports

\`\`\`tsx
import { KpiCard, AreaChart, BarChart, LineChart, DonutChart, DataTable, StatGroup, Sparkline, Badge, MetricProvider } from "metricui";
import "metricui/styles.css";
\`\`\`

## Architecture

- Wrap your app/page in \`<MetricProvider>\` for global config (variant, dense, animate, locale, currency)
- Use the format engine for all numeric values: \`format="currency"\`, \`format="percent"\`, \`format="number"\`, \`format="duration"\`
- Handle data states with \`loading\`, \`empty\`, \`error\` props on every component

## Component Selection

| Need | Component |
|------|-----------|
| Single metric | \`<KpiCard>\` |
| Multiple metrics at a glance | \`<StatGroup>\` |
| Trend over time | \`<AreaChart>\` or \`<LineChart>\` |
| Category comparison | \`<BarChart>\` |
| Part of whole | \`<DonutChart>\` |
| Bars + line overlay | \`<BarLineChart>\` |
| Inline trend | \`<Sparkline>\` |
| Detailed data | \`<DataTable>\` |
| Labels/tags | \`<Badge>\` |

## MCP Tools

Use the MetricUI MCP tools for API lookups:
- \`get_component_api("KpiCard")\` — full prop reference
- \`suggest_format("revenue")\` — format configuration
- \`validate_props("BarChart", { ... })\` — check your work
`;

      const mcpJson = JSON.stringify({
        mcpServers: {
          metricui: {
            command: "npx",
            args: ["-y", "@metricui/mcp-server"],
            env: {},
          },
        },
      }, null, 2);

      return text(`## CLAUDE.md\n\nWrite this to \`CLAUDE.md\` in the project root:\n\n${claudeMd}\n\n## .mcp.json\n\nWrite this to \`.mcp.json\` in the project root so Claude Code auto-connects the MetricUI MCP server:\n\n\`\`\`json\n${mcpJson}\n\`\`\`\n\nThis ensures every developer who opens this project in Claude Code gets MetricUI knowledge automatically.`);
    }
  );

  // --- search_docs ---
  server.tool(
    "search_docs",
    "Search all MetricUI documentation — components, props, types, patterns, format examples, and guides. Returns ranked results with snippets. Use this when a user asks conceptual questions like 'how do I set up dark mode?' or 'what format should I use for currency?'",
    {
      query: z.string().describe("Natural language query, e.g. 'how to format currency', 'dark mode setup', 'table pagination', 'sparkline'"),
      limit: z.number().optional().default(5).describe("Max results to return (default 5)"),
      type: z.enum(["component", "prop", "type", "pattern", "guide", "format", "all"]).optional().default("all").describe("Filter results by content type"),
    },
    async ({ query, limit, type }) => {
      const results = searchDocs(query, limit ?? 5, type ?? "all");
      if (results.length === 0) {
        return text(`No results found for "${query}". Try broader terms or check component names.`);
      }

      const formatted = results
        .map((r, i) => {
          return `${i + 1}. [${r.type}] **${r.title}** (score: ${r.score})\n   ${r.snippet}\n   ref: ${r.reference}`;
        })
        .join("\n\n");

      return text(`Found ${results.length} results for "${query}":\n\n${formatted}`);
    }
  );
}
