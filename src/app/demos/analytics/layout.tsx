import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Analytics Dashboard Demo",
  description: "Interactive web analytics dashboard built with MetricUI. Tab navigation, AI insights, cross-filtering, and per-device breakdowns.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
