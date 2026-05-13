"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FadeIn } from "../../../components/ui/MotionWrapper";
import { createClient } from "../../../lib/supabase";

export default function AddMemberPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    specialization: "",
    experience_details: "",
    bio: "",
    portfolio_url: "",
    linkedin_url: "",
    twitter_url: "",
    github_url: "",
    brands_worked_with: "",
    software_stack: "",
    certifications: "",
    years_experience: "0",
    priority: "10", 
    available_for_freelance: false,
    image_url: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const payload = {
        ...formData,
        years_experience: parseInt(formData.years_experience) || 0,
        priority: parseInt(formData.priority) || 10 
      };

      const { error } = await supabase.from('team_members').insert([payload]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Team member successfully deployed to the roster!' });
      
      setTimeout(() => {
        router.push('/admin');
      }, 1500);

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "Failed to add team member." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offWhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          
          <div className="mb-8">
            <Link href="/admin" className="text-xs font-bold text-matteBlack/50 hover:text-accentBlue uppercase tracking-widest transition-colors">
              &larr; Back to Command Center
            </Link>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-matteBlack/10">
            <div className="mb-10 pb-6 border-b border-matteBlack/10">
              <span className="text-accentBlue font-bold uppercase tracking-widest text-xs mb-2 block">Roster Expansion</span>
              <h1 className="text-3xl font-extrabold text-matteBlack tracking-tight">Onboard Team Member</h1>
            </div>

            {message && (
              <div className={`mb-8 p-4 text-sm font-bold rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Email Address *</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="jane@advergentmarketers.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Designation *</label>
                  <input type="text" required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="Lead UI Engineer" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-accentBlue mb-2">Display Priority *</label>
                  <input type="number" required value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full px-4 py-3 bg-accentBlue/10 border border-accentBlue/20 text-accentBlue rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-bold" min="1" title="1 is highest priority (shown first)" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Specialization</label>
                <input type="text" required value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="SEO, React, Node.js" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Work Experience (Brief for Homepage Card)</label>
                <textarea rows={2} required value={formData.experience_details} onChange={e => setFormData({...formData, experience_details: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="Led e-commerce scaling at X..." />
              </div>

              {/* NEW: Dedicated Profile Page Data */}
              <div className="pt-8 border-t border-matteBlack/10">
                <h3 className="text-xl font-extrabold text-matteBlack mb-6 flex items-center gap-3">
                  <span className="w-4 h-[2px] bg-accentBlue"></span> Dedicated Profile Data
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Full Biography</label>
                    <textarea rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold leading-relaxed" placeholder="Write their full professional story here..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Brands Worked With (Comma Separated)</label>
                      <input type="text" value={formData.brands_worked_with} onChange={e => setFormData({...formData, brands_worked_with: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="Nike, Apple, Sony, Tesla" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Software Stack (Comma Separated)</label>
                      <input type="text" value={formData.software_stack} onChange={e => setFormData({...formData, software_stack: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="Photoshop, Figma, Premiere Pro, VS Code" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">GitHub / Behance URL</label>
                      <input type="url" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">LinkedIn URL</label>
                      <input type="url" value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">X (Twitter) URL</label>
                      <input type="url" value={formData.twitter_url} onChange={e => setFormData({...formData, twitter_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="https://..." />
                    </div>
                  </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">GitHub / Behance URL</label>
                      <input type="url" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">LinkedIn URL</label>
                      <input type="url" value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">X (Twitter) URL</label>
                      <input type="url" value={formData.twitter_url} onChange={e => setFormData({...formData, twitter_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="https://..." />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Portrait Image Path</label>
                <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="/team-member.jpg" />
                <p className="text-[10px] font-bold text-matteBlack/40 mt-2 uppercase tracking-widest">
                  Drop your image into the Next.js "public" folder and type the file name here (e.g., /guninder.png)
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-matteBlack/10">
                <button type="submit" disabled={isLoading} className="w-full py-5 bg-accentBlue text-matteBlack text-sm font-extrabold uppercase tracking-widest rounded-sm hover:opacity-90 transition-all focus:outline-none disabled:opacity-70 shadow-xl">
                  {isLoading ? "Adding to Roster..." : "Publish Team Member"}
                </button>
              </div>

            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}