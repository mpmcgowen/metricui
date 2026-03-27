import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KpiCard",
  description: "KPI card with comparisons, sparklines, goal progress, conditional coloring, drill-down, and copy-to-clipboard. The core metric display component.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
