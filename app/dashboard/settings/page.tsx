'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

// 国コードリスト（主要なもの）
const countryCodes = [
  { code: '+1', country: 'US/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+81', country: 'Japan' },
  { code: '+86', country: 'China' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+61', country: 'Australia' },
  { code: '+82', country: 'South Korea' },
  { code: '+91', country: 'India' },
  { code: '+7', country: 'Russia' },
  { code: '+55', country: 'Brazil' },
  { code: '+52', country: 'Mexico' },
  { code: '+31', country: 'Netherlands' },
  { code: '+46', country: 'Sweden' },
  { code: '+47', country: 'Norway' },
  { code: '+41', country: 'Switzerland' },
  { code: '+32', country: 'Belgium' },
  { code: '+351', country: 'Portugal' },
  { code: '+353', country: 'Ireland' },
  { code: '+358', country: 'Finland' },
  { code: '+45', country: 'Denmark' },
  { code: '+64', country: 'New Zealand' },
  { code: '+65', country: 'Singapore' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+886', country: 'Taiwan' },
  { code: '+971', country: 'UAE' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+27', country: 'South Africa' },
];

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
  { value: 'WY', label: 'WY — Wyoming' },
];

const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  return { value: String(month).padStart(2, '0'), label: String(month).padStart(2, '0') };
});

