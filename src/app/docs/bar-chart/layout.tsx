import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BarChart",
  description: "Bar chart with 6 presets, comparison bars, sorting, negative values, reference lines, and cross-filtering. Horizontal and vertical layouts.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
