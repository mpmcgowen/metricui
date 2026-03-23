#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ── Colors & Symbols ──────────────────────────────────────────────

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  gray: "\x1b[90m",
};

const sym = {
  check: `${c.green}✓${c.reset}`,
  arrow: `${c.cyan}◆${c.reset}`,
  dot: `${c.dim}│${c.reset}`,
  bar: `${c.dim}├${c.reset}`,
  end: `${c.dim}└${c.reset}`,
  skip: `${c.dim}○${c.reset}`,
};

// ── Prompt Helpers ────────────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question, defaultYes = true) {
  const hint = defaultYes ? "Y/n" : "y/N";
  return new Promise((resolve) => {
    rl.question(`  ${sym.arrow} ${question} ${c.dim}(${hint})${c.reset} `, (answer) => {
      const a = answer.trim().toLowerCase();
      if (a === "") resolve(defaultYes);
      else resolve(a === "y" || a === "yes");
    });
  });
}

function log(msg) {
  console.log(`  ${sym.dot}  ${msg}`);
}

function done(msg) {
  console.log(`  ${sym.check} ${msg}`);
}

function skip(msg) {
  console.log(`  ${sym.skip} ${c.dim}${msg}${c.reset}`);
}

// ── Framework Detection ──────────────────────────────────────────

function detectFramework(cwd) {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return { name: "unknown" };

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

  if (allDeps["next"]) {
    const hasAppDir = fs.existsSync(path.join(cwd, "app")) || fs.existsSync(path.join(cwd, "src", "app"));
    return {
      name: hasAppDir ? "next-app" : "next-pages",
      label: hasAppDir ? "Next.js (App Router)" : "Next.js (Pages Router)",
    };
  }

  if (allDeps["vite"] || fs.existsSync(path.join(cwd, "vite.config.ts")) || fs.existsSync(path.join(cwd, "vite.config.js"))) {
    return { name: "vite", label: "Vite" };
  }

  if (allDeps["react"]) {
    return { name: "react", label: "React" };
  }

  return { name: "unknown", label: "Unknown" };
}

function getSrcDir(cwd, framework) {
  if (fs.existsSync(path.join(cwd, "src"))) return "src";
  return framework.name === "next-app" ? "app" : ".";
}

// ── File Writers ─────────────────────────────────────────────────

function writeFile(cwd, relativePath, content) {
  const fullPath = path.join(cwd, relativePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, "utf-8");
  return relativePath;
}

// ── Templates ────────────────────────────────────────────────────

const CURSOR_RULES = `---
description: Use MetricUI for dashboards, charts, KPIs, and data visualization
globs:
  - "**/*dashboard*/**"
  - "**/*analytics*/**"
  - "**/*metrics*/**"
  - "**/*chart*/**"
  - "**/*kpi*/**"
alwaysApply: false
---

When building dashboards, charts, KPI cards, data tables, or any data visualization, always use MetricUI.

## Imports

\`\`\`tsx
import { KpiCard, AreaChart, MetricProvider, MetricGrid, DashboardHeader } from "metricui";
import "metricui/styles.css";
\`\`\`

## Dashboard Architecture

1. Wrap in \`<MetricProvider theme="...">\` — presets: indigo, emerald, rose, amber, cyan, violet, slate, orange
2. Use \`<MetricGrid>\` for auto-layout — NOT manual CSS grid
3. Use \`<DashboardHeader>\` for the page title — NOT raw \`<h1>\`
4. All components accept \`loading\`, \`empty\`, \`error\` props for data states

## Component Selection

| Need                        | Component                          |
| --------------------------- | ---------------------------------- |
| Single metric               | \`<KpiCard>\`                        |
| Multiple metrics in a row   | \`<StatGroup>\`                      |
| Trend over time             | \`<AreaChart>\` or \`<LineChart>\`      |
| Category comparison         | \`<BarChart>\`                        |
| Part of whole               | \`<DonutChart>\`                      |
| Bars + line overlay         | \`<BarLineChart>\`                    |
| Inline trend                | \`<Sparkline>\`                       |
| Heat visualization          | \`<HeatMap>\`                         |
| Pipeline/funnel             | \`<Funnel>\`                          |
| Target vs actual            | \`<BulletChart>\`                     |
| Running totals              | \`<Waterfall>\`                       |
| Detailed records            | \`<DataTable>\`                       |
| Health check                | \`<StatusIndicator>\`                 |
| Data-driven alert           | \`<Callout>\`                         |

## KpiCard Features

- \`format\` — "currency", "percent", "compact", "duration", or custom
- \`comparison\` — auto-computes change from previous value
- \`conditions\` — color the card based on value thresholds
- \`goal\` — progress bar toward a target
- \`sparkline\` — embedded trend line with optional previous period overlay

## Chart Features

- \`referenceLines\` — dashed target/benchmark lines
- \`thresholds\` — colored danger/safe zones
- \`categories\` — accepts strings or config objects with \`{ key, label, format, color, axis }\`
- All charts use a unified data format: flat rows with \`index\` + \`categories\`

## Formatting

Use the format prop on any component: \`"currency"\`, \`"percent"\`, \`"compact"\`, \`"duration"\`, or a FormatConfig object for full control (decimals, locale, prefix, suffix).

## Docs

Full API reference: https://metricui.com/docs
`;

