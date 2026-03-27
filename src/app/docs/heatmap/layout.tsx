import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HeatMap",
  description: "2D matrix heatmap with cross-hair hover, sequential and diverging color scales. Visualize patterns across two dimensions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
