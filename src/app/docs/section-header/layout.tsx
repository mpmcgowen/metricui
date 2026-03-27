import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SectionHeader",
  description: "Labeled section divider with description popover, badge, and action slot. Organize dashboard sections with clear visual hierarchy.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
