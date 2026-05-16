"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function ServiceArchitectPortal() {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Identity State
  const [displayName, setDisplayName] = useState("");
  const [baseUnit, setBaseUnit] = useState("Project");
  const [basePrice, setBasePrice] = useState(1000);
  
  // Dynamic UI Features
  const [hasVideoSlider, setHasVideoSlider] = useState(false);
  const [hasVariantSlider, setHasVariantSlider] = useState(false);
  const [hasSeoAddon, setHasSeoAddon] = useState(false);
  
  // Dynamic Tiers Array
  const [tiers, setTiers] = useState([
    { title: "Basic Tier", desc: "Standard service delivery.", type: "multiplier", value: 1.0 }
  ]);

  const addTier = () => setTiers([...tiers, { title: "", desc: "", type: "multiplier", value: 1.0 }]);
  const removeTier = (index: number) => setTiers(tiers.filter((_, i) => i !== index));
  const updateTier = (index: number, field: string, value: any) => {
    const newTiers = [...tiers] as any;
    newTiers[index][field] = value;
    setTiers(newTiers);
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const category_slug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
      if (!category_slug) throw new Error("Please enter a valid service name.");
      if (tiers.length === 0) throw new Error("You must add at least one pricing tier.");

      // Build JSON for all tiers
      const complexities: any = {};
      tiers.forEach((t) => {
        const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'default';
        complexities[slug] = {
          title: t.title,
          description: t.desc,
          ...(t.type === 'multiplier' ? { multiplier: t.value } : { fixed_base_price: t.value }),
          media_url: "",
          media_type: "image"
        };
      });

      const { error } = await supabase
        .from('pricing_config')
        .insert([{
          category_slug,
          display_name: displayName,
          base_price: basePrice,
          base_unit: baseUnit,
          complexities,
          custom_rules: {
            has_video_slider: hasVideoSlider,
            has_variant_slider: hasVariantSlider,
            has_seo_addon: hasSeoAddon
          }
        }]);

      if (error) {
        if (error.code === '23505') throw new Error("A service with this name already exists!");
        throw new Error(`Database Error: ${error.message}`);
      }

      setMessage({ text: `Success! ${displayName} deployed with ${tiers.length} tiers.`, type: 'success' });
      
      // Reset
      setDisplayName(""); setTiers([{ title: "Basic Tier", desc: "", type: "multiplier", value: 1.0 }]);
      setHasVideoSlider(false); setHasVariantSlider(false); setHasSeoAddon(false);

    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-offWhite p-8 lg:p-24 text-matteBlack font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b border-matteBlack/10 pb-8">
          <h1 className="text-3xl font-extrabold uppercase tracking-tight">Service Architect</h1>
          <p className="text-sm text-matteBlack/60 mt-2">Deploy dynamic services with unlimited tiers and custom UI modules.</p>
        </header>

        <form onSubmit={handleCreateService} className="bg-white p-8 lg:p-12 rounded-3xl shadow-xl border border-matteBlack/5 space-y-12">
          
          {message && (
            <div className={`p-4 rounded-lg text-xs font-bold uppercase tracking-widest ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}

          {/* Core Settings */}
          <div className="space-y-6">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-accentBlue border-b border-matteBlack/10 pb-2">1. Core Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/50">Display Name</label>
                <input required type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g., Short Form Reels" className="w-full p-4 border-2 border-matteBlack/10 rounded-xl outline-none focus:border-accentBlue text-sm font-bold bg-transparent" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/50">Base Unit</label>
                <input required type="text" value={baseUnit} onChange={(e) => setBaseUnit(e.target.value)} placeholder="e.g., Minute" className="w-full p-4 border-2 border-matteBlack/10 rounded-xl outline-none focus:border-accentBlue text-sm font-bold bg-transparent" />
              </div>
            </div>
            
            <div className="flex gap-6 mt-4 p-4 bg-matteBlack/5 rounded-xl border border-matteBlack/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasVideoSlider} onChange={(e) => setHasVideoSlider(e.target.checked)} className="accent-accentBlue w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Add Video Slider</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasVariantSlider} onChange={(e) => setHasVariantSlider(e.target.checked)} className="accent-accentBlue w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Add Variants Slider</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasSeoAddon} onChange={(e) => setHasSeoAddon(e.target.checked)} className="accent-accentBlue w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Add SEO Checkbox</span>
              </label>
            </div>
          </div>

          {/* Dynamic Tiers Manager */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-matteBlack/10 pb-2">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-accentBlue">2. Complexity Tiers</h2>
              <button type="button" onClick={addTier} className="text-[10px] font-extrabold uppercase bg-accentBlue/10 text-accentBlue px-3 py-1 rounded hover:bg-accentBlue hover:text-white transition-colors">+ Add Tier</button>
            </div>

            <div className="space-y-4">
              {tiers.map((tier, index) => (
                <div key={index} className="p-6 bg-offWhite rounded-xl border border-matteBlack/10 relative">
                  {tiers.length > 1 && (
                    <button type="button" onClick={() => removeTier(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xs font-bold uppercase">Remove</button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/50">Tier Name</label>
                      <input required type="text" value={tier.title} onChange={(e) => updateTier(index, 'title', e.target.value)} className="w-full p-3 border-2 border-matteBlack/10 rounded-lg outline-none text-sm font-bold bg-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/50">Description</label>
                      <input required type="text" value={tier.desc} onChange={(e) => updateTier(index, 'desc', e.target.value)} className="w-full p-3 border-2 border-matteBlack/10 rounded-lg outline-none text-sm font-bold bg-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/50">Pricing Type</label>
                      <select value={tier.type} onChange={(e) => updateTier(index, 'type', e.target.value)} className="w-full p-3 border-2 border-matteBlack/10 rounded-lg outline-none text-sm font-bold bg-white">
                        <option value="multiplier">Multiplier (1.0x)</option>
                        <option value="fixed">Fixed Flat Price (INR)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/50">Value</label>
                      <input required type="number" step="0.1" value={tier.value} onChange={(e) => updateTier(index, 'value', parseFloat(e.target.value))} className="w-full p-3 border-2 border-matteBlack/10 rounded-lg outline-none text-sm font-bold bg-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting || !displayName} className="w-full py-5 bg-matteBlack text-white text-xs font-extrabold uppercase tracking-widest rounded shadow-xl hover:bg-accentBlue transition-all duration-300 disabled:opacity-30">
            {isSubmitting ? 'Deploying to Engine...' : 'Deploy Entire Ecosystem'}
          </button>
        </form>
      </div>
    </div>
  );
}