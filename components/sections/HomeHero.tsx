"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/MotionWrapper";

export default function HomeHero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 lg:px-8 pt-20 pb-32">
      
      {/* Absolute Background Graphs for Hero Section */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center">
        {/* Left Graph Line */}
        <motion.svg 
          className="absolute left-[5%] md:left-[15%] bottom-[20%] w-[300px] md:w-[500px] h-[300px] opacity-[0.07] text-matteBlack"
          viewBox="0 0 500 300"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        >
          <motion.path 
            d="M 0 300 C 150 300, 200 150, 500 50" 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.circle cx="500" cy="50" r="8" fill="currentColor" 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.2 }}
          />
        </motion.svg>

        {/* Right Graph Line (Accent Blue) */}
        <motion.svg 
          className="absolute right-[5%] md:right-[15%] top-[20%] w-[250px] md:w-[400px] h-[400px] opacity-[0.15] text-accentBlue"
          viewBox="0 0 400 400"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <motion.path 
            d="M 50 400 L 150 250 L 250 280 L 400 50" 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          />
          {/* Arrowhead */}
          <motion.path 
            d="M 370 50 L 400 50 L 400 80" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          />
        </motion.svg>
      </div>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto text-center z-10 relative">
        
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-matteBlack/10 bg-white/60 backdrop-blur-md mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accentBlue animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-matteBlack/80">
              Level up your architecture
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-matteBlack tracking-tighter leading-[1.1]">
            The Elite <br className="hidden md:block" />
            <span className="text-accentBlue">Digital Marketing Agency</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="mt-8 text-lg sm:text-xl text-matteBlack/70 max-w-3xl mx-auto font-medium leading-relaxed">
            Backed by <span className="text-matteBlack font-bold">industry-standard professionals</span> across all digital fields. 
            We don't just run campaigns; we engineer scalable ecosystems to dominate your market.
          </p>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-matteBlack text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-accentBlue hover:text-white transition-all shadow-lg active:scale-95">
              Apply For Strategy
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/50 backdrop-blur-sm border border-matteBlack/20 text-matteBlack text-sm font-bold uppercase tracking-widest rounded-sm hover:border-matteBlack hover:bg-white transition-all shadow-sm active:scale-95">
              View Case Studies
            </button>
          </div>
        </FadeIn>
      </div>

    </section>
  );
}