import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase-server"; // Used absolute import for stability

// This ensures the auth check happens on every single page load inside /admin
export const dynamic = "force-dynamic"; 

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServer();

  // 1. Fetch the user session
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // Your specific master email from the user summary
  const MASTER_ADMIN_EMAIL = "ginniomen22@gmail.com";

  // 2. The Security Gate
  // If there's an error, no user, or the email doesn't match, kick them to /auth
  if (error || !user || user.email?.toLowerCase() !== MASTER_ADMIN_EMAIL.toLowerCase()) {
    return redirect("/auth");
  }

  // 3. If they pass the test, render the sub-page (like the Service Editor)
  return (
    <div className="admin-container">
      {children}
    </div>
  );
}