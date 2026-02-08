'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

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
      <div style={{ marginLeft: '75px', padding: '1rem', flex: 1 }}>
        <div style={{ paddingTop: '1rem' }}>
          <h1 style={{ margin: 0, marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 700, color: '#111' }}>
            Order {orderId}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Order detail content for {orderId}
          </p>
        </div>
      </div>
    </div>
  );
}
