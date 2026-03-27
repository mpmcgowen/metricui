import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Filtering",
  description: "Build interactive filter bars with FilterProvider, PeriodSelector, DropdownFilter, SegmentToggle, and FilterTags. All wired through React context.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
