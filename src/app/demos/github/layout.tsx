import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Analytics Dashboard Demo",
  description: "GitHub repository analytics dashboard using real facebook/react data. Commit velocity, issue triage, and contributor metrics.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
