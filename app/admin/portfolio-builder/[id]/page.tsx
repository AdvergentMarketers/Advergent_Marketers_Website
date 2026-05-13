"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

// Import the Lego Bricks we built in Phase 2
import HeroBlock from "@/components/portfolio/blocks/HeroBlock";
import MasonryGridBlock from "@/components/portfolio/blocks/MasonryGridBlock";
import StandardGridBlock from "@/components/portfolio/blocks/StandardGridBlock";
import CinematicFadeBlock from "@/components/portfolio/blocks/CinematicFadeBlock";

type AccentTheme = "blue" | "red";

// Added accentTheme to all blocks, and added the new cinematic_fade type
type PortfolioBlock = 
  | { type: "hero"; id: string; imageUrl: string; title: string; subtitle: string; accentTheme: AccentTheme }
  | { type: "masonry"; id: string; categoryName: string; images: string[]; accentTheme: AccentTheme }
  | { type: "standard_grid"; id: string; categoryName: string; columns: 2 | 3; images: string[]; accentTheme: AccentTheme }
 | { type: "cinematic_fade"; id: string; imageUrl: string; title: string; descriptionType: "points" | "paragraph"; features: string[]; paragraphText: string; accentTheme: AccentTheme };

// Define the shape of our dynamic blocks


export default function PortfolioCanvasBuilder() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [memberName, setMemberName] = useState("");
  
  // THE MASTER STATE: This array holds the blueprint.
  const [blocks, setBlocks] = useState<PortfolioBlock[]>([]);

  // 1. Fetch existing data on load
  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('name, portfolio_data')
        .eq('id', memberId)
        .single();

      if (data) {
        setMemberName(data.name);
        // If they already have blocks built, load them into the state!
        if (data.portfolio_data && data.portfolio_data.blocks) {
          setBlocks(data.portfolio_data.blocks);
        }
      }
      setIsLoading(false);
    };
    if (memberId) fetchPortfolio();
  }, [memberId, supabase]);

