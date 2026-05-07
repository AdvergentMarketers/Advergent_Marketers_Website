import { createClient } from "../../lib/supabase"; // Adjust path to point back to root lib/
import { FadeIn } from "../../components/ui/MotionWrapper"; // Adjust path
import ProjectCard from "../../components/ui/ProjectCard"; // Adjust path

const supabase = createClient();
export const revalidate = 60; // Keep the page fast but fresh

export const metadata = {
  title: "Our Work | Advergent Marketers",
  description: "Explore the case studies and ROI-driven results we've delivered for our partners.",
};

export default async function WorkPage() {
  // Fetch case studies from the new database table
  const { data: caseStudies, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq('is_active', true)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offWhite">
        <p className="text-red-500 font-bold">Error loading portfolio: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offWhite pt-24 pb-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Portfolio Header */}
        <FadeIn className="mb-20 text-center md:text-left">
          <span className="text-accentBlue font-bold tracking-widest uppercase text-sm mb-4 block">
            The Proof
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-matteBlack tracking-tight">
            We don't sell services.<br />
            <span className="text-matteBlack/40">We engineer results.</span>
          </h1>
          <p className="mt-6 text-xl text-matteBlack/70 max-w-2xl font-medium">
            Explore the data-driven campaigns and exact methodologies we use to scale modern brands to the next level.
          </p>
        </FadeIn>

        {/* Dynamic Project Grid */}
        {caseStudies && caseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((project, index) => (
              <FadeIn key={project.id} delay={index * 0.1}>
                <ProjectCard project={project} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-matteBlack/10 shadow-sm">
            <h3 className="text-2xl font-extrabold text-matteBlack mb-2">No active campaigns found.</h3>
            <p className="text-matteBlack/60">Log into the Command Center to publish your first client win.</p>
          </div>
        )}

      </div>
    </div>
  );
}