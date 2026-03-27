import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "World Explorer Dashboard Demo",
  description: "Geographic data explorer with population, GDP, and languages. 4-level drill-downs and choropleth maps built with MetricUI.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
