"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "../../../components/ui/MotionWrapper"; 

export default function DesktopCaseStudy({ project }: { project: any }) {

return (
    <div className="min-h-screen bg-offWhite pt-24 pb-32">
      
      {/* 1. HERO SECTION & BENTO BOX OVERVIEW */}
      <header className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto mb-32">
        <FadeIn>
          <Link href="/work" className="inline-flex items-center text-sm font-bold text-matteBlack/50 hover:text-accentBlue mb-12 transition-colors uppercase tracking-widest">
            &larr; Back to Portfolio
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Left Column: Sticky Title */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-32">
                <h1 className="text-5xl md:text-7xl font-extrabold text-matteBlack tracking-tight mb-6 leading-none">
                  {project.client_name}
                </h1>
                <div className="inline-block px-6 py-3 bg-accentBlue text-matteBlack text-xl md:text-2xl font-extrabold tracking-widest uppercase rounded-sm shadow-sm mb-8">
                  {project.hero_metric}
                </div>
                
                {/* Tech Stack / Services Tags */}
                {project.services && project.services.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8">
                    {project.services.map((service: string, i: number) => (
                      <span key={i} className="px-4 py-2 bg-matteBlack/5 text-matteBlack text-xs font-bold uppercase tracking-widest rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: The Narrative Bento Box */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white p-8 md:p-12 rounded-3xl border border-matteBlack/5 shadow-sm hover:shadow-xl transition-shadow duration-500">
                <h3 className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-matteBlack/40 mb-6">
                  <span className="w-8 h-[2px] bg-red-500"></span> The Challenge
                </h3>
                <p className="text-lg md:text-xl text-matteBlack/80 leading-relaxed font-medium">
                  {project.problem_statement}
                </p>
              </div>
              
              <div className="bg-matteBlack text-white p-8 md:p-12 rounded-3xl shadow-xl hover:scale-[1.01] transition-transform duration-500">
                <h3 className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/40 mb-6">
                  <span className="w-8 h-[2px] bg-accentBlue"></span> Our Pivot
                </h3>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                  {project.solution_statement}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </header>

      <div className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-32">
        
        {/* 2. THE GROWTH GRAPH (Visual Timeline) */}
        {project.timeline_data && project.timeline_data.length > 0 && (
          <FadeIn>
            <div className="bg-matteBlack rounded-3xl p-8 md:p-16 overflow-hidden relative shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-16 relative z-10">
                Performance <span className="text-accentBlue">Trajectory</span>
              </h2>
              
              <div className="space-y-8 relative z-10">
                {project.timeline_data.map((step: any, i: number) => {
                  // Calculate an abstract expanding width for the visual graph effect
                  const totalSteps = project.timeline_data.length;
                  const baseWidth = 25; // Minimum width %
                  const calculatedWidth = baseWidth + (i * ((100 - baseWidth) / Math.max(1, totalSteps - 1)));
                  
                  return (
                    <div key={i} className="group relative">
                      {/* Label & Metric above the bar on mobile, inside on desktop */}
                      <div className="flex flex-col md:flex-row md:items-end justify-between mb-2 md:mb-0 md:absolute md:inset-y-0 md:left-6 md:right-6 md:z-20 pointer-events-none">
                        <span className="text-xs font-bold text-white/50 uppercase tracking-widest md:self-center">{step.label}</span>
                        <span className="text-2xl md:text-3xl font-extrabold text-white md:self-center">{step.metric}</span>
                      </div>
                      
                      {/* The Animated Bar */}
                      <div className="w-full h-auto md:h-20 bg-white/5 rounded-xl overflow-hidden relative border border-white/10">
                        <div 
                          className="h-2 md:h-full bg-accentBlue/20 md:bg-white/10 absolute left-0 top-0 transition-all duration-1000 group-hover:bg-accentBlue"
                          style={{ width: `${calculatedWidth}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Decorative grid background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>
          </FadeIn>
        )}

        {/* 3. CREATIVE ASSETS (Dynamic Aspect Ratio Grid) */}
        {project.creative_assets && project.creative_assets.length > 0 && (
          <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <h2 className="text-3xl md:text-5xl font-extrabold text-matteBlack tracking-tight">Creative <br/><span className="text-matteBlack/30">Execution</span></h2>
            </div>
            
            {/* Using flex-wrap instead of strict grid allows items of different widths/ratios to flow naturally */}
            <div className="flex flex-wrap gap-6">
              {project.creative_assets.map((asset: any, i: number) => {
                // Get the raw URL, and use .trim() to wipe out any accidental spaces!
                const rawUrl = typeof asset === 'string' ? asset : asset.url;
                const imgUrl = rawUrl ? rawUrl.trim() : ""; 
                const ratio = typeof asset === 'string' ? '1/1' : (asset.aspectRatio || '1/1');
                
                // If the image is landscape, let it span wide. If portrait/square, let it sit side-by-side.
                const widthClass = ratio === '16/9' ? 'w-full' : 'w-full md:w-[calc(50%-12px)]';

                return (
                  <div 
                    key={i} 
                    className={`relative ${widthClass} bg-offWhite rounded-2xl overflow-hidden border border-matteBlack/10 group`}
                    style={{ aspectRatio: ratio }}
                  >
                    <Image 
                      src={imgUrl} 
                      alt={`Creative Asset ${i+1}`} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      sizes="(max-width: 768px) 100vw, 100vw"
                    />
                  </div>
                );
              })}
            </div>
          </FadeIn>
        )}

        {/* 4. CAMPAIGN MEDIA (Dynamic Aspect Ratio Vault) */}
        {project.video_assets && project.video_assets.length > 0 && (
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-extrabold text-matteBlack tracking-tight mb-12">Motion & <span className="text-accentBlue">Media</span></h2>
            <div className="flex flex-wrap gap-8">
              {project.video_assets.map((vid: any, i: number) => {
                const ratio = vid.aspectRatio || '16/9';
                // Vertical reels stay slim, standard videos span wider
                const widthClass = ratio === '9/16' ? 'w-full md:w-[calc(33%-21px)]' : 'w-full md:w-[calc(50%-16px)]';

                return (
                  <a 
                    key={i} 
                    href={vid.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`group block relative ${widthClass} bg-matteBlack rounded-2xl overflow-hidden shadow-lg border border-matteBlack/10`}
                    style={{ aspectRatio: ratio }}
                  >
                    <Image src={vid.thumbnail} alt="Video Thumbnail" fill className="object-cover opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white text-matteBlack px-6 py-4 rounded-full font-extrabold uppercase tracking-widest text-xs flex items-center gap-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl">
                        <span>Play Campaign</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </FadeIn>
        )}

        {/* 5. THE VERDICT (Editorial Quote) */}
        {project.testimonial && project.testimonial.quote && (
          <FadeIn>
            <div className="py-20 md:py-32 border-t border-matteBlack/10 text-center max-w-4xl mx-auto">
              <svg className="w-12 h-12 text-accentBlue mx-auto mb-8" fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" /></svg>
              <p className="text-2xl md:text-4xl font-medium leading-tight md:leading-snug mb-10 text-matteBlack">
                "{project.testimonial.quote}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-[2px] bg-matteBlack/20"></div>
                <span className="block text-matteBlack font-extrabold tracking-widest uppercase text-sm">
                  {project.testimonial.author}
                </span>
                <div className="w-12 h-[2px] bg-matteBlack/20"></div>
              </div>
            </div>
          </FadeIn>
        )}

      </div>
    </div>
  );
}