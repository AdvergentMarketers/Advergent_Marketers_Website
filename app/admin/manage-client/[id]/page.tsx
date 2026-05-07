"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FadeIn } from "../../../../components/ui/MotionWrapper"; 
import { createClient } from "../../../../lib/supabase"; 

export default function ManageClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Master State for the Client (Now includes Presentation Arrays!)
  const [formData, setFormData] = useState({
    client_name: "",
    company_name: "",
    account_balance: 0,
    next_invoice_date: "",
    active_projects: [] as any[],
    deliverables: [] as any[],
    timeline_data: [] as any[],
    creative_assets: [] as any[],
    video_assets: [] as any[]
  });

  // Fetch Client Data on Load
  useEffect(() => {
    const fetchClient = async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (data) {
        setFormData({
          client_name: data.client_name || "",
          company_name: data.company_name || "",
          account_balance: data.account_balance || 0,
          next_invoice_date: data.next_invoice_date || "",
          active_projects: data.active_projects || [],
          deliverables: data.deliverables || [],
          timeline_data: data.timeline_data || [],
          creative_assets: (data.creative_assets || []).map((asset: any) => 
            typeof asset === 'string' ? { url: asset, aspectRatio: '1/1' } : asset
          ),
          video_assets: data.video_assets || []
        });
      }
      setIsLoading(false);
    };
    if (clientId) fetchClient();
  }, [clientId, supabase]);

  // --- ARRAY HANDLERS ---
  
  // Projects
  const addProject = () => setFormData(prev => ({ ...prev, active_projects: [...prev.active_projects, { name: "", status: "Active", progress: "0%" }] }));
  const updateProject = (index: number, field: string, value: string) => {
    const newArr = [...formData.active_projects];
    newArr[index][field] = value;
    setFormData(prev => ({ ...prev, active_projects: newArr }));
  };
  const removeProject = (index: number) => setFormData(prev => ({ ...prev, active_projects: prev.active_projects.filter((_, i) => i !== index) }));

  // Deliverables (Drive Links)
  const addDeliverable = () => setFormData(prev => ({ ...prev, deliverables: [...prev.deliverables, { name: "", date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), link: "" }] }));
  const updateDeliverable = (index: number, field: string, value: string) => {
    const newArr = [...formData.deliverables];
    newArr[index][field] = value;
    setFormData(prev => ({ ...prev, deliverables: newArr }));
  };
  const removeDeliverable = (index: number) => setFormData(prev => ({ ...prev, deliverables: prev.deliverables.filter((_, i) => i !== index) }));

  // Timeline (Growth Graph)
  const addTimeline = () => setFormData(prev => ({ ...prev, timeline_data: [...prev.timeline_data, { label: "", metric: "" }] }));
  const updateTimeline = (index: number, field: string, value: string) => {
    const newArr = [...formData.timeline_data];
    newArr[index][field] = value;
    setFormData(prev => ({ ...prev, timeline_data: newArr }));
  };
  const removeTimeline = (index: number) => setFormData(prev => ({ ...prev, timeline_data: prev.timeline_data.filter((_, i) => i !== index) }));

  // Creative Assets
  const addCreative = () => setFormData(prev => ({ ...prev, creative_assets: [...prev.creative_assets, { url: "", aspectRatio: "1/1" }] }));
  const updateCreative = (index: number, field: string, value: string) => {
    const newArr = [...formData.creative_assets];
    newArr[index][field] = value;
    setFormData(prev => ({ ...prev, creative_assets: newArr }));
  };
  const removeCreative = (index: number) => setFormData(prev => ({ ...prev, creative_assets: prev.creative_assets.filter((_, i) => i !== index) }));

  // Video Assets
  const addVideo = () => setFormData(prev => ({ ...prev, video_assets: [...prev.video_assets, { link: "", thumbnail: "", aspectRatio: "16/9" }] }));
  const updateVideo = (index: number, field: string, value: string) => {
    const newArr = [...formData.video_assets];
    newArr[index][field] = value;
    setFormData(prev => ({ ...prev, video_assets: newArr }));
  };
  const removeVideo = (index: number) => setFormData(prev => ({ ...prev, video_assets: prev.video_assets.filter((_, i) => i !== index) }));

  // --- DATABASE ACTIONS ---

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.from('clients').update(formData).eq('id', clientId);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Client Ecosystem updated successfully!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("WARNING: Are you absolutely sure? This will permanently delete their CRM record and dashboard access.")) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('clients').delete().eq('id', clientId);
      if (error) throw error;
      router.push('/admin');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen py-20 text-center font-bold animate-pulse text-matteBlack/50">Loading CRM Data...</div>;

  return (
    <div className="min-h-screen bg-offWhite py-12 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          
          <div className="flex justify-between items-center mb-8">
            <Link href="/admin" className="text-xs font-bold text-matteBlack/50 hover:text-accentBlue uppercase tracking-widest transition-colors">
              &larr; Back to Command Center
            </Link>
            <button onClick={handleDelete} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors">
              Delete Client
            </button>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-matteBlack/10">
            <div className="mb-10 pb-6 border-b border-matteBlack/10">
              <span className="text-accentBlue font-bold uppercase tracking-widest text-xs mb-2 block">Master CRM Editor</span>
              <h1 className="text-3xl font-extrabold text-matteBlack tracking-tight">Manage {formData.company_name}</h1>
            </div>

            {message && (
              <div className={`mb-8 p-4 text-sm font-bold rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-16">
              
              {/* === SECTION 1: ACCOUNT & BILLING === */}
              <section>
                <h3 className="text-xl font-extrabold text-matteBlack mb-6 flex items-center gap-3">
                  <span className="w-4 h-[2px] bg-accentBlue"></span> Account Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-offWhite p-6 rounded-xl border border-matteBlack/5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Account Balance (INR)</label>
                    <input type="number" required value={formData.account_balance} onChange={e => setFormData({...formData, account_balance: parseFloat(e.target.value) || 0})} className="w-full px-4 py-3 bg-white border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Next Invoice Date</label>
                    <input type="date" value={formData.next_invoice_date} onChange={e => setFormData({...formData, next_invoice_date: e.target.value})} className="w-full px-4 py-3 bg-white border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                  </div>
                </div>
              </section>

              {/* === SECTION 2: ACTIVE CAMPAIGNS & DELIVERABLES === */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-matteBlack">Active Campaigns</h3>
                    <button type="button" onClick={addProject} className="text-xs font-bold text-accentBlue uppercase tracking-widest">+ Add Campaign</button>
                  </div>
                  <div className="space-y-4">
                    {formData.active_projects.map((project, index) => (
                      <div key={index} className="flex flex-col gap-3 p-4 bg-offWhite rounded-xl border border-matteBlack/5 relative group">
                        <input type="text" placeholder="Campaign Name" value={project.name} onChange={e => updateProject(index, 'name', e.target.value)} className="w-full px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md bg-white" />
                        <div className="flex gap-3">
                          <select value={project.status} onChange={e => updateProject(index, 'status', e.target.value)} className="flex-1 px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md bg-white cursor-pointer">
                            <option value="Active">Active</option>
                            <option value="In Review">In Review</option>
                            <option value="Paused">Paused</option>
                          </select>
                          <input type="text" placeholder="Progress (50%)" value={project.progress} onChange={e => updateProject(index, 'progress', e.target.value)} className="w-24 px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md bg-white" />
                        </div>
                        <button type="button" onClick={() => removeProject(index)} className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-matteBlack">Drive Links</h3>
                    <button type="button" onClick={addDeliverable} className="text-xs font-bold text-accentBlue uppercase tracking-widest">+ Add Link</button>
                  </div>
                  <div className="space-y-4">
                    {formData.deliverables.map((item, index) => (
                      <div key={index} className="flex flex-col gap-3 p-4 bg-offWhite rounded-xl border border-matteBlack/5 relative group">
                        <div className="flex gap-3">
                          <input type="text" placeholder="Asset Name" value={item.name} onChange={e => updateDeliverable(index, 'name', e.target.value)} className="flex-1 px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md bg-white" />
                          <input type="text" placeholder="Date" value={item.date} onChange={e => updateDeliverable(index, 'date', e.target.value)} className="w-24 px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md bg-white" />
                        </div>
                        <input type="url" placeholder="URL" value={item.link} onChange={e => updateDeliverable(index, 'link', e.target.value)} className="w-full px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md bg-white" />
                        <button type="button" onClick={() => removeDeliverable(index)} className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* === SECTION 3: LIVE PRESENTATION ARRAYS (New!) === */}
              <div className="border-t border-matteBlack/10 pt-16 space-y-16">
                <h3 className="text-xl font-extrabold text-matteBlack flex items-center gap-3">
                  <span className="w-4 h-[2px] bg-matteBlack"></span> Live Dashboard Presentation
                </h3>

                {/* TIMELINE (GROWTH GRAPH) */}
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-matteBlack">Performance Trajectory</h3>
                    <button type="button" onClick={addTimeline} className="text-xs font-bold text-accentBlue uppercase tracking-widest">+ Add Step</button>
                  </div>
                  <div className="space-y-4">
                    {formData.timeline_data.map((step, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-offWhite rounded-xl border border-matteBlack/5 relative group">
                        <input type="text" placeholder="Label (e.g. Month 1)" value={step.label} onChange={e => updateTimeline(index, 'label', e.target.value)} className="flex-1 px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md" />
                        <input type="text" placeholder="Metric (e.g. $10k Rev)" value={step.metric} onChange={e => updateTimeline(index, 'metric', e.target.value)} className="flex-1 px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md" />
                        <button type="button" onClick={() => removeTimeline(index)} className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* CREATIVE ASSETS */}
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-matteBlack">Creative Assets (Images)</h3>
                    <button type="button" onClick={addCreative} className="text-xs font-bold text-accentBlue uppercase tracking-widest">+ Add Image</button>
                  </div>
                  <div className="space-y-4">
                    {formData.creative_assets.map((asset, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-offWhite rounded-xl border border-matteBlack/5 relative group">
                        <input type="text" placeholder="Image URL" value={asset.url} onChange={e => updateCreative(index, 'url', e.target.value)} className="flex-1 px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md" />
                        <select value={asset.aspectRatio} onChange={e => updateCreative(index, 'aspectRatio', e.target.value)} className="px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md cursor-pointer">
                          <option value="1/1">Square (1:1)</option>
                          <option value="16/9">Landscape (16:9)</option>
                          <option value="4/5">Portrait (4:5)</option>
                        </select>
                        <button type="button" onClick={() => removeCreative(index)} className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* VIDEO ASSETS */}
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-matteBlack">Motion & Media (Videos)</h3>
                    <button type="button" onClick={addVideo} className="text-xs font-bold text-accentBlue uppercase tracking-widest">+ Add Video</button>
                  </div>
                  <div className="space-y-4">
                    {formData.video_assets.map((vid, index) => (
                      <div key={index} className="flex flex-col gap-4 p-4 bg-offWhite rounded-xl border border-matteBlack/5 relative group">
                        <div className="flex flex-col md:flex-row gap-4">
                          <input type="text" placeholder="Video Link" value={vid.link} onChange={e => updateVideo(index, 'link', e.target.value)} className="flex-1 px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md" />
                          <input type="text" placeholder="Thumbnail Image URL" value={vid.thumbnail} onChange={e => updateVideo(index, 'thumbnail', e.target.value)} className="flex-1 px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md" />
                          <select value={vid.aspectRatio} onChange={e => updateVideo(index, 'aspectRatio', e.target.value)} className="px-3 py-2 text-sm font-semibold border border-matteBlack/10 rounded-md cursor-pointer">
                            <option value="16/9">Standard (16:9)</option>
                            <option value="9/16">Reel/Short (9:16)</option>
                          </select>
                        </div>
                        <button type="button" onClick={() => removeVideo(index)} className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* SAVE BUTTON */}
              <div className="pt-8 mt-8 border-t border-matteBlack/10">
                <button type="submit" disabled={isSaving} className="w-full py-5 bg-accentBlue text-matteBlack text-sm font-extrabold uppercase tracking-widest rounded-sm hover:opacity-90 transition-all focus:outline-none disabled:opacity-70 shadow-xl">
                  {isSaving ? "Syncing Ecosystem..." : "Save Ecosystem Changes"}
                </button>
              </div>

            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}