import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | Advergent Marketers',
  description: 'Terms and Conditions for the Advergent Marketers website and Advergent Analytics application.',
};

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] p-8 md:p-14 shadow-sm border border-slate-100">
        
        {/* Header Section */}
        <div className="mb-12 border-b border-slate-100 pb-8">
          <Link href="/" className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 inline-block hover:text-blue-700 transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Terms & Conditions</h1>
          <p className="text-slate-500 font-medium">Effective Date: May 23, 2026</p>
        </div>

        {/* Content Section */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-[15px]">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms & Two-Tiered Access</h2>
            <p>
              By accessing the Advergent Marketers website or the Advergent Analytics application (collectively, "the Service"), you agree to be bound by these Terms and Conditions. Our Service operates on a two-tiered model: public-facing informational pages for general visitors, and a secure, restricted portal exclusively for active clients and authorized personnel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Public Website Use & Intellectual Property</h2>
            <p className="mb-3">For users browsing our public website and portfolio:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>All content, including but not limited to text, logos, case studies, interactive UI components, and visual assets, are the exclusive intellectual property of Advergent Marketers.</li>
              <li>You agree not to scrape, copy, reverse-engineer, or maliciously attack the website's infrastructure.</li>
              <li>Portfolio items may not be reused, distributed, or claimed as your own work under any circumstances.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Client Portal Access and Security</h2>
            <p className="mb-3">Access to the Advergent Analytics app is restricted to users provisioned by our administrative team:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>You are responsible for maintaining the strict confidentiality of your login credentials.</li>
              <li>You agree not to share your account access or internal data with unauthorized third parties.</li>
              <li>We reserve the right to suspend or terminate your access at any time if you breach these terms or upon the conclusion of your professional engagement with Advergent Marketers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Use of Internal Content and Deliverables</h2>
            <p className="mb-3">The App provides active clients access to proprietary analytics, weekly reports, and creative assets (the "Deliverables").</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>You may download these Deliverables to your local device for authorized business use.</li>
              <li>The intellectual property rights of unapproved or draft creative assets remain solely with Advergent Marketers until officially released and transferred as per your overarching master service agreement.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Push Notifications</h2>
            <p>
              By logging into the App and accepting notification permissions, you consent to receive push notifications regarding critical updates, report availability, and operational communication from our team. You may opt out of these notifications at any time through your device's operating system settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Limitation of Liability</h2>
            <p>
              The Service and its content are provided on an "as is" basis. While we strive for absolute accuracy in our analytics, reporting, and portfolio data, Advergent Marketers shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the Service, or from any business decisions made based on the data presented.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Contact Information</h2>
            <p>
              For legal inquiries, technical support, or questions regarding these terms, please contact: <a href="mailto:support@advergentmarketers.com" className="text-blue-600 font-medium hover:underline">advergentmarketers887@gmail.com</a>
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}