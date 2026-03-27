import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bump",
  description: "Bump chart showing ranking changes over multiple periods. Track position changes for competitors, categories, or features over time.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
