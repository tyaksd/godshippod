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
        <div className="absolute inset-0 z-0 bg-black/50"></div>
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
            Manufactured in our factories near major cities—built for local delivery by ground.
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            On-demand production infrastructure built for consistent quality and fast delivery.
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

      {/* Second Page - POD Challenges */}
      <section className="relative overflow-hidden bg-[#070A12] text-zinc-100 min-h-screen">
        {/* subtle background */}
        <div className="pointer-events-none absolute inset-0">
          {/* top glow */}
          <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
          {/* grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          {/* vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070A12]/40 to-[#070A12]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-15 md:pt-16 md:pb-20">
          {/* Header */}
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.05] px-3 py-1 text-xs text-zinc-200/80">
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              Traditional Print-On-Demand
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
              POD is over.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-zinc-300/80 md:text-lg">
            5–21 day delivery. Unpredictable quality. Zero brand experience.
              <br className="hidden md:block" />
              And people still call this "POD".
            </p>
          </div>

          {/* Cards */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Challenge 1: Too slow */}
            <div className="group relative rounded-2xl border border-white/14 bg-white/[0.05] p-8 transition hover:border-white/20 hover:bg-white/[0.045]">
              {/* inner gradient */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent opacity-0 transition group-hover:opacity-100" />

              <div className="relative">
                <div 
                  className="text-6xl font-semibold tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  01
                </div>

                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  Too slow
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-zinc-300/80">
                  Orders take <span className="text-zinc-100 font-medium">5–21 days</span>.
                  <br />
                  That kills repeat purchases.
                </p>

                {/* tiny accent line */}
                <div className="mt-6 h-px w-10 bg-white/10 transition group-hover:bg-white/20" />
              </div>
            </div>

            {/* Challenge 2: Quality roulette */}
            <div className="group relative rounded-2xl border border-white/14 bg-white/[0.05] p-8 transition hover:border-white/20 hover:bg-white/[0.045]">
              {/* inner gradient */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent opacity-0 transition group-hover:opacity-100" />

              <div className="relative">
                <div 
                  className="text-6xl font-semibold tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  02
                </div>

                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  Quality roulette
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-zinc-300/80">
                  Each order ships from a{" "}
                  <span className="text-zinc-100 font-medium">different unknown third-party factory</span>.
                  <br />
                  Quality becomes a gamble.
                </p>

                {/* tiny accent line */}
                <div className="mt-6 h-px w-10 bg-white/10 transition group-hover:bg-white/20" />
              </div>
            </div>

            {/* Challenge 3: Not your brand */}
            <div className="group relative rounded-2xl border border-white/14 bg-white/[0.05] p-8 transition hover:border-white/20 hover:bg-white/[0.045]">
              {/* inner gradient */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent opacity-0 transition group-hover:opacity-100" />

              <div className="relative">
                <div 
                  className="text-6xl font-semibold tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  03
                </div>

                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  Not your brand
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-zinc-300/80">
                Your product is treated like just another mass-produced item.
                  <br />
                  It breaks the <span className="text-zinc-100 font-medium">brand experience</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Problems */}
          <div className=" pt-12">
            <p className="text-sm text-zinc-400/60 mb-5 text-center">
              And more...
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-zinc-300/70">
              <div className="flex items-start gap-2">
                <span className="text-zinc-500 mt-0.5">•</span>
                <span>Outdated systems and UX</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-zinc-500 mt-0.5">•</span>
                <span>Complex returns, remakes, and exception handling</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-zinc-500 mt-0.5">•</span>
                <span>Lack of process transparency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Third Page - The Fix */}
      <section className="relative min-h-screen py-20 bg-black">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />
          <div className="absolute left-1/2 top-0 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl opacity-60" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-6">
          {/* Header */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                THE FIX
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                SKU-LIMITED
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                IN-HOUSE
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                CITY-LOCAL
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              One city. One factory. One standard.
            </h2>

            <p className="max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              We solve "Not your brand" by limiting SKUs for efficiency, running a fully controlled
              in-house factory near major cities, and shipping locally for speed and consistency.
            </p>
          </div>

          {/* Flow row */}
          <div className="mt-10">
            <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
              {/* SKU Focus Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
                </div>
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/85" fill="none" aria-hidden="true">
                        <path d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5Z" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
                        <path d="M12 2.5V12m0 0 8-5M12 12 4 7m8 5v9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-white">SKU Focus</div>
                      <div className="text-xs text-white/60">SKU-LIMITED</div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                      CONTROLLED
                    </span>
                  </div>
                </div>
                <p className="relative mt-4 text-sm leading-relaxed text-white/70">
                  Start narrow to maximize throughput, repeatability, and quality control — no chaos, no surprises.
                </p>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                    SKU-LIMITED
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                    MEASURED
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                    CONSISTENT
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden items-center justify-center md:flex">
                <div className="relative">
                  <div className="h-px w-16 bg-white/10" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-45">
                    <div className="h-2 w-2 border-r border-t border-white/20" />
                  </div>
                </div>
              </div>

              {/* In-house Factory Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
                </div>
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/85" fill="none" aria-hidden="true">
                        <path d="M3.5 20.5v-9l6 3.5V11l6 3.5V11l5 3v6.5H3.5Z" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
                        <path d="M8 20.5v-4m4 4v-4m4 4v-4" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
                        <path d="M5.5 9.5V6.5a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-white">In-house Factory</div>
                      <div className="text-xs text-white/60">IN-HOUSE</div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                      CONTROLLED
                    </span>
                  </div>
                </div>
                <p className="relative mt-4 text-sm leading-relaxed text-white/70">
                  Purpose-built workflow, owned operations, and a custom system tracking every step end-to-end.
                </p>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                    IN-HOUSE
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                    MEASURED
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                    CONSISTENT
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden items-center justify-center md:flex">
                <div className="relative">
                  <div className="h-px w-16 bg-white/10" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-45">
                    <div className="h-2 w-2 border-r border-t border-white/20" />
                  </div>
                </div>
              </div>

              {/* City-local Shipping Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
                </div>
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/85" fill="none" aria-hidden="true">
                        <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
                        <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-white">City-local Shipping</div>
                      <div className="text-xs text-white/60">CITY-LOCAL</div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                      CONTROLLED
                    </span>
                  </div>
                </div>
                <p className="relative mt-4 text-sm leading-relaxed text-white/70">
                  Factories near major metros ship only to local residents — faster delivery and tighter experience control.
                </p>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                    CITY-LOCAL
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                    MEASURED
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                    CONSISTENT
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pilot */}
          <div className="mt-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#070A12]">
              {/* Background layers */}
              <div className="pointer-events-none absolute inset-0">
                {/* soft glow */}
                <div className="absolute -top-28 left-12 h-[320px] w-[520px] rounded-full bg-white/6 blur-3xl" />
                <div className="absolute -bottom-36 right-[-140px] h-[380px] w-[520px] rounded-full bg-white/5 blur-3xl" />

                {/* subtle grid */}
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
                    backgroundSize: "72px 72px",
                  }}
                />

                {/* NYC map watermark */}
                <svg viewBox="0 0 520 520" fill="none" aria-hidden="true" className="absolute right-[-80px] top-[-40px] h-[520px] w-[520px] opacity-[0.28]">
                  <path
                    d="M275 60c35 18 55 54 50 92-6 46-6 70 6 105 16 48 14 83-6 122-22 42-50 70-72 93-23 24-39 43-44 72-5 28-26 41-52 31-25-9-37-32-29-56 8-24 24-43 37-62 16-23 20-38 13-66-9-35-7-73 5-117 11-42 14-78 8-113-6-33 4-70 29-88 17-12 36-17 55-13z"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="2"
                  />
                  {Array.from({ length: 10 }).map((_, i) => (
                    <path
                      key={i}
                      d={`M160 ${110 + i * 28} C 220 ${100 + i * 28}, 290 ${120 + i * 28}, 355 ${110 + i * 28}`}
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                    />
                  ))}
                  <circle cx="300" cy="210" r="6" fill="rgba(255,255,255,0.22)" />
                  <circle cx="300" cy="210" r="14" fill="rgba(255,255,255,0.08)" />
                </svg>

                {/* vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070A12]/35 to-[#070A12]" />
              </div>

              <div className="relative p-7 md:p-10">
                {/* Top row: tags + proof */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-200/80">
                      NYC PILOT
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-200/80">
                      ONE SKU
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-200/80">
                      LOCAL-ONLY
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-white/14 bg-white/[0.06] px-3 py-1 text-xs text-zinc-100">
                      Proof before scale
                    </span>
                  </div>
                </div>

                {/* Main: 2-column layout */}
                <div className="mt-7 grid gap-8 md:grid-cols-12 md:gap-10">
                  {/* Left: narrative */}
                  <div className="md:col-span-7">
                    <h3 className="text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl">
                      NYC Metro Pilot
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300/80 md:text-base">
                      We start with a single factory near NYC and a single SKU — the{" "}
                      <span className="text-zinc-100 font-medium">black tee</span>.
                      Shipping is limited to NYC-area customers to validate{" "}
                      <span className="text-zinc-100 font-medium">
                        speed, consistency, and control
                      </span>{" "}
                      end-to-end.
                    </p>

                    {/* Mini flow (makes it feel "system-y") */}
                    <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <span className="text-xs text-zinc-300/80">Flow</span>
                      <span className="h-1 w-1 rounded-full bg-white/25" />
                      <span className="text-xs font-medium text-zinc-100">Factory</span>
                      <span className="text-xs text-zinc-300/70">→</span>
                      <span className="text-xs font-medium text-zinc-100">Print</span>
                      <span className="text-xs text-zinc-300/70">→</span>
                      <span className="text-xs font-medium text-zinc-100">Ship</span>
                      <span className="text-xs text-zinc-300/70">→</span>
                      <span className="text-xs font-medium text-zinc-100">Customer</span>
                    </div>
                  </div>

                  {/* Right: specs */}
                  <div className="md:col-span-5">
                    <div className="grid gap-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1">
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                          <div className="text-[11px] uppercase tracking-wider text-zinc-300/70">
                            SKU
                          </div>
                          <div className="mt-1 text-sm font-semibold tracking-tight text-zinc-100">
                            Black Tee Only
                          </div>
                          <div className="mt-1 text-xs text-zinc-300/70">SKU-limited</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                          <div className="text-[11px] uppercase tracking-wider text-zinc-300/70">
                            Factory
                          </div>
                          <div className="mt-1 text-sm font-semibold tracking-tight text-zinc-100">
                            Near NYC
                          </div>
                          <div className="mt-1 text-xs text-zinc-300/70">In-house ops</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                          <div className="text-[11px] uppercase tracking-wider text-zinc-300/70">
                            Delivery
                          </div>
                          <div className="mt-1 text-sm font-semibold tracking-tight text-zinc-100">
                            NYC Metro Only
                          </div>
                          <div className="mt-1 text-xs text-zinc-300/70">City-local</div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-xs text-zinc-300/70">
                          System principle
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-200/80">
                            One city
                          </span>
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-200/80">
                            One factory
                          </span>
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-200/80">
                            One standard
                          </span>
                        </div>

                        {/* tiny note */}
                        <div className="mt-3 text-xs text-zinc-300/70">
                          Constrain scope to prove unit economics before expanding.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom footnote */}
                <div className="mt-6 text-xs text-zinc-300/60">
                  * Pilot scope is intentionally constrained to prove speed, consistency,
                  and operational control.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fourth Page - Scrollable Content */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-white">
        <div className="flex flex-col items-center gap-8 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black text-center">
            Fourth Page
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl">
            This is the fourth page that appears when you scroll down further.
          </p>
        </div>
      </section>
    </div>
  );
}
