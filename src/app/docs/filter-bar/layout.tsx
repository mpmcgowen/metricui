import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FilterBar",
  description: "Collapsible filter container with auto-tags, badge count, sticky mode, and Primary/Secondary slots. The dashboard filter toolbar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
