'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DesignPage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseImageElRef = useRef<HTMLImageElement | null>(null);
  
  // Design position and size state (center as reference point)
  const [positionTop, setPositionTop] = useState(42); // Reference: 42%
  const [positionLeft, setPositionLeft] = useState(50); // Reference: 50%
  const [scale, setScale] = useState(1.3); // Reference: 1.3 (35% width as reference)
  
  // Timers for long-press
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const actionRef = useRef<(() => void) | null>(null);
  
  // Drag state for image overlay
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startTop: number; startLeft: number } | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Frame visibility state
  const [showFrame, setShowFrame] = useState(true);
  
  // Color adjustment values for CMYK conversion preview (fixed values)
  const saturation = 0.80; // Saturation adjustment (18% desaturated for CMYK preview)
  const brightness = 0.90; // Brightness adjustment (7% darker for CMYK preview)
  const contrast = 1.15; // Contrast adjustment (8% more contrast for CMYK preview)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        // Apply the same defaults as the "Center" button immediately on upload
        resetPosition();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadComposite = async () => {
    if (!uploadedImage) return;
    const baseEl = baseImageElRef.current;
    const clipEl = imageContainerRef.current;
    if (!baseEl || !clipEl) return;

    // Ensure base image is ready
    if (!baseEl.complete || baseEl.naturalWidth === 0 || baseEl.naturalHeight === 0) return;

    const imgRect = baseEl.getBoundingClientRect();
    const clipRect = clipEl.getBoundingClientRect();
    if (imgRect.width === 0 || imgRect.height === 0) return;

    const sx = baseEl.naturalWidth / imgRect.width;
    const sy = baseEl.naturalHeight / imgRect.height;

    // Clip rect in base-image pixel space
    const clipX = (clipRect.left - imgRect.left) * sx;
    const clipY = (clipRect.top - imgRect.top) * sy;
    const clipW = clipRect.width * sx;
    const clipH = clipRect.height * sy;

    const canvas = document.createElement('canvas');
    canvas.width = baseEl.naturalWidth;
    canvas.height = baseEl.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw base image
    ctx.drawImage(baseEl, 0, 0, canvas.width, canvas.height);

    // Load uploaded image (data URL)
    const overlayImg = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load overlay image'));
      img.src = uploadedImage;
    });

    // Compute overlay size/position based on current UI logic
    const overlayWDisplay = Math.min(clipRect.width * ((35 * scale) / 100), 220 * scale);
    const overlayW = overlayWDisplay * sx;
    const overlayH = overlayW * (overlayImg.height / overlayImg.width);

    const centerXDisplay = (clipRect.left - imgRect.left) + (clipRect.width * (positionLeft / 100));
    const centerYDisplay = (clipRect.top - imgRect.top) + (clipRect.height * (positionTop / 100));
    const centerX = centerXDisplay * sx;
    const centerY = centerYDisplay * sy;

    const drawX = centerX - overlayW / 2;
    const drawY = centerY - overlayH / 2;

    // Clip to the light-blue rectangle
    ctx.save();
    ctx.beginPath();
    ctx.rect(clipX, clipY, clipW, clipH);
    ctx.clip();

    // Apply the same visual adjustments as the preview
    ctx.filter = `saturate(${saturation}) brightness(${brightness}) contrast(${contrast})`;
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 8 * sx;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2 * sy;

    ctx.drawImage(overlayImg, drawX, drawY, overlayW, overlayH);
    ctx.restore();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preview.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Save composite image to sessionStorage for orderinfo page
  const saveCompositeToSession = async () => {
    if (!uploadedImage) return;
    const baseEl = baseImageElRef.current;
    const clipEl = imageContainerRef.current;
    if (!baseEl || !clipEl) return;

    // Ensure base image is ready
    if (!baseEl.complete || baseEl.naturalWidth === 0 || baseEl.naturalHeight === 0) return;

    const imgRect = baseEl.getBoundingClientRect();
    const clipRect = clipEl.getBoundingClientRect();
    if (imgRect.width === 0 || imgRect.height === 0) return;

    const sx = baseEl.naturalWidth / imgRect.width;
    const sy = baseEl.naturalHeight / imgRect.height;

    // Clip rect in base-image pixel space
    const clipX = (clipRect.left - imgRect.left) * sx;
    const clipY = (clipRect.top - imgRect.top) * sy;
    const clipW = clipRect.width * sx;
    const clipH = clipRect.height * sy;

    const canvas = document.createElement('canvas');
    canvas.width = baseEl.naturalWidth;
    canvas.height = baseEl.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw base image
    ctx.drawImage(baseEl, 0, 0, canvas.width, canvas.height);

    // Load uploaded image (data URL)
    const overlayImg = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load overlay image'));
      img.src = uploadedImage;
    });

    // Compute overlay size/position based on current UI logic
    const overlayWDisplay = Math.min(clipRect.width * ((35 * scale) / 100), 220 * scale);
    const overlayW = overlayWDisplay * sx;
    const overlayH = overlayW * (overlayImg.height / overlayImg.width);

    const centerXDisplay = (clipRect.left - imgRect.left) + (clipRect.width * (positionLeft / 100));
    const centerYDisplay = (clipRect.top - imgRect.top) + (clipRect.height * (positionTop / 100));
    const centerX = centerXDisplay * sx;
    const centerY = centerYDisplay * sy;

    const drawX = centerX - overlayW / 2;
    const drawY = centerY - overlayH / 2;

    // Clip to the light-blue rectangle
    ctx.save();
    ctx.beginPath();
    ctx.rect(clipX, clipY, clipW, clipH);
    ctx.clip();

    // Apply the same visual adjustments as the preview
    ctx.filter = `saturate(${saturation}) brightness(${brightness}) contrast(${contrast})`;
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 8 * sx;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2 * sy;

    ctx.drawImage(overlayImg, drawX, drawY, overlayW, overlayH);
    ctx.restore();

    // Convert canvas to data URL and save to sessionStorage
    const dataUrl = canvas.toDataURL('image/png');
    sessionStorage.setItem('designCompositePng', dataUrl);
  };

  const handleGoToOrderInfo = async () => {
    await saveCompositeToSession();
    router.push('/dashboard/orderinfo');
  };

  // Position adjustment function
  const adjustPosition = (direction: 'up' | 'down' | 'left' | 'right', step: number = 1) => {
    if (direction === 'up') setPositionTop(prev => Math.max(-50, prev - step));
    if (direction === 'down') setPositionTop(prev => Math.min(150, prev + step));
    if (direction === 'left') setPositionLeft(prev => Math.max(-50, prev - step));
    if (direction === 'right') setPositionLeft(prev => Math.min(150, prev + step));
  };

  // Size adjustment function
  const adjustSize = (direction: 'increase' | 'decrease', step: number = 0.1) => {
    if (direction === 'increase') setScale(prev => Math.min(20.0, prev + step));
    if (direction === 'decrease') setScale(prev => Math.max(0.1, prev - step));
  };

  // Reset function (return to reference point)
  const resetPosition = () => {
    setPositionTop(42);
    setPositionLeft(50);
    setScale(2.0);
  };

  // Start long-press
  const startContinuousAction = (action: () => void) => {
    // Execute once immediately
    action();
    
    // Wait a bit before starting continuous execution
    timeoutRef.current = window.setTimeout(() => {
      actionRef.current = action;
      intervalRef.current = window.setInterval(() => {
        if (actionRef.current) {
          actionRef.current();
        }
      }, 50); // Execute every 50ms
    }, 300); // Start continuous execution after 300ms long-press
  };

  // Stop long-press
  const stopContinuousAction = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    actionRef.current = null;
  };

  // Handle image drag
  const handleImageMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingImage(true);
    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (rect) {
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        startTop: positionTop,
        startLeft: positionLeft
      };
    }
  };

  const handleImageTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDraggingImage(true);
    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (rect && e.touches[0]) {
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        startTop: positionTop,
        startLeft: positionLeft
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingImage && dragStartRef.current && imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const deltaX = ((e.clientX - dragStartRef.current.x) / rect.width) * 100;
        const deltaY = ((e.clientY - dragStartRef.current.y) / rect.height) * 100;
        
        setPositionLeft(Math.max(-50, Math.min(150, dragStartRef.current.startLeft + deltaX)));
        setPositionTop(Math.max(-50, Math.min(150, dragStartRef.current.startTop + deltaY)));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingImage && dragStartRef.current && imageContainerRef.current && e.touches[0]) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const deltaX = ((e.touches[0].clientX - dragStartRef.current.x) / rect.width) * 100;
        const deltaY = ((e.touches[0].clientY - dragStartRef.current.y) / rect.height) * 100;
        
        setPositionLeft(Math.max(-50, Math.min(150, dragStartRef.current.startLeft + deltaX)));
        setPositionTop(Math.max(-50, Math.min(150, dragStartRef.current.startTop + deltaY)));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingImage(false);
      dragStartRef.current = null;
    };

    if (isDraggingImage) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      document.addEventListener('touchcancel', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('touchcancel', handleMouseUp);
    };
  }, [isDraggingImage]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
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
      <div style={{ marginLeft: '75px', padding: '1rem', display: 'flex', gap: '2rem', width: '100%' }}>
        {/* Left side: Upload area */}
        <div style={{ flex: 1, maxWidth: '300px' }}>
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              border: isDragging ? '2px dashed #111' : '2px dashed rgba(0,0,0,0.2)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging 
                ? 'rgba(0,0,0,0.02)' 
                : 'linear-gradient(135deg, rgba(255,255,255,0.70), rgba(255,255,255,0.45))',
              transition: 'all 0.2s',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              style={{
                alignSelf: 'stretch',
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.12)',
                background: 'rgba(255,255,255,0.9)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                color: '#111'
              }}
            >
              {uploadedImage ? 'Upload / Change Photo' : 'Upload Photo'}
            </button>
            {uploadedImage ? (
              <div style={{ width: '100%', position: 'relative' }}>
                <Image
                  src={uploadedImage}
                  alt="Uploaded"
                  width={500}
                  height={500}
                  className="object-contain"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedImage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  Delete
                </button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.08), rgba(0,0,0,0.02))',
                    border: '1px solid rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    fontWeight: 300,
                    color: '#111'
                  }}
                >
                  +
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#111' }}>
                  Upload Photo
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  Select or drop from PC files
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side: omote-short.jpg + overlay uploaded design */}
        <div style={{ flex: 1, maxWidth: '500px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', position: 'relative', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              marginBottom: '0.25rem',
              marginTop: '-2.5rem',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: 600, color: '#111' }}>Preview</span>
            <span style={{ fontSize: '15px', color: '#666' }}>
              We use AI to predict how the colors will look when printed.
            </span>
          </div>
          <div style={{ width: '100%', position: 'relative' }}>
            <Image
              src="/omote-short.jpg"
              alt="Omote Short"
              width={500}
              height={500}
              className="object-contain"
              onLoadingComplete={(img) => {
                baseImageElRef.current = img;
              }}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
            />
            {uploadedImage && (
              <button
                type="button"
                onClick={handleDownloadComposite}
                aria-label="Download preview"
                title="Download preview"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 5,
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  background: 'rgba(255,255,255,0.92)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3v10m0 0 4-4m-4 4-4-4"
                    stroke="#111"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 17v3h16v-3"
                    stroke="#111"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            {/* Light blue rectangle in the center with clipping */}
            <div
              ref={imageContainerRef}
              style={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '180px',
                height: '200px',
                border: showFrame ? '0.1px solid rgba(173, 216, 230, 0.8)' : 'none',
                overflow: 'hidden',
                pointerEvents: uploadedImage ? 'auto' : 'none'
              }}
            >
              {uploadedImage && (
                <div
                  onMouseDown={handleImageMouseDown}
                  onTouchStart={handleImageTouchStart}
                  style={{
                    position: 'absolute',
                    top: `${positionTop}%`,
                    left: `${positionLeft}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${35 * scale}%`,
                    maxWidth: `${220 * scale}px`,
                    cursor: isDraggingImage ? 'grabbing' : 'grab',
                    userSelect: 'none'
                  }}
                >
                  <Image
                    src={uploadedImage}
                    alt="Overlay Design"
                    width={220}
                    height={220}
                    className="object-contain"
                    draggable={false}
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      filter: `drop-shadow(0 2px 8px rgba(0,0,0,0.2)) saturate(${saturation}) brightness(${brightness}) contrast(${contrast})`,
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          {/* Control panel (right side of photo) */}
          <div
            style={{
              position: 'absolute',
              top: '0.5rem',
              left: 'calc(100% + 1rem)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '12px',
              padding: '0.75rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              minWidth: '140px',
              opacity: uploadedImage ? 1 : 0.55,
              pointerEvents: uploadedImage ? 'auto' : 'none'
            }}
          >
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#111', marginBottom: '0.25rem' }}>
                Position & Size
              </div>
              {!uploadedImage && (
                <div style={{ fontSize: '11px', color: '#666', marginTop: '-0.15rem' }}>
             
                </div>
              )}
              
              {/* Position adjustment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '0.2rem' }}>Position</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem' }}>
                  <div></div>
                  <button
                    onMouseDown={() => {
                      startContinuousAction(() => adjustPosition('up'));
                      const handleMouseUp = () => {
                        stopContinuousAction();
                        document.removeEventListener('mouseup', handleMouseUp);
                        document.removeEventListener('mouseleave', handleMouseUp);
                      };
                      document.addEventListener('mouseup', handleMouseUp);
                      document.addEventListener('mouseleave', handleMouseUp);
                    }}
                    onTouchStart={() => {
                      startContinuousAction(() => adjustPosition('up'));
                      const handleTouchEnd = () => {
                        stopContinuousAction();
                        document.removeEventListener('touchend', handleTouchEnd);
                        document.removeEventListener('touchcancel', handleTouchEnd);
                      };
                      document.addEventListener('touchend', handleTouchEnd);
                      document.addEventListener('touchcancel', handleTouchEnd);
                    }}
                    style={{
                      padding: '0.4rem',
                      border: '1px solid rgba(0,0,0,0.15)',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.9)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#000'
                    }}
                  >
                    ↑
                  </button>
                  <div></div>
                  <button
                    onMouseDown={() => {
                      startContinuousAction(() => adjustPosition('left'));
                      const handleMouseUp = () => {
                        stopContinuousAction();
                        document.removeEventListener('mouseup', handleMouseUp);
                        document.removeEventListener('mouseleave', handleMouseUp);
                      };
                      document.addEventListener('mouseup', handleMouseUp);
                      document.addEventListener('mouseleave', handleMouseUp);
                    }}
                    onTouchStart={() => {
                      startContinuousAction(() => adjustPosition('left'));
                      const handleTouchEnd = () => {
                        stopContinuousAction();
                        document.removeEventListener('touchend', handleTouchEnd);
                        document.removeEventListener('touchcancel', handleTouchEnd);
                      };
                      document.addEventListener('touchend', handleTouchEnd);
                      document.addEventListener('touchcancel', handleTouchEnd);
                    }}
                    style={{
                      padding: '0.4rem',
                      border: '1px solid rgba(0,0,0,0.15)',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.9)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#000'
                    }}
                  >
                    ←
                  </button>
                  <button
                    onClick={resetPosition}
                    style={{
                      padding: '0.4rem',
                      border: '1px solid rgba(0,0,0,0.15)',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.9)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#000'
                    }}
                  >
                    Center
                  </button>
                  <button
                    onMouseDown={() => {
                      startContinuousAction(() => adjustPosition('right'));
                      const handleMouseUp = () => {
                        stopContinuousAction();
                        document.removeEventListener('mouseup', handleMouseUp);
                        document.removeEventListener('mouseleave', handleMouseUp);
                      };
                      document.addEventListener('mouseup', handleMouseUp);
                      document.addEventListener('mouseleave', handleMouseUp);
                    }}
                    onTouchStart={() => {
                      startContinuousAction(() => adjustPosition('right'));
                      const handleTouchEnd = () => {
                        stopContinuousAction();
                        document.removeEventListener('touchend', handleTouchEnd);
                        document.removeEventListener('touchcancel', handleTouchEnd);
                      };
                      document.addEventListener('touchend', handleTouchEnd);
                      document.addEventListener('touchcancel', handleTouchEnd);
                    }}
                    style={{
                      padding: '0.4rem',
                      border: '1px solid rgba(0,0,0,0.15)',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.9)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#000'
                    }}
                  >
                    →
                  </button>
                  <div></div>
                  <button
                    onMouseDown={() => {
                      startContinuousAction(() => adjustPosition('down'));
                      const handleMouseUp = () => {
                        stopContinuousAction();
                        document.removeEventListener('mouseup', handleMouseUp);
                        document.removeEventListener('mouseleave', handleMouseUp);
                      };
                      document.addEventListener('mouseup', handleMouseUp);
                      document.addEventListener('mouseleave', handleMouseUp);
                    }}
                    onTouchStart={() => {
                      startContinuousAction(() => adjustPosition('down'));
                      const handleTouchEnd = () => {
                        stopContinuousAction();
                        document.removeEventListener('touchend', handleTouchEnd);
                        document.removeEventListener('touchcancel', handleTouchEnd);
                      };
                      document.addEventListener('touchend', handleTouchEnd);
                      document.addEventListener('touchcancel', handleTouchEnd);
                    }}
                    style={{
                      padding: '0.4rem',
                      border: '1px solid rgba(0,0,0,0.15)',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.9)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#000'
                    }}
                  >
                    ↓
                  </button>
                  <div></div>
                </div>
              </div>

              {/* Size adjustment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '0.2rem' }}>Size</div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    onMouseDown={() => {
                      startContinuousAction(() => adjustSize('decrease'));
                      const handleMouseUp = () => {
                        stopContinuousAction();
                        document.removeEventListener('mouseup', handleMouseUp);
                        document.removeEventListener('mouseleave', handleMouseUp);
                      };
                      document.addEventListener('mouseup', handleMouseUp);
                      document.addEventListener('mouseleave', handleMouseUp);
                    }}
                    onTouchStart={() => {
                      startContinuousAction(() => adjustSize('decrease'));
                      const handleTouchEnd = () => {
                        stopContinuousAction();
                        document.removeEventListener('touchend', handleTouchEnd);
                        document.removeEventListener('touchcancel', handleTouchEnd);
                      };
                      document.addEventListener('touchend', handleTouchEnd);
                      document.addEventListener('touchcancel', handleTouchEnd);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      border: '1px solid rgba(0,0,0,0.15)',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.9)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#000'
                    }}
                  >
                    −
                  </button>
                  <button
                    onMouseDown={() => {
                      startContinuousAction(() => adjustSize('increase'));
                      const handleMouseUp = () => {
                        stopContinuousAction();
                        document.removeEventListener('mouseup', handleMouseUp);
                        document.removeEventListener('mouseleave', handleMouseUp);
                      };
                      document.addEventListener('mouseup', handleMouseUp);
                      document.addEventListener('mouseleave', handleMouseUp);
                    }}
                    onTouchStart={() => {
                      startContinuousAction(() => adjustSize('increase'));
                      const handleTouchEnd = () => {
                        stopContinuousAction();
                        document.removeEventListener('touchend', handleTouchEnd);
                        document.removeEventListener('touchcancel', handleTouchEnd);
                      };
                      document.addEventListener('touchend', handleTouchEnd);
                      document.addEventListener('touchcancel', handleTouchEnd);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      border: '1px solid rgba(0,0,0,0.15)',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.9)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#000'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Frame visibility toggle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '0.2rem' }}>Frame</div>
                <button
                  onClick={() => setShowFrame(!showFrame)}
                  style={{
                    width: '100%',
                    padding: '0.4rem',
                    border: '1px solid rgba(0,0,0,0.15)',
                    borderRadius: '6px',
                    background: showFrame 
                      ? 'rgba(173, 216, 230, 0.3)' 
                      : 'rgba(255,255,255,0.9)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: showFrame ? '#000' : '#333',
                    transition: 'all 0.2s'
                  }}
                >
                  {showFrame ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
        </div>
      </div>

      {/* Shipping info button (fixed on right side) */}
      <button
        type="button"
        onClick={handleGoToOrderInfo}
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
        <div style={{ position: 'absolute', top: '1.5rem', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
          Shipping info
        </div>
        <div style={{ fontSize: '48px', lineHeight: 1, color: '#fff' }}>&gt;</div>
      </button>
    </div>
  );
}
