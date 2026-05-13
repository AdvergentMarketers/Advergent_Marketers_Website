"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "../../components/ui/MotionWrapper"; 
import { createClient } from "../../lib/supabase";

export default function AboutPage() {
  const supabase = createClient();
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('priority', { ascending: true }) // <-- Sorts by priority (1 is first)
        .order('created_at', { ascending: true }); // secondary fallback sort
      
      if (data) setTeam(data);
    };
    fetchTeam();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-offWhite pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* === SECTION 1: THE MANIFESTO === */}
        <FadeIn>
          <div className="max-w-4xl mb-32">
            <span className="text-accentBlue font-bold tracking-widest uppercase text-sm mb-4 block">
              The Advergent Philosophy
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-matteBlack tracking-tight leading-none mb-8">
              We engineer <span className="text-matteBlack/40">growth</span>, not just campaigns.
            </h1>
            <p className="text-xl text-matteBlack/80 font-medium leading-relaxed max-w-2xl">
              In a landscape cluttered with fragmented marketing tactics, we build cohesive, high-performance digital ecosystems. We combine deep technical architecture with minimal, premium aesthetics to scale brands with absolute precision.
            </p>
          </div>
        </FadeIn>

        {/* === SECTION 2: THE ROSTER (LIVE DATABASE) === */}
        <FadeIn>
          <div className="mb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-matteBlack/10 pb-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-matteBlack tracking-tight">The <span className="text-accentBlue">Architects</span></h2>
                <p className="text-matteBlack/60 font-medium mt-2 text-lg">The minds engineering your ecosystem.</p>
              </div>
            </div>

            {/* 3-Column Grid for 1080p Displays */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {team.map((member) => (
                <div key={member.id} className="bg-white rounded-2xl border border-matteBlack/10 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:border-accentBlue transition-all duration-300 relative">
                  
                  {/* Image Vault (If available) */}
                  {member.image_url && (
                    <div className="w-full h-48 bg-offWhite relative border-b border-matteBlack/5 overflow-hidden">
                      <Image src={member.image_url} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  )}
                  
                  <div className="p-6 md:p-8 flex-grow">
                    
                    {/* Fixed Badges Row (No more overlap!) */}
                    <div className="flex items-start justify-between mb-4 min-h-[28px]">
                      <div>
                        {/* Priority 1 (Founder/Lead) Badge */}
                        {member.priority === 1 && (
                          <span className="inline-block px-3 py-1 bg-matteBlack text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                              Leadership
                          </span>
                        )}
                      </div>
                      
                      <div>
                        {/* Freelance Badge */}
                        {member.available_for_freelance && (
                          <div className="flex items-center gap-2 bg-green-50 px-2 py-1 rounded-sm border border-green-100">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Available</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="text-2xl font-extrabold text-matteBlack mb-1">{member.name}</h3>
                    <p className="text-accentBlue font-bold text-sm mb-6">{member.designation}</p>
                    
                    <div className="space-y-4 text-sm font-medium text-matteBlack/70">
                      <div>
                        <strong className="block text-xs uppercase tracking-widest text-matteBlack/40 mb-1">Specialization</strong>
                        {member.specialization}
                      </div>
                      <div>
                        <strong className="block text-xs uppercase tracking-widest text-matteBlack/40 mb-1">Background ({member.years_experience} Yrs)</strong>
                        {member.experience_details}
                      </div>
                      {member.certifications && (
                        <div>
                          <strong className="block text-xs uppercase tracking-widest text-matteBlack/40 mb-1">Licenses</strong>
                          {member.certifications}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className={`p-6 border-t flex flex-col gap-3 ${member.available_for_freelance ? 'bg-accentBlue/5 border-accentBlue/20' : 'bg-offWhite border-matteBlack/5'}`}>
                    
                    {/* NEW: Route to Dynamic Profile Page */}
                    <Link 
                      href={`/team/${member.id}`}
                      className="block w-full py-3 text-center text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-300 bg-matteBlack text-white hover:bg-accentBlue hover:shadow-md"
                    >
                      View Full Profile
                    </Link>

                    {/* Existing Contact / Hire Button (Converted to Secondary Style) */}
                    <a 
                      href={"mailto:" + member.email}
                      className={`block w-full py-3 text-center text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-300 ${
                        member.available_for_freelance 
                          ? 'bg-white border border-accentBlue text-accentBlue hover:bg-accentBlue hover:text-white shadow-sm' 
                          : 'bg-transparent border border-matteBlack/20 text-matteBlack hover:border-matteBlack hover:bg-matteBlack/5'
                      }`}
                    >
                      {member.available_for_freelance ? 'Hire for Consulting' : `Contact ${member.name.split(' ')[0]}`}
                    </a>

                  </div>
                </div>
              ))}

              {team.length === 0 && (
                 <div className="col-span-full py-12 text-center text-matteBlack/40 font-bold">
                    Roster is currently empty.
                 </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* === SECTION 3: BRAND VALUES === */}
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-extrabold text-matteBlack tracking-tight mb-12">Core <span className="text-accentBlue">Protocols</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-matteBlack text-white p-8 md:p-10 rounded-3xl shadow-xl">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-8">
                <svg className="w-6 h-6 text-accentBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Algorithmic Precision</h3>
              <p className="text-white/60 font-medium leading-relaxed">
                Gut feelings are obsolete. We integrate advanced AI tooling and rigorous data analytics into our workflows to eliminate guesswork and scale what mathematically works.
              </p>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-matteBlack/5 shadow-sm">
              <div className="w-12 h-12 bg-accentBlue/10 rounded-full flex items-center justify-center mb-8">
                <svg className="w-6 h-6 text-accentBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-matteBlack mb-4">Minimal Luxury</h3>
              <p className="text-matteBlack/60 font-medium leading-relaxed">
                Complexity kills conversion. We champion a premium, matte-finish aesthetic that removes friction, elevates brand perception, and guides the user directly to the objective.
              </p>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-matteBlack/5 shadow-sm">
              <div className="w-12 h-12 bg-accentBlue/10 rounded-full flex items-center justify-center mb-8">
                <svg className="w-6 h-6 text-accentBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-matteBlack mb-4">Ecosystem Architecture</h3>
              <p className="text-matteBlack/60 font-medium leading-relaxed">
                We don't build isolated funnels. We architect full-stack digital ecosystems where your organic content, paid media, and web platforms talk to each other seamlessly.
              </p>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}