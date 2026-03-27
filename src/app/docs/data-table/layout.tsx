import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DataTable",
  description: "Data table with sort, search, pagination, expandable rows, 12 column types, pinned columns, and smart column inference.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
