import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import "./globals.css";

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
  metadataBase: new URL('https://advergentmarketers.com'), // Updated to your new domain!
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
      </body>
    </html>
  );
}