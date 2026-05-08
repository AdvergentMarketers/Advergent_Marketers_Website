"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase"; 
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authRoute, setAuthRoute] = useState("/auth");

  useEffect(() => {
    const supabase = createClient();

    const checkAuthStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsLoggedIn(true);
        if (user.email?.toLowerCase() === "ginniomen22@gmail.com") {
          setAuthRoute("/admin");
        } else {
          setAuthRoute("/dashboard");
        }
      } else {
        setIsLoggedIn(false);
        setAuthRoute("/auth");
      }
    };

    checkAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        if (session.user.email?.toLowerCase() === "ginniomen22@gmail.com") {
          setAuthRoute("/admin");
        } else {
          setAuthRoute("/dashboard");
        }
      } else {
        setIsLoggedIn(false);
        setAuthRoute("/auth");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-offWhite/80 backdrop-blur-md border-b border-matteBlack/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            {/* Replace /logo.png with your exact filename in the public folder */}
            <Image 
              src="/logo.svg" 
              alt="Advergent Marketers" 
              width={30} 
              height={30} 
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/about" className="text-matteBlack/80 hover:text-accentBlue transition-colors text-sm font-semibold">About</Link>
            <Link href="/services" className="text-matteBlack/80 hover:text-accentBlue transition-colors text-sm font-semibold">Services</Link>
            <Link href="/work" className="text-matteBlack/80 hover:text-accentBlue transition-colors text-sm font-semibold">Work</Link>
            <Link href="/contact" className="text-matteBlack/80 hover:text-accentBlue transition-colors text-sm font-semibold">Contact</Link>
          </nav>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Dynamic Auth Icon */}
            <Link 
              href={authRoute} 
              className={`transition-colors ${isLoggedIn ? 'text-green-500 hover:text-green-600' : 'text-matteBlack hover:text-accentBlue'}`} 
              title={isLoggedIn ? "Go to Dashboard" : "Client Login"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 -mr-2 text-matteBlack focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-offWhite border-b border-matteBlack/10 overflow-hidden shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <Link href="/about" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-semibold text-matteBlack hover:bg-matteBlack/5 rounded-md transition-colors">About</Link>
              <Link href="/services" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-semibold text-matteBlack hover:bg-matteBlack/5 rounded-md transition-colors">Services</Link>
              <Link href="/work" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-semibold text-matteBlack hover:bg-matteBlack/5 rounded-md transition-colors">Work</Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-semibold text-matteBlack hover:bg-matteBlack/5 rounded-md transition-colors">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}