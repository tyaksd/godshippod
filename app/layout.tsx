import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Godship",
  description: "Get high-quality tees to your customers worldwide within 3 days. The fastest and most reliable print on demand for clothing brands.",
  icons: {
    icon: "/gblack2.png",
    shortcut: "/gblack2.png",
    apple: "/gblack2.png",
  },
  openGraph: {
    title: "Godship - High-Quality Tees Delivered within 3 Days",
    description: "Get high-quality tees to your customers worldwide within 3 days. The fastest and most reliable print on demand for clothing brands.",
    url: "https://godship.io",
    siteName: "Godship",
    images: [
      {
        url: "/gblack2.png",
        width: 1200,
        height: 630,
        alt: "Godship",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Godship - High-Quality Tees Delivered in 3 Days",
    description: "Get high-quality tees to your customers worldwide within 3 days.",
    images: ["/gblack2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
