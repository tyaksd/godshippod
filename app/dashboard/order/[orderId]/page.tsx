'use client';

import Image from 'next/image';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';

const STEPS = ['Order Received', 'In Production', 'Quality Check', 'Packed', 'Shipped', 'Arrived'];

// Hours from Order Received; Shipped (index 4) is within 24h; Arrived (index 5) is 3 days later
const STEP_HOURS_OFFSET = [0, 2, 5, 9, 14, 72];

function getCurrentStepFromOrderId(orderId: string): number {
  const n = orderId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return Math.min(5, Math.max(0, n % 6));
}

function parseOrderDate(dateStr: string): Date | null {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getStepTimes(baseDate: Date, orderId: string): string[] {
  const start = new Date(baseDate);
  start.setHours(8, 0, 0, 0);
  const seed = orderId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return STEP_HOURS_OFFSET.map((h, i) => {
    const minuteOffset = (seed + i * 11 + (orderId.charCodeAt(i % orderId.length) || 0)) % 60;
    const d = new Date(start.getTime() + h * 60 * 60 * 1000 + minuteOffset * 60 * 1000);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
  });
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = (params.orderId as string) || '';
  const stepFromUrl = searchParams.get('step');
  const currentStep = useMemo(() => {
    if (stepFromUrl !== null) {
      const n = parseInt(stepFromUrl, 10);
      if (!Number.isNaN(n) && n >= 0 && n <= 5) return n;
    }
    return getCurrentStepFromOrderId(orderId);
  }, [orderId, stepFromUrl]);
  const targetProgress = Math.min(1, (currentStep + 0.78) / 6);
  const [lineProgress, setLineProgress] = useState(0);
  const dateFromUrl = searchParams.get('date');
  const stepTimesBaseDate = useMemo(() => {
    const parsed = dateFromUrl ? parseOrderDate(dateFromUrl) : null;
    if (parsed) return parsed;
    const fallback = new Date();
    fallback.setHours(8, 0, 0, 0);
    const seed = orderId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    fallback.setDate(fallback.getDate() - (seed % 7));
    return fallback;
  }, [orderId, dateFromUrl]);
  const stepTimes = useMemo(() => getStepTimes(stepTimesBaseDate, orderId), [stepTimesBaseDate, orderId]);
  const estimatedArrivedDate = useMemo(() => {
    const d = new Date(stepTimesBaseDate);
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [stepTimesBaseDate]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setLineProgress(targetProgress);
    });
    return () => cancelAnimationFrame(id);
  }, [targetProgress]);

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom, rgb(255, 255, 255), rgb(237, 237, 237))',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex'
      }}
    >
      {/* 左サイドバー */}
      <div
        style={{
          width: '65px',
          backgroundColor: 'black',
          minHeight: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '0.5rem'
        }}
      >
        <button
          onClick={() => router.push('/dashboard')}
          aria-label="Back to dashboard"
          style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <Image
            src="/gblack2.png"
            alt="Godship Logo"
            width={60}
            height={60}
            className="object-contain"
          />
        </button>
        <div style={{ marginTop: '0.5rem' }}>
          <button
            onClick={() => router.push('/dashboard/order')}
            aria-label="Order"
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <Image
              src="/order.png"
              alt="Order"
              width={30}
              height={30}
              className="object-contain"
            />
          </button>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={() => router.push('/dashboard/settings')}
            aria-label="Settings"
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <Image
              src="/settings.png"
              alt="Settings"
              width={30}
              height={30}
              className="object-contain"
            />
          </button>
        </div>
      </div>
      {/* メインコンテンツエリア */}
      <div style={{ marginLeft: '75px', padding: '1.5rem 1.5rem 2rem', flex: 1, maxWidth: '100%' }}>
        <div style={{ paddingTop: '0.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Order tracking
            </div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
              {orderId}
            </h1>
          </div>

          {/* プログレスタイムライン：モダン・ステータス反映・ラインアニメーション */}
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '2rem 1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.06)',
              marginBottom: '1.5rem'
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '8px',
                paddingBottom: '48px'
              }}
            >
              {/* 背景の線 */}
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  right: '14px',
                  top: '20px',
                  height: '3px',
                  backgroundColor: 'rgba(0,0,0,0.06)',
                  borderRadius: '2px',
                  zIndex: 0
                }}
              />
              {/* 進捗の線（アニメーション） */}
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '20px',
                  height: '3px',
                  borderRadius: '2px',
                  zIndex: 1,
                  width: `${lineProgress * 100}%`,
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)',
                  boxShadow: '0 0 12px rgba(99, 102, 241, 0.35)'
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                {STEPS.map((label, i) => {
                  const completed = i <= currentStep;
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                        minWidth: 0
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: completed ? '#6366f1' : '#fff',
                          border: completed ? '2px solid #6366f1' : '2px solid rgba(0,0,0,0.1)',
                          boxShadow: completed
                            ? '0 0 0 4px rgba(99, 102, 241, 0.15), 0 2px 4px rgba(99, 102, 241, 0.2)'
                            : '0 1px 2px rgba(0,0,0,0.04)',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease'
                        }}
                      >
                        {completed && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div
                        style={{
                          marginTop: '0.75rem',
                          fontSize: '12px',
                          fontWeight: completed ? 600 : 500,
                          color: completed ? '#0f172a' : 'rgba(15, 23, 42, 0.5)',
                          textAlign: 'center',
                          lineHeight: 1.35,
                          maxWidth: '90px',
                          transition: 'color 0.3s ease'
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          marginTop: '0.25rem',
                          fontSize: '11px',
                          fontWeight: 500,
                          color: 'rgba(15, 23, 42, 0.5)',
                          textAlign: 'center'
                        }}
                      >
                        {i === 5 && currentStep < 5 ? `Estimated: ${estimatedArrivedDate}` : stepTimes[i]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p style={{ margin: 0, marginBottom: '1.5rem', fontSize: '13px', color: 'rgba(15, 23, 42, 0.6)' }}>
            Current status: <strong style={{ color: '#0f172a' }}>{STEPS[currentStep]}</strong>
          </p>

          {/* After production / After packing (original size × 80%) */}
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div
              style={{
                flex: '1 1 192px',
                minWidth: '160px',
                background: '#fff',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.06)'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#6366f1', marginBottom: '0.75rem', letterSpacing: '0.02em' }}>
                After production
              </div>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'rgba(0,0,0,0.04)'
                }}
              >
                <Image
                  src="/afterproduction1.png"
                  alt="After production"
                  width={240}
                  height={180}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
            <div
              style={{
                flex: '1 1 192px',
                minWidth: '160px',
                background: '#fff',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.06)'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#6366f1', marginBottom: '0.75rem', letterSpacing: '0.02em' }}>
                After packing
              </div>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'rgba(0,0,0,0.04)'
                }}
              >
                <Image
                  src="/afterpacked1.png"
                  alt="After packing"
                  width={240}
                  height={180}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
