import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetricGrid",
  description: "Smart auto-layout grid for dashboards. KPIs row up, charts pair, tables go full-width. Staggered reveal animations. Zero CSS needed.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
