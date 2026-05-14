import Link from "next/link";

export default function ServicesShowcase() {
  return (
    <div className="min-h-screen bg-offWhite text-matteBlack selection:bg-accentBlue selection:text-white pb-24">
      
      {/* SECTION 1: HERO */}
      <section className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase">
          End-to-End <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentBlue to-blue-600">
            Digital Execution.
          </span>
        </h1>
        <p className="text-lg md:text-xl font-semibold text-matteBlack/60 max-w-2xl mx-auto">
          From pure branding to conversion-heavy e-commerce. We operate on strict project milestones, transparent pricing, and relentless quality.
        </p>
      </section>

      {/* SECTION 2: INDIVIDUAL SERVICES (A La Carte) */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto py-16">
        <div className="flex items-center gap-4 border-b border-matteBlack/10 pb-4 mb-12">
          <span className="w-3 h-[2px] bg-accentBlue" />
          <h3 className="text-xl font-extrabold uppercase tracking-widest">Individual Services</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard 
            title="Video Editing" 
            desc="Podcasts, dynamic reels, and high-end SaaS UI motion graphics." 
            startingPrice="₹1,000 / min" 
          />
          <ServiceCard 
            title="Graphic Design" 
            desc="Minimalist posters, 5-slide carousels, and premium 3D manipulations." 
            startingPrice="₹1,000 / graphic" 
          />
          <ServiceCard 
            title="UI/UX Design" 
            desc="Wireframes, high-fidelity visual design, and interactive Figma prototypes." 
            startingPrice="₹1,000 / screen" 
          />
          <ServiceCard 
            title="Website Development" 
            desc="Custom Node.js stacks, robust Shopify e-commerce, and WordPress." 
            startingPrice="₹1,000 / page" 
          />
          <ServiceCard 
            title="Brand Identity" 
            desc="Combination logos, wordmarks, pictorials, and full brand guidelines." 
            startingPrice="₹3,000 / logo" 
          />
          <ServiceCard 
            title="Amazon Optimization" 
            desc="Basic listing setups and Premium A+ Enhanced Brand Content." 
            startingPrice="₹1,000 / product" 
          />
        </div>
      </section>

      {/* SECTION 3: BUNDLED SERVICES */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto py-16">
        <div className="flex items-center gap-4 border-b border-matteBlack/10 pb-4 mb-12">
          <span className="w-3 h-[2px] bg-red-500" />
          <h3 className="text-xl font-extrabold uppercase tracking-widest">Agency Packages</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bundle 1: Brand Setup */}
          <div className="p-8 md:p-12 bg-white border border-matteBlack/10 rounded-2xl shadow-xl hover:border-accentBlue transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-matteBlack text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-bl-xl">
              One-Time Project
            </div>
            <h4 className="text-3xl font-extrabold uppercase tracking-tight mb-2">The Complete Brand Setup</h4>
            <p className="text-sm font-semibold text-matteBlack/50 mb-8">Complete brand creation from zero to launch.</p>
            
            <ul className="space-y-4 mb-12 font-semibold text-sm">
              <li className="flex items-center gap-3"><CheckIcon /> Professional Logo Design</li>
              <li className="flex items-center gap-3"><CheckIcon /> Full Brand Guidelines</li>
              <li className="flex items-center gap-3"><CheckIcon /> 10 Launch Graphics / Posters</li>
              <li className="flex items-center gap-3 text-matteBlack/50">Upgrade available for E-Commerce & Reels</li>
            </ul>
            
            <Link href="/estimate" className="block text-center w-full py-4 bg-offWhite border border-matteBlack/10 text-matteBlack text-xs font-extrabold uppercase tracking-widest rounded hover:bg-matteBlack hover:text-white transition-all">
              Configure & Price
            </Link>
          </div>

          {/* Bundle 2: Social Media */}
          <div className="p-8 md:p-12 bg-matteBlack text-white rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-accentBlue text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-bl-xl">
              Monthly Retainer
            </div>
            <h4 className="text-3xl font-extrabold uppercase tracking-tight mb-2">Monthly Social Media Management</h4>
            <p className="text-sm font-semibold text-white/50 mb-8">Outsourced marketing. We manage your content.</p>
            
            <ul className="space-y-4 mb-12 font-semibold text-sm text-white/80">
              <li className="flex items-center gap-3"><CheckIcon color="text-accentBlue" /> 4 to 8 Dynamic Reels per month</li>
              <li className="flex items-center gap-3"><CheckIcon color="text-accentBlue" /> 12 to 20 Premium Posters</li>
              <li className="flex items-center gap-3"><CheckIcon color="text-accentBlue" /> Meta & Google Ads Management</li>
              <li className="flex items-center gap-3"><CheckIcon color="text-accentBlue" /> Weekly Analytics Reporting</li>
            </ul>
            
            <Link href="/estimate" className="block text-center w-full py-4 bg-accentBlue text-white text-xs font-extrabold uppercase tracking-widest rounded hover:opacity-90 transition-all shadow-lg">
              Configure & Price
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: CUSTOM ESTIMATE CTA */}
      <section className="px-6 lg:px-12 max-w-5xl mx-auto py-24">
        <div className="bg-gradient-to-br from-matteBlack to-gray-900 rounded-[2rem] p-12 md:p-20 text-center shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight mb-6">
            Need a Specific Solution?
          </h2>
          <p className="text-lg font-semibold text-white/70 mb-10 max-w-2xl mx-auto">
            Use our interactive pricing engine to build a custom scope of work tailored exactly to your brand's requirements. Get a live estimate instantly.
          </p>
          <Link 
            href="/estimate" 
            className="inline-block px-12 py-5 bg-white text-matteBlack text-sm font-extrabold uppercase tracking-widest rounded shadow-xl hover:bg-accentBlue hover:text-white transition-all duration-300"
          >
            Get Estimate Pricing
          </Link>
        </div>
      </section>

      {/* THE 95% DISCLAIMER */}
      <section className="px-6 max-w-3xl mx-auto text-center pb-12 opacity-60">
        <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
          * Note: All prices generated by our interactive estimator are 95% accurate baseline estimates. Final project scoping, custom add-ons, and technical requirements may slightly adjust the final quote. You must contact our team and sign an official SOW (Scope of Work) to lock in your pricing.
        </p>
      </section>
    </div>
  );
}

// Reusable UI Components
function ServiceCard({ title, desc, startingPrice }: { title: string, desc: string, startingPrice: string }) {
  return (
    <div className="group p-8 bg-white border border-matteBlack/5 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <h4 className="text-lg font-extrabold uppercase tracking-widest mb-3 group-hover:text-accentBlue transition-colors">{title}</h4>
      <p className="text-sm font-semibold text-matteBlack/60 mb-6 line-clamp-2">{desc}</p>
      <div className="flex items-center justify-between border-t border-matteBlack/5 pt-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-matteBlack/40">Starting At</span>
        <span className="text-sm font-extrabold">{startingPrice}</span>
      </div>
    </div>
  );
}

function CheckIcon({ color = "text-matteBlack" }: { color?: string }) {
  return (
    <svg className={`w-4 h-4 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}