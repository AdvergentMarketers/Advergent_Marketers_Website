"use client";

import { useState } from "react";
import { FadeIn } from "../../components/ui/MotionWrapper";
import { createClient } from "../../lib/supabase";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // NEW: Separate state for Google
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const supabase = createClient();

  // NEW: The Google OAuth Handler
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Routes back to your new Next.js callback API
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("OAuth Error:", error.message);
      setMessage({ type: 'error', text: error.message || "Failed to initialize Google login." });
      setIsGoogleLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string).trim(); 
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        if (email.toLowerCase() === "ginniomen22@gmail.com") {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
        
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        
        if (email.toLowerCase() === "ginniomen22@gmail.com") {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (error: any) {
      console.error("AUTH FAILED:", error);
      const errorMessage = error?.message || error?.error_description || "Invalid credentials. Please try again.";
      setMessage({ type: 'error', text: errorMessage });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <FadeIn className="w-full max-w-md space-y-8">
        
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-matteBlack tracking-tight">
            {isLogin ? "Sign in to your account" : "Join the ecosystem"}
          </h2>
          <p className="mt-2 text-sm text-matteBlack/60 font-medium">
            {isLogin ? "Or " : "Already have an account? "}
            <button type="button" onClick={() => { setIsLogin(!isLogin); setMessage(null); }} className="font-bold text-accentBlue hover:text-accentBlue/80 transition-colors focus:outline-none">
              {isLogin ? "create a new account" : "sign in here"}
            </button>
          </p>
        </div>

        {message && (
          <div className={`p-4 text-sm font-semibold rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message.text}
          </div>
        )}

        {/* UPDATED: Fully Functional Google Button */}
        <div className="mt-8">
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-matteBlack/20 rounded-md shadow-sm bg-white text-sm font-semibold text-matteBlack hover:bg-offWhite transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-matteBlack disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </button>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-matteBlack/10" /></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-matteBlack/50 font-medium">Or continue with email</span></div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleAuth}>
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-matteBlack">Full Name</label>
              <div className="mt-1"><input id="name" name="name" type="text" required={!isLogin} className="appearance-none block w-full px-3 py-3 border border-matteBlack/20 rounded-md shadow-sm placeholder-matteBlack/40 focus:outline-none focus:ring-accentBlue focus:border-accentBlue sm:text-sm" placeholder="John Doe" /></div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-matteBlack">Email address</label>
            <div className="mt-1"><input id="email" name="email" type="email" required className="appearance-none block w-full px-3 py-3 border border-matteBlack/20 rounded-md shadow-sm placeholder-matteBlack/40 focus:outline-none focus:ring-accentBlue focus:border-accentBlue sm:text-sm" placeholder="you@example.com" /></div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-matteBlack">Password</label>
            <div className="mt-1 relative">
              <input id="password" name="password" type={showPassword ? "text" : "password"} required className="appearance-none block w-full px-3 py-3 border border-matteBlack/20 rounded-md shadow-sm placeholder-matteBlack/40 focus:outline-none focus:ring-accentBlue focus:border-accentBlue sm:text-sm" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-matteBlack/40 hover:text-matteBlack">
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <button type="submit" disabled={isLoading || isGoogleLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-matteBlack hover:bg-matteBlack/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-matteBlack active:scale-[0.98] disabled:opacity-70">
              {isLoading ? "Authenticating..." : (isLogin ? "Sign in" : "Create account")}
            </button>
          </div>
        </form>
      </FadeIn>
    </div>
  );
}