import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Treemap",
  description: "Hierarchical treemap with click-to-zoom navigation. Visualize part-of-whole relationships in nested data. Built on Nivo.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
