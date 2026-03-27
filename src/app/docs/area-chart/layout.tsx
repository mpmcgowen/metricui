import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AreaChart",
  description: "Area chart with gradient fills, stacking, dual Y-axis, comparison overlays, reference lines, and threshold bands. Built on Nivo.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
