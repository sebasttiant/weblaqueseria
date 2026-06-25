import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SITE } from "@/lib/config/site";
import { env } from "@/lib/config/env";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${SITE.name} — ${SITE.subtitle}`,
    template: `%s | ${SITE.name}`,
  },
  description: `${SITE.name}. ${SITE.slogan}. ${SITE.subtitle} artesanales en ${SITE.address}.`,
  openGraph: {
    title: `${SITE.name} — ${SITE.subtitle}`,
    description: SITE.slogan,
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
