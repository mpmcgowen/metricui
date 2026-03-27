import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactions",
  description: "Add cross-filtering, linked hover, value flash, and drill-downs to your MetricUI dashboard. Click-driven interactivity with zero wiring code.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
