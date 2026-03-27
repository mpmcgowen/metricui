import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SaaS Metrics Dashboard Demo",
  description: "SaaS analytics dashboard with MRR, churn, conversion funnel, and industry breakdown. Built with MetricUI components.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
