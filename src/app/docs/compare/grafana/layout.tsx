import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetricUI vs Grafana — Detailed Comparison",
  description: "Compare MetricUI and Grafana for dashboards. Embeddable React components vs monitoring platform. Licensing, theming, data model, and when to use each.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
