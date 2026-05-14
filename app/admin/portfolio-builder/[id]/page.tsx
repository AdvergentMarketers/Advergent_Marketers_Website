"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

// Lego Bricks
import HeroBlock from "@/components/portfolio/blocks/HeroBlock";
import MasonryGridBlock from "@/components/portfolio/blocks/MasonryGridBlock";
import StandardGridBlock from "@/components/portfolio/blocks/StandardGridBlock";
import CinematicFadeBlock from "@/components/portfolio/blocks/CinematicFadeBlock";
import VideoEmbedBlock from "@/components/portfolio/blocks/VideoEmbedBlock";
import ReelEmbedBlock from "@/components/portfolio/blocks/ReelEmbedBlock"; 

type AccentTheme = "blue" | "red";
type VaultType = "graphic_design" | "video_editing" | "ui_ux";

// Block Types
type PortfolioBlock = 
  | { type: "hero"; id: string; imageUrl: string; title: string; subtitle: string; accentTheme: AccentTheme }
  | { type: "masonry"; id: string; categoryName: string; images: string[]; accentTheme: AccentTheme }
  | { type: "standard_grid"; id: string; categoryName: string; columns: 2 | 3; images: string[]; accentTheme: AccentTheme }
  | { type: "cinematic_fade"; id: string; imageUrl: string; title: string; descriptionType: "points" | "paragraph"; features: string[]; paragraphText: string; accentTheme: AccentTheme }
  | { type: "video_embed"; id: string; videoUrl: string; title: string; accentTheme: AccentTheme }
  | { type: "reel_embed"; id: string; videoUrls: string[]; title: string; accentTheme: AccentTheme };

