import FixedBackgroundCanvas from "@/components/ui/FixedBackgroundCanvas";
import HomeHero from "@/components/sections/HomeHero";
import Services from "@/components/sections/Services"; 
import AppPortal from "@/components/sections/AppPortal";
import TeamRoster from "@/components/sections/TeamRoster";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <main className="relative w-full overflow-hidden bg-offWhite">
      {/* The 2.5D Global Animation Engine sitting behind everything */}
      <FixedBackgroundCanvas />

      {/* The Transparent Content Layers */}
      <div className="relative z-10 w-full flex flex-col">
        <HomeHero />
        <Services /> 
        <AppPortal />
        <TeamRoster />
        <CTASection />
      </div>
    </main>
  );
}