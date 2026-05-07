import { createServer } from "../../../lib/supabase-server";
import { headers } from "next/headers";
import Link from "next/link";
import DesktopCaseStudy from "./DesktopCaseStudy";
import MobileCaseStudy from "./MobileCaseStudy";

export const revalidate = 60;

export default async function CaseStudyDeepDive({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; 
  const supabase = await createServer(); // 2. Update to await createServer()

  // 1. Fetch the data once
  const { data: project, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("id", resolvedParams.id) 
    .single();

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-offWhite px-4 text-center">
        <h1 className="text-2xl font-bold text-matteBlack mb-4">Case Study Not Found</h1>
        <Link href="/work" className="text-accentBlue font-bold hover:underline">Return to Portfolio</Link>
      </div>
    );
  }

  // 2. Detect the user's device via headers
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

  // 3. Render the completely separate UI files
  if (isMobile) {
    return <MobileCaseStudy project={project} />;
  }
  
  return <DesktopCaseStudy project={project} />;
}