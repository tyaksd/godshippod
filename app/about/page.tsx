'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Fixed glass header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/godship-logo.png"
              alt="Godship"
              width={240}
              height={240}
              className="object-contain w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px]"
            />
          </Link>
          
          {/* Log in and Sign up buttons */}
          <div className="flex items-center gap-3">
            <button className="text-white hover:text-white/80 transition-colors px-3 py-1.5 text-sm">
              Log in
            </button>
            <button className="text-white hover:text-white/80 transition-colors px-3 py-1.5 border border-white/30 rounded-md hover:bg-white/10 text-sm">
              Sign up
            </button>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <div className="pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 md:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
            About Godship
          </h1>
          
          <div className="space-y-6 text-white/80 text-lg leading-relaxed">
            <p>
              Godship is revolutionizing the print-on-demand industry by delivering high-quality tees to your customers worldwide within 3 days.
            </p>
            <p>
              We eliminate the need for inventory management, allowing you to focus on what matters most: building your brand and connecting with your customers.
            </p>
            <p>
              With our global network of production facilities and streamlined logistics, we ensure fast delivery without compromising on quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
