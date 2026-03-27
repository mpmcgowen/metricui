import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Server",
  description: "MetricUI's Model Context Protocol server. 13 tools, 9 resources, and 3 prompts for AI agents to generate, validate, and scaffold dashboards.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
