import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LineChart",
  description: "Line chart with 9 curve types, dual Y-axis, reference lines, threshold bands, and per-series styling. Clean lines for time-series data.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