// 2. Block Mutators (Adding new blocks to the canvas)
  const addHeroBlock = () => setBlocks([...blocks, { type: "hero", id: Date.now().toString(), imageUrl: "", title: "", subtitle: "", accentTheme: "blue" }]);
  const addMasonryBlock = () => setBlocks([...blocks, { type: "masonry", id: Date.now().toString(), categoryName: "", images: [], accentTheme: "blue" }]);
  const addStandardGrid = () => setBlocks([...blocks, { type: "standard_grid", id: Date.now().toString(), categoryName: "", columns: 2, images: [], accentTheme: "blue" }]);
  const addCinematicBlock = () => setBlocks([...blocks, { type: "cinematic_fade", id: Date.now().toString(), imageUrl: "", title: "", descriptionType: "points", features: [], paragraphText: "", accentTheme: "blue" }]);

  const removeBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id));

  // Update specific fields inside a block
  const updateBlock = (id: string, field: string, value: any) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, [field]: value } : block));
  };

  // 3. Deployment Engine
  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      // Compile the state into the final JSON structure
      const payload = {
        template_type: "graphic_design", // We can make this dynamic later!
        blocks: blocks
      };

      const { error } = await supabase
        .from('team_members')
        .update({ portfolio_data: payload })
        .eq('id', memberId);

      if (error) throw error;
      alert("Portfolio successfully deployed to the live server.");
    } catch (error: any) {
      alert("Deployment Failed: " + error.message);
    } finally {
      setIsDeploying(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-matteBlack flex items-center justify-center text-white font-bold animate-pulse">Initializing Canvas Engine...</div>;

  return (
    <div className="h-screen w-full flex overflow-hidden bg-offWhite selection:bg-accentBlue selection:text-white">
      
      {/* LEFT DESK: The Control Panel (30% Width) */}
      <div className="w-[30%] h-full bg-white border-r border-matteBlack/10 flex flex-col shadow-2xl z-20 relative">
        
        {/* Header */}
        <div className="p-6 border-b border-matteBlack/10 bg-white">
          <Link href="/admin" className="text-[10px] font-bold uppercase tracking-widest text-matteBlack/40 hover:text-accentBlue transition-colors mb-4 block">
            &larr; Exit Canvas
          </Link>
          <h1 className="text-xl font-extrabold text-matteBlack tracking-tight mb-1">
            Editing: {memberName}
          </h1>
          <p className="text-xs font-bold text-accentBlue uppercase tracking-widest">
            Live Portfolio Builder
          </p>
        </div>

        {/* The Block Stack (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
          
          {blocks.length === 0 && (
            <div className="text-center py-10 border border-dashed border-matteBlack/20 rounded-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-matteBlack/40">Canvas is empty</p>
            </div>
          )}

          {blocks.map((block, index) => (
  <div key={block.id} className="p-4 bg-offWhite border border-matteBlack/5 rounded-xl relative group">
    <div className="flex justify-between items-center mb-4 pb-2 border-b border-matteBlack/10">
      
      {/* Title & Theme Toggle Group */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/50">
          Block {index + 1} • {block.type.replace('_', ' ')}
        </span>
        
        {/* NEW: DYNAMIC COLOR TOGGLE */}
        <select 
          value={block.accentTheme || "blue"} 
          onChange={e => updateBlock(block.id, 'accentTheme', e.target.value)} 
          className="text-[10px] font-bold uppercase bg-white border border-matteBlack/20 rounded px-2 py-1 cursor-pointer outline-none text-matteBlack focus:border-accentBlue transition-colors"
        >
          <option value="blue">Blue Theme</option>
          <option value="red">Red Theme</option>
        </select>
      </div>

      {/* Remove Button */}
      <button 
        onClick={() => removeBlock(block.id)} 
        className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline"
      >
        Remove
      </button>
    </div>

              {/* Dynamic Inputs based on Block Type */}
              {block.type === "hero" && (
                <div className="space-y-3">
                  <input type="text" placeholder="Image URL" value={block.imageUrl} onChange={e => updateBlock(block.id, 'imageUrl', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue focus:border-accentBlue" />
                  <input type="text" placeholder="Main Title (e.g., Brand Identity)" value={block.title} onChange={e => updateBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                  <input type="text" placeholder="Subtitle (e.g., Selected Works)" value={block.subtitle} onChange={e => updateBlock(block.id, 'subtitle', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                </div>
              )}

              {block.type === "masonry" && (
                <div className="space-y-3">
                  <input type="text" placeholder="Category Name (e.g., Social Media)" value={block.categoryName} onChange={e => updateBlock(block.id, 'categoryName', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                  <textarea rows={3} placeholder="Paste Image URLs (comma separated)" value={block.images.join(', ')} onChange={e => updateBlock(block.id, 'images', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue resize-none" />
                </div>
              )}

              {block.type === "standard_grid" && (
                <div className="space-y-3">
                  <input type="text" placeholder="Category Name" value={block.categoryName} onChange={e => updateBlock(block.id, 'categoryName', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                  <select value={block.columns} onChange={e => updateBlock(block.id, 'columns', Number(e.target.value))} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue cursor-pointer">
                    <option value={2}>2 Columns (Wide)</option>
                    <option value={3}>3 Columns (Compact)</option>
                  </select>
                  <textarea rows={3} placeholder="Paste Image URLs (comma separated)" value={block.images.join(', ')} onChange={e => updateBlock(block.id, 'images', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue resize-none" />
                </div>
              )}
              {block.type === "cinematic_fade" && (
                <div className="space-y-3">
                  <input type="text" placeholder="Image URL " value={block.imageUrl} onChange={e => updateBlock(block.id, 'imageUrl', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                  <input type="text" placeholder="Title " value={block.title} onChange={e => updateBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                  
                  {/* NEW: Layout Toggle */}
                  <select 
                    value={block.descriptionType || "points"} 
                    onChange={e => updateBlock(block.id, 'descriptionType', e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue cursor-pointer bg-white"
                  >
                    <option value="points">Layout: Bullet Points</option>
                    <option value="paragraph">Layout: Standard Paragraph</option>
                  </select>

                  {/* CONDITIONAL RENDER: Show Textarea based on selection */}
                  {block.descriptionType === "paragraph" ? (
                    <textarea rows={5} placeholder="Write your full paragraph description here..." value={block.paragraphText || ""} onChange={e => updateBlock(block.id, 'paragraphText', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue resize-none" />
                  ) : (
                    <>
                      <textarea rows={4} placeholder="Features (Format -> Heading: Description) Separated by commas" value={block.features.join(', ')} onChange={e => updateBlock(block.id, 'features', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue resize-none" />
                      <p className="text-[9px] font-bold text-matteBlack/40 uppercase tracking-wider">Format: "Fast Delivery: We ship in 24 hours, Secure: Fully encrypted"</p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer: Add Blocks & Deploy */}
        <div className="p-6 bg-white border-t border-matteBlack/10">
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button onClick={addHeroBlock} className="py-2 bg-matteBlack/5 text-matteBlack text-[10px] font-bold uppercase tracking-widest rounded hover:bg-matteBlack/10 transition">+ Hero</button>
            <button onClick={addMasonryBlock} className="py-2 bg-matteBlack/5 text-matteBlack text-[10px] font-bold uppercase tracking-widest rounded hover:bg-matteBlack/10 transition">+ Masonry</button>
           <button onClick={addCinematicBlock} className="py-2 bg-matteBlack text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-accentBlue transition shadow-md">+ Cinematic Fade</button>
            <button onClick={addStandardGrid} className="py-2 bg-matteBlack/5 text-matteBlack text-[10px] font-bold uppercase tracking-widest rounded hover:bg-matteBlack/10 transition">+ Grid</button>
          </div>
          <button onClick={handleDeploy} disabled={isDeploying} className="w-full py-4 bg-accentBlue text-white text-xs font-extrabold uppercase tracking-widest rounded shadow-xl hover:opacity-90 transition disabled:opacity-50">
            {isDeploying ? "Compiling..." : "Deploy Portfolio to Live"}
          </button>
        </div>

      </div>

      {/* RIGHT DESK: The Live Canvas (70% Width) */}
      <div className="w-[70%] h-full overflow-y-auto bg-offWhite p-8 md:p-16 hide-scrollbar relative">
        <div className="absolute top-8 right-8 z-50">
          <span className="px-3 py-1.5 bg-matteBlack/10 backdrop-blur-md border border-matteBlack/20 text-matteBlack text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accentBlue animate-pulse" /> Live Preview
          </span>
        </div>

        {/* THE ENGINE: Dynamically mapping the state to the visual blocks */}
        <div className="max-w-5xl mx-auto space-y-24">
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-matteBlack/30">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <h2 className="text-xl font-bold uppercase tracking-widest">Canvas Awaiting Input</h2>
            </div>
          ) : (
            blocks.map((block) => {
              if (block.type === "hero") {
                return <HeroBlock key={block.id} imageUrl={block.imageUrl} title={block.title} subtitle={block.subtitle} accentTheme={block.accentTheme} />;
              }
              if (block.type === "masonry") {
                return <MasonryGridBlock key={block.id} categoryName={block.categoryName} images={block.images} accentTheme={block.accentTheme} />;
              }
              if (block.type === "standard_grid") {
                return <StandardGridBlock key={block.id} categoryName={block.categoryName} columns={block.columns} images={block.images} accentTheme={block.accentTheme} />;
              }
              // NEW: Render the Cinematic Fade Block in the preview window!
              if (block.type === "cinematic_fade") {
                return <CinematicFadeBlock key={block.id} imageUrl={block.imageUrl} title={block.title} features={block.features} accentTheme={block.accentTheme} />;
              }
              return null;
            })
          )}
        </div>
      </div>

    </div>
  );
}