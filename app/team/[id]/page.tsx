import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createServer } from "@/lib/supabase-server";
import { FadeIn } from "@/components/ui/MotionWrapper";

// 1. DYNAMIC SEO GENERATOR
// FIX: params is now explicitly typed as a Promise
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // <-- Await the params here
  const supabase = await createServer();
  const { data: member } = await supabase
    .from("team_members")
    .select("name, designation, image_url, bio")
    .eq("id", resolvedParams.id)
    .single();

  if (!member) return { title: "Profile Not Found" };

  return {
    title: `${member.name} | ${member.designation}`,
    description: member.bio ? member.bio.substring(0, 160) + "..." : `View the professional portfolio of ${member.name}.`,
    openGraph: {
      images: [member.image_url || "/App_icon.png"],
    },
  };
}

// 2. THE SERVER COMPONENT ARCHITECTURE
// FIX: params is now explicitly typed as a Promise
export default async function TeamMemberProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // <-- Await the params here
  const supabase = await createServer();
  
  // Fetch the member data
  const { data: member, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", resolvedParams.id) // <-- Safely pass the resolved ID
    .single();

  // If someone types a random ID, throw a 404
  if (error || !member) {
    notFound();
  }

  // Parse comma-separated strings into arrays for beautiful rendering
  const softwareStack = member.software_stack ? member.software_stack.split(",").map((s: string) => s.trim()) : [];
  const brandsWorkedWith = member.brands_worked_with ? member.brands_worked_with.split(",").map((s: string) => s.trim()) : [];
  
  // NEW: Smart Portfolio Detection (Handles both old single arrays and new Multi-Vault structures)
  const hasPortfolio = member.portfolio_data && (
    (member.portfolio_data.blocks && member.portfolio_data.blocks.length > 0) || 
    Object.values(member.portfolio_data).some((vault: any) => vault?.blocks && vault.blocks.length > 0)
  );
  
  return (
    <main className="relative w-full min-h-screen bg-offWhite pt-24 pb-32">
      <div className="max-w-[1500px] mx-auto px-2 sm:px-4 md:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-12">
          <Link href="/#team" className="text-xs font-bold uppercase tracking-widest text-matteBlack/50 hover:text-accentBlue transition-colors flex items-center gap-2">
            <span>&larr;</span> Return to Vanguard
          </Link>
        </div>

        {/* The Split Hero Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24">
          
          {/* Left Column: The Portrait */}
          <div className="lg:col-span-5">
            <FadeIn>
              <div className="relative w-full aspect-[4/5] bg-matteBlack rounded-2xl overflow-hidden shadow-2xl border border-matteBlack/10 group">
                {member.image_url ? (
                  <Image 
                    src={member.image_url} 
                    alt={member.name} 
                    fill 
                    className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                )}
                
                {/* Dynamic Freelance Badge & Button */}
                {member.available_for_freelance && (
                  <div className="absolute top-6 right-6">
                    <div className="bg-green-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      Accepting Contracts
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Right Column: The Data Core */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <FadeIn delay={0.2}>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-matteBlack tracking-tighter leading-[1.1] mb-4">
                {member.name}
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-accentBlue uppercase tracking-widest mb-8">
                {member.designation}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-matteBlack/10 mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-matteBlack/40 mb-1">Experience</p>
                  <p className="text-xl font-extrabold text-matteBlack">{member.years_experience}+ Years</p>
                </div>
                {member.specialization && (
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-matteBlack/40 mb-1">Primary Discipline</p>
                    <p className="text-xl font-extrabold text-matteBlack">{member.specialization}</p>
                  </div>
                )}
              </div>

              {member.bio ? (
                <div className="prose prose-lg text-matteBlack/70 font-medium leading-relaxed mb-10 max-w-none">
                  {member.bio.split('\n').map((paragraph: string, i: number) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-lg text-matteBlack/70 font-medium leading-relaxed mb-10">
                  {member.experience_details}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                {member.available_for_freelance && member.email && (
                  <a 
                    href={`mailto:${member.email}?subject=Freelance Inquiry via Advergent Marketers`}
                    className="px-8 py-4 bg-matteBlack text-white text-xs font-extrabold uppercase tracking-widest rounded-sm hover:opacity-90 transition-all shadow-xl"
                  >
                    Hire for Project
                  </a>
                )}
                
                {/* Dynamically Links to the Internal Portfolio Engine */}
                {hasPortfolio && (
                  <Link 
                    href={`/team/${member.id}/portfolio`}
                    className="px-8 py-4 bg-white border border-matteBlack/20 text-matteBlack text-xs font-bold uppercase tracking-widest rounded-sm hover:border-matteBlack transition-all shadow-sm"
                  >
                    View Personal Portfolio
                  </Link>
                )}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* The Grid Architecture (Tech & Brands) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          <FadeIn delay={0.4}>
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-matteBlack/10 h-full">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-matteBlack mb-8 flex items-center gap-3">
                <span className="w-2 h-2 bg-accentBlue rounded-full" /> Software & Arsenal
              </h3>
              {softwareStack.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {softwareStack.map((software: string, index: number) => (
                    <span key={index} className="px-4 py-2 bg-offWhite border border-matteBlack/5 text-matteBlack/80 text-xs font-bold tracking-wider rounded-md">
                      {software}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-matteBlack/40 font-medium">Classified internal stack.</p>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-matteBlack/10 h-full">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-matteBlack mb-8 flex items-center gap-3">
                <span className="w-2 h-2 bg-matteBlack rounded-full" /> Brands Worked With
              </h3>
              {brandsWorkedWith.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {brandsWorkedWith.map((brand: string, index: number) => (
                    <span key={index} className="px-4 py-2 bg-matteBlack text-white text-xs font-bold tracking-wider rounded-md">
                      {brand}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-matteBlack/40 font-medium">Internal agency operations.</p>
              )}
            </div>
          </FadeIn>

        </div>

      </div>
    </main>
  );
}