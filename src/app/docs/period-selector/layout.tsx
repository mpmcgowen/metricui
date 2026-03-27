import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PeriodSelector",
  description: "Date range preset selector with custom ranges and comparison toggle. 7d, 30d, 90d, YTD, and custom period selection for dashboards.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
