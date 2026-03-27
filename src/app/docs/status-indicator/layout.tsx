import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StatusIndicator",
  description: "Rule-based health indicator with pulse animation, trend arrows, time-in-state tracking, and 5 sizes. Show system and metric health.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
