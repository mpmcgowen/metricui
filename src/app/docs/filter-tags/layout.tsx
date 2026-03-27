import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FilterTags",
  description: "Active filter tag pills with dismiss action. Show and clear applied filters. Auto-wired with FilterProvider context.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
