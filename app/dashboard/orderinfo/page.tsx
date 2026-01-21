'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderInfoPage() {
  const router = useRouter();
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [stateRegion, setStateRegion] = useState<string>('NY');
  const [city, setCity] = useState<string>('');
  const [zip, setZip] = useState<string>('');
  const [zipStatus, setZipStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);

  useEffect(() => {
    const src = sessionStorage.getItem('designCompositePng');
    if (src) setPreviewSrc(src);
    
    const raw = localStorage.getItem('orderQuantity');
    if (raw) {
      const n = parseInt(raw, 10);
      if (Number.isFinite(n) && n > 0) {
        setQuantity(n);
      } else {
        setQuantity(1);
        localStorage.setItem('orderQuantity', '1');
      }
    } else {
      setQuantity(1);
    }
    
    const size = localStorage.getItem('selectedSize');
    if (size && ['S', 'M', 'L', 'XL', '2XL'].includes(size)) {
      setSelectedSize(size);
    } else {
      setSelectedSize('M');
      localStorage.setItem('selectedSize', 'M');
    }
    
    const state = localStorage.getItem('shippingStateRegion');
    if (state) {
      setStateRegion(state);
    } else {
      setStateRegion('NY');
      localStorage.setItem('shippingStateRegion', 'NY');
    }
    
    const savedCity = localStorage.getItem('shippingCity');
    if (savedCity) {
      setCity(savedCity);
    }
    
    const savedZip = localStorage.getItem('shippingZip');
    if (savedZip) {
      setZip(savedZip);
    }
  }, []);
  
  // Calculate delivery date based on state
  useEffect(() => {
    const today = new Date();
    const stateNorm = stateRegion.trim().toUpperCase();
    const shippingFiveStates = new Set(['NY', 'NJ', 'DE', 'PA', 'CT']);
    const daysToAdd = shippingFiveStates.has(stateNorm) ? 3 : 5;
    const deliveryDateObj = new Date(today);
    deliveryDateObj.setDate(today.getDate() + daysToAdd);
    
    const formatDate = (date: Date) => {
      const month = date.toLocaleString('en-US', { month: 'short' });
      const day = date.getDate();
      return `${month} ${day}`;
    };
    
    setDeliveryDate(formatDate(deliveryDateObj));
  }, [stateRegion]);

  const lookupZip = async (zipValueRaw: string) => {
    const zipValue = zipValueRaw.replace(/\D/g, '').slice(0, 5);
    if (zipValue.length !== 5) return;
    setZipStatus('loading');
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zipValue}`);
      if (!res.ok) throw new Error('zip lookup failed');
      const data = (await res.json()) as {
        places?: Array<{ 'place name'?: string; state?: string; 'state abbreviation'?: string }>;
      };
      const place = data.places?.[0];
      const nextCity = place?.['place name'] ?? '';
      const nextState = place?.['state abbreviation'] ?? '';
      if (nextCity) {
        setCity(nextCity);
        localStorage.setItem('shippingCity', nextCity);
      }
      if (nextState) {
        setStateRegion(nextState);
        localStorage.setItem('shippingStateRegion', nextState);
      }
      setZipStatus('ok');
    } catch {
      setZipStatus('error');
    }
  };

  const basePrice = 13.0;
  const stateNorm = stateRegion.trim().toUpperCase();
  const shippingFiveStates = new Set(['NY', 'NJ', 'DE', 'PA', 'CT']);
  const shippingCost = shippingFiveStates.has(stateNorm) ? 5.0 : 6.0;
  const computedTotal = basePrice * quantity + shippingCost;

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom, rgb(255, 255, 255), rgb(237, 237, 237))',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex'
      }}
    >
      {/* Left banner (same as dashboard/design) */}
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
          type="button"
          onClick={() => router.push('/dashboard')}
          aria-label="Back to dashboard"
          style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <Image src="/gblack2.png" alt="Godship Logo" width={60} height={60} className="object-contain" />
        </button>
        <div style={{ marginTop: '0.5rem' }}>
          <Image src="/order.png" alt="Order" width={30} height={30} className="object-contain" />
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={() => router.push('/dashboard/settings')}
            aria-label="Settings"
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <Image src="/settings.png" alt="Settings" width={30} height={30} className="object-contain" />
          </button>
        </div>
      </div>

      {/* Page content */}
      <div
        style={{
          marginLeft: '75px',
          padding: '1.25rem',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'minmax(360px, 520px) minmax(360px, 1fr)',
          gap: '1.5rem',
          alignItems: 'start'
        }}
      >
        {/* Left: Preview + Total */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.90), rgba(255,255,255,0.70))',
            border: '1px solid rgba(0,0,0,0.10)',
            borderRadius: '16px',
            padding: '1rem',
            boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
            backdropFilter: 'blur(12px)'
          }}
        >
         
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              margin: '0 auto',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.10)',
              background: 'rgba(255,255,255,0.7)'
            }}
          >
            {previewSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewSrc} alt="Composite preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
            ) : (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#666', fontSize: '14px' }}>
                No preview found. Go back to Design and click “Shipping info”.
              </div>
            )}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>Total</div>

            <div
              style={{
                marginTop: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.35rem',
                fontSize: '13px',
                color: '#333'
              }}
            >
              <span>${basePrice.toFixed(2)}</span>
              <span>×</span>
              <input
                aria-label="Quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  const n = Math.max(1, parseInt(e.target.value || '1', 10) || 1);
                  setQuantity(n);
                  localStorage.setItem('orderQuantity', String(n));
                }}
                style={{
                  width: '72px',
                  height: '34px',
                  border: '1px solid rgba(0,0,0,0.16)',
                  borderRadius: '10px',
                  padding: '0 10px',
                  fontSize: '15px',
                  fontWeight: 900,
                  color: '#111',
                  background: 'rgba(255,255,255,0.9)',
                  textAlign: 'center'
                }}
              />
              <span>+</span>
              <span>${shippingCost.toFixed(2)}</span>
              <span style={{ color: '#666' }}>(Shipping cost)</span>
              <span>=</span>
              <span style={{ fontWeight: 900, color: '#111' }}>${computedTotal.toFixed(2)}</span>
            </div>

            <div
              style={{
                marginTop: '0.65rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', lineHeight: 1.2 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#b00020' }}>
                  Please verify your order details.
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#b00020' }}>
                  Changes cannot be made after this step.
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 950, letterSpacing: '-0.02em', color: '#111' }}>
                ${computedTotal.toFixed(2)}
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Size:</span>
                <span style={{ fontSize: '14px', color: '#333' }}>{selectedSize}</span>
              </div>
              {deliveryDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Estimated delivery:</span>
                  <span style={{ fontSize: '14px', color: '#333' }}>{deliveryDate}</span>
                </div>
              )}
            </div>
            <div style={{ marginTop: '0.2rem', fontSize: '12px', color: '#666' }}>
              Shipping info: NY, NJ, DE, PA, CT → +$5.00 / Other states → +$6.00
            </div>
          </div>
        </div>

        {/* Right: Shipping info form */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.90), rgba(255,255,255,0.70))',
            border: '1px solid rgba(0,0,0,0.10)',
            borderRadius: '16px',
            padding: '1rem',
            boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.6rem',
              marginBottom: '0.75rem'
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>Shipping info</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#b00020' }}>
              You can&apos;t change this later. Please double-check.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="First name" />
            <Field label="Last name" />
            <Field label="Email" />
            <Field label="Phone (optional)" />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Address line 1" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Address line 2 (optional)" />
            </div>
            <Field
              label="City"
              value={city}
              onChange={(v) => {
                setCity(v);
                localStorage.setItem('shippingCity', v);
              }}
            />
            <SelectField
              label="State / Province"
              value={stateRegion}
              onChange={(v) => {
                setStateRegion(v);
                localStorage.setItem('shippingStateRegion', v);
              }}
              options={US_STATES}
              placeholder="Select state"
            />
            <Field
              label="ZIP / Postal"
              value={zip}
              onChange={(v) => {
                const only = v.replace(/\D/g, '').slice(0, 5);
                setZip(only);
                localStorage.setItem('shippingZip', only);
                setZipStatus(only.length === 5 ? 'loading' : 'idle');
                if (only.length === 5) lookupZip(only);
              }}
              inputMode="numeric"
            />
            <Field label="Country" value="US" disabled />
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '12px', color: zipStatus === 'error' ? '#b00020' : '#666' }}>
            {zipStatus === 'loading' && 'Looking up ZIP…'}
            {zipStatus === 'ok' && 'ZIP matched. City/State auto-filled.'}
            {zipStatus === 'error' && 'ZIP not found. Please enter City/State manually.'}
            {zipStatus === 'idle' && 'Enter a 5-digit US ZIP to auto-fill City and State.'}
          </div>
        </div>
      </div>

      {/* Payment info button (fixed on right side) */}
      <button
        type="button"
        onClick={() => {
          // TODO: Navigate to payment page when created
        }}
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
          Payment info
        </div>
        <div style={{ fontSize: '48px', lineHeight: 1, color: '#fff' }}>&gt;</div>
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  inputMode
}: {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <span style={{ fontSize: '12px', fontWeight: 700, color: '#111' }}>{label}</span>
      <input
        placeholder={label}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        inputMode={inputMode}
        style={{
          height: '38px',
          borderRadius: '10px',
          border: '1px solid rgba(0,0,0,0.14)',
          padding: '0 12px',
          fontSize: '14px',
          color: '#111',
          background: disabled ? 'rgba(245,245,245,0.9)' : 'rgba(255,255,255,0.85)'
        }}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <span style={{ fontSize: '12px', fontWeight: 700, color: '#111' }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: '38px',
          borderRadius: '10px',
          border: '1px solid rgba(0,0,0,0.14)',
          padding: '0 12px',
          fontSize: '14px',
          color: '#111',
          background: 'rgba(255,255,255,0.85)'
        }}
      >
        <option value="">{placeholder ?? 'Select'}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const US_STATES: Array<{ value: string; label: string }> = [
  { value: 'AL', label: 'AL — Alabama' },
  { value: 'AK', label: 'AK — Alaska' },
  { value: 'AZ', label: 'AZ — Arizona' },
  { value: 'AR', label: 'AR — Arkansas' },
  { value: 'CA', label: 'CA — California' },
  { value: 'CO', label: 'CO — Colorado' },
  { value: 'CT', label: 'CT — Connecticut' },
  { value: 'DE', label: 'DE — Delaware' },
  { value: 'FL', label: 'FL — Florida' },
  { value: 'GA', label: 'GA — Georgia' },
  { value: 'HI', label: 'HI — Hawaii' },
  { value: 'ID', label: 'ID — Idaho' },
  { value: 'IL', label: 'IL — Illinois' },
  { value: 'IN', label: 'IN — Indiana' },
  { value: 'IA', label: 'IA — Iowa' },
  { value: 'KS', label: 'KS — Kansas' },
  { value: 'KY', label: 'KY — Kentucky' },
  { value: 'LA', label: 'LA — Louisiana' },
  { value: 'ME', label: 'ME — Maine' },
  { value: 'MD', label: 'MD — Maryland' },
  { value: 'MA', label: 'MA — Massachusetts' },
  { value: 'MI', label: 'MI — Michigan' },
  { value: 'MN', label: 'MN — Minnesota' },
  { value: 'MS', label: 'MS — Mississippi' },
  { value: 'MO', label: 'MO — Missouri' },
  { value: 'MT', label: 'MT — Montana' },
  { value: 'NE', label: 'NE — Nebraska' },
  { value: 'NV', label: 'NV — Nevada' },
  { value: 'NH', label: 'NH — New Hampshire' },
  { value: 'NJ', label: 'NJ — New Jersey' },
  { value: 'NM', label: 'NM — New Mexico' },
  { value: 'NY', label: 'NY — New York' },
  { value: 'NC', label: 'NC — North Carolina' },
  { value: 'ND', label: 'ND — North Dakota' },
  { value: 'OH', label: 'OH — Ohio' },
  { value: 'OK', label: 'OK — Oklahoma' },
  { value: 'OR', label: 'OR — Oregon' },
  { value: 'PA', label: 'PA — Pennsylvania' },
  { value: 'RI', label: 'RI — Rhode Island' },
  { value: 'SC', label: 'SC — South Carolina' },
  { value: 'SD', label: 'SD — South Dakota' },
  { value: 'TN', label: 'TN — Tennessee' },
  { value: 'TX', label: 'TX — Texas' },
  { value: 'UT', label: 'UT — Utah' },
  { value: 'VT', label: 'VT — Vermont' },
  { value: 'VA', label: 'VA — Virginia' },
  { value: 'WA', label: 'WA — Washington' },
  { value: 'WV', label: 'WV — West Virginia' },
  { value: 'WI', label: 'WI — Wisconsin' },
  { value: 'WY', label: 'WY — Wyoming' }
];