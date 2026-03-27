import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ScatterPlot",
  description: "Scatter plot with bubble size, segments, and trend lines. Visualize correlations between two variables. Built on Nivo.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