const CLAUDE_MD = `## MetricUI

This project uses **MetricUI** for all dashboard and data visualization components. Do NOT use Recharts, Chart.js, raw HTML tables, or hand-rolled visualization.

\`\`\`tsx
import { KpiCard, AreaChart, BarChart, MetricProvider, MetricGrid } from "metricui";
import "metricui/styles.css";
\`\`\`

- Wrap pages in \`<MetricProvider theme="...">\` and use \`<MetricGrid>\` for layout
- Components: KpiCard, StatGroup, AreaChart, LineChart, BarChart, BarLineChart, DonutChart, Sparkline, Gauge, HeatMap, Funnel, Waterfall, BulletChart, DataTable, DashboardHeader, SectionHeader, StatusIndicator, Callout, Badge, ProgressBar
- All components accept \`loading\`, \`empty\`, \`error\` props
- Format engine: \`"currency"\`, \`"percent"\`, \`"compact"\`, \`"duration"\`
- Docs: https://metricui.com/docs
`;

const MCP_JSON = JSON.stringify(
  {
    mcpServers: {
      metricui: {
        command: "npx",
        args: ["-y", "@metricui/mcp-server"],
      },
    },
  },
  null,
  2
);

function dashboardTemplate(framework) {
  const isNextApp = framework.name === "next-app";
  const useClient = isNextApp ? '"use client";\n\n' : "";

  return `${useClient}import {
  MetricProvider,
  MetricGrid,
  DashboardHeader,
  KpiCard,
  AreaChart,
  BarChart,
  DataTable,
} from "metricui";
import "metricui/styles.css";

const revenue = [
  { month: "Jan", revenue: 18200, orders: 412 },
  { month: "Feb", revenue: 21400, orders: 487 },
  { month: "Mar", revenue: 19800, orders: 453 },
  { month: "Apr", revenue: 24100, orders: 521 },
  { month: "May", revenue: 27600, orders: 589 },
  { month: "Jun", revenue: 31200, orders: 634 },
];

const channels = [
  { channel: "Organic", visitors: 12400 },
  { channel: "Direct", visitors: 8200 },
  { channel: "Referral", visitors: 5100 },
  { channel: "Social", visitors: 3800 },
  { channel: "Email", visitors: 2900 },
];

const transactions = [
  { id: "TXN-001", customer: "Acme Corp", amount: 2400, status: "Completed" },
  { id: "TXN-002", customer: "Globex Inc", amount: 1800, status: "Completed" },
  { id: "TXN-003", customer: "Initech", amount: 3200, status: "Pending" },
  { id: "TXN-004", customer: "Umbrella Co", amount: 950, status: "Completed" },
  { id: "TXN-005", customer: "Stark Ind", amount: 5100, status: "Pending" },
];

export default function Dashboard() {
  return (
    <MetricProvider theme="indigo">
      <MetricGrid>
        <DashboardHeader
          title="Dashboard"
          subtitle="Your business at a glance"
          lastUpdated={new Date()}
        />

        <KpiCard
          title="Revenue"
          value={128400}
          format="currency"
          comparison={{ value: 114200, label: "vs last month" }}
          sparkline={{ data: [18, 21, 19, 24, 27, 31] }}
        />
        <KpiCard
          title="Customers"
          value={3842}
          format="compact"
          comparison={{ value: 3556, label: "vs last month" }}
        />
        <KpiCard
          title="Conversion"
          value={0.034}
          format="percent"
          comparison={{ value: 0.038, label: "vs last month" }}
        />
        <KpiCard
          title="Avg Order Value"
          value={33.42}
          format="currency"
          comparison={{ value: 32.10, label: "vs last month" }}
        />

        <AreaChart
          title="Revenue & Orders"
          data={revenue}
          index="month"
          categories={[
            { key: "revenue", label: "Revenue", format: "currency" },
            { key: "orders", label: "Orders", axis: "right" },
          ]}
        />

        <BarChart
          title="Traffic by Channel"
          data={channels}
          index="channel"
          categories={["visitors"]}
        />

        <DataTable
          title="Recent Transactions"
          data={transactions}
          columns={[
            { key: "id", label: "ID" },
            { key: "customer", label: "Customer" },
            { key: "amount", label: "Amount", format: "currency" },
            { key: "status", label: "Status" },
          ]}
        />
      </MetricGrid>
    </MetricProvider>
  );
}
`;
}

function getDashboardPath(cwd, framework) {
  const srcDir = getSrcDir(cwd, framework);

  switch (framework.name) {
    case "next-app": {
      const appDir = fs.existsSync(path.join(cwd, "src", "app")) ? "src/app" : "app";
      return `${appDir}/dashboard/page.tsx`;
    }
    case "next-pages": {
      const pagesDir = fs.existsSync(path.join(cwd, "src", "pages")) ? "src/pages" : "pages";
      return `${pagesDir}/dashboard.tsx`;
    }
    default:
      return `${srcDir}/Dashboard.tsx`;
  }
}

