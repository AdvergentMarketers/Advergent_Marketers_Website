"use client";

import { useEffect, useState } from "react";
import { FadeIn } from "@/components/ui/MotionWrapper";
import { createClient } from "@/lib/supabase";
import Image from "next/image";

type TeamMember = {
  id: string;
  name: string;
  designation: string;
  specialization: string;
  experience_details: string;
  certifications: string;
  years_experience: number;
  available_for_freelance: boolean;
  image_url: string;
};

export default function TeamRoster() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('priority', { ascending: true });

      if (!error && data) {
        setMembers(data);
      }
      setIsLoading(false);
    };

    fetchTeam();
  }, []);

  return (
    // Reduced top padding on mobile (py-12 instead of py-20) to pull everything up
    <section className="relative w-full py-12 sm:py-32 z-10">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <FadeIn>
          {/* Compressed bottom margin on mobile (mb-8 instead of mb-12) */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-24 px-4">
            <h2 className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-accentBlue mb-2 sm:mb-4">
              The Vanguard
            </h2>
            {/* Reduced text size from 3xl to 2xl, tightened line-height */}
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-matteBlack tracking-tight mb-3 sm:mb-6 leading-[1.1]">
              Engineered by industry leaders.
            </h3>
            {/* Reduced paragraph size to text-xs on mobile */}
            <p className="text-xs sm:text-lg text-matteBlack/70 font-medium leading-relaxed px-2 sm:px-0 max-w-[90%] mx-auto">
              An elite roster of brand strategists, full-stack developers, and media buyers dedicated to dominating your market sector.
            </p>
          </div>
        </FadeIn>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-matteBlack/10 border-t-accentBlue rounded-full animate-spin" />
          </div>
        )}

        {/* The Carousel Engine (Arrows removed, purely swipe-based now) */}
        {!isLoading && members.length > 0 && (
          <div className="relative w-full group">
            
            {/* The Scroll Track with Mask Image */}
            <div 
              className="flex gap-2 sm:gap-6 overflow-x-auto snap-x snap-mandatory px-[5%] sm:px-[10%] pb-12 pt-2 hide-scrollbar"
              style={{
                // Adjusted mask gradient to be slightly more forgiving on small screens
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
                maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)"
              }}
            >
              {members.map((member, index) => (
                <FadeIn 
                  key={member.id} 
                  delay={index * 0.1}
                  className="w-[30vw] min-w-[115px] sm:w-[280px] md:w-[350px] flex-none snap-center"
                >
                  
                  {/* Matte Black Premium Card */}
                  <div className="relative bg-matteBlack rounded-xl md:rounded-2xl overflow-hidden shadow-xl border border-white/10 flex flex-col h-full transform hover:-translate-y-2 transition-all duration-500">
                    
                    {/* Portrait Image */}
                    <div className="relative w-full aspect-[4/5] bg-matteBlack/50 overflow-hidden border-b border-white/10">
                      {member.image_url ? (
                        <Image 
                          src={member.image_url} 
                          alt={member.name} 
                          fill 
                          className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90 group-hover:opacity-100 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-matteBlack text-white/20">
                          <svg className="w-8 h-8 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                      )}
                    </div>

                    {/* Member Data */}
                    <div className="p-3 sm:p-6 md:p-8 flex-grow flex flex-col">
                      <h4 className="text-[11px] sm:text-xl md:text-2xl font-extrabold text-white mb-0.5 md:mb-1 truncate">
                        {member.name}
                      </h4>
                      <p className="text-accentBlue text-[8px] sm:text-xs md:text-sm font-bold uppercase tracking-widest mb-2 md:mb-4 truncate">
                        {member.designation}
                      </p>
                      
                      <p className="hidden md:block text-white/60 text-sm font-medium leading-relaxed mb-6 flex-grow">
                        {member.experience_details}
                      </p>

                      <div className="pt-2 md:pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[7px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold">Experience</span>
                          <span className="text-[9px] sm:text-xs md:text-sm text-white font-bold">{member.years_experience}+ Yrs</span>
                        </div>
                        
                        {member.specialization && (
                          <div className="bg-white/5 px-1.5 py-1 md:px-3 md:py-1.5 rounded-sm md:rounded-md border border-white/10 text-white/70 text-[7px] sm:text-[10px] md:text-xs font-semibold truncate max-w-full">
                            {member.specialization}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </FadeIn>
              ))}
            </div>

          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}