const YEARS = Array.from({ length: 20 }, (_, i) => {
  const year = new Date().getFullYear() + i;
  return { value: String(year), label: String(year) };
});

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('US');
  const [stateRegion, setStateRegion] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpMonth, setCardExpMonth] = useState('');
  const [cardExpYear, setCardExpYear] = useState('');
  const [cardSecurityCode, setCardSecurityCode] = useState('');
  const [brandName, setBrandName] = useState('');
  const [brandLink, setBrandLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [zipStatus, setZipStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

  // ZIPコードから都市と州を自動入力
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
      }
      if (nextState) {
        setStateRegion(nextState);
      }
      setZipStatus('ok');
    } catch {
      setZipStatus('error');
    }
  };

  // データを読み込む
  useEffect(() => {
    if (!isLoaded || !user) return;

    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/user-settings', { method: 'GET' });
        const json = (await res.json()) as { data?: any; error?: string };
        if (!res.ok) throw new Error(json.error || 'Failed to load settings');

        const data = json.data;
        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setCountry(data.country || 'US');
          setStateRegion(data.state_region || '');
          setZipCode(data.zip_code || '');
          setCity(data.city || '');
          setAddressLine1(data.address_line1 || '');
          setAddressLine2(data.address_line2 || '');
          // カード番号を4桁ずつスペースで区切って表示
          const cardNum = data.card_number || '';
          const formattedCardNumber = cardNum.replace(/(\d{4})(?=\d)/g, '$1 ');
          setCardNumber(formattedCardNumber);
          setCardName(data.card_name || '');
          setCardExpMonth(data.card_exp_month || '');
          setCardExpYear(data.card_exp_year || '');
          setCardSecurityCode(data.card_security_code || '');
          setBrandName(data.brand_name || '');
          setBrandLink(data.brand_link || '');
          
          // 電話番号を国コードと番号に分割
          if (data.phone_number) {
            const phoneMatch = data.phone_number.match(/^(\+\d+)(.+)$/);
            if (phoneMatch) {
              setPhoneCountryCode(phoneMatch[1]);
              setPhoneNumber(phoneMatch[2]);
            } else {
              setPhoneNumber(data.phone_number);
            }
          }
        }
      } catch (error: any) {
        console.error('Error loading settings:', error);
        setMessage({ type: 'error', text: 'Failed to load settings' });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [isLoaded, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const fullPhoneNumber = phoneNumber ? `${phoneCountryCode}${phoneNumber}` : null;

      // カード番号からスペースを削除して保存
      const cardNumberDigits = cardNumber ? cardNumber.replace(/\s/g, '') : null;

      const settingsData = {
        first_name: firstName || null,
        last_name: lastName || null,
        country: country || 'US',
        state_region: stateRegion || null,
        zip_code: zipCode || null,
        city: city || null,
        address_line1: addressLine1 || null,
        address_line2: addressLine2 || null,
        email: user.emailAddresses[0]?.emailAddress || null,
        phone_number: fullPhoneNumber,
        card_number: cardNumberDigits,
        card_name: cardName || null,
        card_exp_month: cardExpMonth || null,
        card_exp_year: cardExpYear || null,
        card_security_code: cardSecurityCode || null,
        brand_name: brandName || null,
        brand_link: brandLink || null,
        updated_at: new Date().toISOString(),
      };

      const res = await fetch('/api/user-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error || 'Failed to save settings');

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to save settings',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div
        style={{
          background: 'linear-gradient(to bottom, rgb(255, 255, 255), rgb(237, 237, 237))',
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#000' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom, rgb(255, 255, 255), rgb(237, 237, 237))',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex'
      }}
    >
      {/* Left sidebar */}
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

      {/* Main content */}
      <div style={{ marginLeft: '75px', padding: '1.25rem', width: '100%', maxWidth: '900px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '1rem', color: '#000' }}>Settings</h1>
        
        {isLoading ? (
          <div style={{ background: 'white', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#000' }}>Loading settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {/* First Name and Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    color: '#000',
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    color: '#000',
                  }}
                  required
                />
              </div>
            </div>

            {/* Address Section */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#000', fontSize: '1.02rem' }}>
                Address *
              </label>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000', fontSize: '0.88rem' }}>
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      color: '#000',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000', fontSize: '0.88rem' }}>
                    State / Province
                  </label>
                  <select
                    value={stateRegion}
                    onChange={(e) => setStateRegion(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      color: '#000',
                    }}
                  >
                    <option value="">Select state</option>
                    {US_STATES.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000', fontSize: '0.88rem' }}>
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => {
                      const only = e.target.value.replace(/\D/g, '').slice(0, 5);
                      setZipCode(only);
                      setZipStatus(only.length === 5 ? 'loading' : 'idle');
                      if (only.length === 5) lookupZip(only);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      color: '#000',
                    }}
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000', fontSize: '0.88rem' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      color: '#000',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000', fontSize: '0.88rem' }}>
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    color: '#000',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000', fontSize: '0.88rem' }}>
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    color: '#000',
                  }}
                />
              </div>

              {zipStatus !== 'idle' && (
                <div style={{ marginTop: '0.5rem', fontSize: '12px', color: zipStatus === 'error' ? '#b00020' : '#000' }}>
                  {zipStatus === 'loading' && 'Looking up ZIP…'}
                  {zipStatus === 'ok' && 'ZIP matched. City/State auto-filled.'}
                  {zipStatus === 'error' && 'ZIP not found. Please enter City/State manually.'}
                </div>
              )}
            </div>

            {/* Email (read-only from Clerk) */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000' }}>
                Email
              </label>
              <input
                type="email"
                value={user?.emailAddresses[0]?.emailAddress || ''}
                disabled
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  backgroundColor: '#f5f5f5',
                  color: '#000',
                }}
              />
              <p style={{ marginTop: '0.25rem', fontSize: '0.82rem', color: '#000' }}>
                Email is managed by Clerk
              </p>
            </div>

            {/* Password (read-only from Clerk) */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000' }}>
                Password
              </label>
              <input
                type="password"
                value="••••••••"
                disabled
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  backgroundColor: '#f5f5f5',
                  color: '#000',
                }}
              />
              <p style={{ marginTop: '0.25rem', fontSize: '0.82rem', color: '#000' }}>
                Password is managed by Clerk
              </p>
            </div>

            {/* Phone Number (optional) */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000' }}>
                Phone Number (Optional)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  style={{
                    padding: '0.6rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    minWidth: '120px',
                    color: '#000',
                  }}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} ({country.country})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Phone number"
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    color: '#000',
                  }}
                />
              </div>
            </div>

            {/* Payment Info */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#000', fontSize: '1.02rem' }}>
                Payment Info *
              </label>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000', fontSize: '0.88rem' }}>
                  Card Number *
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    // 数字のみを抽出して最大16桁まで
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                    // 4桁ずつスペースで区切る
                    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
                    setCardNumber(formatted);
                  }}
                  placeholder="1234 5678 9012 3456"
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    color: '#000',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000', fontSize: '0.88rem' }}>
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    color: '#000',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000', fontSize: '0.88rem' }}>
                    Expiration Month *
                  </label>
                  <select
                    value={cardExpMonth}
                    onChange={(e) => setCardExpMonth(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      color: '#000',
                    }}
                    required
                  >
                    <option value="">Month</option>
                    {MONTHS.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000', fontSize: '0.88rem' }}>
                    Expiration Year *
                  </label>
                  <select
                    value={cardExpYear}
                    onChange={(e) => setCardExpYear(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      color: '#000',
                    }}
                    required
                  >
                    <option value="">Year</option>
                    {YEARS.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000', fontSize: '0.88rem' }}>
                    Security Code (CVV) *
                  </label>
                  <input
                    type="text"
                    value={cardSecurityCode}
                    onChange={(e) => setCardSecurityCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '0.95rem',
                      color: '#000',
                    }}
                    inputMode="numeric"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Brand Name (optional) */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000' }}>
                Brand Name (Optional)
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Your brand name"
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  color: '#000',
                }}
              />
            </div>

            {/* Brand Link (optional) */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, color: '#000' }}>
                Brand Link (Optional)
              </label>
              <input
                type="url"
                value={brandLink}
                onChange={(e) => setBrandLink(e.target.value)}
                placeholder="https://yourbrand.com"
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  color: '#000',
                }}
              />
            </div>

            {/* Message */}
            {message && (
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: message.type === 'success' ? '#155724' : '#721c24',
                }}
              >
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              style={{
                width: '100%',
                padding: '0.65rem',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
