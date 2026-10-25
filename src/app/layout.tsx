import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: "Affordable IT courses (₹299) and internship programs (₹999) for BCA, B.Sc. IT, MCA, M.Sc. IT and Computer Science students.",
  openGraph: { title: site.name, description: site.tagline, type: "website", siteName: site.name },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-gold focus:p-3">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
