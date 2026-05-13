"use client";

import Image from "next/image";
import { FadeIn } from "@/components/ui/MotionWrapper";

type CinematicFadeProps = {
  imageUrl: string;
  title: string;
  descriptionType?: "points" | "paragraph";
  features?: string[];
  paragraphText?: string;
  accentTheme?: "blue" | "red";
};

export default function CinematicFadeBlock({ 
  imageUrl, 
  title, 
  descriptionType = "points",
  features = [], 
  paragraphText = "",
  accentTheme = "blue" 
}: CinematicFadeProps) {
  const isRed = accentTheme === "red";
  const themeColor = isRed ? "text-red-500" : "text-accentBlue";
  const borderColor = isRed ? "border-red-500/30" : "border-accentBlue/30";
  const iconBg = isRed ? "bg-red-500/10" : "bg-accentBlue/10";

  const words = title.split(' ');
  const lastWord = words.pop();
  const firstPart = words.join(' ');

  return (
    <div className="relative w-full min-h-[80vh] flex flex-col md:flex-row items-center overflow-hidden bg-white border-y border-matteBlack/5">
      
      {/* MOBILE: Fading to white */}
      <div className="md:hidden relative w-full h-[50vh]">
        {imageUrl && <Image src={imageUrl} alt={title} fill className="object-cover object-top" />}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f7f7f8]/80 to-[#f7f7f8]" />
      </div>

      {/* DESKTOP: Fading to white */}
      <div className="hidden md:block absolute top-0 right-0 w-[60%] h-full">
        {imageUrl && <Image src={imageUrl} alt={title} fill className="object-cover object-center" />}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-24">
        <div className="max-w-2xl">
          <FadeIn>
            {/* White text with a drop shadow so it's visible on the white fade */}
            <h2 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-xl tracking-tight mb-16 leading-[1.1]">
              {firstPart} <br/> <span className={themeColor}>{lastWord}</span>
            </h2>
            
            {/* CONDITIONAL RENDER: Points vs Paragraph */}
            {descriptionType === "points" ? (
              <div className="space-y-10">
                {features.map((feature, idx) => {
                  const [heading, ...descParts] = feature.split(':');
                  const description = descParts.join(':');
                  
                  return (
                    <div key={idx} className="flex gap-6 items-start group">
                      <div className={`mt-1 w-12 h-12 rounded-xl ${iconBg} border ${borderColor} flex items-center justify-center shrink-0 shadow-sm`}>
                         <svg className={`w-5 h-5 ${themeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                         </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-matteBlack mb-2">{heading}</h4>
                        {description && (
                          <p className="text-sm md:text-base text-matteBlack/70 leading-relaxed font-medium">
                            {description.trim()}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="prose prose-lg">
                <p className="text-lg md:text-xl text-matteBlack/80 leading-relaxed font-medium whitespace-pre-wrap">
                  {paragraphText}
                </p>
              </div>
            )}
          </FadeIn>
        </div>
      </div>
    </div>
  );
}