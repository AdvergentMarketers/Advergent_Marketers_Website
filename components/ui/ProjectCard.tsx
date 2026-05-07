"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

// Updated to accept both old string data and new aspect ratio objects
interface CaseStudy {
  id: string;
  client_name: string;
  hero_metric: string;
  services: string[];
  problem_statement: string;
  creative_assets: any[]; // Changed from string[] to any[] to satisfy TypeScript
}

export default function ProjectCard({ project }: { project: CaseStudy }) {
  // Fallbacks just in case an array is empty
  // Fallbacks just in case an array is empty
  const primaryService = project.services && project.services.length > 0 ? project.services[0] : "Campaign";
  
  // Safely extract the URL whether it's the old string format or the new object format
  let coverImage = "/products/placeholder-category.png"; // Fallback image
  if (project.creative_assets && project.creative_assets.length > 0) {
    const firstAsset = project.creative_assets[0];
    coverImage = typeof firstAsset === 'string' ? firstAsset : firstAsset.url;
  }
  return (
    <Link href={`/work/${project.id}`} className="block h-full cursor-pointer">
      <motion.div 
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group flex flex-col h-full bg-white border border-matteBlack/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
      >
        {/* Massive Result Metric Header */}
        <div className="p-8 bg-matteBlack text-white flex flex-col items-start justify-center relative overflow-hidden">
          <span className="text-accentBlue text-sm font-bold uppercase tracking-widest mb-2 relative z-10">
            {primaryService}
          </span>
          <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight relative z-10">
            {project.hero_metric}
          </h3>
          
          {/* Subtle geometric background for a premium agency vibe */}
          <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
        </div>

        {/* Visual Proof / Dashboard Image */}
        <div className="relative w-full h-64 bg-offWhite border-y border-matteBlack/10 overflow-hidden flex items-center justify-center">
          <Image
            src={coverImage}
            alt={`Visual for ${project.client_name}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Client Details & Story */}
        <div className="p-8 flex flex-col flex-grow bg-white">
          <h4 className="text-xl font-bold text-matteBlack mb-3">
            {project.client_name}
          </h4>
          <p className="text-sm text-matteBlack/70 leading-relaxed font-medium line-clamp-3">
            {project.problem_statement}
          </p>
          
          <div className="mt-8 pt-6 border-t border-matteBlack/10 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-widest text-matteBlack group-hover:text-accentBlue transition-colors">
              View Case Study
            </span>
            <svg className="w-5 h-5 text-matteBlack/40 group-hover:text-accentBlue transition-colors translate-x-0 group-hover:translate-x-2 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}