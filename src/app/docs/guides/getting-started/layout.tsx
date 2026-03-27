import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started",
  description: "Install MetricUI and build your first React dashboard in minutes. Setup guide for Next.js, Vite, and Create React App.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
