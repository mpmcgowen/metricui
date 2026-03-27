import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funnel",
  description: "Conversion funnel with auto-computed rates between stages. Visualize drop-off in user flows, sales pipelines, and onboarding.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
