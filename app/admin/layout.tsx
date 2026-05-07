import { redirect } from "next/navigation";
import { createServer } from "../../lib/supabase-server";

// 🚀 THIS IS THE MAGIC BULLET: It prevents Next.js from caching the "Kick Out" redirect
export const dynamic = "force-dynamic"; 

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServer();

  const { data: { user }, error } = await supabase.auth.getUser();
  const MASTER_ADMIN_EMAIL = "ginniomen22@gmail.com";

  if (error || !user || user.email?.toLowerCase() !== MASTER_ADMIN_EMAIL.toLowerCase()) {
    redirect("/auth");
  }

  return <>{children}</>;
}