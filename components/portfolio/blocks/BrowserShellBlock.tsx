"use client";

import { useState, useEffect } from "react";
import { FadeIn } from "@/components/ui/MotionWrapper";

interface BrowserShellProps {
  title: string;
  liveUrl: string;
  defaultDevice?: "desktop" | "tablet" | "mobile";
  accentTheme?: "blue" | "red";
}

export default function BrowserShellBlock({ 
  title, 
  liveUrl, 
  defaultDevice = "desktop",
  accentTheme = "blue"
}: BrowserShellProps) {
  const [isInteractive, setIsInteractive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(defaultDevice);

  // Lock background scrolling when full screen is active
 
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // FIX: Added curly braces so it returns void instead of a string
    return () => { document.body.style.overflow = "auto"; };
  }, [isFullscreen]);

  // Handle ESC key to exit full screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const themeColor = accentTheme === "red" ? "bg-red-600 hover:bg-red-700" : "bg-accentBlue hover:bg-blue-600";

  const inlineDeviceStyles = {
    mobile: "max-w-[390px] h-[844px] mx-auto",
    tablet: "max-w-[768px] h-[1024px] mx-auto",
    // We swap the squat 16:9 ratio for a massive custom height, ensuring it stays fully responsive.
    desktop: "w-full max-w-[1440px] aspect-[4/3] min-h-[600px] xl:min-h-[850px] mx-auto" 
  };

  // ----------------------------------------------------------------------
  // RENDER 1: THE FULL-SCREEN DEVICE LAB (Flexbox Bug Fixed)
  // ----------------------------------------------------------------------
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-matteBlack/95 backdrop-blur-xl flex flex-col w-screen h-screen">
        
        {/* The Device Lab Top Bar */}
        <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-matteBlack border-b border-white/10 shrink-0">
          <div className="hidden md:block w-1/3 text-white/50 text-xs font-bold uppercase tracking-widest truncate pr-4">
            {title}
          </div>

          {/* Device Toggles */}
          <div className="flex bg-white/10 p-1 rounded-lg border border-white/5 mx-auto md:mx-0">
            <button onClick={() => setViewMode("desktop")} className={`px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest rounded-md transition-all flex items-center gap-2 ${viewMode === "desktop" ? "bg-white text-matteBlack" : "text-white/50 hover:text-white"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button onClick={() => setViewMode("tablet")} className={`px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest rounded-md transition-all flex items-center gap-2 ${viewMode === "tablet" ? "bg-white text-matteBlack" : "text-white/50 hover:text-white"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button onClick={() => setViewMode("mobile")} className={`px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest rounded-md transition-all flex items-center gap-2 ${viewMode === "mobile" ? "bg-white text-matteBlack" : "text-white/50 hover:text-white"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          <div className="w-1/3 flex justify-end">
            <button onClick={() => setIsFullscreen(false)} className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full hover:bg-white/20">
              <span className="hidden sm:inline">Close</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* THE FIX: Changed from items-center to items-start.
            This ensures tall mobile/tablet mockups never clip the top mac bar! 
        */}
        <div className="flex-1 overflow-y-auto w-full">
          <div className="min-h-full flex items-start justify-center p-4 md:p-8">
            
            <div className={`relative bg-white flex flex-col shrink-0 shadow-2xl transition-all duration-500 ease-in-out ${
              viewMode === "mobile" ? "w-[390px] h-[844px] rounded-[3rem] border-[12px] border-black" :
              viewMode === "tablet" ? "w-[768px] h-[1024px] rounded-[2rem] border-[12px] border-black" :
              "w-[1440px] max-w-full h-[85vh] rounded-xl border border-white/20"
            }`}>
              
              <div className="flex items-center px-4 py-2 bg-offWhite border-b border-matteBlack/10 shrink-0 rounded-t-xl">
                <div className="flex space-x-2 w-16">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white border border-matteBlack/5 px-3 py-1 rounded text-[9px] font-bold text-matteBlack/50 tracking-widest truncate max-w-[200px]">
                    {liveUrl.replace(/^https?:\/\//, '')}
                  </div>
                </div>
                <div className="w-16"></div>
              </div>

              <iframe src={liveUrl} className="w-full flex-1 border-none rounded-b-xl" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" title={title} />
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // RENDER 2: THE INLINE EMBED (Prioritizing Inline Interaction)
  // ----------------------------------------------------------------------
  return (
    <FadeIn>
      <div className="flex flex-col space-y-4">
        
        {/* Context Header with prominent Full Screen trigger */}
        {title && (
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-extrabold text-matteBlack tracking-tight truncate pr-4">{title}</h3>
            
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setIsFullscreen(true)}
                className={`px-4 py-2 ${themeColor} text-white text-[10px] font-bold uppercase tracking-widest rounded-md transition-colors flex items-center gap-2 shadow-sm`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                <span className="hidden sm:inline">Full Screen</span>
              </button>
              
              <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white border border-matteBlack/10 text-[10px] font-bold uppercase tracking-widest text-matteBlack hover:border-matteBlack transition-colors rounded-md flex items-center gap-2 shadow-sm">
                <span className="hidden sm:inline">New Tab</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
        )}

        <div className={`relative flex flex-col bg-white rounded-xl shadow-2xl border border-matteBlack/10 overflow-hidden transition-all duration-700 ${inlineDeviceStyles[defaultDevice]}`}>
          
          <div className="flex items-center px-4 py-3 bg-offWhite border-b border-matteBlack/10 shrink-0">
            <div className="flex space-x-2 w-24">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80 cursor-pointer hover:bg-green-500" title="Full Screen" onClick={() => setIsFullscreen(true)}></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center space-x-2 bg-white border border-matteBlack/5 px-4 py-1.5 rounded-md text-[10px] font-bold text-matteBlack/50 tracking-widest truncate max-w-sm w-full shadow-sm">
                <span className="truncate">{liveUrl.replace(/^https?:\/\//, '')}</span>
              </div>
            </div>
            <div className="w-24"></div> 
          </div>

          <div className="relative w-full flex-1 bg-white">
            <iframe src={liveUrl} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" title={title} />

            {/* Subtle Glass Shield to prevent scroll trapping */}
            {!isInteractive && (
              <div 
                onClick={() => setIsInteractive(true)}
                className="absolute inset-0 z-10 bg-matteBlack/5 backdrop-blur-[1px] flex items-center justify-center cursor-pointer group hover:bg-matteBlack/10 transition-all duration-300"
              >
                <div className="px-6 py-3 bg-matteBlack text-white text-[10px] font-extrabold uppercase tracking-widest rounded shadow-xl flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                  Click to Interact
                </div>
              </div>
            )}

            {/* FLOATING ACTION BUTTONS (When interacting inline) */}
            {isInteractive && !isFullscreen && (
              <div 
                className="absolute top-1/2 -translate-y-1/2 right-6 z-20 flex flex-col items-end gap-3 opacity-0 hover:opacity-100 group-hover:opacity-100"
                style={{ animation: "fadeIn 0.5s forwards" }}
              >
                <button 
                  onClick={() => setIsFullscreen(true)}
                  className={`px-6 py-3 ${themeColor} text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                  Full Screen
                </button>
                <button 
                  onClick={() => setIsInteractive(false)}
                  className="px-4 py-2 bg-matteBlack/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-xl hover:bg-red-500 transition-colors"
                >
                  Lock Canvas
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}