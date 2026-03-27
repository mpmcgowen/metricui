import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Divider",
  description: "Horizontal and vertical separator with label, icon, and accent color. Clean visual breaks between dashboard sections.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
