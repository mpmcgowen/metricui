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
} else if (cmd === "docs") {
  const page = args[1];
  const url = page ? `https://metricui.com/docs/${page}` : "https://metricui.com/docs";
  console.log(`  Opening ${url}`);
  openUrl(url);
} else if (args.includes("--help") || args.includes("-h") || args.length === 0) {
  console.log(`
  MetricUI v${pkg.version}

  Usage:
    metricui docs [page]  Open docs in browser (e.g. metricui docs kpi-card)
    metricui --version    Show version
    metricui --help       Show this help

  Quick start:
    import { KpiCard } from "metricui"
    import "metricui/styles.css"

  AI-powered development:
    claude mcp add metricui -- npx @metricui/mcp-server

  Docs: metricui.com/docs
`);
} else {
  console.log(`Unknown command: ${args.join(" ")}. Run metricui --help for usage.`);
}
