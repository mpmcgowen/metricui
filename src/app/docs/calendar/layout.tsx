import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
  description: "GitHub-style calendar heatmap showing daily values over time. Activity tracking, contribution grids, and temporal patterns.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
