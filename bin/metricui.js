#!/usr/bin/env node

const { readFileSync } = require("fs");
const { join } = require("path");

const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));

const args = process.argv.slice(2);

if (args.includes("--version") || args.includes("-v")) {
  console.log(pkg.version);
} else if (args.includes("--help") || args.includes("-h") || args.length === 0) {
  console.log(`
  MetricUI v${pkg.version}

  Usage:
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
