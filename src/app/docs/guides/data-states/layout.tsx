import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data States",
  description: "Handle loading, empty, error, and stale states across all MetricUI components. Built-in skeleton shimmer, error boundaries, and retry UI.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
