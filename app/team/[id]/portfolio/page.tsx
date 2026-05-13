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

// 2. THE PUBLIC RENDERER ENGINE
export default async function MemberPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createServer();

  // Fetch only the specific data we need for the portfolio
  const { data: member, error } = await supabase
    .from("team_members")
    .select("id, name, portfolio_data")
    .eq("id", resolvedParams.id)
    .single();

  // If the member doesn't exist, or they haven't published a portfolio yet, throw a 404
  if (error || !member || !member.portfolio_data) {
    notFound();
  }

  return (
    // REVERTED TO LIGHT MODE: bg-offWhite and dark text
    <main className="min-h-screen bg-offWhite pt-24 pb-32">
      
      {/* HEADER IS CONSTRAINED */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-12 flex items-center justify-between border-b border-matteBlack/10 pb-6">
            <Link 
              href={`/team/${member.id}`} 
              className="text-xs font-bold uppercase tracking-widest text-matteBlack/50 hover:text-accentBlue transition-colors flex items-center gap-2"
            >
              <span>&larr;</span> Back to Profile
            </Link>
            
            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/40 block mb-1">
                Verified Vault
              </span>
              <h1 className="text-lg font-bold text-matteBlack tracking-tight">
                {member.name}'s Portfolio
              </h1>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* THE SWITCHBOARD: Full width wrapper, blocks constrain themselves */}
      <div className="w-full">
        <PortfolioRenderer portfolioJson={member.portfolio_data} />
      </div>

    </main>
  );
}