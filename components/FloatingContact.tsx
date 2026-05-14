import Link from "next/link";

export default function FloatingContact() {
  return (
    <Link 
      href="mailto:contact@advergent.com" // Update this to your actual lead email or contact page route
      className="fixed bottom-8 right-8 z-[9999] bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
    >
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      
      {/* Tooltip that slides out on hover */}
      <span className="absolute right-16 bg-white text-blue-600 text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-blue-100">
        Contact Us
      </span>
    </Link>
  );
}