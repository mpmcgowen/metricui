import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DashboardNav",
  description: "Tab and scroll navigation with sliding indicator, keyboard nav, and URL sync. Organize multi-page dashboards with smooth transitions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
