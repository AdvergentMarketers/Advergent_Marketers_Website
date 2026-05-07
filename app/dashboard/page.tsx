"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "../../components/ui/MotionWrapper";
import { createClient } from "../../lib/supabase";
import { useCurrency } from "../../components/providers/CurrencyProvider";

export default function ClientDashboard() {
  const supabase = createClient();
  const { formatPrice } = useCurrency();

  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        window.location.href = '/auth';
        return;
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('contact_email', user.email)
        .single();

      if (data) {
        setClientData(data);
      }
      setIsLoading(false);
    };

    fetchClientData();
  }, [supabase]);

  // Loading State
  if (isLoading) {
    return <div className="min-h-screen bg-offWhite flex items-center justify-center font-bold text-matteBlack animate-pulse">Decrypting Ecosystem...</div>;
  }

  // Pending Setup State
  if (!clientData) {
    return (
      <div className="min-h-screen bg-offWhite pt-32 px-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-accentBlue/20 text-accentBlue rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h1 className="text-3xl font-extrabold text-matteBlack tracking-tight mb-4">Ecosystem Pending Setup</h1>
        <p className="text-matteBlack/60 font-medium max-w-md mb-8">
          Your account has been secured, but your strategist is still deploying your digital architecture. Please check back shortly.
        </p>
        <a href="mailto:ginniomen22@gmail.com" className="px-6 py-3 bg-matteBlack text-white font-bold text-sm uppercase tracking-widest rounded-md">Contact Support</a>
      </div>
    );
  }

  // Safe fallbacks for the JSONB arrays
  const activeProjects = clientData.active_projects || [];
  const deliverables = clientData.deliverables || [];
  const timelineData = clientData.timeline_data || [];
  const creativeAssets = clientData.creative_assets || [];
  const videoAssets = clientData.video_assets || [];

  return (
    <div className="min-h-screen bg-offWhite pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* ==========================================
            SECTION 1: THE COMMAND CENTER HEADER
            ========================================== */}
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-matteBlack/10 pb-8 gap-6">
            <div>
              <span className="text-accentBlue font-bold tracking-widest uppercase text-sm mb-2 block">
                Live Ecosystem
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-matteBlack tracking-tight leading-none mb-4">
                {clientData.company_name}
              </h1>
              <p className="text-matteBlack/60 font-medium">
                Welcome back, {clientData.client_name}. Overview generated successfully.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/contact" className="px-6 py-3 bg-white border border-matteBlack/10 text-matteBlack font-bold text-sm uppercase tracking-widest rounded-md hover:border-matteBlack/30 transition-colors shadow-sm text-center">
                Strategy Call
              </Link>
              <button onClick={() => {
                supabase.auth.signOut();
                window.location.href = '/auth';
              }} className="px-6 py-3 bg-matteBlack text-white font-bold text-sm uppercase tracking-widest rounded-md hover:bg-accentBlue hover:text-matteBlack transition-colors shadow-sm">
                Sign Out
              </button>
            </div>
          </div>
        </FadeIn>

        {/* ==========================================
            SECTION 2: OPERATIONS BENTO BOX
            ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
          
          <div className="lg:col-span-2 space-y-8">
            <FadeIn>
              <div className="bg-white p-8 rounded-3xl border border-matteBlack/5 shadow-sm">
                <h2 className="text-xl font-bold text-matteBlack mb-6 flex items-center gap-3">
                  <span className="w-4 h-[2px] bg-accentBlue"></span> Active Campaigns
                </h2>
                <div className="space-y-6">
                  {activeProjects.map((project: any, i: number) => (
                    <div key={i} className="p-6 bg-offWhite rounded-2xl border border-matteBlack/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-matteBlack text-lg">{project.name}</h3>
                        <span className={`inline-block mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-matteBlack/5 text-matteBlack'}`}>
                          Status: {project.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-2 bg-matteBlack/10 rounded-full overflow-hidden">
                          <div className="h-full bg-accentBlue transition-all duration-1000" style={{ width: project.progress }}></div>
                        </div>
                        <span className="text-sm font-bold text-matteBlack/60 w-12 text-right">{project.progress}</span>
                      </div>
                    </div>
                  ))}
                  {activeProjects.length === 0 && <p className="text-sm font-bold text-matteBlack/40">No active campaigns currently running.</p>}
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="bg-matteBlack text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Account Balance</h2>
                  <p className="text-white/60 font-medium text-sm">
                    {clientData.next_invoice_date ? `Next invoice generated on ${clientData.next_invoice_date}.` : 'No pending invoice dates.'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-extrabold text-accentBlue">{formatPrice(clientData.account_balance)}</p>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Outstanding Balance</p>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="space-y-8">
            <FadeIn>
              <div className="bg-white p-8 rounded-3xl border border-matteBlack/5 shadow-sm text-center">
                <div className="w-20 h-20 bg-accentBlue/20 text-accentBlue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h3 className="font-bold text-matteBlack text-lg">Guninder Singh</h3>
                <p className="text-sm text-matteBlack/60 font-medium mb-6">Lead Growth Strategist</p>
                <a href="mailto:ginniomen22@gmail.com" className="block w-full py-3 bg-offWhite text-matteBlack font-bold text-sm uppercase tracking-widest rounded-md hover:bg-matteBlack/5 transition-colors">Email Manager</a>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="bg-white p-8 rounded-3xl border border-matteBlack/5 shadow-sm">
                <h2 className="text-xl font-bold text-matteBlack mb-6 flex items-center gap-3">
                  <span className="w-4 h-[2px] bg-red-500"></span> Deliverables
                </h2>
                <div className="space-y-4">
                  {deliverables.map((item: any, i: number) => (
                    <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="group block p-4 bg-offWhite rounded-xl border border-matteBlack/5 hover:border-accentBlue transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-matteBlack group-hover:text-accentBlue transition-colors">{item.name}</h4>
                          <span className="text-xs text-matteBlack/50 font-medium mt-1 block">Added: {item.date}</span>
                        </div>
                        <svg className="w-5 h-5 text-matteBlack/30 group-hover:text-accentBlue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </div>
                    </a>
                  ))}
                  {deliverables.length === 0 && <p className="text-sm font-bold text-matteBlack/40">No files uploaded yet.</p>}
                </div>
              </div>
            </FadeIn>
          </div>

        </div>

        {/* ==========================================
            SECTION 3: LIVE PRESENTATION ARRAYS
            ========================================== */}
        <div className="space-y-32">
          
          {/* THE GROWTH GRAPH */}
          {timelineData.length > 0 && (
            <FadeIn>
              <div className="bg-matteBlack rounded-3xl p-8 md:p-16 overflow-hidden relative shadow-2xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-16 relative z-10">
                  Performance <span className="text-accentBlue">Trajectory</span>
                </h2>
                
                <div className="space-y-8 relative z-10">
                  {timelineData.map((step: any, i: number) => {
                    const totalSteps = timelineData.length;
                    const baseWidth = 25; 
                    const calculatedWidth = baseWidth + (i * ((100 - baseWidth) / Math.max(1, totalSteps - 1)));
                    
                    return (
                      <div key={i} className="group relative">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-2 md:mb-0 md:absolute md:inset-y-0 md:left-6 md:right-6 md:z-20 pointer-events-none">
                          <span className="text-xs font-bold text-white/50 uppercase tracking-widest md:self-center">{step.label}</span>
                          <span className="text-2xl md:text-3xl font-extrabold text-white md:self-center">{step.metric}</span>
                        </div>
                        <div className="w-full h-auto md:h-20 bg-white/5 rounded-xl overflow-hidden relative border border-white/10">
                          <div className="h-2 md:h-full bg-accentBlue/20 md:bg-white/10 absolute left-0 top-0 transition-all duration-1000 group-hover:bg-accentBlue" style={{ width: `${calculatedWidth}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              </div>
            </FadeIn>
          )}

          {/* CREATIVE ASSETS VAULT */}
          {creativeAssets.length > 0 && (
            <FadeIn>
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <h2 className="text-3xl md:text-5xl font-extrabold text-matteBlack tracking-tight">Creative <br/><span className="text-matteBlack/30">Vault</span></h2>
              </div>
              <div className="flex flex-wrap gap-6">
                {creativeAssets.map((asset: any, i: number) => {
                  const imgUrl = (typeof asset === 'string' ? asset : asset.url)?.trim() || ""; 
                  const ratio = typeof asset === 'string' ? '1/1' : (asset.aspectRatio || '1/1');
                  const widthClass = ratio === '16/9' ? 'w-full' : 'w-full md:w-[calc(50%-12px)]';

                  return (
                    <div key={i} className={`relative ${widthClass} bg-offWhite rounded-2xl overflow-hidden border border-matteBlack/10 group shadow-sm`} style={{ aspectRatio: ratio }}>
                      {imgUrl && <Image src={imgUrl} alt={`Creative Asset ${i+1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" sizes="(max-width: 768px) 100vw, 100vw" />}
                    </div>
                  );
                })}
              </div>
            </FadeIn>
          )}

          {/* MOTION & MEDIA */}
          {videoAssets.length > 0 && (
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-extrabold text-matteBlack tracking-tight mb-12">Active <span className="text-accentBlue">Media</span></h2>
              <div className="flex flex-wrap gap-8">
                {videoAssets.map((vid: any, i: number) => {
                  const ratio = vid.aspectRatio || '16/9';
                  const widthClass = ratio === '9/16' ? 'w-full md:w-[calc(33%-21px)]' : 'w-full md:w-[calc(50%-16px)]';

                  return (
                    <a key={i} href={vid.link} target="_blank" rel="noopener noreferrer" className={`group block relative ${widthClass} bg-matteBlack rounded-2xl overflow-hidden shadow-lg border border-matteBlack/10`} style={{ aspectRatio: ratio }}>
                      {vid.thumbnail && <Image src={vid.thumbnail} alt="Video Thumbnail" fill className="object-cover opacity-70 group-hover:opacity-40 transition-opacity duration-500" />}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white text-matteBlack px-6 py-4 rounded-full font-extrabold uppercase tracking-widest text-xs flex items-center gap-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl">
                          <span>View Media</span>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </FadeIn>
          )}

        </div>

      </div>
    </div>
  );
}