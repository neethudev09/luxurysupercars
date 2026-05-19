import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import JsonLd from "@/components/seo/JsonLd";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://luxurysupercarsdubai.com"),
  title: "Luxury Supercar Rentals Dubai - Rent Luxury & Sports Car Dubai",
  description:
    "Dubai's Most Trusted Supercar Rentals. Premium Services with 24/7 Support and Free Delivery Across Dubai. Lamborghini, Ferrari, Rolls Royce, McLaren, Porsche and more.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Luxury Supercar Rentals Dubai - Rent Luxury & Sports Car Dubai",
    description:
      "Dubai's Most Trusted Supercar Rentals. Premium Services with 24/7 Support and Free Delivery Across Dubai.",
    url: "https://luxurysupercarsdubai.com/",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Supercar Rentals Dubai",
    description:
      "Dubai's Most Trusted Supercar Rentals. Premium Services with 24/7 Support and Free Delivery Across Dubai.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap"
        />
      </head>
      <body>
        <JsonLd />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
