import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "All-in-one dashboard wrapper replacing 5 providers. Theme, filters, cross-filtering, linked hover, and drill-down in one component.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
