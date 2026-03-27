import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Insights",
  description: "Bring-your-own-LLM dashboard chat. Floating button, slide-over sidebar, @ mentions, streaming responses, and per-card AI analysis.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
