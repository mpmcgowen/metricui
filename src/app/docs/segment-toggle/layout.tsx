import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SegmentToggle",
  description: "Pill toggle with icons, badges, and multi-select support. Switch between data segments like channels, platforms, or categories.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
