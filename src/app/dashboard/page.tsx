'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MatchCard } from '@/components/MatchCard';
import { OpportunityCard } from '@/components/OpportunityCard';
import { NetworkGraphHero } from '@/components/NetworkGraphHero';
import { Users, Plus, FolderCode, CheckCircle2, Compass, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data);
      })
      .catch(() => {});

    fetch('/api/students')
      .then((res) => res.json())
      .then((data) => {
        if (data.students) setRecommendations(data.students);
      })
      .catch(() => {});

    fetch('/api/opportunities')
      .then((res) => res.json())
      .then((data) => {
        if (data.opportunities) setOpportunities(data.opportunities);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 py-4 bg-noise">
      {/* ART-DIRECTED DASHBOARD HERO HEADER */}
      <section className="relative overflow-hidden bg-[#051A14] text-[#F8F7F5] rounded-3xl p-8 sm:p-12 border border-[#B7F34A]/25 shadow-2xl ambient-glow-dark">
        {/* Ambient radial lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B7F34A]/10 rounded-full blur-3xl pointer-events-none ambient-pulse" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-serif-editorial leading-[1.05] text-white">
                Build better <br />
                <span className="text-[#B7F34A] italic font-serif-editorial">teams, together.</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#9BB0A6] leading-relaxed pt-1 max-w-lg font-sans-editorial">
                Find students whose verified technical evidence complements what you can build for SIH 2026 and college projects.
              </p>
            </div>

            {/* Candidate avatar stack summary */}
            <div className="flex items-center space-x-3 pt-1">
              <div className="avatar-stack avatar-stack-dark">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Student" className="w-7 h-7" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Student" className="w-7 h-7" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Student" className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-[#9BB0A6]">
                12 verified GLBITM candidates match your requirements
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/students"
                className="px-6 py-3 bg-[#B7F34A] hover:bg-[#A6E239] text-[#051A14] font-black text-xs rounded-xl transition-all active:scale-98 shadow-lg shadow-[#B7F34A]/10 flex items-center justify-center space-x-2"
              >
                <Users className="w-4 h-4 stroke-[2.5]" />
                <span>Find Teammates</span>
              </Link>

              <Link
                href="/opportunities/new"
                className="px-6 py-3 bg-[#0A2B22] hover:bg-[#0E3A2E] text-white font-bold text-xs rounded-xl border border-[#B7F34A]/25 transition-all active:scale-98 flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Post Opportunity</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Candidate SVG Network Graph */}
          <div className="lg:col-span-6">
            <NetworkGraphHero />
          </div>
        </div>
      </section>

      {/* MEANINGFUL PRODUCT METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="editorial-card p-5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-[#0A2B22] text-[#B7F34A] flex items-center justify-center font-bold shrink-0">
            <FolderCode className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-gray-900 text-lg block leading-none">3 Projects</span>
            <span className="text-xs text-[#5A6963] font-medium mt-1 block">GitHub Repos Analyzed</span>
          </div>
        </div>

        <div className="editorial-card p-5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-[#0A2B22] text-[#19C37D] flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-gray-900 text-lg block leading-none">4 Verified Skills</span>
            <span className="text-xs text-[#5A6963] font-medium mt-1 block">Evidence-Backed Capability</span>
          </div>
        </div>

        <div className="editorial-card p-5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-[#0A2B22] text-[#B7F34A] flex items-center justify-center font-bold shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-gray-900 text-lg block leading-none">{opportunities.length} Active Opportunities</span>
            <span className="text-xs text-[#5A6963] font-medium mt-1 block">Open Team Announcements</span>
          </div>
        </div>
      </div>

      {/* STAGGERED MATCHMAKING COMPOSITION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A2B22] block">
              RECOMMENDED FOR YOU
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-editorial text-gray-900 leading-tight">
              Find the people who complete your team
            </h2>
          </div>

          <Link href="/students" className="text-xs font-bold text-[#0A2B22] hover:text-[#19C37D] transition-colors flex items-center gap-1">
            <span>Explore All Teammates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 editorial-card">Loading recommendations...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Featured Candidate */}
            {recommendations[0] && (
              <div className="lg:col-span-7">
                <MatchCard
                  id={recommendations[0].id}
                  name={recommendations[0].name}
                  branch={recommendations[0].branch}
                  year={recommendations[0].year}
                  avatarUrl={recommendations[0].avatarUrl}
                  matchScore={94}
                  matchReasons={[
                    'Python — verified through 3 projects',
                    'Computer Vision — 2 relevant projects analyzed',
                    'SIH 2026 active team seeker & available',
                  ]}
                  verifiedSkills={recommendations[0].verifiedSkills || []}
                  selfDeclaredSkills={recommendations[0].selfDeclaredSkills || []}
                  availability={recommendations[0].availability}
                  projectCount={recommendations[0].projectCount || 2}
                  featured={true}
                />
              </div>
            )}

            {/* Secondary Supporting Candidates */}
            <div className="lg:col-span-5 space-y-5">
              {recommendations.slice(1, 3).map((st, idx) => (
                <MatchCard
                  key={st.id}
                  id={st.id}
                  name={st.name}
                  branch={st.branch}
                  year={st.year}
                  avatarUrl={st.avatarUrl}
                  matchScore={91 - idx * 3}
                  matchReasons={[
                    'Backend API evidence in Node/PostgreSQL',
                    'SIH 2026 interest & available',
                  ]}
                  verifiedSkills={st.verifiedSkills || []}
                  selfDeclaredSkills={st.selfDeclaredSkills || []}
                  availability={st.availability}
                  projectCount={st.projectCount || 2}
                  featured={false}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* EDITORIAL OPPORTUNITIES FEED */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A2B22] block">
              PROJECT ANNOUNCEMENTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-editorial text-gray-900 leading-tight">
              Active Team Opportunities
            </h2>
          </div>

          <Link href="/opportunities" className="text-xs font-bold text-[#0A2B22] hover:text-[#19C37D] transition-colors flex items-center gap-1">
            <span>View All Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} {...opp} />
          ))}
        </div>
      </section>
    </div>
  );
}
