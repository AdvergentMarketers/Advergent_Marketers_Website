"use client";

import HeroBlock from "./blocks/HeroBlock";
import MasonryGridBlock from "./blocks/MasonryGridBlock";
import StandardGridBlock from "./blocks/StandardGridBlock";
import CinematicFadeBlock from "./blocks/CinematicFadeBlock";

type AccentTheme = "blue" | "red";

// The Renderer must know about the new descriptionType and paragraphText fields!
type PortfolioBlock = 
  | { type: "hero"; id: string; imageUrl: string; title: string; subtitle: string; accentTheme: AccentTheme }
  | { type: "masonry"; id: string; categoryName: string; images: string[]; accentTheme: AccentTheme }
  | { type: "standard_grid"; id: string; categoryName: string; columns: 2 | 3; images: string[]; accentTheme: AccentTheme }
  | { type: "cinematic_fade"; id: string; imageUrl: string; title: string; descriptionType?: "points" | "paragraph"; features: string[]; paragraphText?: string; accentTheme: AccentTheme };

type PortfolioData = {
  template_type: string;
  blocks: PortfolioBlock[]; 
};

export default function PortfolioRenderer({ portfolioJson }: { portfolioJson: PortfolioData | null }) {
  
  if (!portfolioJson || !portfolioJson.blocks || portfolioJson.blocks.length === 0) {
    return (
      <div className="w-full py-32 text-center border border-dashed border-matteBlack/20 rounded-3xl">
        <p className="text-matteBlack/40 font-bold uppercase tracking-widest">
          Vault is currently empty.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-24">
      {portfolioJson.blocks.map((block) => {
        if (block.type === "hero") {
          return (
            <HeroBlock 
              key={block.id} 
              imageUrl={block.imageUrl} 
              title={block.title} 
              subtitle={block.subtitle} 
              accentTheme={block.accentTheme} 
            />
          );
        }
        if (block.type === "masonry") {
          return (
            <MasonryGridBlock 
              key={block.id} 
              categoryName={block.categoryName} 
              images={block.images} 
              accentTheme={block.accentTheme} 
            />
          );
        }
        if (block.type === "standard_grid") {
          return (
            <StandardGridBlock 
              key={block.id} 
              categoryName={block.categoryName} 
              columns={block.columns} 
              images={block.images} 
              accentTheme={block.accentTheme} 
            />
          );
        }
        // FULLY SYNCED CINEMATIC BLOCK
        if (block.type === "cinematic_fade") {
          return (
            <CinematicFadeBlock 
              key={block.id} 
              imageUrl={block.imageUrl} 
              title={block.title} 
              descriptionType={block.descriptionType} 
              features={block.features} 
              paragraphText={block.paragraphText} 
              accentTheme={block.accentTheme} 
            />
          );
        }
        return null; 
      })}
    </div>
  );
}