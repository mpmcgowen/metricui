import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Format Engine",
  description: "Auto-format numbers as currency, percentages, compact notation, and durations. MetricUI's built-in format engine with locale support.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
