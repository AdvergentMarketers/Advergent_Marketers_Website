"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function EditServicePortal() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const serviceId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Core State
  const [displayName, setDisplayName] = useState("");
  const [baseUnit, setBaseUnit] = useState("Project");
  const [basePrice, setBasePrice] = useState(1000);
  
  // UI Flags
  const [hasVideoSlider, setHasVideoSlider] = useState(false);
  const [hasVariantSlider, setHasVariantSlider] = useState(false);
  const [hasSeoAddon, setHasSeoAddon] = useState(false);
  
  // Tiers State
  const [tiers, setTiers] = useState<any[]>([]);

  // 1. Fetch Existing Data
  useEffect(() => {
    async function fetchService() {
      if (!serviceId) return;
      const { data, error } = await supabase.from('pricing_config').select('*').eq('id', serviceId).single();
      
      if (error) {
        setMessage({ text: "Service not found.", type: 'error' });
        setIsLoading(false);
        return;
      }

      setDisplayName(data.display_name);
      setBaseUnit(data.base_unit);
      setBasePrice(data.base_price);

      if (data.custom_rules) {
        setHasVideoSlider(data.custom_rules.has_video_slider || false);
        setHasVariantSlider(data.custom_rules.has_variant_slider || false);
        setHasSeoAddon(data.custom_rules.has_seo_addon || false);
      }

      // Unpack JSON into editable array, preserving media URLs!
      if (data.complexities) {
        const loadedTiers = Object.entries(data.complexities).map(([key, val]: any) => ({
          originalSlug: key, // Keep track so we don't accidentally rename keys unless intended
          title: val.title || key,
          desc: val.description || '',
          type: val.fixed_base_price !== undefined ? 'fixed' : 'multiplier',
          value: val.fixed_base_price !== undefined ? val.fixed_base_price : (val.multiplier || 1.0),
          media_url: val.media_url || "",
          media_type: val.media_type || "image"
        }));
        setTiers(loadedTiers);
      }
      
      setIsLoading(false);
    }
    fetchService();
  }, [supabase, serviceId]);

  const addTier = () => setTiers([...tiers, { title: "", desc: "", type: "multiplier", value: 1.0, media_url: "", media_type: "image" }]);
  const removeTier = (index: number) => setTiers(tiers.filter((_, i) => i !== index));
  const updateTier = (index: number, field: string, value: any) => {
    const newTiers = [...tiers];
    newTiers[index][field] = value;
    setTiers(newTiers);
  };

  // 2. Save Updates
  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (tiers.length === 0) throw new Error("You must have at least one pricing tier.");

      // Repackage the JSON
      const complexities: any = {};
      tiers.forEach((t) => {
        const slug = t.originalSlug || t.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'default';
        complexities[slug] = {
          title: t.title,
          description: t.desc,
          ...(t.type === 'multiplier' ? { multiplier: t.value } : { fixed_base_price: t.value }),
          media_url: t.media_url,   // Safely preserve existing media
          media_type: t.media_type
        };
      });

      const { error } = await supabase
        .from('pricing_config')
        .update({
          display_name: displayName,
          base_price: basePrice,
          base_unit: baseUnit,
          complexities,
          custom_rules: {
            has_video_slider: hasVideoSlider,
            has_variant_slider: hasVariantSlider,
            has_seo_addon: hasSeoAddon
          }
        })
        .eq('id', serviceId);

      if (error) throw new Error(`Database Error: ${error.message}`);

      setMessage({ text: `Success! ${displayName} has been updated.`, type: 'success' });
      
      // Redirect back to dashboard after 1.5 seconds
      setTimeout(() => router.push('/admin'), 1500);

    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-offWhite flex items-center justify-center font-extrabold uppercase tracking-widest text-matteBlack/50">Loading Editor...</div>;

  return (
    <div className="min-h-screen bg-offWhite p-8 lg:p-24 text-matteBlack font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex items-center justify-between border-b border-matteBlack/10 pb-8">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight">Edit Service</h1>
            <p className="text-sm text-matteBlack/60 mt-2">Update pricing, fix typos, or add new tiers to {displayName}.</p>
          </div>
          <button onClick={() => router.push('/admin')} className="text-xs font-bold uppercase tracking-widest text-matteBlack/50 hover:text-matteBlack">
            &larr; Cancel
          </button>
        </header>

        <form onSubmit={handleUpdateService} className="bg-white p-8 lg:p-12 rounded-3xl shadow-xl border border-matteBlack/5 space-y-12">
          
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
                <input required type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full p-4 border-2 border-matteBlack/10 rounded-xl outline-none focus:border-accentBlue text-sm font-bold bg-transparent" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/50">Base Unit</label>
                <input required type="text" value={baseUnit} onChange={(e) => setBaseUnit(e.target.value)} className="w-full p-4 border-2 border-matteBlack/10 rounded-xl outline-none focus:border-accentBlue text-sm font-bold bg-transparent" />
              </div>
            </div>
            
            <div className="flex gap-6 mt-4 p-4 bg-matteBlack/5 rounded-xl border border-matteBlack/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasVideoSlider} onChange={(e) => setHasVideoSlider(e.target.checked)} className="accent-accentBlue w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Video Slider</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasVariantSlider} onChange={(e) => setHasVariantSlider(e.target.checked)} className="accent-accentBlue w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Variants Slider</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasSeoAddon} onChange={(e) => setHasSeoAddon(e.target.checked)} className="accent-accentBlue w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">SEO Checkbox</span>
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
            {isSubmitting ? 'Saving Updates...' : 'Update Service Ecosystem'}
          </button>
        </form>
      </div>
    </div>
  );
}