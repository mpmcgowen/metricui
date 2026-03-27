import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookbook",
  description: "Recipes and patterns for common MetricUI dashboard scenarios. Copy-paste solutions for real-world data visualization problems.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
