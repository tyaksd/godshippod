'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { Tag, TrendingUp, Boxes, Layers, Factory, MapPin } from 'lucide-react';


export default function Page() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    // ログイン状態が読み込まれたら処理
    if (!isLoaded) return;

    // ログイン済みの場合は /dashboard にリダイレクト
    if (isSignedIn) {
      router.replace('/dashboard');
      return;
    }

    // 本番環境でのみ /lp にリダイレクト
    if (process.env.NODE_ENV === 'production') {
      router.replace('/lp');
    }
  }, [router, isSignedIn, isLoaded]);

  // ログイン済みの場合はリダイレクト中なので何も表示しない
  if (isLoaded && isSignedIn) {
    return null;
  }

  // 本番環境ではリダイレクト中なので何も表示しない
  // 開発環境では "hello" を表示
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="relative bg-black">
      {/* Fixed glass header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/godship-logo.png"
              alt="Godship"
              width={1240}
              height={1240}
              className="object-contain w-[120px] h-[50px] sm:w-[130px] sm:h-[50px] md:w-[150px] md:h-[60px]"
            />
          </div>
          
          {/* Log in and Sign up buttons */}
          <div className="flex items-center gap-3">
            <Link 
              href="/contact" 
              className="hidden md:block text-white hover:text-white/80 transition-colors px-3 py-2 rounded-md hover:bg-white/30 text-sm"
            >
              Contact
            </Link>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="text-white hover:text-white/80 transition-colors px-3 py-2 rounded-md hover:bg-white/30 text-sm">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="text-white hover:text-white/80 transition-colors px-3 py-2 rounded-md hover:bg-white/30 text-sm">
                    Sign up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Page 1: Title Section */}
      <section 
        className="min-h-screen flex items-center justify-center relative hero-bg-mobile"
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 z-0 bg-black/30"></div>
        <div className="z-10 flex flex-col items-center gap-4 relative px-4">
          <h1 className="text-white text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center flex flex-col gap-2">
            <span>High-quality tees.</span>
            <span>Delivered in 3 days.</span>
            <span>Zero inventory.</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-base text-center max-w-2xl">
            Manufactured in our high-tech factories near major cities.<br />
            The on-demand apparel production infrastructure.
          </p>
        
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
          <span className="text-white text-3xl animate-bounce-arrow">›</span>
          <span className="text-white text-3xl animate-bounce-arrow -mt-3">›</span>
        </div>
      </section>
      
      {/* Page 2: Content Section */}
      <section 
        className="min-h-screen pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 md:px-8 pb-16 relative"
        style={{
          background: 'linear-gradient(to bottom,rgb(220, 220, 220),rgb(190, 190, 190))'
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 flex-shrink-0 relative flex items-center justify-center" style={{ aspectRatio: '1' }}>
              {/* Glass square behind the image */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg"></div>
              {/* Image centered in the glass square */}
              <div className="relative z-10 flex items-center justify-center w-full h-full ">
                <Image
                  src="/btee3.png"
                  alt="Godship tee"
                  width={600}
                  height={600}
                  className="object-contain w-full h-full max-w-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Page 3: Features Section */}
      <section 
        className="min-h-screen pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 md:px-8 pb-16 relative"
        style={{
          background: 'linear-gradient(to bottom, rgb(190, 190, 190), rgb(160, 160, 160))'
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Godship?
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Revolutionizing apparel production with cutting-edge technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Feature 1 */}
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-700">
                Get your products delivered in just 3 days from order to doorstep.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
                <Boxes className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Zero Inventory</h3>
              <p className="text-gray-700">
                On-demand production means no storage costs or waste.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
                <Factory className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">High-Tech Factories</h3>
              <p className="text-gray-700">
                State-of-the-art facilities located near major cities.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
                <Tag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-700">
                High-quality materials and craftsmanship in every product.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Scalable Infrastructure</h3>
              <p className="text-gray-700">
                Production infrastructure that grows with your business.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Strategic Locations</h3>
              <p className="text-gray-700">
                Factories positioned for optimal delivery times.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

