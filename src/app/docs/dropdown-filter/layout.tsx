import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DropdownFilter",
  description: "Multi-select dimension filter with search and grouped options. Filter dashboard data by category, region, status, or any dimension.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
