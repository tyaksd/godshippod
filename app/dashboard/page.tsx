'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const favoritesRow = [
  { name: 'Bella + Canvas 3001', price: '$13.00', href: '/dashboard/bella-canvas-3001', image: '/btee.png' },
  { name: 'Gildan 64000', price: '$9.50', image: '/Gildan_64000png.png' },
  { name: 'Cotton Heritage M2580', price: '$26.50', image: '/hoodiepng1.png' },
  { name: 'Gildan 18500', price: '$24.00', image: '/hoodiepng2.png' }
];

const catalogRow1 = [
  { name: 'Bella + Canvas 3501', price: '$20.00', image: '/longsleevepng1.png' },
  { name: 'Sweatshirt', price: '', image: '/sweatshirtpng1.png' },
  { name: 'T-Shirt', price: '', image: '/tshirtpng1.png' },
  { name: 'T-Shirt', price: '', image: '/tshirtpng2.png' }
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom, rgb(255, 255, 255), rgb(237, 237, 237))',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex'
      }}
    >
      {/* 左サイドバー（bella-canvas-3001 と同じ） */}
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
      <div style={{ marginLeft: '75px', padding: '1rem', flex: 1, display: 'flex', gap: '2rem' }}>
        <div style={{ paddingTop: '1rem', flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '1.75rem', fontWeight: 700, color: '#111' }}>
            Hello Jack
          </h1>
          <p style={{ margin: 0, marginBottom: '1.5rem', fontSize: '14px', color: 'rgba(0,0,0,0.6)' }}>
            Favorites
          </p>
          {/* 4列×3行：正方形写真 + 商品名。1段目と2段目の間に Catalog */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              maxWidth: '1100px'
            }}
          >
            {favoritesRow.map((item, i) => {
              const isGildan64000 = item.name === 'Gildan 64000';
              return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {item.image ? (
                  item.href ? (
                    <button
                      type="button"
                      onClick={() => router.push(item.href)}
                      aria-label={item.name}
                      style={{
                        aspectRatio: '1',
                        padding: 0,
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: 'transparent'
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={400}
                        height={400}
                        className="object-contain"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </button>
                  ) : (
                    <div
                      style={{
                        aspectRatio: '1',
                        padding: 0,
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: 'transparent'
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={400}
                        height={400}
                        className="object-contain"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          ...(isGildan64000 && { transform: 'scale(1.10)', transformOrigin: 'center center' })
                        }}
                      />
                    </div>
                  )
                ) : (
                  <div
                    style={{
                      aspectRatio: '1',
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  />
                )}
                <div style={{ padding: '0.5rem 0.6rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: '14px', color: 'rgba(0,0,0,0.7)' }}>
                    {item.price}
                  </span>
                </div>
              </div>
            );})}
            {/* 1段目と2段目の間：Catalog */}
            <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '14px', fontWeight: 600, color: 'rgba(0,0,0,0.7)' }}>
              Catalog
            </div>
            {catalogRow1.map((item, i) => (
              <div key={`catalog-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div
                  style={{
                    aspectRatio: '1',
                    padding: 0,
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'transparent'
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={400}
                    className="object-contain"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ padding: '0.5rem 0.6rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>
                    {item.name}
                  </span>
                  {item.price ? (
                    <span style={{ fontSize: '14px', color: 'rgba(0,0,0,0.7)' }}>
                      {item.price}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`catalog-placeholder-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div
                  style={{
                    aspectRatio: '1',
                    backgroundColor: 'rgba(0,0,0,0.06)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.08)'
                  }}
                />
                <input
                  type="text"
                  placeholder="商品名"
                  style={{
                    padding: '0.5rem 0.6rem',
                    fontSize: '14px',
                    border: '1px solid rgba(0,0,0,0.15)',
                    borderRadius: '6px',
                    backgroundColor: '#fff',
                    color: '#111'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* 右端：This month Orders */}
        <div
          style={{
            paddingTop: '1rem',
            flexShrink: 0,
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}
        >
          <span style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', fontWeight: 500 }}>
            This month
          </span>
          <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Orders
          </span>
          <span style={{ fontSize: '2rem', fontWeight: 700, color: '#111', marginTop: '0.25rem' }}>
            54
          </span>
        </div>
      </div>
    </div>
  );
}
