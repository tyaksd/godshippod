'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Tag, TrendingUp, Boxes, Layers, Factory, MapPin } from 'lucide-react';

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

/** Local component (put in same file) */
function FixCard({
  accent,
  icon,
  title,
  subtitle,
  tags,
  body,
  chips,
}: {
  accent: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tags: string[];
  body: string;
  chips: string[];
}) {
  return (
    <div
      style={{ ["--accent" as any]: accent } as React.CSSProperties}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.05]"
    >
      {/* Accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14] transition duration-300 group-hover:opacity-[0.30]"
        style={{
          background:
            "radial-gradient(900px circle at 18% 10%, rgb(var(--accent) / 0.22), transparent 55%)",
        }}
      />
      {/* Top tint line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgb(var(--accent) / 0.0), rgb(var(--accent) / 0.55), rgb(var(--accent) / 0.0))",
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        {/* Icon + title */}
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border aspect-square"
            style={{
              borderColor: "rgb(var(--accent) / 0.22)",
              backgroundColor: "rgb(var(--accent) / 0.10)",
              color: "rgb(255 255 255 / 0.92)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset",
            }}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="mt-0.5 text-xs text-white/60">{subtitle}</div>

            {/* Accent underline */}
            <div
              className="mt-2 h-[2px] w-10 rounded-full"
              style={{ backgroundColor: "rgb(var(--accent) / 0.75)" }}
            />
          </div>
        </div>

        {/* Tags (colored) */}
        <div className="flex flex-wrap justify-end gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide"
              style={{
                borderColor: "rgb(var(--accent) / 0.22)",
                backgroundColor: "rgb(var(--accent) / 0.08)",
                color: "rgb(255 255 255 / 0.84)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-white/70">
        {body}
      </p>

      {/* Bottom chips */}
      <div className="relative mt-5 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span
            key={c}
            className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide"
            style={{
              borderColor: "rgb(var(--accent) / 0.16)",
              backgroundColor: "rgba(255,255,255,0.03)",
              color: "rgb(255 255 255 / 0.78)",
            }}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function UseCaseCard({
  accent,
  eyebrow,
  title,
  body,
  outcomes,
}: {
  accent: string;
  eyebrow: string;
  title: string;
  body: string;
  outcomes: string[];
}) {
  return (
    <div
      style={{ ["--accent" as any]: accent } as React.CSSProperties}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.05]"
    >
      {/* color glow (stronger + more visible) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18] transition duration-300 group-hover:opacity-[0.34]"
        style={{
          background:
            "radial-gradient(900px circle at 18% 12%, rgb(var(--accent) / 0.22), transparent 55%)",
        }}
      />
      {/* top subtle tint strip */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, rgb(var(--accent) / 0.0), rgb(var(--accent) / 0.55), rgb(var(--accent) / 0.0))" }}
      />

      <div className="relative">
        {/* Eyebrow badge: now visibly colored */}
        <div
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            borderColor: "rgb(var(--accent) / 0.28)",
            backgroundColor: "rgb(var(--accent) / 0.10)",
            color: "rgb(255 255 255 / 0.92)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "rgb(var(--accent) / 0.95)" }}
          />
          {eyebrow}
        </div>

        <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
          {title}
        </h3>

        {/* accent underline (makes the card identity obvious) */}
        <div
          className="mt-3 h-[2px] w-10 rounded-full"
          style={{ backgroundColor: "rgb(var(--accent) / 0.75)" }}
        />

        <p className="mt-4 text-sm leading-relaxed text-white/70">
          {body}
        </p>

        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="text-xs text-white/55">Outcomes</div>

          {/* outcomes block with left accent rail */}
          <div className="mt-3 grid gap-2 relative pl-4">
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-[2px] rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, rgb(var(--accent) / 0.55), rgb(var(--accent) / 0.05))",
              }}
            />
            {outcomes.map((t) => (
              <div key={t} className="flex items-start gap-2 text-sm">
                <span
                  className="mt-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "rgb(var(--accent) / 0.9)" }}
                />
                <span style={{ color: "rgb(255 255 255 / 0.86)" }}>
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* bottom border tint */}
        <div
          aria-hidden="true"
          className="pointer-events-none mt-6 h-px w-full"
          style={{ backgroundColor: "rgb(var(--accent) / 0.14)" }}
        />
      </div>
    </div>
  );
}

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
    <div className="bg-white overflow-x-hidden">
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
      <section className="relative overflow-x-hidden overflow-y-visible bg-[#070A12] text-zinc-100 min-h-screen">
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
      <section className="relative overflow-x-hidden overflow-y-hidden bg-[#091126] pt-8 pb-12">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#091126] via-[#091126] to-black" />

          {/* cool glow */}
          <div className="absolute left-1/2 top-[-140px] h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-sky-300/10 blur-3xl opacity-70" />
          <div className="absolute right-[-220px] top-[220px] h-[520px] w-[520px] rounded-full bg-cyan-300/8 blur-3xl opacity-50 hidden md:block" />

          {/* subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "76px 76px",
            }}
          />

          {/* top hairline */}
          <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

          {/* vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-6">
          {/* Header */}
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-white/70 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300/80" />
              THE FIX
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
            The new standard.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
            Replace legacy POD chaos with a controlled system — tight scope, owned ops, local delivery, and brand-linked AI that predicts demand.
            </p>
          </div>

          {/* 4 Pillars */}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <FixCard
              accent="125 211 252" // Sky: throughput / speed
              icon={
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M6 7.5h12M7.5 11.5h9M9 15.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
                  <path d="M4.5 6.5A2 2 0 0 1 6.5 4.5h11A2 2 0 0 1 19.5 6.5v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11Z" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
                </svg>
              }
              title="SKU-limited"
              subtitle="Repeatability by design"
              tags={["THROUGHPUT", "CONSISTENCY"]}
              body="Start narrow to maximize throughput, consistency, and quality control."
              chips={["MEASURED", "STANDARDIZED"]}
            />

            <FixCard
              accent="103 232 249" // Cyan: control / ops
              icon={
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M4.5 19.5v-8l6 3.5V11l6 3.5V11l3 1.8v6.7H4.5Z" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
                  <path d="M8 19.5v-4m4 4v-4m4 4v-4" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
                  <path d="M6.5 9V7.2A2.2 2.2 0 0 1 8.7 5h2" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
                </svg>
              }
              title="In-house factory"
              subtitle="Owned ops, end-to-end control"
              tags={["CONTROL",　"SPEED", "TRACEABLE"]}
              body="Track every step. Fix issues at the source. Keep quality consistent."
              chips={["ACCOUNTABLE", "STANDARDIZED", "< 24-HOUR TARGET"]}
            />

            <FixCard
              accent="165 180 252" // Indigo: geo / delivery
              icon={
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
                  <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
                </svg>
              }
              title="City-local delivery"
              subtitle="Metro-only for reliability"
              tags={["SPEED", "RELIABILITY"]}
              body="Factories near major metros ship exclusively to local customers — faster and more predictable."
              chips={["METRO-ONLY", "2-DAY TARGET"]}
            />

            <FixCard
              accent="244 114 182" // Pink: intelligence / AI (stands out, "future")
              icon={
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M9 7.5a3 3 0 0 1 6 0v1.2a2 2 0 0 0 1.2 1.9l.6.3a3 3 0 0 1 0 5.2l-.6.3A2 2 0 0 0 15 18.8V20a3 3 0 0 1-6 0v-1.2a2 2 0 0 0-1.2-1.9l-.6-.3a3 3 0 0 1 0-5.2l.6-.3A2 2 0 0 0 9 8.7V7.5Z" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
                  <path d="M12 9.2v5.6" stroke="currentColor" strokeWidth="1.6" opacity="0.55" strokeLinecap="round" />
                </svg>
              }
              title="Brand-linked AI"
              subtitle="Context → forecasting → inventory"
              tags={["INTELLIGENCE", "FORECASTING"]}
              body="Connect with your brand to understand context (drops, audience, creatives) and predict demand — so production stays fast without losing control."
              chips={["DEMAND FORECASTING", "CONTEXT-AWARE"]}
            />
          </div>
        </div>
      </section>

      {/* Fourth Page — We start in NY */}
      <section className="relative min-h-screen overflow-hidden pt-12 pb-10">
        {/* Background images - 一番下に配置 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ny4s.jpg"
            alt="Background"
            fill
            className="object-cover sm:hidden transition-opacity duration-500"
            priority
          />
            <Image
            src="/ny4.jpg"
            alt="Background"
            fill
            className="hidden sm:block object-cover transition-opacity duration-500"
            priority
          />
        </div>
        {/* Background overlay */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#05060A]/10 via-[#05060A]/20 to-black/30" />

          {/* cool glow */}
          <div className="absolute left-1/2 top-[-160px] h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-sky-300/10 blur-3xl opacity-70" />
          <div className="absolute right-[-220px] bottom-[-120px] h-[520px] w-[520px] rounded-full bg-cyan-300/10 blur-3xl opacity-60 hidden md:block" />

          {/* subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />
        </div>

        <div className="mx-auto max-w-6xl px-6 relative z-10">
          {/* Header */}
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-white/70 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300/80" />
              EXECUTION
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              We start in NY.
            </h2>
          </div>

          {/* Main content */}
          <div className="mt-8 grid gap-10 md:grid-cols-12">
            {/* Globe / Map */}
            <div className="relative md:col-span-7">
              <div className="relative aspect-square max-w-[520px] rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md">
                {/* Globe SVG */}
                <svg
                  viewBox="0 0 520 520"
                  fill="none"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full"
                >
                  <defs>
                    {/* soft continent fade */}
                    <radialGradient id="continentFade" cx="50%" cy="45%" r="70%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                    </radialGradient>
                    {/* NY glow */}
                    <radialGradient id="nyGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(125,211,252,0.95)" />
                      <stop offset="55%" stopColor="rgba(125,211,252,0.35)" />
                      <stop offset="100%" stopColor="rgba(125,211,252,0.00)" />
                    </radialGradient>
                    {/* globe clip */}
                    <clipPath id="globeClip">
                      <circle cx="260" cy="260" r="232" />
                    </clipPath>
                    {/* subtle vignette */}
                    <radialGradient id="globeVignette" cx="50%" cy="45%" r="75%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                      <stop offset="55%" stopColor="rgba(255,255,255,0.02)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
                    </radialGradient>
                  </defs>
                  {/* Outer ring */}
                  <circle cx="260" cy="260" r="232" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
                  {/* Everything inside the globe */}
                  <g clipPath="url(#globeClip)">
                    {/* Base subtle lighting */}
                    <rect x="0" y="0" width="520" height="520" fill="rgba(255,255,255,0.02)" />
                    <circle cx="220" cy="200" r="260" fill="rgba(255,255,255,0.03)" />
                    {/* Grid: latitudes */}
                    {[...Array(7)].map((_, i) => (
                      <ellipse
                        key={`lat-${i}`}
                        cx="260"
                        cy="260"
                        rx={220}
                        ry={220 - i * 30}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1"
                      />
                    ))}
                    {/* Grid: longitudes */}
                    {[...Array(6)].map((_, i) => (
                      <ellipse
                        key={`lon-${i}`}
                        cx="260"
                        cy="260"
                        rx={220 - i * 30}
                        ry={220}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1"
                      />
                    ))}
                    {/* Continents (abstract, subtle) */}
                    {/* Americas-ish */}
                    <path
                      d="M210 170c26-24 60-34 92-24 24 8 42 26 46 46 3 14-3 28-16 36-14 8-30 10-44 14-18 4-26 12-30 28-5 20-20 38-44 44-22 5-40-10-36-30 4-20 16-34 26-48 12-16 12-32-2-46-10-10-14-22-12-36 1-10 8-20 20-30z"
                      fill="url(#continentFade)"
                      opacity="0.85"
                    />
                   
                    {/* Vignette overlay */}
                    <rect x="0" y="0" width="520" height="520" fill="url(#globeVignette)" opacity="0.9" />
                    {/* City dots */}
                    {[
                      { name: "New York", x: 330, y: 230, active: true },
                      { name: "Los Angeles", x: 250, y: 255, active: false },
                      { name: "London", x: 355, y: 215, active: false },
                      { name: "Tokyo", x: 430, y: 250, active: false },
                    ].map((c) => (
                      <g key={c.name}>
                        {c.active ? (
                          <>
                            {/* glow */}
                            <circle cx={c.x} cy={c.y} r="22" fill="url(#nyGlow)" />
                            {/* core dot */}
                            <circle cx={c.x} cy={c.y} r="5" fill="rgba(125,211,252,0.95)" />
                          </>
                        ) : (
                          <>
                            <circle cx={c.x} cy={c.y} r="3.5" fill="rgba(255,255,255,0.22)" />
                          </>
                        )}
                      </g>
                    ))}
                    {/* subtle terminator line (optional, adds depth) */}
                    <path
                      d="M85 360c70-60 150-95 240-95 70 0 130 18 180 50"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="2"
                      opacity="0.7"
                    />
                  </g>
                </svg>

                {/* Label */}
                <div className="absolute right-[18%] top-[38%] flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/80 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                  New York
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="md:col-span-5">
              <div className="space-y-6">
                {/* Rule cards */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm">
                  <div className="text-sm font-semibold text-white">Black tee only</div>
                  <p className="mt-2 text-sm text-white/70">
                    One SKU to eliminate variation and maximize throughput.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm">
                  <div className="text-sm font-semibold text-white">NY-area customers only</div>
                  <p className="mt-2 text-sm text-white/70">
                    Orders are limited to customers living near the factory.
                    Speed and consistency first.
                  </p>
                </div>

                {/* Expansion */}
                <div className="mt-6">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                    <span className="text-white/85 font-medium">Next:</span>

                    {["Los Angeles", "London", "Tokyo", "Paris", "Seoul"].map((city) => (
                      <span
                        key={city}
                        className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-white/70 backdrop-blur-md"
                      >
                        {city}
                      </span>
                    ))}

                    <span className="text-white/50">→</span>
                    <span className="text-white/60">every major city</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page 5 — Use Cases */}
      <section className="relative min-h-screen overflow-hidden bg-[#05060A] py-10">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#05060A] via-[#05060A] to-black" />

          <div className="absolute left-1/2 top-[-180px] h-[640px] w-[980px] -translate-x-1/2 rounded-full bg-sky-300/10 blur-3xl opacity-70" />
          <div className="absolute right-[-240px] bottom-[-120px] h-[520px] w-[520px] rounded-full bg-cyan-300/10 blur-3xl opacity-60 hidden md:block" />

          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/25 to-black/70" />
        </div>

        <div className="mx-auto max-w-6xl px-6">
          {/* Header */}
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-white/70 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300/80" />
              USE CASES
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl md:leading-tight">
              Plug in. Route the right orders.
              <span className="md:hidden"> </span>
              <br className="hidden md:block" />
              Upgrade the experience.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
              Godship runs alongside your existing setup. We only take the slice that benefits most —
              starting with <span className="text-white/85 font-medium">black tees</span> for{" "}
              <span className="text-white/85 font-medium">NY-area customers</span>.
            </p>
          </div>

          {/* How it works (compact) */}
          <div className="mt-10 ">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xl font-semibold text-white md:text-xl">How it works</div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {/* Step 1 */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.055]">
                <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/55">Step 01</div>
                  <span className="text-xs text-white/55">Connect</span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  {/* Icon */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] aspect-square">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/80" fill="none">
                      <path
                        d="M8 12a4 4 0 0 1 4-4h3a4 4 0 1 1 0 8h-3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M16 12a4 4 0 0 1-4 4H9a4 4 0 1 1 0-8h3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                    </svg>
                  </div>

                  <div className="text-sm font-semibold text-white">
                    Keep your current POD + inventory
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  No migration. No switching costs. Godship runs in parallel with your existing workflow.
                </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.055]">
                <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/55">Step 02</div>
                  <span className="text-xs text-white/55">Route</span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  {/* Icon */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] aspect-square">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/80" fill="none">
                      <path
                        d="M4 6h16M4 12h10M4 18h6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="18"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                    </svg>
                  </div>

                  <div className="text-sm font-semibold text-white">
                    Auto-route: NY-area + black tee orders
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Only the targeted slice is sent to Godship — everything else stays with your current setup.
                </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.055]">
                <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-white/55">Step 03</div>
                  <span className="text-xs text-white/55">Fulfill</span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  {/* Icon */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] aspect-square">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/80" fill="none">
                      <path
                        d="M3 20V9l6 3V9l6 3V9l6 3v8H3Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7 20v-4m4 4v-4m4 4v-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                    </svg>
                  </div>

                  <div className="text-sm font-semibold text-white">
                    We print, pack, and ship
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Controlled production and a consistent unboxing — faster delivery and fewer surprises.
                </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {/* 1) POD users — SKY */}
            <UseCaseCard
              accent="125 211 252"
              eyebrow="For brands already using POD"
              title="Upgrade your best customers first."
              body="Keep Printful/Printify/Gelato for most orders. Auto-route NY black-tee orders to Godship to deliver a premium experience where it matters most."
              outcomes={["Faster delivery (NY)", "Consistent quality", "Better unboxing"]}
            />

            {/* 2) Inventory — CYAN */}
            <UseCaseCard
              accent="103 232 249"
              eyebrow="For brands running inventory"
              title="Add on-demand without losing brand control."
              body="Go hybrid: keep inventory for core SKUs, and use Godship on-demand for NY customers — so you reduce risk while improving the experience."
              outcomes={["Lower inventory risk", "On-demand option", "Brand control stays intact"]}
            />

            {/* 3) Cross-border — INDIGO */}
            <UseCaseCard
              accent="165 180 252"
              eyebrow="For cross-border apparel brands"
              title="Sell globally, fulfill locally."
              body="Avoid overseas shipping for every order. Fulfill locally for NY-area customers to dramatically improve speed, quality, and brand experience for international buyers."
              outcomes={["No overseas shipping", "Faster to customers (NY)", "Consistent brand experience"]}
            />
          </div>

          {/* Go to top button */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20 hover:border-white/30"
            >
              Go to the top
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
