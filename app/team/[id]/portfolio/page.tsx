import { notFound } from "next/navigation";
import Link from "next/link";
import { createServer } from "@/lib/supabase-server";
import PortfolioRenderer from "@/components/portfolio/PortfolioRenderer";
import { FadeIn } from "@/components/ui/MotionWrapper";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 1. DYNAMIC SEO GENERATOR
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createServer();
  
  const { data: member } = await supabase
    .from("team_members")
    .select("name, designation")
    .eq("id", resolvedParams.id)
    .single();

  if (!member) return { title: "Portfolio Not Found" };

  return {
    title: `${member.name} | Portfolio Vault`,
    description: `Explore the verified project portfolio and creative execution of ${member.name}, ${member.designation}.`,
  };
}

// 2. THE MULTI-VAULT ENGINE
export default async function MemberPortfolioPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ vault?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const activeVaultQuery = resolvedSearch.vault; // e.g., ?vault=video_editing

  const supabase = await createServer();

  const { data: member, error } = await supabase
    .from("team_members")
    .select("id, name, portfolio_data")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !member || !member.portfolio_data) {
    notFound();
  }

  // --- THE CHAMELEON SCRIPT (DATA PRESERVATION) ---
  let vaults = member.portfolio_data;
  
  // If the data is in the old format (it has a 'blocks' array at the root),
  // we seamlessly wrap it into the "graphic_design" vault so it doesn't break!
  if (vaults.blocks && Array.isArray(vaults.blocks)) {
    vaults = {
      graphic_design: vaults
    };
  }
  // ------------------------------------------------

  const availableVaultKeys = Object.keys(vaults);

  // LOGIC 1: If the URL asks for a specific vault, OR there is only one vault available, render the actual Portfolio.
  const targetVaultKey = activeVaultQuery || (availableVaultKeys.length === 1 ? availableVaultKeys[0] : null);

  if (targetVaultKey && vaults[targetVaultKey]) {
    const activePortfolioJson = vaults[targetVaultKey];
    
    // Formatting the vault name for the UI (e.g., "video_editing" -> "Video Editing")
    const formattedVaultName = targetVaultKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
      <main className="min-h-screen bg-offWhite pt-24 pb-32">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-12 flex items-center justify-between border-b border-matteBlack/10 pb-6">
              
              {/* If there's multiple vaults, back button goes to Hub. Otherwise, back to profile */}
              <Link 
                href={availableVaultKeys.length > 1 ? `/team/${member.id}/portfolio` : `/team/${member.id}`} 
                className="text-xs font-bold uppercase tracking-widest text-matteBlack/50 hover:text-accentBlue transition-colors flex items-center gap-2"
              >
                <span>&larr;</span> {availableVaultKeys.length > 1 ? "Back to Vault Hub" : "Back to Profile"}
              </Link>
              
              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-accentBlue block mb-1">
                  {formattedVaultName} Vault
                </span>
                <h1 className="text-lg font-bold text-matteBlack tracking-tight">
                  {member.name}'s Portfolio
                </h1>
              </div>
            </div>
          </FadeIn>
        </div>
        <div className="w-full">
          <PortfolioRenderer portfolioJson={activePortfolioJson} />
        </div>
      </main>
    );
  }

  // LOGIC 2: If there are MULTIPLE vaults and no specific vault is selected in the URL, show the Vault Hub!
  return (
    <main className="min-h-screen bg-offWhite pt-24 pb-32 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <FadeIn>
          <div className="text-center mb-16">
            <Link href={`/team/${member.id}`} className="text-[10px] font-bold uppercase tracking-widest text-matteBlack/50 hover:text-accentBlue transition-colors mb-6 inline-block">
              &larr; Back to Profile
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-matteBlack tracking-tight mb-4">
              Select a Discipline
            </h1>
            <p className="text-lg text-matteBlack/60 font-medium">
              {member.name} operates across multiple creative verticals. Choose a vault to explore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableVaultKeys.map((vaultKey, index) => {
              const formattedName = vaultKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              // Basic icon logic based on the vault type
              let icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />; // Default Image Icon
              if (vaultKey === "video_editing") icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />; // Video Icon
              if (vaultKey === "ui_ux") icon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />; // UI Icon

              return (
                <FadeIn key={vaultKey} delay={index * 0.1}>
                  <Link 
                    href={`/team/${member.id}/portfolio?vault=${vaultKey}`}
                    className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-matteBlack/10 hover:border-accentBlue hover:shadow-2xl transition-all duration-300 group h-full"
                  >
                    <div className="w-16 h-16 bg-offWhite rounded-full flex items-center justify-center text-matteBlack group-hover:text-accentBlue group-hover:bg-accentBlue/10 transition-colors mb-6">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {icon}
                      </svg>
                    </div>
                    <h3 className="text-xl font-extrabold text-matteBlack text-center group-hover:text-accentBlue transition-colors">{formattedName}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-matteBlack/40 mt-3 text-center">View Vault</p>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        </FadeIn>
      </div>
    </main>
  );
}