"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FadeIn } from "../../../../components/ui/MotionWrapper";
import { createClient } from "../../../../lib/supabase";

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // 1. STATE DECLARED AT THE TOP LEVEL
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
    years_experience: 0,
    priority: 10,
    available_for_freelance: false,
    image_url: ""
  });

  // 2. USE-EFFECT PULLS THE DATA AND UPDATES THE STATE
  useEffect(() => {
    const fetchMember = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', memberId)
        .single();

      if (data) {
        // Notice there is NO "const [formData, setFormData] = useState" here.
        // We are just calling the setter function.
        setFormData({
          name: data.name || "",
          email: data.email || "",
          designation: data.designation || "",
          specialization: data.specialization || "",
          experience_details: data.experience_details || "",
          bio: data.bio || "",
          portfolio_url: data.portfolio_url || "",
          linkedin_url: data.linkedin_url || "",
          twitter_url: data.twitter_url || "",
          github_url: data.github_url || "",
          brands_worked_with: data.brands_worked_with || "",
          software_stack: data.software_stack || "",
          certifications: data.certifications || "",
          years_experience: data.years_experience || 0,
          priority: data.priority || 10,
          available_for_freelance: data.available_for_freelance || false,
          image_url: data.image_url || ""
        });
      }
      setIsLoading(false);
    };
    
    if (memberId) fetchMember();
  }, [memberId, supabase]);

  // ... rest of your code (handleSave, handleDelete, and the return statement)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const payload = {
        ...formData,
        years_experience: Number(formData.years_experience),
        priority: Number(formData.priority)
      };

      const { error } = await supabase.from('team_members').update(payload).eq('id', memberId);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Roster updated successfully!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("WARNING: Are you sure you want to permanently remove this member from the roster?")) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', memberId);
      if (error) throw error;
      router.push('/admin');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen py-20 text-center font-bold animate-pulse text-matteBlack/50">Decrypting Roster Data...</div>;

  return (
    <div className="min-h-screen bg-offWhite py-12 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          
          <div className="flex justify-between items-center mb-8">
            <Link href="/admin" className="text-xs font-bold text-matteBlack/50 hover:text-accentBlue uppercase tracking-widest transition-colors">
              &larr; Back to Command Center
            </Link>
            <button onClick={handleDelete} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors">
              Remove Member
            </button>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-matteBlack/10">
            <div className="mb-10 pb-6 border-b border-matteBlack/10">
              <span className="text-accentBlue font-bold uppercase tracking-widest text-xs mb-2 block">Roster Management</span>
              <h1 className="text-3xl font-extrabold text-matteBlack tracking-tight">Edit {formData.name}</h1>
            </div>

            {message && (
              <div className={`mb-8 p-4 text-sm font-bold rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Full Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Designation</label>
                  <input type="text" required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-accentBlue mb-2">Display Priority</label>
                  <input type="number" required value={formData.priority} onChange={e => setFormData({...formData, priority: Number(e.target.value)})} className="w-full px-4 py-3 bg-accentBlue/10 border border-accentBlue/20 text-accentBlue rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-bold" min="1" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Specialization</label>
                <input type="text" required value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Work Experience (Brief for Homepage Card)</label>
                <textarea rows={2} required value={formData.experience_details} onChange={e => setFormData({...formData, experience_details: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
              </div>

              {/* NEW: Dedicated Profile Page Data */}
              <div className="pt-8 border-t border-matteBlack/10">
                <h3 className="text-xl font-extrabold text-matteBlack mb-6 flex items-center gap-3">
                  <span className="w-4 h-[2px] bg-accentBlue"></span> Dedicated Profile Data
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Full Biography</label>
                    <textarea rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold leading-relaxed" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Brands Worked With (Comma Separated)</label>
                      <input type="text" value={formData.brands_worked_with} onChange={e => setFormData({...formData, brands_worked_with: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Software Stack (Comma Separated)</label>
                      <input type="text" value={formData.software_stack} onChange={e => setFormData({...formData, software_stack: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    
                    {/* NEW: Gateway to the Internal Canvas Builder */}
                    <div className="flex flex-col justify-end">
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Internal Portfolio Engine</label>
                      <Link 
                        href={`/admin/portfolio-builder/${memberId}`}
                        className="w-full flex items-center justify-between px-4 py-3 bg-matteBlack text-white rounded-md hover:bg-accentBlue transition-colors group shadow-sm"
                      >
                        <span className="text-sm font-extrabold uppercase tracking-widest">Launch Canvas Builder</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </Link>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">GitHub / Behance URL</label>
                      <input type="url" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">LinkedIn URL</label>
                      <input type="url" value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">X (Twitter) URL</label>
                      <input type="url" value={formData.twitter_url} onChange={e => setFormData({...formData, twitter_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                    </div>
                  </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">GitHub / Behance URL</label>
                      <input type="url" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">LinkedIn URL</label>
                      <input type="url" value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">X (Twitter) URL</label>
                      <input type="url" value={formData.twitter_url} onChange={e => setFormData({...formData, twitter_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-matteBlack/10">
                <button type="submit" disabled={isSaving} className="w-full py-5 bg-accentBlue text-matteBlack text-sm font-extrabold uppercase tracking-widest rounded-sm hover:opacity-90 transition-all focus:outline-none disabled:opacity-70 shadow-xl">
                  {isSaving ? "Saving..." : "Save Member Profile"}
                </button>
              </div>

            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}