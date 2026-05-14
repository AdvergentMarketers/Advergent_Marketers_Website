"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { PricingConfig } from "@/lib/pricingEngine";

export default function AdminMediaPortal() {
  const supabase = createClient();
  const [configs, setConfigs] = useState<PricingConfig[]>([]);
  
  // Form State
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  
  // UI State
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // 1. Fetch all services on load
  useEffect(() => {
    async function loadConfigs() {
      const { data } = await supabase.from('pricing_config').select('*');
      if (data) setConfigs(data);
    }
    loadConfigs();
  }, [supabase]);

  const activeConfig = configs.find(c => c.id === selectedConfigId);

  // 2. The Upload Engine
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConfig || !selectedComplexity || !file) {
      setMessage({ text: "Please select a service, tier, and file.", type: 'error' });
      return;
    }

    setIsUploading(true);
    setMessage({ text: "Uploading to secure storage...", type: 'success' });

    try {
      // Step A: Determine file type
      const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
      
      // Step B: Create a safe, unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${activeConfig.category_slug}_${selectedComplexity}_${Date.now()}.${fileExt}`;

      // Step C: Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('service_references')
        .upload(fileName, file);

      if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);

      // Step D: Get the Public URL
      const { data: publicUrlData } = supabase.storage
        .from('service_references')
        .getPublicUrl(fileName);

      const newMediaUrl = publicUrlData.publicUrl;

      // Step E: Update the JSON inside the Postgres Database
      setMessage({ text: "File uploaded. Updating database...", type: 'success' });
      
      const updatedComplexities = {
        ...activeConfig.complexities,
        [selectedComplexity]: {
          ...activeConfig.complexities[selectedComplexity],
          media_url: newMediaUrl,
          media_type: mediaType
        }
      };

      const { error: dbError } = await supabase
        .from('pricing_config')
        .update({ complexities: updatedComplexities })
        .eq('id', activeConfig.id);

      if (dbError) throw new Error(`Database Error: ${dbError.message}`);

      // Success! Reset form.
      setMessage({ text: `Success! ${activeConfig.display_name} updated.`, type: 'success' });
      setFile(null);
      
      // Refresh local data to show the new URL
      const { data } = await supabase.from('pricing_config').select('*');
      if (data) setConfigs(data);

    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offWhite p-8 lg:p-24 text-matteBlack font-sans">
      <div className="max-w-3xl mx-auto space-y-12">
        
        <header className="border-b border-matteBlack/10 pb-8">
          <h1 className="text-3xl font-extrabold uppercase tracking-tight">Media Command Center</h1>
          <p className="text-sm text-matteBlack/60 mt-2">Upload reference images and videos directly to your live pricing engine.</p>
        </header>

        <form onSubmit={handleUpload} className="bg-white p-8 lg:p-12 rounded-3xl shadow-xl border border-matteBlack/5 space-y-8">
          
          {/* Status Message */}
          {message && (
            <div className={`p-4 rounded-lg text-xs font-bold uppercase tracking-widest ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}

          {/* 1. Select Category */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-widest text-matteBlack/50">1. Select Service Category</label>
            <select 
              value={selectedConfigId} 
              onChange={(e) => { setSelectedConfigId(e.target.value); setSelectedComplexity(""); }}
              className="w-full p-4 border-2 border-matteBlack/10 rounded-xl outline-none focus:border-accentBlue text-sm font-bold bg-transparent"
            >
              <option value="">-- Choose a Service --</option>
              {configs.map(c => (
                <option key={c.id} value={c.id}>{c.display_name}</option>
              ))}
            </select>
          </div>

          {/* 2. Select Complexity (Only shows if Category is selected) */}
          {activeConfig && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
              <label className="text-xs font-extrabold uppercase tracking-widest text-matteBlack/50">2. Select Complexity Tier</label>
              <select 
                value={selectedComplexity} 
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="w-full p-4 border-2 border-matteBlack/10 rounded-xl outline-none focus:border-accentBlue text-sm font-bold bg-transparent"
              >
                <option value="">-- Choose a Tier --</option>
                {Object.entries(activeConfig.complexities).map(([key, data]: any) => (
                  <option key={key} value={key}>
                    {data.title || key} {data.media_url ? '(Has Media)' : '(Empty)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 3. File Upload */}
          {selectedComplexity && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
              <label className="text-xs font-extrabold uppercase tracking-widest text-matteBlack/50">3. Upload File (.webp, .png, .mp4)</label>
              <div className="border-2 border-dashed border-matteBlack/20 rounded-xl p-8 text-center hover:border-accentBlue transition-colors relative bg-offWhite/50">
                <input 
                  type="file" 
                  accept="image/*,video/mp4" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {file ? (
                  <div className="space-y-2">
                    <p className="text-sm font-extrabold text-accentBlue">{file.name}</p>
                    <p className="text-[10px] uppercase font-bold text-matteBlack/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg className="w-8 h-8 mx-auto text-matteBlack/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <p className="text-xs font-bold text-matteBlack/60">Drag and drop or click to browse</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Current Media Preview */}
          {selectedComplexity && activeConfig?.complexities[selectedComplexity]?.media_url && !file && (
            <div className="p-4 bg-accentBlue/5 border border-accentBlue/20 rounded-xl flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accentBlue">Current File Active</span>
              <a href={activeConfig.complexities[selectedComplexity].media_url} target="_blank" rel="noreferrer" className="text-xs font-bold underline hover:text-accentBlue">View Current</a>
            </div>
          )}

          <button 
            type="submit" 
            disabled={!file || isUploading}
            className="w-full py-4 bg-matteBlack text-white text-xs font-extrabold uppercase tracking-widest rounded shadow-xl hover:bg-accentBlue transition-colors disabled:opacity-30 flex justify-center items-center gap-3"
          >
            {isUploading ? (
              <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Processing Ecosystem...</>
            ) : (
              'Upload & Deploy to Engine'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}