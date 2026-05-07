"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Currency = "INR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  symbol: string;
  // A premium helper function to automatically format your prices
  formatPrice: (basePriceInINR: number) => string; 
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Define your exchange rate (You can update this manually or connect an API later)
const EXCHANGE_RATE = 83.5; // Example: 1 USD = 83.5 INR

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Default to INR as requested
  const [currency, setCurrency] = useState<Currency>("INR");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Fire a lightning-fast request to a free IP geolocation API
    const detectLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        // If the country code is anything other than India, switch to USD
        if (data.country_code && data.country_code !== "IN") {
          setCurrency("USD");
        }
      } catch (error) {
        console.error("Geolocation failed, defaulting to INR.", error);
      } finally {
        setIsLoaded(true);
      }
    };

    detectLocation();
  }, []);

  const symbol = currency === "INR" ? "₹" : "$";

  // This helper function does the math and formatting for you automatically!
  const formatPrice = (basePriceInINR: number) => {
    if (!isLoaded) return ""; // Prevents text flashing before location loads

    if (currency === "USD") {
      const usdPrice = basePriceInINR / EXCHANGE_RATE;
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usdPrice);
    } else {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(basePriceInINR);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, symbol, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Custom hook so you can easily use this anywhere in your app
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};