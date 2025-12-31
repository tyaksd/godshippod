'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    platform: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('contact-submissions')
        .insert([{ 
          name: formData.name,
          email: formData.email,
          company: formData.company,
          platform: formData.platform,
          created_at: new Date().toISOString() 
        }]);

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Thank you for reaching out! We\'ll get back to you soon.' });
      setFormData({
        name: '',
        email: '',
        company: '',
        platform: '',
      });
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header with logo */}
      <div className="relative bg-[#05060A]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/godship-logo.png"
              alt="Godship"
              width={200}
              height={200}
              className="object-contain w-[200px] h-[70px]"
            />
          </Link>
        </div>
      </div>

      {/* Main content */}
      <section className="relative min-h-[calc(100vh-200px)] bg-[#05060A] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
              Contact Us
            </h1>
            <p className="text-base text-white/70 leading-relaxed">
              Are you an apparel brand looking to partner with us? We'd love to hear from you.
              Fill out the form below and we'll get back to you.
            </p>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-white/80 mb-2">
                Brand store link *
              </label>
              <input
                type="url"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="https://yourstore.com"
              />
            </div>

            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-white/80 mb-2">
                E-commerce platform *
              </label>
              <input
                type="text"
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g., Shopify, Wix, Custom, etc."
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                    : 'bg-red-500/20 border border-red-500/30 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {/* Back to home link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-white/70 hover:text-white transition-colors underline"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

