import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wikipedia Live Dashboard Demo",
  description: "Real-time streaming dashboard showing Wikipedia edits. Bot vs human analysis, edit velocity, and live data with MetricUI.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
