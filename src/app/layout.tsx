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
  title: "GT Tech",
  description:
    "GT Tech provides cutting-edge technology solutions, expert consulting, and custom software development to help businesses innovate, scale, and succeed in the digital age.",
  keywords: [
    "GT Tech",
    "technology consulting",
    "IT services",
    "custom software development",
    "cloud solutions",
    "digital transformation",
    "AI consulting",
    "IT strategy",
    "enterprise technology",
    "technology solutions",
    "business automation",
    "tech consultancy",
    "IT infrastructure",
    "cybersecurity services",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "GT Tech - Expert Technology Services & Consulting",
    description:
      "Partner with GT Tech for innovative technology solutions, IT consulting, and custom development services tailored to your business needs.",
    url: "https://thegttech.com",
    type: "website",
    images: [
      {
        url: "/seo.png",
        width: 1200,
        height: 630,
        alt: "GT Tech - Technology Services & Consulting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thegttech",
    title: "GT Tech - Expert Technology Services & Consulting",
    description:
      "Delivering technology consulting, custom development, and IT services to help businesses grow and innovate.",
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
