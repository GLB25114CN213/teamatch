'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { OpportunityCard } from '@/components/OpportunityCard';
import { Plus, Quote } from 'lucide-react';

const SAMPLE_PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
];

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [type, setType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, [type]);

  const fetchOpportunities = () => {
    setLoading(true);
    const url = type === 'All' ? '/api/opportunities' : `/api/opportunities?type=${encodeURIComponent(type)}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.opportunities) setOpportunities(data.opportunities);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="space-y-12 py-4 bg-noise">
      
      {/* CINEMATIC DARK HERO */}
      <section className="relative overflow-hidden bg-[#051A14] text-[#F8F7F5] rounded-3xl p-8 sm:p-12 md:p-16 border border-[#B7F34A]/25 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B7F34A]/10 rounded-full blur-3xl pointer-events-none ambient-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#19C37D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif-editorial leading-[1.05] text-white">
              Build what <br />
              matters, <span className="text-[#B7F34A] italic font-serif-editorial">together.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#9BB0A6] max-w-xl leading-relaxed font-sans-editorial">
              Explore verified SIH 2026 problem statements, hackathon rosters, and college ventures seeking developers with complementary technical evidence.
            </p>

            {/* Quick stats row */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#B7F34A]/15 text-xs text-[#9BB0A6]">
              <div>
                <span className="font-extrabold text-white text-lg block">12</span>
                <span>Active Projects</span>
              </div>
              <div className="h-6 w-px bg-[#B7F34A]/20" />
              <div>
                <span className="font-extrabold text-[#B7F34A] text-lg block">4</span>
                <span>SIH 2026 Statements</span>
              </div>
              <div className="h-6 w-px bg-[#B7F34A]/20" />
              <div>
                <span className="font-extrabold text-[#19C37D] text-lg block">8</span>
                <span>Hackathon Teams</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/opportunities/new"
                className="inline-flex items-center space-x-2 px-7 py-3.5 bg-[#B7F34A] hover:bg-[#A6E239] text-[#051A14] font-black text-xs rounded-xl transition-all active:scale-95 shadow-lg shadow-[#B7F34A]/10"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Post Opportunity</span>
              </Link>
            </div>
          </div>

          {/* Right Quote / Art Element */}
          <div className="lg:col-span-4 bg-[#0A2B22] p-7 rounded-2xl border border-[#B7F34A]/20 space-y-4 shadow-xl">
            <Quote className="w-8 h-8 text-[#B7F34A]" />
            <blockquote className="font-serif-editorial text-xl text-white leading-snug">
              “Great projects don’t happen alone. They are forged by teams with complementary, evidence-proven skills.”
            </blockquote>
            <p className="text-xs text-[#9BB0A6] font-sans-editorial">
              — GLBITM Innovation Desk
            </p>
          </div>

        </div>
      </section>

      {/* FILTER TABS */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {['All', 'SIH', 'Hackathon', 'College Project', 'Research', 'Startup', 'Personal Project'].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                type === t
                  ? 'bg-[#0A2B22] text-[#B7F34A] shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-stone-100 border border-gray-200'
              }`}
            >
              {t === 'SIH' ? 'SIH 2026' : t}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#5A6963] font-semibold">
          Showing <span className="text-gray-900 font-extrabold">{opportunities.length}</span> opportunities
        </span>
      </div>

      {/* OPPORTUNITIES FEED GRID */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500 editorial-card">Loading opportunities...</div>
      ) : opportunities.length === 0 ? (
        <div className="editorial-card p-12 text-center space-y-3">
          <h3 className="font-serif-editorial text-2xl text-gray-900">No active opportunities found</h3>
          <p className="text-xs text-[#5A6963]">Be the first student to announce an SIH 2026 or Hackathon project!</p>
          <Link href="/opportunities/new" className="inline-block px-5 py-2.5 bg-[#0A2B22] text-[#B7F34A] font-bold text-xs rounded-xl">
            + Post Opportunity
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp, idx) => (
            <OpportunityCard
              key={opp.id}
              {...opp}
              imageUrl={SAMPLE_PROJECT_IMAGES[idx % SAMPLE_PROJECT_IMAGES.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
