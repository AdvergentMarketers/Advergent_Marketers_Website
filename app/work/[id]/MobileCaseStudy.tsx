"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "../../../components/ui/MotionWrapper"; 

export default function MobileCaseStudy({ project }: { project: any }) {
  return (
    <div className="min-h-screen bg-offWhite pt-20 pb-24 overflow-x-hidden">
      
      {/* 1. MOBILE HERO & OVERVIEW */}
      <header className="px-5 mb-16">
        <FadeIn>
          <Link href="/work" className="inline-flex items-center text-xs font-bold text-matteBlack/50 hover:text-accentBlue mb-8 uppercase tracking-widest">
            &larr; Back to Portfolio
          </Link>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-matteBlack tracking-tight mb-4 leading-tight">
            {project.client_name}
          </h1>
          <div className="inline-block px-4 py-2 bg-accentBlue text-matteBlack text-lg font-extrabold tracking-widest uppercase rounded-sm shadow-sm mb-6">
            {project.hero_metric}
          </div>
          
          {project.services && project.services.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {project.services.map((service: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-matteBlack/5 text-matteBlack text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {service}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-matteBlack/5 shadow-sm">
              <h3 className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-matteBlack/40 mb-4">
                <span className="w-6 h-[2px] bg-red-500"></span> The Challenge
              </h3>
              <p className="text-base text-matteBlack/80 leading-relaxed font-medium">
                {project.problem_statement}
              </p>
            </div>
            
            <div className="bg-matteBlack text-white p-6 rounded-2xl shadow-xl">
              <h3 className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
                <span className="w-6 h-[2px] bg-accentBlue"></span> Our Pivot
              </h3>
              <p className="text-base text-white/90 leading-relaxed font-medium">
                {project.solution_statement}
              </p>
            </div>
          </div>
        </FadeIn>
      </header>

      <div className="px-5 space-y-20">
        
        {/* 2. MOBILE GROWTH GRAPH */}
        {project.timeline_data && project.timeline_data.length > 0 && (
          <FadeIn>
            <div className="bg-matteBlack rounded-2xl p-6 overflow-hidden relative shadow-2xl">
              <h2 className="text-2xl font-extrabold text-white tracking-tight mb-8 relative z-10">
                Performance <span className="text-accentBlue">Trajectory</span>
              </h2>
              
              <div className="space-y-6 relative z-10">
                {project.timeline_data.map((step: any, i: number) => {
                  const totalSteps = project.timeline_data.length;
                  const calculatedWidth = 25 + (i * (75 / Math.max(1, totalSteps - 1)));
                  
                  return (
                    <div key={i} className="relative flex flex-col">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{step.label}</span>
                        <span className="text-xl font-extrabold text-white">{step.metric}</span>
                      </div>
                      <div className="w-full h-8 bg-white/5 rounded-lg overflow-hidden relative border border-white/10">
                        <div className="h-full bg-accentBlue/40 absolute left-0 top-0 transition-all duration-1000" style={{ width: `${calculatedWidth}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        )}

        {/* 3. MOBILE CREATIVE ASSETS */}
        {project.creative_assets && project.creative_assets.length > 0 && (
          <FadeIn>
            <h2 className="text-3xl font-extrabold text-matteBlack tracking-tight leading-tight mb-6">
              Creative <span className="text-matteBlack/30">Execution</span>
            </h2>
            <div className="flex flex-col gap-4">
              {project.creative_assets.map((asset: any, i: number) => {
                const rawUrl = typeof asset === 'string' ? asset : asset.url;
                const imgUrl = rawUrl ? rawUrl.trim() : ""; 
                const ratio = typeof asset === 'string' ? '1/1' : (asset.aspectRatio || '1/1');
                
                return (
                  <div key={i} className="relative w-full bg-offWhite rounded-xl overflow-hidden border border-matteBlack/10" style={{ aspectRatio: ratio }}>
                    <Image src={imgUrl} alt={`Creative Asset ${i+1}`} fill className="object-cover" sizes="100vw" />
                  </div>
                );
              })}
            </div>
          </FadeIn>
        )}

        {/* 4. MOBILE CAMPAIGN MEDIA */}
        {project.video_assets && project.video_assets.length > 0 && (
          <FadeIn>
            <h2 className="text-3xl font-extrabold text-matteBlack tracking-tight mb-6">
              Motion & <span className="text-accentBlue">Media</span>
            </h2>
            <div className="flex flex-col gap-6">
              {project.video_assets.map((vid: any, i: number) => {
                const ratio = vid.aspectRatio || '16/9';
                
                return (
                  <a key={i} href={vid.link} target="_blank" rel="noopener noreferrer" className="block relative w-full bg-matteBlack rounded-xl overflow-hidden shadow-lg border border-matteBlack/10" style={{ aspectRatio: ratio }}>
                    <Image src={vid.thumbnail} alt="Video Thumbnail" fill className="object-cover opacity-70" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white text-matteBlack px-4 py-2 rounded-full font-extrabold uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-2xl">
                        <span>Play Campaign</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </FadeIn>
        )}

        {/* 5. MOBILE VERDICT */}
        {project.testimonial && project.testimonial.quote && (
          <FadeIn>
            <div className="pt-16 border-t border-matteBlack/10 text-center">
              <svg className="w-8 h-8 text-accentBlue mx-auto mb-6" fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" /></svg>
              <p className="text-xl font-medium leading-tight mb-8 text-matteBlack">
                "{project.testimonial.quote}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-[2px] bg-matteBlack/20"></div>
                <span className="block text-matteBlack font-extrabold tracking-widest uppercase text-[10px]">
                  {project.testimonial.author}
                </span>
                <div className="w-8 h-[2px] bg-matteBlack/20"></div>
              </div>
            </div>
          </FadeIn>
        )}

      </div>
    </div>
  );
}