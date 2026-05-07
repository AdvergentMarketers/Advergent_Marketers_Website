"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FadeIn } from "../../../../components/ui/MotionWrapper"; 
import { createClient } from "../../../../lib/supabase"; 

export default function EditCaseStudy() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // --- Core State ---
  const [clientName, setClientName] = useState("");
  const [heroMetric, setHeroMetric] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");

  // --- Dynamic Array States ---
  const [timeline, setTimeline] = useState<{ label: string; metric: string }[]>([]);
  const [creativeAssets, setCreativeAssets] = useState<{ url: string; aspectRatio: string }[]>([]);
  const [videos, setVideos] = useState<{ thumbnail: string; link: string; aspectRatio: string }[]>([]);
  
  // --- Testimonial State ---
  const [testimonial, setTestimonial] = useState({ quote: "", author: "" });
  
  // --- Status State ---
  const [isActive, setIsActive] = useState(true);

  // --- Fetch Existing Data on Load ---
  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const { data, error } = await supabase.from('case_studies').select('*').eq('id', id).single();
        if (error) throw error;
        
        // Populate the form with existing data
        setClientName(data.client_name || "");
        setHeroMetric(data.hero_metric || "");
        setProblem(data.problem_statement || "");
        setSolution(data.solution_statement || "");
        
        // Ensure arrays don't break if they are null in the database
        setTimeline(data.timeline_data || []);
        
        // Handle migration just in case old data was just strings instead of objects
        const formattedCreative = (data.creative_assets || []).map((asset: any) => 
          typeof asset === 'string' ? { url: asset, aspectRatio: '1/1' } : asset
        );
        setCreativeAssets(formattedCreative);
        
        setVideos(data.video_assets || []);
        setTestimonial(data.testimonial || { quote: "", author: "" });
        setIsActive(data.is_active ?? true);
        
      } catch (error: any) {
        setMessage({ type: 'error', text: "Failed to load case study. " + error.message });
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCaseStudy();
  }, [id, supabase]);

  // --- Array Handlers ---
  const handleAddItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, item: any) => {
    setter(prev => [...prev, item]);
  };

  const handleRemoveItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  // --- Form Submission (UPDATE instead of INSERT) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const updatedData = {
      client_name: clientName,
      hero_metric: heroMetric,
      problem_statement: problem,
      solution_statement: solution,
      timeline_data: timeline,
      creative_assets: creativeAssets,
      video_assets: videos,
      testimonial: testimonial,
      is_active: isActive
    };

    try {
      const { error } = await supabase.from('case_studies').update(updatedData).eq('id', id);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Case study successfully updated!' });
      
      // Send back to dashboard after a short delay so they see the success message
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-offWhite flex items-center justify-center">
        <p className="text-matteBlack font-bold animate-pulse">Loading Agency Editor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offWhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-matteBlack/10">
            
            <div className="flex justify-between items-end mb-8 border-b border-matteBlack/10 pb-6">
              <div>
                <span className="text-accentBlue font-bold uppercase tracking-widest text-xs mb-2 block">Editing Mode</span>
                <h1 className="text-3xl font-extrabold text-matteBlack tracking-tight">Updating: {clientName}</h1>
              </div>
              <button type="button" onClick={() => router.push('/admin')} className="text-sm font-bold text-matteBlack/50 hover:text-matteBlack transition">
                Cancel
              </button>
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
                    <input type="text" required value={clientName} onChange={e => setClientName(e.target.value)} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-matteBlack mb-1">Hero Metric *</label>
                    <input type="text" required value={heroMetric} onChange={e => setHeroMetric(e.target.value)} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-matteBlack mb-1">The Problem (Before)</label>
                    <textarea rows={3} value={problem} onChange={e => setProblem(e.target.value)} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue resize-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-matteBlack mb-1">The Pivot (Solution)</label>
                    <textarea rows={3} value={solution} onChange={e => setSolution(e.target.value)} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue resize-none" />
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
                      <option value="1/1">1:1 (Square)</option>
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
                      <option value="16/9">16:9 (Standard)</option>
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
              <div className="pt-8 border-t border-matteBlack/10 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-5 h-5 text-accentBlue rounded border-matteBlack/20 focus:ring-accentBlue" />
                  <span className="text-sm font-bold text-matteBlack">Publish to Live Site</span>
                </label>
                
                <button type="submit" disabled={isSaving} className="py-4 px-10 bg-accentBlue text-matteBlack rounded-md text-sm font-bold hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentBlue disabled:opacity-70">
                  {isSaving ? "Saving Changes..." : "Save Updates"}
                </button>
              </div>

            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}