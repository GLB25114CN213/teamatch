'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { MatchScoreRing } from '@/components/MatchScoreRing';

export interface MatchCardProps {
  id: string;
  name: string;
  branch: string;
  year: string;
  avatarUrl?: string | null;
  matchScore: number;
  matchReasons: string[];
  verifiedSkills: { name: string; confidence?: string }[];
  selfDeclaredSkills?: { name: string }[];
  availability?: string;
  projectCount?: number;
  featured?: boolean;
}

export function MatchCard({
  id,
  name,
  branch,
  year,
  avatarUrl,
  matchScore,
  matchReasons,
  verifiedSkills,
  selfDeclaredSkills = [],
  availability = 'Available',
  projectCount = 0,
  featured = false,
}: MatchCardProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  if (featured) {
    return (
      <div className="editorial-card-dark p-7 relative overflow-hidden group">
        {/* Ambient lighting backdrop */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#B7F34A]/10 rounded-full blur-3xl pointer-events-none ambient-pulse" />

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#B7F34A]/30 shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B7F34A] block mb-0.5">
                  Top Recommended Teammate
                </span>
                <h3 className="font-extrabold text-white text-xl group-hover:text-[#B7F34A] transition-colors">
                  {name}
                </h3>
                <p className="text-xs text-[#A3B8AD] font-medium mt-0.5">
                  {branch} · {year} · <span className="text-[#19C37D] font-semibold">{projectCount} Verified Repos</span>
                </p>
              </div>
            </div>

            {/* SVG Animated Score Ring */}
            <div className="shrink-0">
              <MatchScoreRing score={matchScore} size={68} strokeWidth={5} />
            </div>
          </div>

          {/* Rationale / Match Reasons */}
          {matchReasons && matchReasons.length > 0 && (
            <div className="p-4 bg-[#051A14]/90 rounded-xl border border-[#B7F34A]/20 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B7F34A] block">
                Why this match
              </span>
              <div className="space-y-2">
                {matchReasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-[#FFFFFF] flex items-center space-x-2.5 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#19C37D]/20 text-[#19C37D] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span className="font-medium">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Skills */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A3B8AD] block mb-2">
              Verified Technical Evidence
            </span>
            <div className="flex flex-wrap gap-2">
              {verifiedSkills.slice(0, 5).map((sk, i) => {
                const isHovered = hoveredSkill === sk.name;
                return (
                  <span
                    key={i}
                    onMouseEnter={() => setHoveredSkill(sk.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                      isHovered
                        ? 'bg-[#B7F34A] text-[#051A14] scale-105 border-transparent shadow-[0_0_15px_rgba(183,243,74,0.4)]'
                        : 'bg-[#0A2B22] text-[#F5F3EA] border border-[#B7F34A]/25 hover:border-[#B7F34A]/60'
                    }`}
                  >
                    {sk.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-3 border-t border-[#B7F34A]/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#19C37D]">
              ● {availability}
            </span>

            <Link
              href={`/students/${id}`}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#B7F34A] hover:bg-[#A6E239] text-[#051A14] font-black text-xs rounded-xl transition-all active:scale-95 shadow-md"
            >
              <span>View Full Profile</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editorial-card p-6 flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <img
              src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={name}
              className="w-12 h-12 rounded-xl object-cover border border-gray-200 group-hover:scale-105 transition-transform duration-300"
            />
            <div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-[#0A2B22] transition-colors">
                {name}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {branch} · {year}
                {projectCount > 0 && <span className="ml-1 text-gray-400">({projectCount} repos)</span>}
              </p>
            </div>
          </div>

          {/* SVG Score Ring for Standard Card */}
          <div className="shrink-0">
            <MatchScoreRing score={matchScore} size={54} strokeWidth={4} />
          </div>
        </div>

        {/* Why this match */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="p-3 bg-[#F6F5F0] rounded-xl border border-gray-200/60 space-y-1.5">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#0A2B22] block mb-1">
              Why this match
            </span>
            {matchReasons.map((reason, idx) => (
              <div
                key={idx}
                className="text-xs text-gray-800 flex items-center space-x-1.5 font-medium animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#19C37D] shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Verified Skills */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
            Verified Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {verifiedSkills.slice(0, 4).map((sk, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#EFECE6] text-[#0A2B22] border border-gray-300/60 hover:bg-[#0A2B22] hover:text-[#B7F34A] transition-colors cursor-pointer"
              >
                {sk.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">
          ● {availability}
        </span>

        <Link
          href={`/students/${id}`}
          className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-[#0A2B22] hover:bg-[#061C17] text-[#B7F34A] font-bold text-xs rounded-lg transition-all active:scale-95"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
