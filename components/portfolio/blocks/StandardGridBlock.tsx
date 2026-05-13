"use client";

import Image from "next/image";
import { FadeIn } from "@/components/ui/MotionWrapper";

type StandardGridProps = {
  categoryName?: string;
  images: string[];
  columns?: 2 | 3;
  accentTheme?: "blue" | "red";
};

export default function StandardGridBlock({ categoryName, images, columns = 2, accentTheme = "blue" }: StandardGridProps) {
  if (!images || images.length === 0) return null;
  const isRed = accentTheme === "red";
  const lineColor = isRed ? "bg-red-500" : "bg-accentBlue";
  const borderColor = isRed ? "border-red-500/40" : "border-accentBlue/40";

  const gridClass = columns === 3 
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" 
    : "grid-cols-1 md:grid-cols-2";

  return (
    <div className="space-y-8 px-6 lg:px-12">
      {categoryName && (
        <FadeIn>
          <div className="flex items-center gap-4 border-b border-matteBlack/10 pb-4">
            <span className={`w-3 h-[2px] ${lineColor}`} />
            {/* FORCED MATTE BLACK TEXT */}
            <h3 className="text-xl font-extrabold text-matteBlack uppercase tracking-widest">
              {categoryName}
            </h3>
          </div>
        </FadeIn>
      )}

      <div className={`grid ${gridClass} gap-6 md:gap-8`}>
        {images.map((imgUrl, index) => (
          <FadeIn key={index} delay={index * 0.1} className="h-full">
            <div className={`relative w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden border-2 ${borderColor} group shadow-sm hover:shadow-xl transition-all duration-500`}>
              <Image 
                src={imgUrl} 
                alt={`${categoryName || 'Portfolio'} asset ${index + 1}`} 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}