import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DashboardHeader",
  description: "Dashboard title bar with live/stale status indicator, auto-ticking update time, breadcrumbs, and action slots for filters.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
