'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export interface StudentCardProps {
  id: string;
  name: string;
  branch: string;
  year: string;
  bio?: string | null;
  avatarUrl?: string | null;
  availability: string;
  matchScore?: number;
  matchReasons?: string[];
  verifiedSkills: { name: string; confidence?: string }[];
  selfDeclaredSkills: { name: string }[];
  projectCount: number;
}

export function StudentCard({
  id,
  name,
  branch,
  year,
  bio,
  avatarUrl,
  availability,
  matchScore,
  matchReasons,
  verifiedSkills,
  selfDeclaredSkills,
  projectCount,
}: StudentCardProps) {
  return (
    <div className="card-editorial p-6 flex flex-col justify-between group">
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <img
              src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={name}
              className="w-12 h-12 rounded-xl object-cover border border-gray-200"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-800 transition-colors">
                  {name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {branch} · {year} · <span className="text-emerald-800 font-semibold">{projectCount} Projects</span>
              </p>
            </div>
          </div>

          {matchScore !== undefined && (
            <div className="bg-emerald-900 text-white px-2.5 py-1 rounded-lg text-right shrink-0">
              <span className="font-extrabold text-sm">{matchScore}%</span>
              <span className="text-[9px] text-emerald-200 block uppercase font-semibold">Match</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {bio && <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">{bio}</p>}

        {/* Match Reasons */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="mt-3.5 p-3 bg-stone-50 rounded-xl border border-stone-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Why this match
            </span>
            <ul className="space-y-1">
              {matchReasons.map((reason, idx) => (
                <li key={idx} className="text-xs font-medium text-gray-800 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Verified vs Self Declared */}
        <div className="mt-4 space-y-2.5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
              Verified Skills ({verifiedSkills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {verifiedSkills.slice(0, 4).map((sk, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200"
                >
                  {sk.name}
                </span>
              ))}
              {verifiedSkills.length === 0 && (
                <span className="text-xs text-gray-400 italic">No project evidence yet</span>
              )}
            </div>
          </div>

          {selfDeclaredSkills.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Self-Declared
              </span>
              <div className="flex flex-wrap gap-1">
                {selfDeclaredSkills.slice(0, 3).map((sd, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-[11px] text-gray-600 bg-gray-100 border border-gray-200">
                    {sd.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span
          className={`text-xs font-medium ${
            availability === 'Available' ? 'text-emerald-700' : 'text-gray-500'
          }`}
        >
          ● {availability}
        </span>

        <Link
          href={`/students/${id}`}
          className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-gray-900 hover:bg-emerald-900 text-white font-medium text-xs rounded-lg transition-colors"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
