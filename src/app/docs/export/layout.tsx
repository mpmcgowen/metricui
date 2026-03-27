import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Export",
  description: "Export dashboards and components as PNG (4x DPI), CSV, or clipboard copy. Clean filenames with filter context metadata.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
