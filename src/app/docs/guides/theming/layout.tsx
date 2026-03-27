import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Theming",
  description: "Customize MetricUI with CSS variables, 8 theme presets, dark mode, card variants, and chart color palettes. Works with any CSS framework.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
