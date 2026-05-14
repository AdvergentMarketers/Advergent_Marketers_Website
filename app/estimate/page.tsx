"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useEstimatorStore } from "@/store/useEstimatorStore";
import { pdf, PDFViewer } from '@react-pdf/renderer';
import { ProposalPDF } from '@/components/ProposalPDF';
import { calculateLineItem, applyBundleDiscount, PricingConfig, ServiceSelection } from "@/lib/pricingEngine";

export default function InteractiveEstimator() {
  const supabase = createClient();
  const [pricingData, setPricingData] = useState<PricingConfig[]>([]);
  const { selections, setSelection, removeSelection, toggleAddon } = useEstimatorStore();
  const [showModal, setShowModal] = useState(false);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<PricingConfig | null>(null);
  // NEW: Extracted download function so our Preview Screen button can trigger it
  const handleDownloadPDF = async () => {
    if (!previewData) return;
    const blob = await pdf(
      <ProposalPDF {...previewData} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Advergent_Proposal_${previewData.clientName.replace(/\s+/g, '_') || 'Estimate'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Optional: Close everything after download, or let them stay on the preview screen
    // setShowModal(false); 
    // setPreviewData(null);
  };

  useEffect(() => {
    async function getPricing() {
      const { data } = await supabase.from('pricing_config').select('*');
      if (data) setPricingData(data);
      setIsLoading(false);
    }
    getPricing();
  }, [supabase]);

  const subtotal = pricingData.reduce((acc, config) => {
    const selection = selections[config.category_slug];
    if (!selection) return acc;
    return acc + calculateLineItem(config, selection);
  }, 0);

  const isBundleUnlocked = Object.keys(selections).length >= 3; 
  const finalTotal = applyBundleDiscount(subtotal, isBundleUnlocked);

  const formatTitle = (str: string) => str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-offWhite text-matteBlack">
      <nav className="p-6 lg:px-12 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-40 border-b border-matteBlack/5">
        <Link href="/services" className="text-[10px] font-bold uppercase tracking-widest text-matteBlack/40 hover:text-accentBlue transition-colors">
          &larr; Back to Services
        </Link>
        <span className="text-xs font-extrabold uppercase tracking-widest text-matteBlack">
          Custom Estimate Builder
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        <main className="w-full lg:w-[60%] p-6 lg:p-16 space-y-12">
          <header className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight">Configure Plan.</h1>
            <p className="text-sm font-semibold text-matteBlack/50 max-w-lg">
              Select a service module to configure its complexity and scale.
            </p>
          </header>

          {isLoading ? (
             <div className="animate-pulse h-40 bg-matteBlack/5 rounded-2xl w-full" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              {pricingData.map((config) => {
                const isActive = !!selections[config.category_slug];
                return (
                  <div key={config.id} className={`p-6 rounded-2xl border-2 transition-all relative ${isActive ? 'border-accentBlue bg-white shadow-xl' : 'border-matteBlack/10 bg-transparent hover:border-matteBlack/30'}`}>
                    
                    <div className="absolute top-6 right-6">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={isActive}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setActiveModal(config);
                            } else {
                              removeSelection(config.category_slug);
                            }
                          }}
                        />
                        <div className="w-11 h-6 bg-matteBlack/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accentBlue"></div>
                      </label>
                    </div>

                    <h3 className="text-xl font-extrabold uppercase tracking-widest pr-12">{config.display_name}</h3>
                    <p className="text-[10px] font-bold text-matteBlack/40 mt-2">
                      {isActive ? 'CONFIGURED' : 'NOT SELECTED'}
                    </p>

                    <button 
                      onClick={() => setActiveModal(config)}
                      className="mt-8 w-full py-3 bg-matteBlack/5 hover:bg-matteBlack hover:text-white text-xs font-extrabold uppercase tracking-widest rounded transition-colors"
                    >
                      {isActive ? 'Edit Configuration' : 'Configure Service'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <aside className="w-full lg:w-[40%] bg-white border-l border-matteBlack/5 p-8 lg:p-16">
          <div className="sticky top-32 space-y-8">
            <div className="flex items-center gap-3 border-b border-matteBlack/10 pb-4">
              <span className="w-2 h-2 rounded-full bg-accentBlue animate-pulse" />
              <h3 className="text-sm font-extrabold uppercase tracking-widest">Live Receipt</h3>
            </div>

            <div className="space-y-6">
              {Object.keys(selections).length === 0 ? (
                <p className="text-xs font-bold uppercase text-matteBlack/20 py-12 text-center border-2 border-dashed border-matteBlack/5 rounded-2xl">
                  Your plan is empty.
                </p>
              ) : (
                pricingData.map((config) => {
                  const selection = selections[config.category_slug];
                  if (!selection) return null;
                  const itemCost = calculateLineItem(config, selection);
                  
                  const complexityData = config.complexities[selection.complexity] as any;
                  const niceName = complexityData?.title || formatTitle(selection.complexity);

                  // Formatting Receipt Layout
                  const isVideo = config.category_slug === 'video_editing';
                  const isAmazon = config.category_slug === 'amazon_listing';
                  const isEcom = config.category_slug === 'website_development' && complexityData?.type === 'ecommerce';
                  const isServiceWeb = config.category_slug === 'website_development' && complexityData?.type === 'service';
                  
                  let receiptLabel = `${selection.quantity} ${config.base_unit}(s)`;
                  
                  if (isVideo) {
                    receiptLabel = `${selection.addons?.videoCount || 1} Video(s) x ${selection.quantity} Min`;
                  } else if (isAmazon || isEcom) {
                    const vars = selection.addons?.variants || 1;
                    receiptLabel = `${selection.quantity} Product(s) x ${vars} Variant(s)`;
                  } else if (isServiceWeb) {
                    receiptLabel = `${selection.quantity} Page(s)`;
                  }

                  return (
                    <div key={config.id} className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-accentBlue">
                          {config.display_name}
                        </p>
                        <p className="text-xs font-bold text-matteBlack">
                          {receiptLabel} • {niceName}
                        </p>
                      </div>
                      <p className="text-sm font-extrabold">₹{itemCost.toLocaleString()}</p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t-2 border-matteBlack pt-8 space-y-4">
              {isBundleUnlocked && (
                <div className="flex justify-between items-center text-accentBlue">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">Bundle Discount (5%)</span>
                  <span className="text-sm font-extrabold">-₹{(subtotal * 0.05).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xl font-extrabold uppercase tracking-tighter">Total Estimate</span>
                <span className="text-2xl font-extrabold tracking-tight">₹{finalTotal.toLocaleString()}</span>
              </div>
              
              {/* PDF GENERATION BUTTON */}
              <button 
                onClick={() => setShowModal(true)}
                disabled={Object.keys(selections).length === 0}
                className="w-full mt-6 py-5 bg-matteBlack text-white text-xs font-extrabold uppercase tracking-widest rounded-sm hover:bg-accentBlue transition-all duration-500 shadow-2xl disabled:opacity-20"
              >
                Get The Quotation
              </button>
            </div>
          </div>
        </aside>
      </div>

      {activeModal && (
        <ConfigurationModal 
          config={activeModal} 
          selection={selections[activeModal.category_slug]}
          onClose={() => setActiveModal(null)}
          onUpdate={(payload: ServiceSelection) => setSelection(activeModal.category_slug, payload)}
          onToggleAddon={(key: string) => toggleAddon(activeModal.category_slug, key)}
        />
      )}

      {/* LEAD CAPTURE & PDF PREVIEW ENGINE */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-matteBlack/80 backdrop-blur-sm">
          
          {/* STATE 1: THE FORM */}
          {!previewData && (
            <div className="bg-white p-12 rounded-3xl max-w-xl w-full text-center space-y-8 shadow-2xl relative m-6 animate-in fade-in zoom-in-95">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-matteBlack/30 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-3xl font-extrabold uppercase tracking-tight">Generate Proposal</h2>
              <p className="text-sm font-semibold text-matteBlack/50">Enter your details to generate your branded, high-resolution estimate PDF.</p>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const clientName = formData.get('clientName') as string;
                  const clientEmail = formData.get('clientEmail') as string;

                  const lineItems = pricingData
                    .filter(config => selections[config.category_slug])
                    .map(config => {
                      const selection = selections[config.category_slug];
                      const itemCost = calculateLineItem(config, selection);
                      const complexityData = config.complexities[selection.complexity] as any;
                      
                      let receiptLabel = `${selection.quantity} ${config.base_unit}(s)`;
                      if (config.category_slug === 'video_editing') receiptLabel = `${selection.addons?.videoCount || 1} Video(s) x ${selection.quantity} Min`;
                      else if (['amazon_listing', 'website_development'].includes(config.category_slug) && complexityData?.type !== 'service') receiptLabel = `${selection.quantity} Product(s) x ${selection.addons?.variants || 1} Variant(s)`;
                      else if (config.category_slug === 'website_development' && complexityData?.type === 'service') receiptLabel = `${selection.quantity} Page(s)`;

                      return {
                        title: config.display_name,
                        complexityNiceName: complexityData?.title || formatTitle(selection.complexity),
                        receiptLabel,
                        cost: itemCost,
                        addons: selection.addons
                      };
                    });

                  // Push data to state to trigger the Preview Screen
                  setPreviewData({
                    clientName,
                    clientEmail,
                    lineItems,
                    subtotal,
                    finalTotal,
                    isBundleUnlocked,
                    // NEW: Dynamically grab the absolute URL of the PNG
                    logoUrl: `${window.location.origin}/logo.png` 
                  });
                }}
                className="space-y-4"
              >
                <input name="clientName" required type="text" placeholder="Full Name or Business Name" className="w-full p-4 border border-matteBlack/10 rounded-lg text-xs font-bold outline-none focus:border-accentBlue" />
                <input name="clientEmail" required type="email" placeholder="Business Email" className="w-full p-4 border border-matteBlack/10 rounded-lg text-xs font-bold outline-none focus:border-accentBlue" />
                <button type="submit" className="w-full py-4 bg-accentBlue text-white text-xs font-extrabold uppercase tracking-widest rounded shadow-xl hover:bg-blue-700 transition-colors">
                  Preview PDF
                </button>
              </form>
            </div>
          )}

          {/* STATE 2: FULL SCREEN PDF PREVIEWER */}
          {previewData && (
            <div className="w-full h-full bg-offWhite flex flex-col animate-in fade-in slide-in-from-bottom-10">
              
              {/* Preview Header Toolbar */}
              <div className="h-24 bg-white border-b border-matteBlack/10 px-8 flex justify-between items-center shadow-sm shrink-0">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setPreviewData(null)} 
                    className="text-xs font-extrabold uppercase tracking-widest text-matteBlack/50 hover:text-matteBlack flex items-center gap-2"
                  >
                    <span>&larr;</span> Back to Edit
                  </button>
                  <div className="h-8 w-px bg-matteBlack/10" />
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-matteBlack">Document Preview</h3>
                    <p className="text-[10px] text-matteBlack/40 uppercase tracking-widest mt-1">Prepared for: {previewData.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => { setShowModal(false); setPreviewData(null); }}
                    className="px-6 py-3 border-2 border-matteBlack/10 text-matteBlack text-xs font-extrabold uppercase tracking-widest rounded hover:border-matteBlack transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    className="px-8 py-3 bg-accentBlue text-white text-xs font-extrabold uppercase tracking-widest rounded shadow-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download PDF
                  </button>
                </div>
              </div>

              {/* The Actual PDF Viewer */}
              <div className="flex-1 p-4 md:p-8 bg-matteBlack/5 overflow-hidden">
                <div className="w-full h-full max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-matteBlack/10">
                  <PDFViewer width="100%" height="100%" className="border-0">
                    <ProposalPDF {...previewData} />
                  </PDFViewer>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}

function ConfigurationModal({ config, selection, onClose, onUpdate, onToggleAddon }: { 
  config: PricingConfig, 
  selection: any, 
  onClose: () => void, 
  onUpdate: (p: ServiceSelection) => void, 
  onToggleAddon: (k: string) => void 
}) {
  const currentQty = selection?.quantity || 1; 
  const currentVideoCount = selection?.addons?.videoCount || 1; 
  const currentVariants = selection?.addons?.variants || 1; 
  const currentComplexity = selection?.complexity || Object.keys(config.complexities)[0];
  const activeComplexityData = config.complexities[currentComplexity] as any;

  const [webTab, setWebTab] = useState<'service' | 'ecommerce'>('service');

  const availableComplexities = Object.entries(config.complexities).filter(([key, data]: any) => {
    if (config.category_slug !== 'website_development') return true;
    return data.type === webTab;
  });

  const formatTitle = (str: string) => str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Dynamic UI Labels
  const isVideo = config.category_slug === 'video_editing';
  const isAmazon = config.category_slug === 'amazon_listing';
  const isEcom = config.category_slug === 'website_development' && webTab === 'ecommerce';
  const isServiceWeb = config.category_slug === 'website_development' && webTab === 'service';

  let primaryLabel = `Total ${config.base_unit}(s)`;
  if (isVideo) primaryLabel = 'Minutes Per Video';
  if (isServiceWeb) primaryLabel = 'Total Pages';
  if (isAmazon || isEcom) primaryLabel = 'Total Core Products';

  return (
    <div className="fixed inset-0 bg-matteBlack/90 backdrop-blur-md z-[999] flex justify-center items-center p-4 lg:p-12 overflow-y-auto">
      <div className="bg-offWhite w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col lg:flex-row min-h-[600px]">
        
        <button onClick={onClose} className="absolute top-6 right-6 z-50 text-matteBlack hover:text-red-500 bg-white rounded-full p-2 shadow-lg transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="w-full lg:w-[40%] bg-matteBlack relative overflow-hidden flex items-center justify-center p-8">
          {activeComplexityData?.media_url ? (
            activeComplexityData.media_type === 'video' ? (
              <video src={activeComplexityData.media_url} autoPlay muted loop className="w-full h-auto object-contain rounded-xl shadow-2xl" />
            ) : (
              <img src={activeComplexityData.media_url} alt="Reference" className="w-full h-auto object-contain rounded-xl shadow-2xl" />
            )
          ) : (
            <div className="text-center space-y-4">
               <div className="w-16 h-16 border-4 border-white/10 border-t-accentBlue rounded-full animate-spin mx-auto" />
               <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest">Awaiting Reference Asset</p>
            </div>
          )}
          
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">{activeComplexityData?.title || formatTitle(currentComplexity)}</h2>
            <p className="text-sm text-white/60 mt-2">{activeComplexityData?.description}</p>
          </div>
        </div>

        <div className="w-full lg:w-[60%] p-8 lg:p-12 space-y-8 overflow-y-auto max-h-[80vh]">
          
          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-accentBlue mb-2">Configuring</h3>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight">{config.display_name}</h2>
          </div>

          {config.category_slug === 'website_development' && (
            <div className="flex p-1 bg-matteBlack/5 rounded-lg">
              <button 
                onClick={() => {
                  setWebTab('service');
                  // Auto-select the first service option so the image changes instantly
                  const firstKey = Object.entries(config.complexities).find(([_, data]: any) => data.type === 'service')?.[0];
                  if (firstKey) onUpdate({ quantity: currentQty, complexity: firstKey, addons: selection?.addons });
                }} 
                className={`flex-1 py-3 text-xs font-bold uppercase rounded-md transition-all ${webTab === 'service' ? 'bg-white shadow-sm text-matteBlack' : 'text-matteBlack/50'}`}
              >
                Service Website
              </button>
              <button 
                onClick={() => {
                  setWebTab('ecommerce');
                  // Auto-select the first e-commerce option so the image changes instantly
                  const firstKey = Object.entries(config.complexities).find(([_, data]: any) => data.type === 'ecommerce')?.[0];
                  if (firstKey) onUpdate({ quantity: currentQty, complexity: firstKey, addons: selection?.addons });
                }} 
                className={`flex-1 py-3 text-xs font-bold uppercase rounded-md transition-all ${webTab === 'ecommerce' ? 'bg-white shadow-sm text-matteBlack' : 'text-matteBlack/50'}`}
              >
                E-Commerce
              </button>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-matteBlack/40">Select Type</p>
            {availableComplexities.map(([key, data]: any) => (
              <button 
                key={key} 
                onClick={() => onUpdate({ quantity: currentQty, complexity: key, addons: selection?.addons })}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all flex justify-between items-center ${currentComplexity === key ? 'border-accentBlue bg-accentBlue/5' : 'border-matteBlack/10 hover:border-matteBlack/30'}`}
              >
                <div>
                  <h4 className="text-sm font-extrabold text-matteBlack">{data.title || formatTitle(key)}</h4>
                  <p className="text-xs font-semibold text-matteBlack/60 mt-1">{data.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${currentComplexity === key ? 'border-accentBlue' : 'border-matteBlack/20'}`}>
                   {currentComplexity === key && <div className="w-2 h-2 bg-accentBlue rounded-full" />}
                </div>
              </button>
            ))}
          </div>

          {/* Primary Input & Slider (Pages, Products, Minutes, Screens) */}
          <div className="bg-white p-6 rounded-xl border border-matteBlack/10 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/40">
                {primaryLabel}
              </label>
              
              <input 
                type="number" 
                min="1" 
                value={currentQty} 
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  onUpdate({ quantity: val, complexity: currentComplexity, addons: selection?.addons });
                }}
                className="w-20 text-right text-2xl font-extrabold text-matteBlack bg-transparent outline-none focus:ring-0 border-b-2 border-transparent focus:border-accentBlue transition-colors p-0"
              />
            </div>
            <input 
              type="range" 
              min="1" 
              max={100} 
              value={currentQty} 
              onChange={(e) => onUpdate({ quantity: parseInt(e.target.value), complexity: currentComplexity, addons: selection?.addons })}
              className="w-full h-2 bg-matteBlack/10 rounded-lg appearance-none cursor-pointer accent-accentBlue"
            />
          </div>

          {/* SECONDARY SLIDER: Number of Videos */}
          {isVideo && (
            <div className="bg-white p-6 rounded-xl border border-matteBlack/10 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/40">
                  Total Number of Videos
                </label>
                <input 
                  type="number" 
                  min="1" 
                  value={currentVideoCount} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    onUpdate({ quantity: currentQty, complexity: currentComplexity, addons: { ...selection?.addons, videoCount: val } });
                  }}
                  className="w-20 text-right text-2xl font-extrabold text-matteBlack bg-transparent outline-none focus:ring-0 border-b-2 border-transparent focus:border-accentBlue transition-colors p-0"
                />
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={currentVideoCount} 
                onChange={(e) => onUpdate({ quantity: currentQty, complexity: currentComplexity, addons: { ...selection?.addons, videoCount: parseInt(e.target.value) } })}
                className="w-full h-2 bg-matteBlack/10 rounded-lg appearance-none cursor-pointer accent-accentBlue"
              />
            </div>
          )}

          {/* SECONDARY SLIDER: Number of Variants (Amazon & E-Commerce) */}
          {(isAmazon || isEcom) && (
            <div className="bg-white p-6 rounded-xl border border-matteBlack/10 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/40">
                  Variants per Product (Sizes, Colors, etc.)
                </label>
                <input 
                  type="number" 
                  min="1" 
                  value={currentVariants} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    onUpdate({ quantity: currentQty, complexity: currentComplexity, addons: { ...selection?.addons, variants: val } });
                  }}
                  className="w-20 text-right text-2xl font-extrabold text-matteBlack bg-transparent outline-none focus:ring-0 border-b-2 border-transparent focus:border-accentBlue transition-colors p-0"
                />
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                value={currentVariants} 
                onChange={(e) => onUpdate({ quantity: currentQty, complexity: currentComplexity, addons: { ...selection?.addons, variants: parseInt(e.target.value) } })}
                className="w-full h-2 bg-matteBlack/10 rounded-lg appearance-none cursor-pointer accent-accentBlue"
              />
            </div>
          )}

          {config.category_slug === 'website_development' && (
             <div className="flex items-center gap-4 bg-accentBlue/5 p-6 rounded-xl border border-accentBlue/20">
             <input 
               type="checkbox" 
               checked={selection?.addons?.seo || false}
               onChange={() => onToggleAddon('seo')}
               className="w-5 h-5 accent-accentBlue rounded cursor-pointer" 
             />
             <div>
               <label className="text-sm font-extrabold uppercase tracking-widest cursor-pointer text-matteBlack">Add Advanced SEO</label>
               <p className="text-xs text-matteBlack/60 mt-1">One-time optimization for speed and search ranking.</p>
             </div>
           </div>
          )}

          <button onClick={onClose} className="w-full py-4 bg-matteBlack text-white text-xs font-extrabold uppercase tracking-widest rounded hover:bg-accentBlue transition-colors">
            Confirm & Close
          </button>
        </div>
      </div>
    </div>
  );
}