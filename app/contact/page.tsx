"use client";

import { useState } from "react";
import { FadeIn } from "../../components/ui/MotionWrapper"; 
import { useCurrency } from "../../components/providers/CurrencyProvider";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 1. NEW: We need a state object to actually store what the user types!
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    budget: "",
    bottleneck: ""
  });
  
  const { formatPrice } = useCurrency();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send the payload to our new backend route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
      } else {
        console.error("Transmission failed:", result.error);
        alert("Failed to send the application. Please try again or email us directly.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-offWhite pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <FadeIn>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* LEFT COLUMN: Authority & Direct Info */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-accentBlue font-bold tracking-widest uppercase text-sm mb-6 block">
                  Initiate Protocol
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-matteBlack tracking-tight mb-8 leading-none">
                  Let's build <br/><span className="text-matteBlack/40">the future.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-matteBlack/80 leading-relaxed font-medium mb-12">
                  Submit your ecosystem details. Our strategic team will audit your current architecture and reach out within 24 hours to schedule an exclusive discovery session.
                </p>
              </div>

              <div className="space-y-8 border-t border-matteBlack/10 pt-10">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-matteBlack/40 mb-2">Direct Inquiry</h4>
                  <a href="mailto:advergentmarketers887@gmail.com" className="text-xl font-bold text-matteBlack hover:text-accentBlue transition-colors">
                    advergentmarketers887@gmail.com
                  </a>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-matteBlack/40 mb-2">Operations Base</h4>
                  <p className="text-lg font-bold text-matteBlack">Global Remote</p>
                  <p className="text-sm text-matteBlack/60 font-medium">Bathinda, Punjab, India</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: The Lead Qualification Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 md:p-12 rounded-3xl border border-matteBlack/5 shadow-xl">
                
                {isSubmitted ? (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-accentBlue/20 text-accentBlue rounded-full flex items-center justify-center mb-8">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-extrabold text-matteBlack mb-4">Application Received.</h3>
                    <p className="text-matteBlack/70 font-medium text-lg max-w-md">
                      We are reviewing your ecosystem data. Check your inbox; our lead strategist will be in touch shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Full Name *</label>
                        {/* NEW: Added value and onChange to bind to state */}
                        <input 
                          type="text" 
                          required 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-0 py-3 bg-transparent border-b-2 border-matteBlack/10 focus:border-accentBlue focus:outline-none transition-colors text-lg text-matteBlack font-medium placeholder-matteBlack/20" 
                          placeholder="Tony Stark" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Work Email *</label>
                        <input 
                          type="email" 
                          required 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-0 py-3 bg-transparent border-b-2 border-matteBlack/10 focus:border-accentBlue focus:outline-none transition-colors text-lg text-matteBlack font-medium placeholder-matteBlack/20" 
                          placeholder="tony@starkindustries.com" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Brand / Website URL *</label>
                      <input 
                        type="url" 
                        required 
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full px-0 py-3 bg-transparent border-b-2 border-matteBlack/10 focus:border-accentBlue focus:outline-none transition-colors text-lg text-matteBlack font-medium placeholder-matteBlack/20" 
                        placeholder="https://yourbrand.com" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Monthly Marketing Budget</label>
                      {/* NEW: Removed the buggy 'selected' attribute on the option, bound value to state */}
                      <select 
                        required 
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        className="w-full px-0 py-3 bg-transparent border-b-2 border-matteBlack/10 focus:border-accentBlue focus:outline-none transition-colors text-lg text-matteBlack font-medium cursor-pointer"
                      >
                        <option value="" disabled>Select an option...</option>
                        <option value="under10k">Under {formatPrice(10000)}</option>
                        <option value="10k-20k">{formatPrice(10000)} - {formatPrice(20000)}</option>
                        <option value="20k-50k">{formatPrice(20000)} - {formatPrice(50000)}</option>
                        <option value="50k-1L">{formatPrice(50000)} - {formatPrice(100000)}</option>
                        <option value="custom">{formatPrice(100000)}+ / Custom Enterprise</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">What is your biggest growth bottleneck? *</label>
                      <textarea 
                        rows={4} 
                        required 
                        value={formData.bottleneck}
                        onChange={(e) => setFormData({...formData, bottleneck: e.target.value})}
                        className="w-full px-0 py-3 bg-transparent border-b-2 border-matteBlack/10 focus:border-accentBlue focus:outline-none transition-colors text-lg text-matteBlack font-medium placeholder-matteBlack/20 resize-none" 
                        placeholder="e.g., We are getting traffic, but our CAC is too high and our creatives are fatiguing..." 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-5 bg-matteBlack text-white text-sm font-extrabold uppercase tracking-widest rounded-sm hover:bg-accentBlue hover:text-matteBlack transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? "Encrypting & Sending..." : "Submit Application"}
                    </button>

                  </form>
                )}
              </div>
            </div>

          </div>
        </FadeIn>
      </div>
    </div>
  );
}