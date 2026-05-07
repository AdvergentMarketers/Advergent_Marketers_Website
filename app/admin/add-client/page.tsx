"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FadeIn } from "../../../components/ui/MotionWrapper";

export default function OnboardClientPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Form State
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [password, setPassword] = useState(""); // <-- NEW: Password State
  const [accountBalance, setAccountBalance] = useState("0");
  const [nextInvoiceDate, setNextInvoiceDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Send the data to our secure backend API route
      const response = await fetch('/api/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          companyName,
          contactEmail,
          password,
          accountBalance,
          nextInvoiceDate
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to onboard client');
      }

      setMessage({ type: 'success', text: 'Account created! Client ecosystem successfully deployed.' });
      
      // Redirect back to the command center after a brief delay
      setTimeout(() => {
        router.push('/admin');
      }, 1500);

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
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
              <span className="text-accentBlue font-bold uppercase tracking-widest text-xs mb-2 block">Protocol Initiation</span>
              <h1 className="text-3xl font-extrabold text-matteBlack tracking-tight">Onboard New Client</h1>
              <p className="text-sm text-matteBlack/60 font-medium mt-2">
                This will automatically generate their Auth account and deploy their ecosystem dashboard. You can securely hand off these credentials.
              </p>
            </div>

            {message && (
              <div className={`mb-8 p-4 text-sm font-bold rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Client Full Name *</label>
                  <input type="text" required value={clientName} onChange={e => setClientName(e.target.value)} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="Tony Stark" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Company / Brand *</label>
                  <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="Stark Industries" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Contact Email (Login ID) *</label>
                  <input type="email" required value={contactEmail} onChange={e => setContactEmail(e.target.value.trim())} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="tony@starkindustries.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Initial Password *</label>
                  <input type="text" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="Auto-generated or custom" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-matteBlack/5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Initial Invoice / Balance (INR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 font-bold text-matteBlack/50">₹</span>
                    <input type="number" required value={accountBalance} onChange={e => setAccountBalance(e.target.value)} className="w-full pl-8 pr-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-matteBlack/60 mb-2">Next Invoice Date</label>
                  <input type="date" value={nextInvoiceDate} onChange={e => setNextInvoiceDate(e.target.value)} className="w-full px-4 py-3 bg-offWhite border border-matteBlack/10 rounded-md focus:ring-2 focus:ring-accentBlue text-sm font-semibold text-matteBlack/80" />
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-matteBlack/10">
                <button type="submit" disabled={isLoading} className="w-full py-5 bg-accentBlue text-matteBlack text-sm font-extrabold uppercase tracking-widest rounded-sm hover:opacity-90 transition-all focus:outline-none disabled:opacity-70 shadow-xl">
                  {isLoading ? "Deploying Ecosystem..." : "Deploy Client Ecosystem"}
                </button>
              </div>

            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}