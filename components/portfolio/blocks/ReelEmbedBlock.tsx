"use client";

import { FadeIn } from "@/components/ui/MotionWrapper";

type ReelGridProps = {
  videoUrls: string[];
  title?: string;
  accentTheme?: "blue" | "red";
};

export default function ReelEmbedBlock({ videoUrls = [], title, accentTheme = "blue" }: ReelGridProps) {
  if (!videoUrls || videoUrls.length === 0) return null;

  const isRed = accentTheme === "red";
  const borderColor = isRed ? "border-red-500/40" : "border-accentBlue/40";
  const lineColor = isRed ? "bg-red-500" : "bg-accentBlue";

  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtube.com/shorts/")) {
        const videoId = url.split("shorts/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.split("v=")[1] || url.split("youtu.be/")[1];
        const cleanId = videoId?.split("&")[0];
        return `https://www.youtube.com/embed/${cleanId}?autoplay=0&rel=0`;
      }
      if (url.includes("vimeo.com")) {
        const videoId = url.split("vimeo.com/")[1].split("?")[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return url; 
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="space-y-8 px-6 lg:px-12 max-w-[1500px] mx-auto w-full">
      {title && (
        <FadeIn>
          <div className="flex items-center gap-4 border-b border-matteBlack/10 pb-4">
            <span className={`w-3 h-[2px] ${lineColor}`} />
            <h3 className="text-xl font-extrabold text-matteBlack uppercase tracking-widest">
              {title}
            </h3>
          </div>
        </FadeIn>
      )}

      {/* THE GRID: Automatically scales based on how many reels are added */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
        {videoUrls.map((url, index) => {
          const isIframe = url.includes("youtube") || url.includes("youtu.be") || url.includes("vimeo");
          
          return (
            <FadeIn key={index} delay={index * 0.1} className="w-full max-w-sm mx-auto">
              <div className={`relative w-full aspect-[9/16] bg-matteBlack rounded-[2rem] overflow-hidden border-4 ${borderColor} shadow-xl group hover:shadow-2xl transition-all duration-300`}>
                {isIframe ? (
                  <iframe
                    src={getEmbedUrl(url)}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={url} 
                    controls 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    controlsList="nodownload"
                  />
                )}
              </div>
            </FadeIn>
          )
        })}
      </div>
    </div>
  );
}