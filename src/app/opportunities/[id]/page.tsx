'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { MatchCard } from '@/components/MatchCard';
import { MatchScoreRing } from '@/components/MatchScoreRing';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [opportunity, setOpportunity] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [interestSent, setInterestSent] = useState(false);

  const [userMatch, setUserMatch] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/opportunities/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.opportunity) {
          setOpportunity(data.opportunity);
          setRecommendations(data.recommendations || []);
          if (data.userMatch) setUserMatch(data.userMatch);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [resolvedParams.id]);

  const handleExpressInterest = async () => {
    try {
      const res = await fetch(`/api/opportunities/${resolvedParams.id}/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "I'm interested in joining your team!" }),
      });
      if (res.ok) {
        setInterestSent(true);
      }
    } catch {}
  };

  if (loading) return <div className="p-12 text-center text-xs text-gray-500 editorial-card">Loading opportunity details...</div>;

  if (!opportunity) {
    return (
      <div className="editorial-card p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Opportunity Not Found</h2>
        <Link href="/opportunities" className="inline-block px-4 py-2 bg-[#0A2B22] text-[#B7F34A] font-semibold text-xs rounded-lg">
          ← Back to Opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link href="/opportunities" className="inline-flex items-center space-x-1 text-xs font-bold text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Opportunities</span>
      </Link>

      {/* Main Opportunity Banner */}
      <div className="editorial-card p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-stone-100 text-stone-800 border border-stone-200 text-xs font-bold uppercase rounded-lg inline-block mb-3">
              {opportunity.type === 'SIH' ? 'SIH 2026' : opportunity.type}
            </span>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl text-gray-900 leading-tight">{opportunity.title}</h1>
            <p className="text-xs text-gray-500 mt-1">
              Posted by <span className="font-bold text-gray-800">{opportunity.creator.name}</span> ({opportunity.creator.branch} · {opportunity.creator.year})
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {interestSent ? (
              <span className="px-5 py-3 bg-emerald-50 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Interest Expressed</span>
              </span>
            ) : (
              <button
                onClick={handleExpressInterest}
                className="px-6 py-3 bg-[#B7F34A] hover:bg-[#A6E239] text-[#051A14] font-black text-xs rounded-xl transition-all shadow-md flex items-center space-x-2"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>I&apos;m Interested</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed border-t border-gray-100 pt-4 font-sans-editorial">{opportunity.description}</p>

        {/* Required Skills */}
        <div className="pt-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1.5">
            REQUIRED TECHNICAL SKILLS
          </span>
          <div className="flex flex-wrap gap-1.5">
            {opportunity.requiredSkills.map((sk: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-[#F8F7F5] text-gray-900 rounded-lg text-xs font-semibold border border-gray-200">
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* WHY YOU MAY FIT MATCH BLOCK */}
      <div className="editorial-card-dark p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B7F34A] block">
              MATCHMAKING RATIONALE
            </span>
            <h3 className="font-serif-editorial text-2xl text-white mt-0.5">Why you fit this opportunity</h3>
          </div>
          <MatchScoreRing score={userMatch?.score ?? 0} size={64} strokeWidth={5} />
        </div>

        <div className="space-y-2 text-xs text-[#F8F7F5]">
          {userMatch?.reasons && userMatch.reasons.length > 0 ? (
            userMatch.reasons.map((reason: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#19C37D] shrink-0" />
                <span>{reason}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400 italic">
              Submit your project evidence to generate your verified match score against this opportunity.
            </div>
          )}
        </div>
      </div>

      {/* RECOMMENDED CANDIDATE MATCHES */}
      <section className="space-y-4">
        <div>
          <h2 className="font-serif-editorial text-2xl text-gray-900">
            Recommended Candidate Matches ({recommendations.length})
          </h2>
          <p className="text-xs text-gray-500">
            GLBITM students evaluated against required project skills and verified code evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <MatchCard
              key={rec.studentId}
              id={rec.studentId}
              name={rec.name || rec.studentName}
              branch={rec.branch}
              year={rec.year}
              avatarUrl={rec.avatarUrl}
              matchScore={rec.matchScore ?? 0}
              matchReasons={rec.matchReasons || []}
              verifiedSkills={rec.verifiedSkills || []}
              selfDeclaredSkills={rec.selfDeclaredSkills || []}
              availability={rec.availability}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
