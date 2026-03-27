import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DrillDown",
  description: "Click any metric to see detail. Slide-over or modal, up to 4 nested levels with breadcrumbs. Auto-table generation from chart data.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
