import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sankey",
  description: "Sankey flow diagram with proportional-width links. Visualize flows between categories — traffic sources, budget allocation, user journeys.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
