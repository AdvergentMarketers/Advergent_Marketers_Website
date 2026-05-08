import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Locally hosted font for maximum speed and zero CLS
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap", 
});

// Global SEO Base updated for Advergent Marketers
export const metadata: Metadata = {
  title: {
    template: "%s | Advergent Marketers",
    default: "Advergent Marketers | Digital Growth Architecture",
  },
  description: "A premium digital growth agency engineering high-conversion architectures and scalable ecosystems.",
  metadataBase: new URL('https://advergentmarketers.com'),
  
  keywords: [
    "Digital Marketing Agency",
    "Performance Marketing Agency",
    "SEO Services",
    "Growth Architecture",
    "Paid Media Specialists"
  ],
  
  openGraph: {
    title: "Advergent Marketers | Digital Growth Agency",
    description: "Engineering high-conversion ecosystems and algorithmic dominance.",
    url: "https://advergentmarketers.com",
    siteName: "Advergent Marketers",
    images: [
      {
        url: "/App_icon.png", 
        width: 800,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
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

  appleWebApp: {
    title: "Advergent",
    statusBarStyle: "black-translucent",
    capable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} antialiased scroll-smooth`} suppressHydrationWarning>
      <body className="bg-white text-matteBlack min-h-screen flex flex-col selection:bg-accentBlue selection:text-white">
        <CurrencyProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </CurrencyProvider>
        
        {/* Vercel Performance & Analytics Tracking Active */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}