// ── Main ─────────────────────────────────────────────────────────

async function main() {
  const cwd = process.cwd();

  console.log();
  console.log(`  ${c.bold}MetricUI Init${c.reset}`);
  console.log(`  ${c.dim}Configure your project for MetricUI${c.reset}`);
  console.log();

  // Detect framework
  const framework = detectFramework(cwd);
  if (framework.label) {
    done(`Detected ${c.bold}${framework.label}${c.reset}`);
  } else {
    log(`Could not detect framework — using defaults`);
  }
  console.log();

  // Track what we did
  const created = [];

  // ── AI Tools ────────────────────────────────────────────────────

  const setupAI = await ask("Configure AI tools? (Cursor rules, Claude Code, MCP)");
  console.log();

  if (setupAI) {
    // Cursor rules
    const cursorPath = ".cursor/rules/metricui.mdc";
    if (fs.existsSync(path.join(cwd, cursorPath))) {
      skip(`${cursorPath} already exists`);
    } else {
      writeFile(cwd, cursorPath, CURSOR_RULES);
      created.push(cursorPath);
      done(`Created ${c.cyan}${cursorPath}${c.reset}`);
    }

    // CLAUDE.md
    const claudePath = "CLAUDE.md";
    const claudeFullPath = path.join(cwd, claudePath);
    if (fs.existsSync(claudeFullPath)) {
      const existing = fs.readFileSync(claudeFullPath, "utf-8");
      if (existing.includes("MetricUI") || existing.includes("metricui")) {
        skip(`${claudePath} already has MetricUI config`);
      } else {
        fs.appendFileSync(claudeFullPath, "\n" + CLAUDE_MD, "utf-8");
        created.push(claudePath + " (appended)");
        done(`Appended MetricUI config to ${c.cyan}${claudePath}${c.reset}`);
      }
    } else {
      writeFile(cwd, claudePath, CLAUDE_MD);
      created.push(claudePath);
      done(`Created ${c.cyan}${claudePath}${c.reset}`);
    }

    // .mcp.json
    const mcpPath = ".mcp.json";
    const mcpFullPath = path.join(cwd, mcpPath);
    if (fs.existsSync(mcpFullPath)) {
      const existing = JSON.parse(fs.readFileSync(mcpFullPath, "utf-8"));
      if (existing.mcpServers?.metricui) {
        skip(`${mcpPath} already has MetricUI MCP server`);
      } else {
        existing.mcpServers = existing.mcpServers || {};
        existing.mcpServers.metricui = {
          command: "npx",
          args: ["-y", "@metricui/mcp-server"],
        };
        fs.writeFileSync(mcpFullPath, JSON.stringify(existing, null, 2) + "\n", "utf-8");
        created.push(mcpPath + " (updated)");
        done(`Added MetricUI to ${c.cyan}${mcpPath}${c.reset}`);
      }
    } else {
      writeFile(cwd, mcpPath, MCP_JSON + "\n");
      created.push(mcpPath);
      done(`Created ${c.cyan}${mcpPath}${c.reset}`);
    }
  } else {
    skip("Skipped AI tools setup");
  }

  console.log();

  // ── Starter Dashboard ──────────────────────────────────────────

  const dashPath = getDashboardPath(cwd, framework);
  const setupDashboard = await ask("Scaffold a starter dashboard?");
  console.log();

  if (setupDashboard) {
    if (fs.existsSync(path.join(cwd, dashPath))) {
      skip(`${dashPath} already exists — skipping`);
    } else {
      writeFile(cwd, dashPath, dashboardTemplate(framework));
      created.push(dashPath);
      done(`Created ${c.cyan}${dashPath}${c.reset}`);
    }
  } else {
    skip("Skipped starter dashboard");
  }

  // ── Summary ────────────────────────────────────────────────────

  console.log();

  if (created.length === 0) {
    console.log(`  ${c.dim}Nothing to do — you're already set up.${c.reset}`);
  } else {
    console.log(`  ${c.green}${c.bold}Done!${c.reset} Created ${created.length} file${created.length === 1 ? "" : "s"}:`);
    console.log();
    created.forEach((f, i) => {
      const prefix = i === created.length - 1 ? sym.end : sym.bar;
      console.log(`  ${prefix} ${f}`);
    });
  }

  console.log();

  // Next steps
  if (setupDashboard && created.some((f) => f.includes("dashboard") || f.includes("Dashboard"))) {
    const devCmd = framework.name.startsWith("next") ? "npm run dev" : "npm run dev";
    const route = framework.name === "next-app" ? "/dashboard" : framework.name === "next-pages" ? "/dashboard" : "";

    console.log(`  ${c.bold}Next steps:${c.reset}`);
    console.log(`  ${c.dim}$${c.reset} ${devCmd}`);
    if (route) {
      console.log(`  ${c.dim}$${c.reset} open http://localhost:3000${route}`);
    }
    console.log();
  }

  console.log(`  ${c.dim}Docs:${c.reset}  metricui.com/docs`);
  console.log(`  ${c.dim}Demos:${c.reset} metricui.com/demos`);
  console.log();

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
