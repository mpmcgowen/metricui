import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BarLineChart",
  description: "Dual-axis combo chart combining bars and lines. Unified data format for revenue vs growth rate, volume vs price, and similar pairs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
