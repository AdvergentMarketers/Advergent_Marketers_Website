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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    specialization: "",
    experience_details: "",
    certifications: "",
    years_experience: 0,
    priority: 10,
    available_for_freelance: false,
    image_url: ""
  });

  // Fetch the existing member data
  useEffect(() => {
    const fetchMember = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', memberId)
        .single();

      if (data) {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          designation: data.designation || "",
          specialization: data.specialization || "",
          experience_details: data.experience_details || "",
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
                <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Work Experience Details</label>
                <textarea rows={3} required value={formData.experience_details} onChange={e => setFormData({...formData, experience_details: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Years of Experience</label>
                  <input type="number" required value={formData.years_experience} onChange={e => setFormData({...formData, years_experience: Number(e.target.value)})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" min="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Certifications & Licenses</label>
                  <input type="text" value={formData.certifications} onChange={e => setFormData({...formData, certifications: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-offWhite rounded-xl border border-matteBlack/10">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-matteBlack">Available for Freelance / Consulting?</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.available_for_freelance} onChange={e => setFormData({...formData, available_for_freelance: e.target.checked})} />
                  <div className="w-11 h-6 bg-matteBlack/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accentBlue"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Portrait Image Path</label>
                <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" />
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