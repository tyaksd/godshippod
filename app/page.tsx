'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const cities = ['NY', 'LA', 'London', 'Tokyo'];

const cityColors: Record<string, string> = {
  'NY': '#0EA5E9',
  'LA': '#F97316',
  'London': '#065F46',
  'Tokyo': '#DC2626',
};

const cityBackgrounds: Record<string, { mobile: string; desktop: string }> = {
  'NY': { mobile: '/nysm.jpg', desktop: '/nypc3.png' },
  'LA': { mobile: '/lasm.jpg', desktop: '/lapc.png' },
  'London': { mobile: '/londonsm2.jpg', desktop: '/londonpc.jpg' },
  'Tokyo': { mobile: '/tokyosm.jpg', desktop: '/tokyopc.png' },
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // 各都市名を表示する時間（2秒）
    const showDuration = 5000;
    // フェードアウト/インの時間（300ms）
    const fadeDuration = 100;

    const cycle = () => {
      // 表示状態を維持
      setIsVisible(true);
      
      // 表示時間後にフェードアウト
      setTimeout(() => {
        setIsVisible(false);
        
        // フェードアウト完了後に次の都市名に切り替え
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % cities.length);
          // すぐにフェードイン
          setTimeout(() => {
            setIsVisible(true);
          }, 50);
        }, fadeDuration);
      }, showDuration);
    };

    // 初回実行
    cycle();

    // 各サイクルの合計時間でインターバルを設定
    const interval = setInterval(cycle, showDuration + fadeDuration * 2 + 50);

    return () => clearInterval(interval);
  }, []);

  const currentCity = cities[currentIndex];
  const currentColor = cityColors[currentCity];
  const currentBackground = cityBackgrounds[currentCity];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('waitlist-email')
        .insert([{ email, created_at: new Date().toISOString() }]);

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'You’re on the list. We’ll reach out.' });
      setEmail('');
    } catch (error: any) {
      console.error('Error adding to waitlist:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* First Page - Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-4 bg-cover bg-center bg-no-repeat">
        {/* Background images */}
        <div className="absolute inset-0 z-0">
          <Image
            src={currentBackground.mobile}
            alt="Background"
            fill
            className="object-cover sm:hidden transition-opacity duration-500"
            priority
            key={`mobile-${currentCity}`}
          />
          <Image
            src={currentBackground.desktop}
            alt="Background"
            fill
            className="hidden sm:block object-cover transition-opacity duration-500"
            priority
            key={`desktop-${currentCity}`}
          />
        </div>
        {/* Overlay layers */}
        <div className="absolute inset-0 z-0 bg-black/35"></div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]"></div>
        <div 
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        ></div>
        {/* Logo in top left */}
        <div className="absolute -top-8 left-3 sm:-top-10 sm:left-4 md:-top-14 md:left-4 lg:-top-16 lg:left-4 z-10">
          <Image
            src="/godship-logo.png"
            alt="Godship"
            width={240}
            height={240}
            className="object-contain w-[145px] h-[140px] sm:w-[163px] sm:h-[163px] md:w-[191px] md:h-[191px] lg:w-[200px] lg:h-[200px]"
          />
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center gap-4 max-w-3xl relative z-10">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center tracking-tight leading-[1.05]">
            {/* スマホ用 */}
            <span className="sm:hidden">
              Get high-quality tees{' '}
              <br />
              to your customers{' '}
              <br />
              in {' '} 
              <span className="relative inline-block h-[1.2em] w-[7ch] text-center">
                <span
                  className={`inline-block w-full text-white transition-opacity duration-300 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.25)'
                  }}
                >
                  {currentCity}
                </span>
              </span>{' '}
              <br />
              within 3 days
            </span>
            {/* PC用 */}
            <span className="hidden sm:inline">
              Get high-quality tees to{' '}
              <br />
              your customers in{' '}
              <span className="relative inline-block h-[1.2em] w-[7ch] text-center">
                <span
                  className={`inline-block w-full text-white transition-opacity duration-300 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.25)'
                  }}
                >
                  {currentCity}
                </span>
              </span>{' '}
              <br />
              within 3 days
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-white/90 text-center max-w-2xl">
            Deliver high-quality tees to customers in New York in 3 days.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            Get high-quality tees to your customers within 3 days
          </p>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/70 focus:outline-none focus:ring-1 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Joining...' : 'Join waitlist ➔'}
              </button>
            </div>
            <div className="h-6 flex items-center justify-center">
              <p
                className={`text-sm text-center transition-opacity duration-300 ${
                  message
                    ? message.type === 'success'
                      ? 'text-green-600 opacity-100'
                      : 'text-red-600 opacity-100'
                    : 'opacity-0'
                }`}
              >
                {message ? message.text : '\u00A0'}
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Second Page - Scrollable Content */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center gap-8 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black text-center">
            今
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl">
            作ってる
          </p>
        </div>
      </section>
    </div>
  );
}
