"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// 1. The Core Logic Component
function FloatingWidgetContent() {
  const searchParams = useSearchParams();
  const isWebVault = searchParams.get("vault") === "web_development";

  // Hide on Web Development portfolio pages
  if (isWebVault) {
    return null;
  }

  // Render your widget on all other pages
  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* REPLACE THIS BUTTON WITH YOUR ACTUAL WIDGET/CHAT UI */}
      <button className="bg-matteBlack text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform font-extrabold text-[10px] uppercase tracking-widest">
        Contact Us
      </button>
      
    </div>
  );
}

// 2. The SEO-Safe Export Wrapper
export default function FloatingContact() {
  return (
    // Suspense ensures useSearchParams doesn't break static rendering
    <Suspense fallback={null}>
      <FloatingWidgetContent />
    </Suspense>
  );
}