import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Radar",
  description: "Radar chart for multi-axis comparison with overlay support. Compare entities across multiple dimensions simultaneously.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
