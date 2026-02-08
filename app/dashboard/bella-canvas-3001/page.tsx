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
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeGuideUnit, setSizeGuideUnit] = useState<'inch' | 'cm'>('inch');
  const [deliveryDates, setDeliveryDates] = useState<{ date3Days: string; dateRangeOther: string } | null>(null);
  type ColorId = 'black' | 'white' | 'navy' | 'gray';
  const [selectedColor, setSelectedColor] = useState<ColorId>('black');

  useEffect(() => {
    const today = new Date();
    const date3Days = new Date(today);
    date3Days.setDate(today.getDate() + 3);
    const date4Days = new Date(today);
    date4Days.setDate(today.getDate() + 4);
    const date6Days = new Date(today);
    date6Days.setDate(today.getDate() + 6);
    
    const formatDate = (date: Date) => {
      const month = date.toLocaleString('en-US', { month: 'short' });
      const day = date.getDate();
      return `${month} ${day}`;
    };
    
    setDeliveryDates({
      date3Days: formatDate(date3Days),
      dateRangeOther: `${formatDate(date4Days)} – ${formatDate(date6Days)}`
    });
  }, []);

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
  
  useEffect(() => {
    const savedSize = localStorage.getItem('selectedSize');
    if (savedSize && ['S', 'M', 'L', 'XL', '2XL'].includes(savedSize)) {
      setSelectedSize(savedSize as 'S' | 'M' | 'L' | 'XL' | '2XL');
    }
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
                  fontSize: '14px'
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
                    fontSize: '14px',
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
            <div style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.02em', color: '#111' }}>
              Bella + Canvas 3001 Unisex T-Shirt
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '15px', lineHeight: 1.6, color: '#333', whiteSpace: 'pre-wrap' }}>
              Our best-selling Unisex Jersey Short Sleeve Tee features a crew neck andtailored fit. Crafted from our incredibly soft, proprietary Airlume combed and ring-spun cotton, the Unisex Jersey Short Sleeve Tee is a daily essential built for comfort, with a smooth surface perfect for printing of any kind.

              Features: Side-seamed. Classic fit. Unisex sizing. Shoulder taping.

              Fabrication: 100% Airlume combed and ring-spun cotton, 32 singles, 4.2 oz.

              Ash: 99% Airlume combed and ring-spun cotton, 1% polyester.
            </div>

            <div style={{ marginTop: '1.25rem', fontSize: '13px', color: '#111' }}>
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
                      'linear-gradient(135deg, rgba(236, 254, 255, 0.78), rgba(255,255,255,0.40))',
                    border: '1px solid rgba(8, 145, 178, 0.22)',
                    boxShadow:
                      '0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 46px rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(16px)',
                    position: 'relative'
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '14px',
                      background:
                        'radial-gradient(600px 90px at 20% 0%, rgba(8,145,178,0.20), transparent 60%)',
                      pointerEvents: 'none'
                    }}
                  />
                  <div
                    aria-hidden="true"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '12px',
                      background:
                        'linear-gradient(145deg, rgba(8,145,178,0.22), rgba(0,0,0,0.02))',
                      border: '1px solid rgba(8,145,178,0.28)',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow:
                        '0 1px 0 rgba(255,255,255,0.85) inset, 0 10px 24px rgba(8,145,178,0.10)',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.06em' }}>
                      DTF
                    </span>
                  </div>
                  <div style={{ lineHeight: 1.1, position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#111' }}>DTF</div>
                    <div style={{ fontSize: '12px', color: 'rgba(17,17,17,0.80)' }}>Direct-to-Film</div>
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
                      'linear-gradient(135deg, rgba(250, 245, 255, 0.86), rgba(255,255,255,0.38))',
                    border: '1px solid rgba(88, 28, 135, 0.18)',
                    boxShadow:
                      '0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 46px rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(16px)',
                    position: 'relative'
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '14px',
                      background:
                        'radial-gradient(600px 90px at 18% 0%, rgba(88,28,135,0.18), transparent 60%)',
                      pointerEvents: 'none'
                    }}
                  />
                  <div
                    aria-hidden="true"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '12px',
                      background:
                        'linear-gradient(145deg, rgba(88,28,135,0.20), rgba(0,0,0,0.01))',
                      border: '1px solid rgba(88,28,135,0.22)',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.85) inset',
                      position: 'relative',
                      zIndex: 1
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
                          'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(250, 245, 255, 0.55))',
                        border: '1px solid rgba(88,28,135,0.18)',
                        boxShadow:
                          '0 10px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.4) inset',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '11px',
                        color: '#6d28d9'
                      }}
                    >
                      ✦
                    </span>
                  </div>
                  <div style={{ lineHeight: 1.1, position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#111' }}>Mimaki</div>
                    <div style={{ fontSize: '12px', color: 'rgba(17,17,17,0.80)' }}>Premium printer</div>
                  </div>
                </div>

              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>Size</div>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1d4ed8',
                  textDecoration: 'underline'
                }}
              >
                Size guide
              </button>
            </div>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {sizes.map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      localStorage.setItem('selectedSize', size);
                    }}
                    style={{
                      height: '36px',
                      minWidth: '52px',
                      padding: '0 12px',
                      borderRadius: '10px',
                      border: active ? '2px solid #111' : '1px solid rgba(0,0,0,0.18)',
                      background: active ? '#111' : 'rgba(255,255,255,0.7)',
                      color: active ? '#fff' : '#111',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {showSizeGuide && (
              <div
                role="dialog"
                aria-modal="true"
                onClick={() => setShowSizeGuide(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.35)',
                  zIndex: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem'
                }}
              >
                <div
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setShowSizeGuide(false);
                    }
                  }}
                  style={{
                    width: 'min(780px, 70.5vw)',
                    height: 'min(510px, 64.5vh)',
                    borderRadius: '16px',
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.10)',
                    boxShadow: '0 20px 70px rgba(0,0,0,0.25)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ fontSize: '17px', fontWeight: 900, color: '#111' }}>Size guide</div>

                  <div style={{ marginTop: '0.35rem', fontSize: '14px', color: '#333' }}>
                    Product measurements may vary by up to 2&quot; (5 cm).
                  </div>

                  <div
                    style={{
                      marginTop: '0.75rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      flex: 1,
                      minHeight: 0
                    }}
                  >
                    {/* Left: diagram */}
                    <div
                      style={{
                        borderRadius: '14px',
                        border: '1px solid rgba(0,0,0,0.10)',
                        background: 'rgba(250,250,250,1)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.75rem'
                      }}
                    >
                      <Image
                        src="/A.png"
                        alt="Size guide diagram"
                        width={520}
                        height={520}
                        className="object-contain"
                        style={{ width: '100%', height: 'auto', maxHeight: '400px' }}
                      />
                    </div>

                    {/* Right: table */}
                    <div
                      style={{
                        borderRadius: '14px',
                        border: '1px solid rgba(0,0,0,0.10)',
                        background: 'rgba(255,255,255,1)',
                        padding: '0.9rem',
                        overflow: 'auto'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            border: '1px solid rgba(0,0,0,0.12)',
                            borderRadius: '10px',
                            overflow: 'hidden'
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSizeGuideUnit('inch');
                            }}
                            style={{
                              height: '32px',
                              padding: '0 10px',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 900,
                              color: sizeGuideUnit === 'inch' ? '#fff' : '#111',
                              background: sizeGuideUnit === 'inch' ? '#111' : 'rgba(255,255,255,0.8)'
                            }}
                          >
                            Inch
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSizeGuideUnit('cm');
                            }}
                            style={{
                              height: '32px',
                              padding: '0 10px',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 900,
                              color: sizeGuideUnit === 'cm' ? '#fff' : '#111',
                              background: sizeGuideUnit === 'cm' ? '#111' : 'rgba(255,255,255,0.8)'
                            }}
                          >
                            Centimeters
                          </button>
                        </div>
                      </div>

                      <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.35rem', fontSize: '16px', color: '#111' }}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '64px 1fr 1fr',
                            gap: '0.5rem',
                            fontWeight: 900,
                            color: '#111',
                            paddingBottom: '0.35rem',
                            borderBottom: '1px solid rgba(0,0,0,0.10)',
                            fontSize: '16px'
                          }}
                        >
                          <div>Size</div>
                          <div>A</div>
                          <div>B</div>
                        </div>

                        {(sizeGuideUnit === 'inch'
                          ? [
                              { size: 'S', a: '18', b: '28' },
                              { size: 'M', a: '20', b: '29' },
                              { size: 'L', a: '22', b: '30' },
                              { size: 'XL', a: '24', b: '31' },
                              { size: '2XL', a: '26', b: '32' }
                            ]
                          : [
                              { size: 'S', a: '45.7', b: '71' },
                              { size: 'M', a: '50.8', b: '73.7' },
                              { size: 'L', a: '56', b: '76.2' },
                              { size: 'XL', a: '61', b: '78.7' },
                              { size: '2XL', a: '66', b: '81.3' }
                            ]
                        ).map((row) => (
                          <div
                            key={row.size}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '64px 1fr 1fr',
                              gap: '0.5rem',
                              padding: '0.35rem 0',
                              borderBottom: '1px solid rgba(0,0,0,0.06)',
                              fontSize: '16px'
                            }}
                          >
                            <div style={{ fontWeight: 900 }}>{row.size}</div>
                            <div>{row.a}</div>
                            <div>{row.b}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: '0.8rem', fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                        A = Body width / B = Body length
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Color and Price side by side */}
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>Color</div>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {([
                    { id: 'black' as ColorId, bg: '#000', border: 'transparent' },
                    { id: 'white' as ColorId, bg: '#fff', border: 'rgba(0,0,0,0.2)' },
                    { id: 'navy' as ColorId, bg: '#192a56', border: 'transparent' },
                    { id: 'gray' as ColorId, bg: '#6b7280', border: 'transparent' }
                  ]).map(({ id, bg, border }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedColor(id)}
                      aria-label={id}
                      style={{
                        width: '30px',
                        height: '30px',
                        padding: 0,
                        backgroundColor: bg,
                        border: selectedColor === id ? '2px solid #7dd3fc' : `1px solid ${border}`,
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>Price</div>
                  <div style={{ marginTop: '0.5rem', fontSize: '30px', fontWeight: 900, color: '#111' }}>
                    $13.00
                  </div>
                </div>
              </div>
            </div>
            
            {/* Estimated delivery */}
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#111"/>
                    </svg>
                    <span>Estimated delivery</span>
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)', fontWeight: 500 }}>by UPS Ground</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '20px', fontWeight: 800, lineHeight: 1.6 }}>
                  {deliveryDates ? (
                    <>
                      <div style={{ fontSize: '18px' }}>
                        <span style={{ color: '#111', fontSize: '12px' }}>NY, NJ, CT, MA, DE, PA, MD, ME, VT, NH, RI: </span>
                        <span style={{ color: '#dc2626', fontWeight: 900 }}>{deliveryDates.date3Days}</span>
                      </div>
                      <div style={{ marginTop: '0.25rem', fontSize: '18px' }}>
                        <span style={{ color: '#111', fontWeight: 400, fontSize: '12px' }}>Other states in the US: </span>
                        <span style={{ color: '#111', fontWeight: 900 }}>{deliveryDates.dateRangeOther}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '18px' }}>
                        <span style={{ color: '#111', fontSize: '12px' }}>NY, NJ, CT, MA, DE, PA, MD, ME, VT, NH, RI: </span>
                        <span style={{ color: '#dc2626', fontWeight: 900 }}>...</span>
                      </div>
                      <div style={{ marginTop: '0.25rem', fontSize: '18px' }}>
                        <span style={{ color: '#111', fontWeight: 400, fontSize: '12px' }}>Other states in the US: </span>
                        <span style={{ color: '#111', fontWeight: 900 }}>+4日 – +6日</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>Shipping fee</div>
                <div style={{ marginTop: '0.5rem', fontSize: '19px', fontWeight: 700, lineHeight: 1.6, color: '#111' }}>
                  <div>+ $6.50</div>
                  <div style={{ marginTop: '0.25rem' }}>+ $6.50+</div>
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
          border: '1px solid rgba(255,255,255,0.25)',
          background:
            'linear-gradient(135deg, rgba(0,0,0,0.65), rgba(0,0,0,0.45), rgba(0,0,0,0.35))',
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.2) inset, 0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset',
          backdropFilter: 'blur(20px) saturate(180%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          fontSize: '14px',
          fontWeight: 600,
          color: '#fff',
          textAlign: 'center',
          lineHeight: 1.2
        }}
      >
        <div style={{ position: 'absolute', top: '1.5rem', fontSize: '13px', fontWeight: 600, color: '#fff' }}>Upload design</div>
        <div style={{ fontSize: '48px', lineHeight: 1, color: '#fff' }}>&gt;</div>
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
