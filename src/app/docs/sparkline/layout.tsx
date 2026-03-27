import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sparkline",
  description: "Inline sparkline with line and bar types, reference lines, trend coloring, and interactive tooltips. Embed micro-charts anywhere.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
