import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Badge",
  description: "Badge component with 6 variants, 3 sizes, custom colors, icons, and dismiss action. Label and categorize dashboard elements.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
