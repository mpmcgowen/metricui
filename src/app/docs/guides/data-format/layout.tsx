import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Format",
  description: "Learn the DataRow format used across all MetricUI components. One consistent data shape for charts, tables, and KPI cards.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
