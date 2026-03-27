import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BulletChart",
  description: "Bullet chart showing actual vs target with qualitative range bands. Compact performance indicator for dashboards.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