export default function PortfolioCanvasBuilder() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [memberName, setMemberName] = useState("");
  
  // THE MULTI-VAULT STATE ENGINE
  const [activeVault, setActiveVault] = useState<VaultType>("graphic_design");
  const [vaultData, setVaultData] = useState<Record<VaultType, { blocks: PortfolioBlock[] }>>({
    graphic_design: { blocks: [] },
    video_editing: { blocks: [] },
    ui_ux: { blocks: [] }
  });

  // NATIVE DRAG & DROP STATE
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('name, portfolio_data')
        .eq('id', memberId)
        .single();

      if (data) {
        setMemberName(data.name);
        
        if (data.portfolio_data) {
          if (data.portfolio_data.blocks && Array.isArray(data.portfolio_data.blocks)) {
            setVaultData(prev => ({
              ...prev,
              graphic_design: { blocks: data.portfolio_data.blocks }
            }));
          } else {
            setVaultData({
              graphic_design: data.portfolio_data.graphic_design || { blocks: [] },
              video_editing: data.portfolio_data.video_editing || { blocks: [] },
              ui_ux: data.portfolio_data.ui_ux || { blocks: [] }
            });
          }
        }
      }
      setIsLoading(false);
    };
    if (memberId) fetchPortfolio();
  }, [memberId, supabase]);

  const activeBlocks = vaultData[activeVault].blocks;
  
  const updateActiveBlocks = (newBlocks: PortfolioBlock[]) => {
    setVaultData({
      ...vaultData,
      [activeVault]: { blocks: newBlocks }
    });
  };

  // --- REORDERING ENGINE ---
  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= activeBlocks.length) return;
    const newBlocks = [...activeBlocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    updateActiveBlocks(newBlocks);
  };

  // HTML5 Drag Handlers
  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Required to allow dropping
  };
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveBlock(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };
  const handleDragEnd = () => setDraggedIndex(null);
  // -------------------------

  const addHeroBlock = () => updateActiveBlocks([...activeBlocks, { type: "hero", id: Date.now().toString(), imageUrl: "", title: "", subtitle: "", accentTheme: "blue" }]);
  const addMasonryBlock = () => updateActiveBlocks([...activeBlocks, { type: "masonry", id: Date.now().toString(), categoryName: "", images: [], accentTheme: "blue" }]);
  const addStandardGrid = () => updateActiveBlocks([...activeBlocks, { type: "standard_grid", id: Date.now().toString(), categoryName: "", columns: 2, images: [], accentTheme: "blue" }]);
  const addCinematicBlock = () => updateActiveBlocks([...activeBlocks, { type: "cinematic_fade", id: Date.now().toString(), imageUrl: "", title: "", descriptionType: "points", features: [], paragraphText: "", accentTheme: "blue" }]);
  const addVideoBlock = () => updateActiveBlocks([...activeBlocks, { type: "video_embed", id: Date.now().toString(), videoUrl: "", title: "", accentTheme: "blue" }]);
  const removeBlock = (id: string) => updateActiveBlocks(activeBlocks.filter(b => b.id !== id));
  const addReelBlock = () => updateActiveBlocks([...activeBlocks, { type: "reel_embed", id: Date.now().toString(), videoUrls: [], title: "", accentTheme: "blue" }]);
  const updateBlock = (id: string, field: string, value: any) => {
    updateActiveBlocks(activeBlocks.map(block => block.id === id ? { ...block, [field]: value } : block));
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const finalPayload: Record<string, any> = {};
      (Object.keys(vaultData) as VaultType[]).forEach(key => {
        if (vaultData[key].blocks.length > 0) {
          finalPayload[key] = vaultData[key];
        }
      });

      const { error } = await supabase
        .from('team_members')
        .update({ portfolio_data: finalPayload })
        .eq('id', memberId);

      if (error) throw error;
      alert("Multi-Vault Portfolio successfully deployed to the live server.");
    } catch (error: any) {
      alert("Deployment Failed: " + error.message);
    } finally {
      setIsDeploying(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-matteBlack flex items-center justify-center text-white font-bold animate-pulse">Initializing Canvas Engine...</div>;

  return (
    <div className="h-screen w-full flex overflow-hidden bg-offWhite selection:bg-accentBlue selection:text-white">
      
      {/* LEFT DESK */}
      <div className="w-[30%] h-full bg-white border-r border-matteBlack/10 flex flex-col shadow-2xl z-20 relative">
        <div className="p-6 border-b border-matteBlack/10 bg-white shrink-0">
          <Link href="/admin" className="text-[10px] font-bold uppercase tracking-widest text-matteBlack/40 hover:text-accentBlue transition-colors mb-4 block">
            &larr; Exit Canvas
          </Link>
          <h1 className="text-xl font-extrabold text-matteBlack tracking-tight mb-4">
            Editing: {memberName}
          </h1>
          <div className="flex bg-offWhite p-1 rounded-lg border border-matteBlack/5">
            <button onClick={() => setActiveVault("graphic_design")} className={`flex-1 py-2 text-[10px] font-extrabold uppercase tracking-widest rounded-md transition-all ${activeVault === "graphic_design" ? "bg-white text-accentBlue shadow-sm" : "text-matteBlack/50 hover:text-matteBlack"}`}>Graphics</button>
            <button onClick={() => setActiveVault("video_editing")} className={`flex-1 py-2 text-[10px] font-extrabold uppercase tracking-widest rounded-md transition-all ${activeVault === "video_editing" ? "bg-white text-accentBlue shadow-sm" : "text-matteBlack/50 hover:text-matteBlack"}`}>Video</button>
            <button onClick={() => setActiveVault("ui_ux")} className={`flex-1 py-2 text-[10px] font-extrabold uppercase tracking-widest rounded-md transition-all ${activeVault === "ui_ux" ? "bg-white text-accentBlue shadow-sm" : "text-matteBlack/50 hover:text-matteBlack"}`}>UI/UX</button>
          </div>
        </div>

        {/* BLOCK STACK */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar relative">
          {activeBlocks.length === 0 && (
            <div className="text-center py-10 border border-dashed border-matteBlack/20 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-matteBlack/40">
                {activeVault.replace('_', ' ')} Vault is empty
              </p>
            </div>
          )}

          {activeBlocks.map((block, index) => (
            <div 
              key={block.id} 
              // DRAG AND DROP WRAPPER
              draggable 
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`p-4 bg-offWhite border rounded-xl relative group shadow-sm transition-all duration-200 
                ${draggedIndex === index ? 'opacity-40 border-accentBlue scale-[0.98]' : 'border-matteBlack/5 hover:border-matteBlack/20'}`}
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-matteBlack/10">
                
                {/* Drag Handle & Label */}
                <div className="flex items-center gap-3">
                  <div className="cursor-grab active:cursor-grabbing text-matteBlack/30 hover:text-matteBlack transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/50 flex flex-col sm:flex-row sm:gap-2">
                    <span className="text-accentBlue">POS: {index + 1}</span> 
                    <span className="hidden sm:inline">•</span> 
                    <span>{block.type.replace('_', ' ')}</span>
                  </span>
                  
                  <select 
                    value={block.accentTheme || "blue"} 
                    onChange={e => updateBlock(block.id, 'accentTheme', e.target.value)} 
                    className="text-[10px] font-bold uppercase bg-white border border-matteBlack/20 rounded px-2 py-1 cursor-pointer outline-none text-matteBlack focus:border-accentBlue transition-colors ml-2"
                  >
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                  </select>
                </div>

                {/* Arrow Controls & Remove */}
                <div className="flex items-center gap-2">
                  <button onClick={() => moveBlock(index, index - 1)} disabled={index === 0} className="w-6 h-6 flex items-center justify-center rounded bg-matteBlack/5 text-matteBlack hover:bg-matteBlack/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button onClick={() => moveBlock(index, index + 1)} disabled={index === activeBlocks.length - 1} className="w-6 h-6 flex items-center justify-center rounded bg-matteBlack/5 text-matteBlack hover:bg-matteBlack/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <button onClick={() => removeBlock(block.id)} className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline ml-2">Remove</button>
                </div>
              </div>

              {/* Dynamic Inputs */}
              {block.type === "hero" && (
                <div className="space-y-3">
                  <input type="text" placeholder="Image URL" value={block.imageUrl} onChange={e => updateBlock(block.id, 'imageUrl', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                  <input type="text" placeholder="Main Title" value={block.title} onChange={e => updateBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                  <input type="text" placeholder="Subtitle" value={block.subtitle} onChange={e => updateBlock(block.id, 'subtitle', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                </div>
              )}

              {block.type === "masonry" && (
                <div className="space-y-3">
                  <input type="text" placeholder="Category Name" value={block.categoryName} onChange={e => updateBlock(block.id, 'categoryName', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
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
              
              {block.type === "video_embed" && (
                <div className="space-y-3">
                  <input type="text" placeholder="Video URL (YouTube, Vimeo, or .mp4)" value={block.videoUrl} onChange={e => updateBlock(block.id, 'videoUrl', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                  <input type="text" placeholder="Title (e.g., 2026 Showreel)" value={block.title} onChange={e => updateBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                </div>
              )}
              
              {block.type === "reel_embed" && (
                <div className="space-y-3">
                  <input type="text" placeholder="Section Title (e.g., Vertical Format)" value={block.title} onChange={e => updateBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                  <textarea rows={3} placeholder="Paste Reel URLs (comma separated) - YouTube Shorts or .mp4" value={block.videoUrls ? block.videoUrls.join(', ') : ''} onChange={e => updateBlock(block.id, 'videoUrls', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue resize-none" />
                </div>
              )}

              {block.type === "cinematic_fade" && (
                <div className="space-y-3">
                  <input type="text" placeholder="Image URL" value={block.imageUrl} onChange={e => updateBlock(block.id, 'imageUrl', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                  <input type="text" placeholder="Title" value={block.title} onChange={e => updateBlock(block.id, 'title', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue" />
                  <select value={block.descriptionType || "points"} onChange={e => updateBlock(block.id, 'descriptionType', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue cursor-pointer bg-white">
                    <option value="points">Layout: Bullet Points</option>
                    <option value="paragraph">Layout: Standard Paragraph</option>
                  </select>
                  {block.descriptionType === "paragraph" ? (
                    <textarea rows={5} placeholder="Write full paragraph..." value={block.paragraphText || ""} onChange={e => updateBlock(block.id, 'paragraphText', e.target.value)} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue resize-none" />
                  ) : (
                    <>
                      <textarea rows={4} placeholder="Features (Heading: Description) Comma sep." value={block.features.join(', ')} onChange={e => updateBlock(block.id, 'features', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="w-full px-3 py-2 text-xs font-semibold border border-matteBlack/10 rounded-md focus:ring-accentBlue resize-none" />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-matteBlack/10 shrink-0">
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button onClick={addHeroBlock} className="py-2 bg-matteBlack/5 text-matteBlack text-[10px] font-bold uppercase tracking-widest rounded hover:bg-matteBlack/10 transition">+ Hero</button>
            <button onClick={addMasonryBlock} className="py-2 bg-matteBlack/5 text-matteBlack text-[10px] font-bold uppercase tracking-widest rounded hover:bg-matteBlack/10 transition">+ Masonry</button>
            <button onClick={addStandardGrid} className="py-2 bg-matteBlack/5 text-matteBlack text-[10px] font-bold uppercase tracking-widest rounded hover:bg-matteBlack/10 transition">+ Grid</button>
            <button onClick={addCinematicBlock} className="py-2 bg-matteBlack text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-accentBlue transition shadow-md">+ Cinematic Fade</button>
            <button onClick={addReelBlock} className="py-2 bg-matteBlack text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-accentBlue transition shadow-md">+ Vertical Reel</button>
            <button onClick={addVideoBlock} className="py-2 bg-matteBlack text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-accentBlue transition shadow-md">+ Video Player</button>
          </div>
          <button onClick={handleDeploy} disabled={isDeploying} className="w-full py-4 bg-accentBlue text-white text-xs font-extrabold uppercase tracking-widest rounded shadow-xl hover:opacity-90 transition disabled:opacity-50">
            {isDeploying ? "Pushing to Database..." : "Deploy Portfolio to Live"}
          </button>
        </div>
      </div>

      {/* RIGHT DESK: Live Canvas */}
      <div className="w-[70%] h-full overflow-y-auto bg-offWhite p-8 md:p-16 hide-scrollbar relative">
        <div className="absolute top-8 right-8 z-50">
          <span className="px-3 py-1.5 bg-matteBlack/10 backdrop-blur-md border border-matteBlack/20 text-matteBlack text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accentBlue animate-pulse" /> Live Preview: {activeVault.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <div className="max-w-5xl mx-auto space-y-24">
          {activeBlocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-matteBlack/30">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <h2 className="text-xl font-bold uppercase tracking-widest">Select Blocks to Build</h2>
            </div>
          ) : (
            activeBlocks.map((block) => {
              if (block.type === "hero") return <HeroBlock key={block.id} imageUrl={block.imageUrl} title={block.title} subtitle={block.subtitle} accentTheme={block.accentTheme} />;
              if (block.type === "masonry") return <MasonryGridBlock key={block.id} categoryName={block.categoryName} images={block.images} accentTheme={block.accentTheme} />;
              if (block.type === "standard_grid") return <StandardGridBlock key={block.id} categoryName={block.categoryName} columns={block.columns} images={block.images} accentTheme={block.accentTheme} />;
              if (block.type === "cinematic_fade") return <CinematicFadeBlock key={block.id} imageUrl={block.imageUrl} title={block.title} descriptionType={block.descriptionType} features={block.features} paragraphText={block.paragraphText} accentTheme={block.accentTheme} />;
              if (block.type === "video_embed") return <VideoEmbedBlock key={block.id} videoUrl={block.videoUrl} title={block.title} accentTheme={block.accentTheme} />;
              if (block.type === "reel_embed") return <ReelEmbedBlock key={block.id} videoUrls={block.videoUrls} title={block.title} accentTheme={block.accentTheme} />;
              return null;
            })
          )}
        </div>
      </div>
    </div>
  );
}