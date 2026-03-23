#!/usr/bin/env node

const { readFileSync } = require("fs");
const { join } = require("path");
const { exec } = require("child_process");

const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));

const args = process.argv.slice(2);
const cmd = args[0];

function openUrl(url) {
  const platform = process.platform;
  const opener = platform === "darwin" ? "open" : platform === "win32" ? "start" : "xdg-open";
  exec(`${opener} ${url}`);
}

if (args.includes("--version") || args.includes("-v")) {
  console.log(pkg.version);
} else if (cmd === "init") {
  require("./init.js");
} else if (cmd === "docs") {
  const page = args[1];
  const url = page ? `https://metricui.com/docs/${page}` : "https://metricui.com/docs";
  console.log(`  Opening ${url}`);
  openUrl(url);
} else if (cmd === "demos") {
  const demo = args[1];
  const url = demo ? `https://metricui.com/demos/${demo}` : "https://metricui.com/demos/saas";
  console.log(`  Opening ${url}`);
  openUrl(url);
} else if (cmd === "github") {
  console.log("  Opening github.com/mpmcgowen/metricui");
  openUrl("https://github.com/mpmcgowen/metricui");
} else if (cmd === "mcp") {
  console.log(`
  Add MetricUI to your AI coding tool:

  Claude Code:
    claude mcp add metricui -- npx @metricui/mcp-server

  Cursor (settings.json):
    "mcpServers": {
      "metricui": { "command": "npx", "args": ["@metricui/mcp-server"] }
    }
`);
} else if (args.includes("--help") || args.includes("-h") || args.length === 0) {
  console.log(`
  MetricUI v${pkg.version}

  Usage:
    metricui init         Set up MetricUI in your project
    metricui docs [page]  Open docs (e.g. metricui docs kpi-card)
    metricui demos [name] Open a live demo (saas, github, wikipedia, world)
    metricui github       Open the GitHub repo
    metricui mcp          Show MCP server setup instructions
    metricui --version    Show version
    metricui --help       Show this help

  Quick start:
    import { KpiCard } from "metricui"
    import "metricui/styles.css"

  Docs: metricui.com/docs
`);
} else {
  console.log(`Unknown command: ${args.join(" ")}. Run metricui --help for usage.`);
}
