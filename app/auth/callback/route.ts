import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/admin';

  if (code) {
    // THE FIX: We must 'await' the cookies object before using it
    const cookieStore = await cookies();
    
    // Initialize the server-side Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    // Exchange the Google code for a secure session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Login successful! Redirect to the admin dashboard
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Session Exchange Error:", error);
    }
  }

  // If something fails, return the user to the login page with an error
  return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
}