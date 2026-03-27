import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choropleth",
  description: "Geographic choropleth map colored by value. World and regional views for population, revenue, and other geo-distributed data.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
