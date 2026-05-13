"use client";

import Image from "next/image";
import { FadeIn } from "@/components/ui/MotionWrapper";

type MasonryGridProps = {
  categoryName?: string;
  images: string[];
  accentTheme?: "blue" | "red";
};

export default function MasonryGridBlock({ categoryName, images, accentTheme = "blue" }: MasonryGridProps) {
  if (!images || images.length === 0) return null;
  const isRed = accentTheme === "red";
  const bulletColor = isRed ? "bg-red-500" : "bg-accentBlue";
  const borderColor = isRed ? "border-red-500/40" : "border-accentBlue/40";

  return (
    <div className="space-y-8 px-6 lg:px-12">
      {categoryName && (
        <FadeIn>
          <div className="flex items-center gap-4 border-b border-matteBlack/10 pb-4">
            <span className={`w-2 h-2 rounded-full ${bulletColor}`} />
            {/* FORCED MATTE BLACK TEXT */}
            <h3 className="text-xl font-extrabold text-matteBlack uppercase tracking-widest">
              {categoryName}
            </h3>
          </div>
        </FadeIn>
      )}

      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        {images.map((imgUrl, index) => (
          <FadeIn key={index} delay={index * 0.1}>
            <div className={`relative w-full bg-white rounded-xl overflow-hidden border-2 ${borderColor} group inline-block shadow-sm`}>
              <Image 
                src={imgUrl} 
                alt={`${categoryName || 'Portfolio'} asset ${index + 1}`} 
                width={800} 
                height={1200}
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-matteBlack/0 group-hover:bg-matteBlack/5 transition-colors duration-500" />
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}