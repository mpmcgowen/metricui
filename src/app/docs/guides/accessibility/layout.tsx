import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "MetricUI accessibility features: keyboard navigation, ARIA labels, screen reader support, focus-visible rings, and prefers-reduced-motion.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
