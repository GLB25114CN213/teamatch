'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [year, setYear] = useState('3rd Year');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          branch,
          year,
          githubUrl: githubUrl || undefined,
          linkedinUrl: linkedinUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6 bg-noise">
      <div className="editorial-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#0A2B22] text-[#B7F34A] border border-[#B7F34A]/30 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B7F34A]" />
            Student Account Registration
          </span>
          <h1 className="font-serif-editorial text-3xl text-gray-900">Join TeamMatch</h1>
          <p className="text-xs text-[#5A6963] font-sans-editorial">
            Create your account to match with teammates based on verified technical skills.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Branch / Major
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="AI/DS">AI/DS</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                GitHub URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                LinkedIn URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-extrabold text-xs rounded-xl transition-all active:scale-98 flex items-center justify-center space-x-2 shadow-md mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#5A6963]">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-extrabold text-[#0A2B22] hover:underline">
            Log In →
          </Link>
        </div>
      </div>
    </div>
  );
}
