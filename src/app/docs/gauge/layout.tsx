import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gauge",
  description: "Arc gauge with threshold zones, target markers, and comparison badges. Show progress toward a goal or metric health at a glance.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
