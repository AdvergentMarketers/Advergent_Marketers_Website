"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/MotionWrapper";
import Image from "next/image";

export default function AppPortal() {
  return (
    <section className="relative w-full py-20 sm:py-32 px-4 sm:px-6 lg:px-8 z-10">
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Column: Copy & Features */}
        <div className="flex-1 text-left">
          <FadeIn>
            <h2 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-accentBlue mb-3 sm:mb-4">
              The Client Ecosystem
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-matteBlack tracking-tight mb-6">
              Total transparency. Absolute control.
            </h3>
            <p className="text-sm sm:text-lg text-matteBlack/70 font-medium leading-relaxed mb-10">
              We engineered a proprietary client portal so you never have to guess what your agency is doing. Access your custom growth architecture, download your creative assets, and track your metrics in one tap.
            </p>
          </FadeIn>

          <div className="space-y-6 sm:space-y-8">
            {/* Feature 1 */}
            <FadeIn delay={0.2} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accentBlue/10 flex items-center justify-center text-accentBlue">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-matteBlack mb-1">Real-Time Trajectory</h4>
                <p className="text-xs sm:text-sm text-matteBlack/70 font-medium leading-relaxed">
                  Monitor the exact ROI of your paid media and track your <span className="font-bold text-matteBlack">SEO services</span> keyword rankings live.
                </p>
              </div>
            </FadeIn>

            {/* Feature 2 */}
            <FadeIn delay={0.3} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accentBlue/10 flex items-center justify-center text-accentBlue">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-matteBlack mb-1">The Creative Vault</h4>
                <p className="text-xs sm:text-sm text-matteBlack/70 font-medium leading-relaxed">
                  Instantly review and download high-fidelity video assets, ad creatives, and brand collateral directly to your device.
                </p>
              </div>
            </FadeIn>

            {/* Feature 3 */}
            <FadeIn delay={0.4} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accentBlue/10 flex items-center justify-center text-accentBlue">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-matteBlack mb-1">Weekly PDF Briefings</h4>
                <p className="text-xs sm:text-sm text-matteBlack/70 font-medium leading-relaxed">
                  Automated, executive-level PDF reports delivered weekly, breaking down your growth metrics without the fluff.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Right Column: The App Device Presentation */}
        <div className="flex-1 w-full max-w-md lg:max-w-none mx-auto relative perspective-1000">
          
          <FadeIn delay={0.3}>
            {/* The Floating Motion Wrapper */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] max-h-[600px] bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2rem] sm:rounded-[3rem] shadow-[0_20px_60px_rgb(0,0,0,0.08)] flex flex-col overflow-hidden"
            >
              
              {/* Internal Glass Reflection Sweep */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_4s_infinite]" />

              {/* App Top Bar */}
              <div className="w-full px-8 pt-8 pb-6 flex justify-between items-center border-b border-matteBlack/5 bg-white/50 z-10">
                <Image src="/logo.svg" alt="Advergent" width={120} height={24} className="h-5 sm:h-6 w-auto object-contain" />
                <div className="w-8 h-8 rounded-full border border-matteBlack/10 bg-offWhite flex items-center justify-center shadow-sm">
                   <svg className="w-4 h-4 text-matteBlack/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
              </div>

              {/* App Center Piece (The App Icon) */}
              <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-8">
                
                {/* Glowing Aura behind Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accentBlue/20 rounded-full blur-3xl" />
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-[2rem] shadow-2xl p-6 flex items-center justify-center border border-matteBlack/5"
                >
                  <Image src="logo.svg" alt="Advergent App" width={100} height={100} className="w-full h-full object-contain" />
                </motion.div>
                
                <h4 className="mt-8 text-xl sm:text-2xl font-bold text-matteBlack text-center">Ecosystem Live</h4>
                <p className="mt-2 text-xs sm:text-sm text-matteBlack/50 font-semibold tracking-widest uppercase">All Systems Optimal</p>
              </div>

              {/* Fake UI Data Bars at bottom */}
              <div className="p-8 bg-white/40 border-t border-matteBlack/5 flex gap-4 z-10">
                <div className="flex-1 h-12 bg-white rounded-lg shadow-sm border border-matteBlack/5 flex items-end p-2 gap-1">
                  <div className="w-full bg-accentBlue/20 rounded-sm h-[30%]" />
                  <div className="w-full bg-accentBlue/40 rounded-sm h-[60%]" />
                  <div className="w-full bg-accentBlue rounded-sm h-[90%]" />
                </div>
                <div className="w-12 h-12 bg-accentBlue text-white rounded-lg shadow-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
              </div>

            </motion.div>
          </FadeIn>
          
        </div>
      </div>
    </section>
  );
}