'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [currentImage, setCurrentImage] = useState('/omote.jpg');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | '2XL'>('M');
  const [showMore, setShowMore] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const images = [
    { src: '/omote.jpg', alt: 'Omote' },
    { src: '/ura.jpg', alt: 'Ura' },
    { src: '/model.png', alt: 'Model' }
  ];
  const sizes = ['S', 'M', 'L', 'XL', '2XL'] as const;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // PC用レイアウト
  const DesktopLayout = () => (
    <div
      style={{
        background: 'linear-gradient(to bottom, rgb(255, 255, 255), rgb(237, 237, 237))',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex'
      }}
    >
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
        <Image
          src="/gblack2.png"
          alt="Godship Logo"
          width={60}
          height={60}
          className="object-contain"
        />
        <div style={{ marginTop: '0.5rem' }}>
          <Image
            src="/order.png"
            alt="Order"
            width={30}
            height={30}
            className="object-contain"
          />
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <Image
            src="/settings.png"
            alt="Settings"
            width={30}
            height={30}
            className="object-contain"
          />
        </div>
      </div>
      <div style={{ marginLeft: '75px', padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
        <div style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'row', gap: '2.5rem', alignItems: 'flex-start' }}>
          {/* 左：プレビュー + メイン画像 */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'flex-start' }}>
            {/* プレビュー画像（左側、縦並び） */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImage(image.src)}
                  style={{
                    cursor: 'pointer',
                    border: currentImage === image.src ? '2px solid #000' : '2px solid transparent',
                    padding: '2px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    background: currentImage === image.src ? 'rgba(0,0,0,0.04)' : 'transparent'
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
            {/* メイン画像 */}
            <div style={{ width: '420px' }}>
              <Image
                src={currentImage}
                alt="Main Image"
                width={420}
                height={420}
                className="object-contain"
              />

              {/* Read more (moved under image) */}
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                style={{
                  marginTop: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: '#111',
                  fontWeight: 800,
                  fontSize: '13px'
                }}
              >
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '7px',
                    border: '1px solid rgba(0,0,0,0.22)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    background: 'rgba(255,255,255,0.55)',
                    boxShadow:
                      '0 1px 0 rgba(255,255,255,0.8) inset, 0 10px 24px rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {showMore ? '−' : '+'}
                </span>
                Read more about this shirt
              </button>

              {showMore && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.9rem 1rem',
                    borderRadius: '14px',
                   
                    color: '#222',
                    fontSize: '13px',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                    backdropFilter: 'blur(14px)'
                  }}
                >
                  Introducing the BELLA+CANVAS 3001 Unisex Jersey Short Sleeve Tee: The Perfect Canvas for Custom Printing

                  Looking for a high-quality, versatile t-shirt that feels like a well-loved favorite? The BELLA+CANVAS 3001 is an updated essential built from superior combed and ring-spun cotton—an ideal blank for crisp, vibrant prints.

                  With a classic crew neck and short sleeves, it delivers a timeless look for everyone. Side-seamed construction creates a more flattering, consistent shape, while shoulder taping adds strength where it matters most—so it holds up to everyday wear and repeat washing.

                  Fabric & feel
                  - 100% Airlume combed & ring-spun cotton (32 singles / 4.2 oz) for exceptional softness and breathability.
                  - Smooth surface engineered to print cleanly, with sharp details and rich color.
                  - Ash: 99% Airlume cotton / 1% polyester.

                  Unparalleled cotton quality (Airlume)
                  BELLA+CANVAS uses Airlume Combed and Ringspun Cotton—a signature process that removes more impurities than typical cotton prep. The result is a noticeably smoother, cleaner hand-feel that’s comfortable on skin and creates a premium print surface.

                  Unmatched quality with side seams
                  Side seams aren’t just a construction detail—they’re a hallmark of a premium tee. They help the shirt drape better, keep the shape more consistent over time, and support a modern retail fit that looks tailored without feeling tight.

                  Pre-shrunk perfection
                  Cotton can shrink significantly if not handled carefully. That’s why the fabric is pre-shrunk before cutting and sewing—reducing unpredictable shrinkage, helping the tee keep its intended measurements, and protecting your design placement after washing.

                  Quick FAQ
                  - Unisex fit: Modern retail fit that’s comfortable and flattering for most body types.
                  - Care: Cold wash recommended; tumble dry low or air dry to preserve fit and feel.
                </div>
              )}
            </div>
          </div>

          {/* 右：商品情報 */}
          <div style={{ maxWidth: '520px', paddingTop: '0.25rem' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: '#111' }}>
              Bella + Canvas 3001 Unisex T-Shirt
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '14px', lineHeight: 1.6, color: '#333', whiteSpace: 'pre-wrap' }}>
              Our best-selling Unisex Jersey Short Sleeve Tee features a crew neck andtailored fit. Crafted from our incredibly soft, proprietary Airlume combed and ring-spun cotton, the Unisex Jersey Short Sleeve Tee is a daily essential built for comfort, with a smooth surface perfect for printing of any kind.

              Features: Side-seamed. Classic fit. Unisex sizing. Shoulder taping.

              Fabrication: 100% Airlume combed and ring-spun cotton, 32 singles, 4.2 oz.

              Ash: 99% Airlume combed and ring-spun cotton, 1% polyester.
            </div>

            <div style={{ marginTop: '1.25rem', fontSize: '12px', color: '#111' }}>
              <div style={{ fontWeight: 700 }}>Printing info</div>
              <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {/* DTF icon-card */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '14px',
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.70), rgba(255,255,255,0.45))',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow:
                      '0 1px 0 rgba(255,255,255,0.85) inset, 0 14px 34px rgba(0,0,0,0.10)',
                    backdropFilter: 'blur(14px)'
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '12px',
                      background:
                        'linear-gradient(145deg, rgba(0,0,0,0.10), rgba(0,0,0,0.02))',
                      border: '1px solid rgba(0,0,0,0.12)',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset'
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.06em' }}>
                      DTF
                    </span>
                  </div>
                  <div style={{ lineHeight: 1.1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#111' }}>DTF</div>
                    <div style={{ fontSize: '11px', color: '#333' }}>Direct-to-Film</div>
                  </div>
                </div>

                {/* Mimaki icon-card (premium glass) */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.55rem 0.7rem',
                    borderRadius: '14px',
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.76), rgba(255,255,255,0.42))',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow:
                      '0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 46px rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(16px)',
                    position: 'relative'
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '12px',
                      background:
                        'linear-gradient(145deg, rgba(0,0,0,0.10), rgba(0,0,0,0.01))',
                      border: '1px solid rgba(0,0,0,0.12)',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.85) inset',
                      position: 'relative'
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '-0.02em' }}>
                      M
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '999px',
                        background:
                          'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.55))',
                        border: '1px solid rgba(0,0,0,0.10)',
                        boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '11px'
                      }}
                    >
                      ✦
                    </span>
                  </div>
                  <div style={{ lineHeight: 1.1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#111' }}>Mimaki</div>
                    <div style={{ fontSize: '11px', color: '#333' }}>Premium printer</div>
                  </div>
                </div>

              </div>
            </div>

            <div style={{ marginTop: '1.25rem', fontSize: '12px', fontWeight: 600, color: '#111' }}>Size</div>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {sizes.map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    style={{
                      height: '36px',
                      minWidth: '52px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: active ? '2px solid #111' : '1px solid rgba(0,0,0,0.18)',
                      background: active ? '#111' : 'rgba(255,255,255,0.7)',
                      color: active ? '#fff' : '#111',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Color and Price side by side */}
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>Color</div>
                {/* 黒いbox */}
                <div
                  style={{
                    marginTop: '0.5rem',
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#000',
                    borderRadius: '6px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>Price</div>
                  <div style={{ marginTop: '0.5rem', fontSize: '20px', fontWeight: 700, color: '#111' }}>
                    $13.00
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>Quantity</div>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      marginTop: '0.5rem',
                      width: '80px',
                      height: '36px',
                      padding: '0 12px',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#111',
                      border: '1px solid rgba(0,0,0,0.18)',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.7)',
                      textAlign: 'center'
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>Total</div>
                  <div style={{ marginTop: '0.5rem', fontSize: '20px', fontWeight: 700, color: '#111' }}>
                    ${(13.00 * quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Estimated delivery */}
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>Estimated delivery</div>
                <div style={{ marginTop: '0.5rem', fontSize: '20px', fontWeight: 700, lineHeight: 1.6, color: '#111' }}>
                {(() => {
                  const today = new Date();
                  const date3Days = new Date(today);
                  date3Days.setDate(today.getDate() + 3);
                  const date5Days = new Date(today);
                  date5Days.setDate(today.getDate() + 5);
                  
                  const formatDate = (date: Date) => {
                    const month = date.toLocaleString('en-US', { month: 'short' });
                    const day = date.getDate();
                    return `${month} ${day}`;
                  };
                  
                  return (
                    <>
                      <div>NY, NJ, DE, PA, CT: {formatDate(date3Days)}</div>
                      <div style={{ marginTop: '0.25rem' }}>
                        <span style={{ fontWeight: 400 }}>Other states in the US: </span>
                        {formatDate(date5Days)}
                      </div>
                    </>
                  );
                })()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>Shipping fee</div>
                <div style={{ marginTop: '0.5rem', fontSize: '20px', fontWeight: 700, lineHeight: 1.6, color: '#111' }}>
                  <div>+ $5.00</div>
                  <div style={{ marginTop: '0.25rem' }}>+ $6.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upload design button (fixed on right side) */}
      <button
        type="button"
        onClick={() => router.push('/dashboard/design')}
        style={{
          position: 'fixed',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.08)',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.76), rgba(255,255,255,0.42))',
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 46px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          fontSize: '13px',
          fontWeight: 600,
          color: '#111',
          textAlign: 'center',
          lineHeight: 1.2
        }}
      >
        <div style={{ position: 'absolute', top: '1.5rem', fontSize: '12px', fontWeight: 600 }}>Upload design</div>
        <div style={{ fontSize: '48px', lineHeight: 1 }}>&gt;</div>
      </button>
    </div>
  );

  // スマホ用レイアウト（後で実装）
  const MobileLayout = () => (
    <div
      style={{
        background: 'linear-gradient(to bottom, rgb(252, 252, 252), rgb(210, 210, 210))',
        minHeight: '100vh',
        padding: '1rem'
      }}
    >
      {/* スマホ用レイアウトは後で実装 */}
      hello (mobile)
    </div>
  );

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
