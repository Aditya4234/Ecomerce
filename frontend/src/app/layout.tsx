import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/store/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ShopHub - Premium E-Commerce",
    template: "%s | ShopHub",
  },
  description:
    "Discover premium products at ShopHub. Shop the latest trends in fashion, electronics, home decor and more with fast shipping and great prices.",
  keywords: ["ecommerce", "shop", "online shopping", "premium products"],
  openGraph: {
    title: "ShopHub - Premium E-Commerce",
    description:
      "Discover premium products at ShopHub. Shop the latest trends in fashion, electronics, home decor and more.",
    siteName: "ShopHub",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
