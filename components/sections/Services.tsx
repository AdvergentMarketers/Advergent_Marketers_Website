"use client";

import { FadeIn } from "@/components/ui/MotionWrapper";

const services = [
  {
    title: "Performance Marketing",
    description: "As a leading performance marketing agency, we engineer data-driven campaigns designed specifically for aggressive scaling and lowering customer acquisition costs (CAC).",
    icon: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-accentBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    title: "Meta Ads Specialization",
    description: "Elite media buying across Facebook and Instagram. We utilize advanced pixel tracking and algorithmic bidding to convert high-intent audiences into loyal clients.",
    icon: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-accentBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  {
    title: "Brand Strategy",
    description: "We don't just generate clicks; we build digital monopolies. Our strategists position your brand as the undeniable premium authority in your specific market sector.",
    icon: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-accentBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  },
  {
    title: "Creative & Design",
    description: "Industry-standard designers and editors producing cinematic video assets and minimal-luxury creatives that stop the scroll and demand attention.",
    icon: (
      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-accentBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    )
  }
];

export default function Services() {
  return (
    <section className="relative w-full py-20 sm:py-32 px-4 sm:px-6 lg:px-8 z-10">
      
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
            <h2 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-accentBlue mb-3 sm:mb-4">Growth Protocols</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-matteBlack tracking-tight mb-4 sm:mb-6">
              How we scale your business.
            </h3>
            <p className="text-sm sm:text-lg text-matteBlack/70 font-medium leading-relaxed px-4 sm:px-0">
              We eliminate bottlenecks by combining the precision of a performance marketing agency with the aesthetic dominance of an elite creative studio.
            </p>
          </div>
        </FadeIn>

        {/* The Grid: 2 columns on mobile, gap adjusted for tight screens */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <FadeIn key={index} delay={index * 0.15}>
              
              {/* Premium Frosted Glass Card with Responsive Padding */}
              <div className="group relative p-5 sm:p-8 md:p-10 bg-white/60 backdrop-blur-xl border border-matteBlack/10 rounded-xl sm:rounded-2xl hover:border-accentBlue/30 hover:bg-white/80 transition-all duration-500 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden h-full flex flex-col">
                
                {/* Subtle hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accentBlue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex-grow flex flex-col">
                  
                  {/* Floating Icon without the background box */}
                  <div className="mb-4 sm:mb-6 origin-left transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 drop-shadow-sm">
                    {service.icon}
                  </div>
                  
                  {/* Responsive Typography */}
                  <h4 className="text-sm sm:text-lg md:text-xl font-extrabold text-matteBlack mb-2 sm:mb-3 leading-tight">
                    {service.title}
                  </h4>
                  
                  <p className="text-[11px] sm:text-sm text-matteBlack/70 font-semibold sm:font-medium leading-snug sm:leading-relaxed mt-auto">
                    {service.description}
                  </p>
                  
                </div>

              </div>
            </FadeIn>
          ))}
        </div>
      </div>

    </section>
  );
}