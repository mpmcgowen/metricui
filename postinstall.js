#!/usr/bin/env node

const message = `
  \x1b[1mMetricUI\x1b[0m installed successfully

  \x1b[2mQuick start:\x1b[0m
    import { KpiCard } from "metricui"
    import "metricui/styles.css"

  \x1b[2mAI-powered development:\x1b[0m
    claude mcp add metricui -- npx @metricui/mcp-server

  \x1b[2mDocs:\x1b[0m metricui.com/docs
`;

console.log(message);
