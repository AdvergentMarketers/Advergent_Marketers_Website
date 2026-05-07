import Link from "next/link";
import { FadeIn } from "../../components/ui/MotionWrapper"; // Adjust path if needed

export const metadata = {
  title: "Our Mechanisms | Advergent Marketers",
  description: "High-conversion digital architectures and growth ecosystems.",
};

export default function ServicesPage() {
  const pillars = [
    {
      id: "01",
      title: "Paid Media & Acquisition",
      oneLiner: "We don't buy clicks; we engineer profitable customer acquisition at scale.",
      description: "Data-driven traffic generation designed to lower Customer Acquisition Cost (CAC) and maximize bottom-line ROI.",
      services: ["Performance Marketing", "Meta Ads (A/B Testing)", "Google Ads (SEM)", "Search Engine Optimization (SEO)"],
      deliverables: ["Dynamic ROAS Optimization", "Granular Audience Targeting", "Algorithmic Bidding Strategies", "Technical SEO Audits"],
    },
    {
      id: "02",
      title: "Creative & Brand Identity",
      oneLiner: "Scroll-stopping creative rooted in psychological conversion principles.",
      description: "We build visual ecosystems that position your brand as an undisputed premium authority in your specific niche.",
      services: ["Comprehensive Branding", "Cinematic Video Editing", "High-End Graphic Design", "Logo & Identity Design"],
      deliverables: ["Direct-Response Video Ads", "Visual Identity Systems", "Rapid Creative Testing Frameworks", "Conversion-Optimized Posters"],
    },
    {
      id: "03",
      title: "Digital Infrastructure",
      oneLiner: "High-performance digital real estate designed to convert attention into capital.",
      description: "From custom-coded web applications to daily audience nurturing, we build the foundations your traffic lands on.",
      services: ["Custom Web Dev (MERN)", "E-Commerce (Shopify/Woo)", "CMS Sites (Wix/WordPress)", "Social Media Management"],
      deliverables: ["Lightning-Fast Page Speeds", "Frictionless UI/UX", "Community Cultivation", "Strategic Content Calendars"],
    }
  ];

  return (
    <div className="min-h-screen bg-offWhite pt-24 pb-32">
      
      {/* THE MANIFESTO HERO */}
      <header className="px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto mb-32 text-center md:text-left">
        <FadeIn>
          <span className="text-accentBlue font-bold tracking-widest uppercase text-sm mb-6 block">
            Our Philosophy
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-matteBlack tracking-tight leading-tight mb-10">
            Marketing is not an expense. <br className="hidden md:block" />
            <span className="text-matteBlack/40">It is an engineered ecosystem.</span>
          </h1>
          <div className="w-20 h-1 bg-accentBlue mb-10 mx-auto md:mx-0"></div>
          <p className="text-xl md:text-2xl text-matteBlack/80 leading-relaxed font-medium max-w-3xl">
            At Advergent Marketers, we reject vanity metrics and superficial aesthetics. We build high-conversion digital architectures that turn raw attention into measurable, scalable revenue.
          </p>
        </FadeIn>
      </header>

      {/* THE PILLARS */}
      <div className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-24">
        {pillars.map((pillar, index) => (
          <FadeIn key={pillar.id}>
            <div className="group bg-white rounded-3xl p-8 md:p-16 border border-matteBlack/5 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
              
              {/* Background Accent Number */}
              <div className="absolute -right-8 -top-12 text-[15rem] font-extrabold text-matteBlack/[0.02] pointer-events-none transition-transform duration-700 group-hover:scale-110">
                {pillar.id}
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                
                {/* Left Column: Vision */}
                <div>
                  <span className="inline-block px-4 py-2 bg-matteBlack text-accentBlue text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                    Pillar {pillar.id}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-matteBlack tracking-tight mb-6">
                    {pillar.title}
                  </h2>
                  <p className="text-2xl text-matteBlack/90 font-medium mb-4 leading-snug">
                    {pillar.oneLiner}
                  </p>
                  <p className="text-matteBlack/60 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Right Column: Execution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:pt-16">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-matteBlack/40 mb-4 flex items-center gap-2">
                      <span className="w-4 h-[2px] bg-accentBlue"></span> Core Services
                    </h3>
                    <ul className="space-y-3">
                      {pillar.services.map((service, i) => (
                        <li key={i} className="text-matteBlack font-bold text-sm md:text-base">
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-matteBlack/40 mb-4 flex items-center gap-2">
                      <span className="w-4 h-[2px] bg-red-500"></span> Deliverables
                    </h3>
                    <ul className="space-y-3">
                      {pillar.deliverables.map((deliv, i) => (
                        <li key={i} className="text-matteBlack/70 font-medium text-sm md:text-base">
                          — {deliv}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* FOOTER CTA */}
      <FadeIn>
        <div className="mt-32 text-center px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold text-matteBlack mb-8">Ready to scale your ecosystem?</h2>
          <Link href="/contact" className="inline-block px-10 py-5 bg-accentBlue text-matteBlack text-lg font-extrabold uppercase tracking-widest rounded-sm hover:scale-105 transition-transform duration-300 shadow-xl">
            Apply for a Strategy Session
          </Link>
        </div>
      </FadeIn>

    </div>
  );
}