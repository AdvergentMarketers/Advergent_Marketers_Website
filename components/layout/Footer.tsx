import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-offWhite border-t border-matteBlack/10 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            {/* Replace /logo.png with your exact filename in the public folder */}
            <Image 
              src="/logo.svg" 
              alt="Advergent Marketers" 
              width={100} 
              height={24} 
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="mt-4 text-sm text-matteBlack/70 max-w-sm leading-relaxed font-medium">
              A premium digital growth agency engineering high-conversion architectures and scalable ecosystems.
            </p>
          </div>

          {/* Agency Links */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-matteBlack mb-6">Agency</h3>
            <ul className="space-y-4">
              <li><Link href="/services" className="text-sm text-matteBlack/70 hover:text-accentBlue transition-colors font-semibold">Our Services</Link></li>
              <li><Link href="/work" className="text-sm text-matteBlack/70 hover:text-accentBlue transition-colors font-semibold">Case Studies</Link></li>
              <li><Link href="/contact" className="text-sm text-matteBlack/70 hover:text-accentBlue transition-colors font-semibold">Apply for Strategy</Link></li>
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-matteBlack mb-6">Connect</h3>
            <ul className="space-y-4">
              <li><a href="mailto:ginniomen22@gmail.com" className="text-sm text-matteBlack/70 hover:text-accentBlue transition-colors font-semibold">Email Us</a></li>
              <li><Link href="/admin" className="text-sm text-matteBlack/70 hover:text-accentBlue transition-colors font-semibold">Command Center</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-matteBlack/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-matteBlack/60 font-semibold">
            &copy; {new Date().getFullYear()} Advergent Marketers. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-xs text-matteBlack/60 hover:text-accentBlue transition-colors font-semibold">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-matteBlack/60 hover:text-accentBlue transition-colors font-semibold">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}