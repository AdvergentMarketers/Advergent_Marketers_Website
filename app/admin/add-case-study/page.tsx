"use client";

import { useState } from "react";
import { FadeIn } from "../../../components/ui/MotionWrapper"; // Adjust path if needed
import { createClient } from "../../../lib/supabase"; // Adjust path if needed

export default function AddCaseStudyBuilder() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const supabase = createClient();

  // --- Core State ---
  const [clientName, setClientName] = useState("");
  const [heroMetric, setHeroMetric] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");

  // --- Dynamic Array States ---
  const [services, setServices] = useState<string[]>([]);
  const [servicesInput, setServicesInput] = useState("");

  const [techStack, setTechStack] = useState<string[]>([]);
  const [techStackInput, setTechStackInput] = useState("");

  const [timeline, setTimeline] = useState<{ label: string; metric: string }[]>([]);
  const [creativeAssets, setCreativeAssets] = useState<{ url: string; aspectRatio: string }[]>([]);
  const [videos, setVideos] = useState<{ thumbnail: string; link: string; aspectRatio: string }[]>([]);
  
  // --- Testimonial State ---
  const [testimonial, setTestimonial] = useState({ quote: "", author: "" });

  // --- Handlers for Dynamic Arrays ---
  const handleAddItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, item: any) => {
    setter(prev => [...prev, item]);
  };

  const handleRemoveItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const newCaseStudy = {
      client_name: clientName,
      hero_metric: heroMetric,
      problem_statement: problem,
      solution_statement: solution,
      services: services, // JSONB
      tech_stack: techStack, // JSONB
      timeline_data: timeline, // JSONB
      creative_assets: creativeAssets, // JSONB
      video_assets: videos, // JSONB
      testimonial: testimonial, // JSONB
      is_active: true
    };

    try {
      const { error } = await supabase.from('case_studies').insert([newCaseStudy]);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Case study successfully built and published!' });
      
      // Reset Form
      setClientName(""); setHeroMetric(""); setProblem(""); setSolution("");
      setServices([]); setTechStack([]); setTimeline([]); setCreativeAssets([]); 
      setVideos([]); setTestimonial({ quote: "", author: "" });
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offWhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-matteBlack/10">
            
            <div className="mb-8 border-b border-matteBlack/10 pb-6">
              <span className="text-accentBlue font-bold uppercase tracking-widest text-xs mb-2 block">Enterprise Tool</span>
              <h1 className="text-3xl font-extrabold text-matteBlack tracking-tight">Case Study Builder</h1>
              <p className="mt-2 text-sm text-matteBlack/60 font-medium">Construct a dynamic, multi-section case study for the Advergent portfolio.</p>
            </div>

            {message && (
              <div className={`mb-8 p-4 text-sm font-bold rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* SECTION 1: Core Identity */}
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-matteBlack border-b border-matteBlack/5 pb-2">1. The Core Identity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-matteBlack mb-1">Client Name *</label>
                    <input type="text" required value={clientName} onChange={e => setClientName(e.target.value)} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue" placeholder="e.g., Stark Industries" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-matteBlack mb-1">Hero Metric *</label>
                    <input type="text" required value={heroMetric} onChange={e => setHeroMetric(e.target.value)} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue" placeholder="e.g., +450% ROI in 3 Months" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-matteBlack mb-1">The Problem (Before)</label>
                    <textarea rows={3} value={problem} onChange={e => setProblem(e.target.value)} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue resize-none" placeholder="Client was struggling with high CAC..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-matteBlack mb-1">The Pivot (Solution)</label>
                    <textarea rows={3} value={solution} onChange={e => setSolution(e.target.value)} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue resize-none" placeholder="We rebuilt their creative pipeline..." />
                  </div>
                </div>
              </section>

              {/* SECTION 2: Dynamic Timeline */}
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-matteBlack border-b border-matteBlack/5 pb-2">2. Performance Timeline</h2>
                
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center bg-offWhite p-4 rounded-md">
                    <span className="text-sm font-bold">{item.label}:</span>
                    <span className="text-sm">{item.metric}</span>
                    <button type="button" onClick={() => handleRemoveItem(setTimeline, index)} className="ml-auto text-red-500 text-sm font-bold">Remove</button>
                  </div>
                ))}

                <div className="flex gap-4">
                  <input type="text" id="timelineLabel" placeholder="e.g., Month 1" className="flex-1 px-4 py-2 bg-offWhite border border-matteBlack/10 rounded-md text-sm" />
                  <input type="text" id="timelineMetric" placeholder="e.g., $50k Revenue" className="flex-1 px-4 py-2 bg-offWhite border border-matteBlack/10 rounded-md text-sm" />
                  <button type="button" onClick={() => {
                    const label = (document.getElementById('timelineLabel') as HTMLInputElement).value;
                    const metric = (document.getElementById('timelineMetric') as HTMLInputElement).value;
                    if(label && metric) {
                      handleAddItem(setTimeline, { label, metric });
                      (document.getElementById('timelineLabel') as HTMLInputElement).value = '';
                      (document.getElementById('timelineMetric') as HTMLInputElement).value = '';
                    }
                  }} className="px-6 py-2 bg-matteBlack text-white rounded-md text-sm font-bold">Add Step</button>
                </div>
              </section>

              {/* SECTION 3: Visual Assets */}
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-matteBlack border-b border-matteBlack/5 pb-2">3. Visual Proof (Images & Video)</h2>
                
                {/* Images */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-matteBlack">Creative Posters / Logos</label>
                  {creativeAssets.map((asset, index) => (
                    <div key={index} className="flex gap-4 items-center bg-offWhite p-2 rounded-md border border-matteBlack/5">
                      <span className="text-xs font-bold bg-matteBlack/10 px-2 py-1 rounded">{asset.aspectRatio}</span>
                      <span className="text-xs text-matteBlack/70 truncate flex-1">{asset.url}</span>
                      <button type="button" onClick={() => handleRemoveItem(setCreativeAssets, index)} className="text-red-500 text-xs font-bold px-2">X</button>
                    </div>
                  ))}
                  <div className="flex gap-4">
                    <select id="assetRatio" className="w-1/4 px-2 py-2 bg-offWhite border border-matteBlack/10 rounded-md text-sm cursor-pointer">
                      <option value="16/9">16:9 (Landscape)</option>
                      <option value="4/3">4:3 (Standard)</option>
                      <option value="1/1" selected>1:1 (Square)</option>
                      <option value="4/5">4:5 (Portrait)</option>
                      <option value="9/16">9:16 (Vertical)</option>
                    </select>
                    <input type="text" id="assetInput" placeholder="Image URL (/portfolio/stark-poster.jpg)" className="flex-1 px-4 py-2 bg-offWhite border border-matteBlack/10 rounded-md text-sm" />
                    <button type="button" onClick={() => {
                      const url = (document.getElementById('assetInput') as HTMLInputElement).value;
                      const ratio = (document.getElementById('assetRatio') as HTMLSelectElement).value;
                      if(url) { 
                        handleAddItem(setCreativeAssets, { url, aspectRatio: ratio }); 
                        (document.getElementById('assetInput') as HTMLInputElement).value = ''; 
                      }
                    }} className="px-6 py-2 bg-matteBlack/10 text-matteBlack rounded-md text-sm font-bold hover:bg-matteBlack/20 transition">Add Image</button>
                  </div>
                </div>

                {/* Videos */}
                <div className="space-y-2 pt-4 border-t border-matteBlack/5">
                  <label className="block text-sm font-bold text-matteBlack">Videos (Drive Links)</label>
                  {videos.map((vid, index) => (
                     <div key={index} className="flex gap-4 items-center bg-offWhite p-2 rounded-md border border-matteBlack/5">
                        <span className="text-xs font-bold bg-matteBlack/10 px-2 py-1 rounded">{vid.aspectRatio}</span>
                        <span className="text-xs truncate flex-1">Thumb: {vid.thumbnail}</span>
                        <button type="button" onClick={() => handleRemoveItem(setVideos, index)} className="text-red-500 text-xs font-bold px-2">X</button>
                     </div>
                  ))}
                  <div className="flex gap-2">
                    <select id="vidRatio" className="w-1/5 px-2 py-2 bg-offWhite border border-matteBlack/10 rounded-md text-xs cursor-pointer">
                      <option value="16/9" selected>16:9 (Standard)</option>
                      <option value="9/16">9:16 (Reel/TikTok)</option>
                      <option value="1/1">1:1 (Square)</option>
                    </select>
                    <input type="text" id="vidThumb" placeholder="Thumbnail URL" className="w-1/4 px-3 py-2 bg-offWhite border border-matteBlack/10 rounded-md text-sm" />
                    <input type="text" id="vidLink" placeholder="Google Drive Link" className="flex-1 px-3 py-2 bg-offWhite border border-matteBlack/10 rounded-md text-sm" />
                    <button type="button" onClick={() => {
                      const thumb = (document.getElementById('vidThumb') as HTMLInputElement).value;
                      const link = (document.getElementById('vidLink') as HTMLInputElement).value;
                      const ratio = (document.getElementById('vidRatio') as HTMLSelectElement).value;
                      if(thumb && link) {
                        handleAddItem(setVideos, { thumbnail: thumb, link, aspectRatio: ratio });
                        (document.getElementById('vidThumb') as HTMLInputElement).value = '';
                        (document.getElementById('vidLink') as HTMLInputElement).value = '';
                      }
                    }} className="px-4 py-2 bg-matteBlack/10 text-matteBlack rounded-md text-sm font-bold hover:bg-matteBlack/20 transition">Add Video</button>
                  </div>
                </div>
              </section>

              {/* SECTION 4: Social Proof */}
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-matteBlack border-b border-matteBlack/5 pb-2">4. The Verdict</h2>
                <div className="grid grid-cols-1 gap-4">
                  <textarea rows={2} value={testimonial.quote} onChange={e => setTestimonial({...testimonial, quote: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue resize-none text-sm" placeholder="The quote from the client..." />
                  <input type="text" value={testimonial.author} onChange={e => setTestimonial({...testimonial, author: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm" placeholder="Author Name & Title (e.g., Tony S. - CEO)" />
                </div>
              </section>

              {/* Submit Action */}
              <div className="pt-8 border-t border-matteBlack/10">
                <button type="submit" disabled={isLoading} className="w-full py-5 px-4 bg-matteBlack text-white rounded-md text-base font-bold hover:bg-matteBlack/90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-matteBlack disabled:opacity-70">
                  {isLoading ? "Compiling Database Entry..." : "Publish Premium Case Study"}
                </button>
              </div>

            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}