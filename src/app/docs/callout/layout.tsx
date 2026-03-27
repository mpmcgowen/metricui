import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Callout",
  description: "Data-driven alert callout with conditional rules, value templates, and embedded metrics. Surface important thresholds and anomalies.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
