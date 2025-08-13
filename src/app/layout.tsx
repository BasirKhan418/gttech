import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thegttech.com"),
  title: "Gramtrang Technology",
  description:
    "The GT Tech brings you the latest technology news, unbiased reviews, buying guides, and tips. Stay ahead with insights on gadgets, mobiles, laptops, AI, and emerging tech trends.",
  keywords: [
    "The GT Tech",
    "tech news",
    "latest gadgets",
    "mobile reviews",
    "laptop reviews",
    "AI technology",
    "emerging tech trends",
    "buying guides",
    "technology updates",
    "best smartphones",
    "tech tutorials",
    "electronics reviews",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "The GT Tech - Latest Tech News, Reviews & Guides",
    description:
      "Stay updated with The GT Tech – your source for in-depth technology articles, gadget reviews, and insightful buying guides.",
    url: "https://thegttech.com",
    type: "website",
    images: [
      {
        url: "/seo.png",
        width: 1200,
        height: 630,
        alt: "The GT Tech - Tech News & Reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thegttech",
    title: "The GT Tech - Latest Tech News, Reviews & Guides",
    description:
      "Discover the latest gadgets, unbiased product reviews, and tech trends with The GT Tech.",
    images: "/seo.png",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="relative" suppressHydrationWarning>
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
