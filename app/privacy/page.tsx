import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Advergent Marketers',
  description: 'Privacy Policy for the Advergent Marketers website and Advergent Analytics application.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] p-8 md:p-14 shadow-sm border border-slate-100">
        
        {/* Header Section */}
        <div className="mb-12 border-b border-slate-100 pb-8">
          <Link href="/" className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 inline-block hover:text-blue-700 transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-500 font-medium">Effective Date: May 23, 2026</p>
        </div>

        {/* Content Section */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-[15px]">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
            <p>
              Advergent Marketers ("we," "our," or "us") operates both the public-facing website (advergentmarketers.com) and the internal Advergent Analytics mobile application (collectively, the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you interact with our Service, whether as a public visitor or an authorized client.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information Collection for Public Visitors</h2>
            <p className="mb-3">When you visit our public website, we collect information to optimize performance and facilitate communication:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong className="text-slate-800">Analytics & Tracking Data:</strong> We utilize Vercel Analytics and SpeedInsights to anonymously track page views, load speeds, and user behavior. This data helps us improve our website architecture and user experience.</li>
              <li><strong className="text-slate-800">Contact Form Data:</strong> If you utilize our floating contact widget or reach out regarding potential projects, we collect your name, email address, and business details solely for the purpose of professional communication and service proposals.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Information Collection for Authorized Clients</h2>
            <p className="mb-3">For clients utilizing the Advergent Analytics application, we process specific data to provide secure infrastructure and reporting:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong className="text-slate-800">Authentication Data:</strong> We securely process email addresses and encrypted passwords through our backend provider (Supabase) to verify your identity and authorize access to client-specific dashboards.</li>
              <li><strong className="text-slate-800">Device Push Tokens:</strong> We collect and store device push notification tokens to send you important operational updates, such as when a new weekly report or creative asset is available.</li>
              <li><strong className="text-slate-800">Device Permissions:</strong> We request read/write access to your device's storage and media library strictly to allow you to download PDF reports and creative assets directly to your device. We do not scan or access personal files outside of our application.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Third-Party Service Providers</h2>
            <p className="mb-3">We employ highly vetted third-party infrastructure providers to facilitate our Service. They are obligated to protect your data and use it only for agreed-upon tasks:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong className="text-slate-800">Vercel:</strong> Utilized for website hosting, analytics, and speed monitoring.</li>
              <li><strong className="text-slate-800">Supabase:</strong> Utilized for secure user authentication and PostgreSQL database management.</li>
              <li><strong className="text-slate-800">Firebase Cloud Messaging (FCM):</strong> Utilized for the delivery of secure push notifications to mobile devices.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Security of Data</h2>
            <p>
              The security of your data is paramount. We use commercially acceptable means, including encrypted database storage and secure token management, to protect your Personal Data. However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or your data, please contact our support team at: <a href="mailto:support@advergentmarketers.com" className="text-blue-600 font-medium hover:underline">advergentmarketers887@gmail.com</a>
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}