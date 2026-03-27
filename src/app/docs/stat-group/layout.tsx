import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StatGroup",
  description: "Display multiple metrics in a dense responsive grid row. Compact KPI layout with per-stat comparisons and formatting.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
