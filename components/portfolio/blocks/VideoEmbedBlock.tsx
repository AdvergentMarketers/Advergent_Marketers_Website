"use client";

import { FadeIn } from "@/components/ui/MotionWrapper";

type VideoEmbedProps = {
  videoUrl: string;
  title?: string;
  accentTheme?: "blue" | "red";
};

export default function VideoEmbedBlock({ videoUrl, title, accentTheme = "blue" }: VideoEmbedProps) {
  if (!videoUrl) return null;

  const isRed = accentTheme === "red";
  const borderColor = isRed ? "border-red-500/40" : "border-accentBlue/40";
  const lineColor = isRed ? "bg-red-500" : "bg-accentBlue";

  // UPGRADED SMART ENGINE: Now supports YouTube Shorts and cleans URLs perfectly
  const getEmbedUrl = (url: string) => {
    try {
      // 1. YouTube Shorts Fix
      if (url.includes("youtube.com/shorts/")) {
        const videoId = url.split("shorts/")[1].split("?")[0]; // Grabs ID, drops query params
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
      
      // 2. Standard YouTube
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.split("v=")[1] || url.split("youtu.be/")[1];
        const cleanId = videoId?.split("&")[0];
        return `https://www.youtube.com/embed/${cleanId}?autoplay=0&rel=0`;
      }
      
      // 3. Vimeo
      if (url.includes("vimeo.com")) {
        const videoId = url.split("vimeo.com/")[1].split("?")[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }
      
      // Fallback for raw .mp4
      return url; 
    } catch (e) {
      // If parsing completely fails, return the raw URL to avoid crashing
      return url;
    }
  };

  const isIframe = videoUrl.includes("youtube") || videoUrl.includes("youtu.be") || videoUrl.includes("vimeo");

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

      <FadeIn>
        {/* Aspect ratio set to video for standard widescreen. */}
        <div className={`relative w-full aspect-video bg-matteBlack rounded-2xl overflow-hidden border-2 ${borderColor} shadow-xl group`}>
          {isIframe ? (
            <iframe
              src={getEmbedUrl(videoUrl)}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video 
              src={videoUrl} 
              controls 
              className="absolute top-0 left-0 w-full h-full object-cover"
              controlsList="nodownload"
            />
          )}
        </div>
      </FadeIn>
    </div>
  );
}