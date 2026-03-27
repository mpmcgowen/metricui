import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tools Integration",
  description: "Use MetricUI with Claude, Cursor, and Copilot. MCP server, llms.txt, CLAUDE.md setup, and AI-assisted dashboard generation.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
