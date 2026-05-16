"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FadeIn } from "../../components/ui/MotionWrapper";
import { createClient } from "../../lib/supabase";

export default function AdminDashboard() {
  // 1. Added "services" to the active tab state
  const [activeTab, setActiveTab] = useState<"clients" | "portfolio" | "roster" | "services">("clients");
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  // 2. Added state to hold the pricing configurations
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      // 3. Added the pricing_config fetch to the Promise.all array
      const [portfolioRes, clientsRes, teamRes, servicesRes] = await Promise.all([
        supabase.from("case_studies").select("id, client_name, hero_metric, is_active").order("created_at", { ascending: false }),
        supabase.from("clients").select("id, client_name, company_name, contact_email, account_balance, is_active").order("created_at", { ascending: false }),
        supabase.from("team_members").select("id, name, designation, email, priority, available_for_freelance").order("priority", { ascending: true }),
        supabase.from("pricing_config").select("id, display_name, category_slug, base_price, base_unit").order("display_name", { ascending: true })
      ]);

      if (portfolioRes.data) setCaseStudies(portfolioRes.data);
      if (clientsRes.data) setClients(clientsRes.data);
      if (teamRes.data) setTeamMembers(teamRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      
      setIsLoading(false);
    };

    fetchDashboardData();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-offWhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          
          {/* HEADER & TABS */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-matteBlack tracking-tight mb-6">Command Center</h1>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-matteBlack/10 pb-4 gap-4">
              <div className="flex flex-wrap gap-6">
                <button 
                  onClick={() => setActiveTab("clients")}
                  className={`text-sm font-bold uppercase tracking-widest pb-4 -mb-[17px] transition-colors ${activeTab === "clients" ? "text-accentBlue border-b-2 border-accentBlue" : "text-matteBlack/40 hover:text-matteBlack"}`}
                >
                  Active Clients
                </button>
                <button 
                  onClick={() => setActiveTab("portfolio")}
                  className={`text-sm font-bold uppercase tracking-widest pb-4 -mb-[17px] transition-colors ${activeTab === "portfolio" ? "text-accentBlue border-b-2 border-accentBlue" : "text-matteBlack/40 hover:text-matteBlack"}`}
                >
                  Public Portfolio
                </button>
                <button 
                  onClick={() => setActiveTab("roster")}
                  className={`text-sm font-bold uppercase tracking-widest pb-4 -mb-[17px] transition-colors ${activeTab === "roster" ? "text-accentBlue border-b-2 border-accentBlue" : "text-matteBlack/40 hover:text-matteBlack"}`}
                >
                  Team Roster
                </button>
                {/* NEW TAB: Services & Pricing */}
                <button 
                  onClick={() => setActiveTab("services")}
                  className={`text-sm font-bold uppercase tracking-widest pb-4 -mb-[17px] transition-colors ${activeTab === "services" ? "text-accentBlue border-b-2 border-accentBlue" : "text-matteBlack/40 hover:text-matteBlack"}`}
                >
                  Services & Pricing
                </button>
              </div>
              
              {/* Dynamic Action Buttons based on the active tab */}
              <div className="flex flex-wrap gap-3">
                {activeTab === "portfolio" && (
                  <Link href="/admin/add-case-study" className="px-6 py-2 bg-matteBlack text-white font-bold rounded-md text-xs uppercase tracking-widest hover:opacity-90 transition shadow-sm text-center">
                    + New Case Study
                  </Link>
                )}
                {activeTab === "clients" && (
                  <Link href="/admin/add-client" className="px-6 py-2 bg-accentBlue text-white font-bold rounded-md text-xs uppercase tracking-widest hover:opacity-90 transition shadow-sm text-center">
                    + Onboard Client
                  </Link>
                )}
                {activeTab === "roster" && (
                  <Link href="/admin/add-member" className="px-6 py-2 bg-matteBlack text-white font-bold rounded-md text-xs uppercase tracking-widest hover:opacity-90 transition shadow-sm text-center">
                    + Add Team Member
                  </Link>
                )}
                
                {/* NEW ACTION BUTTONS: Services & Media */}
                {activeTab === "services" && (
                  <>
                    <Link href="/admin/media" className="px-6 py-2 bg-white border border-matteBlack/10 text-matteBlack font-bold rounded-md text-xs uppercase tracking-widest hover:border-matteBlack/30 transition shadow-sm text-center">
                      Manage Media
                    </Link>
                    <Link href="/admin/services" className="px-6 py-2 bg-accentBlue text-white font-bold rounded-md text-xs uppercase tracking-widest hover:opacity-90 transition shadow-sm text-center">
                      + New Service
                    </Link>
                  </>
                )}

                <button 
                  onClick={async () => {
                    const { createClient } = await import("../../lib/supabase");
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    window.location.href = '/auth';
                  }} 
                  className="px-6 py-2 bg-white border border-matteBlack/10 text-red-500 font-bold rounded-md text-xs uppercase tracking-widest hover:border-red-500/50 hover:bg-red-50 transition shadow-sm text-center"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {isLoading ? (
             <div className="py-20 text-center text-matteBlack/50 font-bold animate-pulse">Syncing Database...</div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-matteBlack/10 overflow-hidden">
              <div className="overflow-x-auto">
                
                {/* TAB 1: CLIENT CRM VIEW */}
                {activeTab === "clients" && (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-matteBlack/5 border-b border-matteBlack/10 text-matteBlack/60 uppercase tracking-wider font-bold text-xs">
                      <tr>
                        <th className="px-6 py-4">Client / Company</th>
                        <th className="px-6 py-4">Contact Email</th>
                        <th className="px-6 py-4">Balance</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-matteBlack/5">
                      {clients.map((client) => (
                        <tr key={client.id} className="hover:bg-offWhite transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-matteBlack block">{client.client_name}</span>
                            <span className="text-xs text-matteBlack/50 font-medium">{client.company_name}</span>
                          </td>
                          <td className="px-6 py-4 text-matteBlack/70 font-medium">{client.contact_email}</td>
                          <td className="px-6 py-4 font-bold text-matteBlack">₹{client.account_balance}</td>
                          <td className="px-6 py-4 text-right space-x-4">
                            <Link href={`/admin/manage-client/${client.id}`} className="text-matteBlack/50 hover:text-accentBlue font-bold text-xs uppercase tracking-widest transition-colors">Manage Dashboard</Link>
                          </td>
                        </tr>
                      ))}
                      {clients.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-12 text-center text-matteBlack/50">No active clients. Time to close some deals!</td></tr>
                      )}
                    </tbody>
                  </table>
                )}

                {/* TAB 2: PORTFOLIO VIEW */}
                {activeTab === "portfolio" && (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-matteBlack/5 border-b border-matteBlack/10 text-matteBlack/60 uppercase tracking-wider font-bold text-xs">
                      <tr>
                        <th className="px-6 py-4">Project</th>
                        <th className="px-6 py-4">Result</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-matteBlack/5">
                      {caseStudies.map((study) => (
                        <tr key={study.id} className="hover:bg-offWhite transition-colors">
                          <td className="px-6 py-4 font-bold text-matteBlack">{study.client_name}</td>
                          <td className="px-6 py-4 text-matteBlack/70">{study.hero_metric}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-sm text-[10px] uppercase tracking-widest font-bold ${study.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {study.is_active ? 'Published' : 'Hidden'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-4">
                            <Link href={`/work/${study.id}`} target="_blank" className="text-matteBlack/50 hover:text-matteBlack font-bold text-xs uppercase tracking-widest">View</Link>
                            <Link href={`/admin/edit/${study.id}`} className="text-matteBlack/50 hover:text-accentBlue font-bold text-xs uppercase tracking-widest transition-colors">Edit</Link>
                          </td>
                        </tr>
                      ))}
                      {caseStudies.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-12 text-center text-matteBlack/50">No case studies found. Create your first one!</td></tr>
                      )}
                    </tbody>
                  </table>
                )}

                {/* TAB 3: TEAM ROSTER VIEW */}
                {activeTab === "roster" && (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-matteBlack/5 border-b border-matteBlack/10 text-matteBlack/60 uppercase tracking-wider font-bold text-xs">
                      <tr>
                        <th className="px-6 py-4">Member</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-matteBlack/5">
                      {teamMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-offWhite transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-matteBlack block flex items-center gap-2">
                              {member.name} 
                              {member.priority === 1 && <span className="px-1.5 py-0.5 bg-matteBlack text-white rounded-full text-[8px] uppercase tracking-widest">Lead</span>}
                            </span>
                            <span className="text-xs text-matteBlack/50 font-medium">{member.designation}</span>
                          </td>
                          <td className="px-6 py-4 text-matteBlack/70 font-medium">{member.email || 'N/A'}</td>
                          <td className="px-6 py-4">
                            {member.available_for_freelance ? (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-sm text-[10px] uppercase tracking-widest font-bold">Available</span>
                            ) : (
                              <span className="px-2 py-1 bg-matteBlack/10 text-matteBlack/60 rounded-sm text-[10px] uppercase tracking-widest font-bold">Internal</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right space-x-4 flex items-center justify-end">
                            <Link 
                              href={`/admin/portfolio-builder/${member.id}`} 
                              className="text-accentBlue hover:text-matteBlack font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              Open Canvas
                            </Link>
                            <Link 
                              href={`/admin/edit-member/${member.id}`} 
                              className="text-matteBlack/50 hover:text-accentBlue font-bold text-xs uppercase tracking-widest transition-colors"
                            >
                              Edit Profile
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {teamMembers.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-12 text-center text-matteBlack/50">Your roster is empty. Onboard your first team member!</td></tr>
                      )}
                    </tbody>
                  </table>
                )}

                {/* TAB 4: SERVICES & PRICING VIEW */}
                {activeTab === "services" && (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-matteBlack/5 border-b border-matteBlack/10 text-matteBlack/60 uppercase tracking-wider font-bold text-xs">
                      <tr>
                        <th className="px-6 py-4">Service Module</th>
                        <th className="px-6 py-4">System ID (Slug)</th>
                        <th className="px-6 py-4">Base Config</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-matteBlack/5">
                      {services.map((service) => (
                        <tr key={service.id} className="hover:bg-offWhite transition-colors">
                          <td className="px-6 py-4 font-bold text-matteBlack text-base">{service.display_name}</td>
                          <td className="px-6 py-4">
                            <span className="bg-matteBlack/5 text-matteBlack/60 px-2 py-1 rounded font-mono text-[10px]">
                              {service.category_slug}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-matteBlack">₹{service.base_price.toLocaleString()}</span>
                            <span className="text-xs text-matteBlack/50 ml-1">/ {service.base_unit}</span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-4">
                            <Link href={`/admin/services/edit/${service.id}`} className="text-matteBlack/50 hover:text-accentBlue font-bold text-xs uppercase tracking-widest transition-colors">
                              Edit
                            </Link>
                            <Link href="/admin/media" className="text-matteBlack/50 hover:text-accentBlue font-bold text-xs uppercase tracking-widest transition-colors">
                              Media
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {services.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-12 text-center text-matteBlack/50">No services configured. Deploy your first one!</td></tr>
                      )}
                    </tbody>
                  </table>
                )}

              </div>
           </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}