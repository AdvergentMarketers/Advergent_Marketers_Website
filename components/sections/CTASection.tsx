"use client";

import { FadeIn } from "@/components/ui/MotionWrapper";

export default function CTASection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-32 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
      
      {/* Note: The background here is completely transparent. 
        The massive expanding accentBlue circle from FixedBackgroundCanvas 
        will scale up to fill this space as the user reaches the bottom. 
      */}

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">
              Initiate Protocol
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[1.1] mb-6">
            Ready to <span className="text-matteBlack">Level Up</span> <br className="hidden sm:block" />
            your digital architecture?
          </h2>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="text-base sm:text-xl text-white/80 font-medium leading-relaxed max-w-2xl mx-auto mb-12">
            Stop losing high-intent traffic to your competitors. Book your strategy session today, and let our specialists engineer a custom growth ecosystem for your brand.
          </p>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-matteBlack text-sm font-extrabold uppercase tracking-widest rounded-sm hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] active:scale-95">
              Book Appointment Now
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-transparent border border-white/30 text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all duration-300 active:scale-95">
              Contact Support
            </button>
          </div>
        </FadeIn>

      </div>

      {/* Subtle bottom footer fade inside the CTA */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full text-center">
        <FadeIn delay={0.8}>
          <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
            Advergent Marketers &copy; {new Date().getFullYear()}
          </p>
        </FadeIn>
      </div>

    </section>
  );
}