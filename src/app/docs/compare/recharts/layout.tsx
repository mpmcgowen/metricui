import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetricUI vs Recharts — Detailed Comparison",
  description: "Compare MetricUI and Recharts side by side. 18 chart types, KPI cards, filters, cross-filtering, theming, and export vs a charts-only library. See which fits your dashboard.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
