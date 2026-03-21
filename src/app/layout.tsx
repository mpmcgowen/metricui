import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MetricProvider } from "@/lib/MetricProvider";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MetricUI — Beautiful Dashboard Components for React",
  description:
    "Premium, copy-paste React components for analytics dashboards. Built with Next.js, Tailwind CSS, and Nivo. The missing UI kit for data visualization.",
  keywords: [
    "react dashboard components",
    "analytics dashboard UI kit",
    "data visualization react",
    "tailwind dashboard template",
    "nivo charts components",
    "metric ui",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#F8F8F6] font-[family-name:var(--font-body)] text-gray-900 dark:bg-[#0A0A0C] dark:text-gray-100">
        <MetricProvider>
          {children}
        </MetricProvider>
      </body>
    </html>
  );
}
