import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waterfall",
  description: "Waterfall chart showing sequential positive and negative changes with auto running totals and connectors. Perfect for financial breakdowns.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
