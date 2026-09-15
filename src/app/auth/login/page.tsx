'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');

      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 bg-noise">
      <div className="editorial-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#0A2B22] text-[#B7F34A] border border-[#B7F34A]/30 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B7F34A]" />
            GLBITM Student Portal
          </span>
          <h1 className="font-serif-editorial text-3xl text-gray-900">Welcome Back</h1>
          <p className="text-xs text-[#5A6963] font-sans-editorial">
            Log in with your verified @glbitm.ac.in credentials to access candidate recommendations.
          </p>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              GLBITM Email
            </label>
            <input
              type="email"
              required
              placeholder="student.name.cse24@glbitm.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-extrabold text-xs rounded-xl transition-all active:scale-98 flex items-center justify-center space-x-2 shadow-md"
          >
            <span>{loading ? 'Authenticating...' : 'Log In to TeamMatch'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#5A6963]">
          Need an account?{' '}
          <Link href="/auth/register" className="font-extrabold text-[#0A2B22] hover:underline">
            Register with GLBITM Email →
          </Link>
        </div>
      </div>
    </div>
  );
}
