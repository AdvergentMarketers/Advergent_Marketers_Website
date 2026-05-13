"use client";

import Image from "next/image";
import { FadeIn } from "@/components/ui/MotionWrapper";

type HeroBlockProps = {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  accentTheme?: "blue" | "red";
};

export default function HeroBlock({ imageUrl, title, subtitle, accentTheme = "blue" }: HeroBlockProps) {
  if (!imageUrl) return null;
  const isRed = accentTheme === "red";
  const themeColor = isRed ? "text-red-500" : "text-accentBlue";
  const borderColor = isRed ? "border-red-500/40" : "border-accentBlue/40";

  return (
    <FadeIn>
      <div className="px-6 lg:px-12 max-w-[1500px] mx-auto w-full">
        <div className={`relative w-full h-[50vh] md:h-[70vh] bg-white rounded-3xl overflow-hidden border-2 ${borderColor} shadow-xl group`}>
          <Image 
            src={imageUrl} 
            alt={title || "Featured Masterpiece"} 
            fill 
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
            sizes="(max-width: 1500px) 100vw, 1500px"
          />
          
          {(title || subtitle) && (
            // REMOVED THE GRADIENT BACKGROUND ENTIRELY
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 pointer-events-none">
              {subtitle && (
                <span className={`${themeColor} font-extrabold uppercase tracking-widest text-xs sm:text-sm mb-3 drop-shadow-md`}>
                  {subtitle}
                </span>
              )}
              {title && (
                // Added drop-shadow-lg so white text reads clearly over any image without a gradient!
                <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
                  {title}
                </h2>
              )}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}