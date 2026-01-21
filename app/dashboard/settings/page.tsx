'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

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

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentInfo, setPaymentInfo] = useState('');
  const [brandName, setBrandName] = useState('');
  const [brandLink, setBrandLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // データを読み込む
  useEffect(() => {
    if (!isLoaded || !user) return;

    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user-settings')
          .select('*')
          .eq('clerk_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116は「行が見つからない」エラー
          throw error;
        }

        if (data) {
          setName(data.name || '');
          setAddress(data.address || '');
          setPaymentInfo(data.payment_info || '');
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

      const settingsData = {
        clerk_id: user.id,
        name: name || null,
        address: address || null,
        email: user.emailAddresses[0]?.emailAddress || null,
        phone_number: fullPhoneNumber,
        payment_info: paymentInfo || null,
        brand_name: brandName || null,
        brand_link: brandLink || null,
        updated_at: new Date().toISOString(),
      };

      // UPSERT（存在すれば更新、なければ挿入）
      const { error } = await supabase
        .from('user-settings')
        .upsert(settingsData, {
          onConflict: 'clerk_id',
        });

      if (error) throw error;

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
        <p>Loading...</p>
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
          <Image
            src="/order.png"
            alt="Order"
            width={30}
            height={30}
            className="object-contain"
          />
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
      <div style={{ marginLeft: '75px', padding: '2rem', width: '100%', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Settings</h1>
        
        {isLoading ? (
          <div style={{ background: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p>Loading settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {/* Name */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                }}
                required
              />
            </div>

            {/* Address */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Address *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  resize: 'vertical',
                }}
                required
              />
            </div>

            {/* Email (read-only from Clerk) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Email
              </label>
              <input
                type="email"
                value={user?.emailAddresses[0]?.emailAddress || ''}
                disabled
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                }}
              />
              <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#666' }}>
                Email is managed by Clerk
              </p>
            </div>

            {/* Password (read-only from Clerk) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Password
              </label>
              <input
                type="password"
                value="••••••••"
                disabled
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                }}
              />
              <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#666' }}>
                Password is managed by Clerk
              </p>
            </div>

            {/* Phone Number (optional) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Phone Number (Optional)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    minWidth: '120px',
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
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                  }}
                />
              </div>
            </div>

            {/* Payment Info */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Payment Info *
              </label>
              <textarea
                value={paymentInfo}
                onChange={(e) => setPaymentInfo(e.target.value)}
                rows={4}
                placeholder="Enter payment information (e.g., credit card details, PayPal email, etc.)"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  resize: 'vertical',
                }}
                required
              />
            </div>

            {/* Brand Name (optional) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Brand Name (Optional)
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Your brand name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
                }}
              />
            </div>

            {/* Brand Link (optional) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>
                Brand Link (Optional)
              </label>
              <input
                type="url"
                value={brandLink}
                onChange={(e) => setBrandLink(e.target.value)}
                placeholder="https://yourbrand.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '1rem',
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
                padding: '0.75rem',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
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
