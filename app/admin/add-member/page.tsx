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
    email: "", // <-- NEW: Email State
    designation: "",
    specialization: "",
    experience_details: "",
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
                <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Work Experience Details (Brief)</label>
                <textarea rows={3} required value={formData.experience_details} onChange={e => setFormData({...formData, experience_details: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="Led e-commerce scaling at X, handled $500k ad spend at Y..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Years of Experience</label>
                  <input type="number" required value={formData.years_experience} onChange={e => setFormData({...formData, years_experience: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" min="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Certifications & Licenses</label>
                  <input type="text" value={formData.certifications} onChange={e => setFormData({...formData, certifications: e.target.value})} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="AWS Certified, Google Ads Expert..." />
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-offWhite rounded-xl border border-matteBlack/10">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-matteBlack">Available for Freelance / Consulting?</h4>
                  <p className="text-xs font-medium text-matteBlack/60 mt-1">If enabled, a "Hire Me" button will appear on their profile card.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.available_for_freelance} onChange={e => setFormData({...formData, available_for_freelance: e.target.checked})} />
                  <div className="w-11 h-6 bg-matteBlack/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accentBlue"></div>
                </label>
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