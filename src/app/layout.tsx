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

const SITE_URL = "https://metricui.dev";
const SITE_TITLE = "MetricUI — Dashboard Components for React";
const SITE_DESCRIPTION =
  "The React dashboard framework. 31 components, 18 chart types, cross-filtering, drill-downs, export, AI insights — one import replaces six libraries.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | MetricUI",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "react dashboard components",
    "react charts library",
    "analytics dashboard",
    "data visualization react",
    "dashboard framework",
    "kpi card component",
    "react data table",
    "nivo charts",
    "tailwind dashboard",
    "metricui",
  ],
  authors: [{ name: "MetricUI" }],
  creator: "MetricUI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "MetricUI",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "MetricUI — Dashboard Components for React",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "MetricUI",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              license: "https://opensource.org/licenses/MIT",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              programmingLanguage: ["TypeScript", "React"],
            }),
          }}
        />
        <MetricProvider>
          {children}
        </MetricProvider>
      </body>
    </html>
  );
}
