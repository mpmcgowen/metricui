import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DonutChart",
  description: "Donut chart with center KPI content, arc labels, percentage mode, and cross-filtering. Ideal for part-of-whole visualizations.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
