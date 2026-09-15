'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Calendar, ArrowRight } from 'lucide-react';

export interface OpportunityCardProps {
  id: string;
  title: string;
  type: string;
  description: string;
  requiredSkills: string[];
  membersNeeded: number;
  currentTeamSize: number;
  deadline?: string | null;
  status: string;
  imageUrl?: string | null;
  creator: {
    id: string;
    name: string;
    branch: string;
    year: string;
    avatarUrl?: string | null;
  };
}

export function OpportunityCard({
  id,
  title,
  type,
  description,
  requiredSkills,
  membersNeeded,
  currentTeamSize,
  deadline,
  status,
  imageUrl,
  creator,
}: OpportunityCardProps) {
  const percentFilled = Math.min(Math.round((currentTeamSize / membersNeeded) * 100), 100);

  return (
    <div className="card-editorial p-6 flex flex-col justify-between group">
      <div>
        {/* Optional Image Header */}
        {imageUrl && (
          <div className="editorial-image-container mb-4 h-40 w-full bg-stone-100">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Top Type & Deadline */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200">
            {type === 'SIH' ? 'SIH 2026' : type}
          </span>

          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {deadline ? new Date(deadline).toLocaleDateString() : 'Open'}
          </span>
        </div>

        {/* Opportunity Title */}
        <h3 className="font-serif-editorial text-xl text-gray-900 group-hover:text-[#0A2B22] transition-colors leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">{description}</p>

        {/* Creator Info */}
        <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-100">
          <img
            src={creator.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={creator.name}
            className="w-6 h-6 rounded-md object-cover"
          />
          <span className="text-xs text-gray-600">
            Posted by <span className="font-semibold text-gray-900">{creator.name}</span> ({creator.branch} · {creator.year})
          </span>
        </div>

        {/* Looking For Skills */}
        <div className="mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Looking For
          </span>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.slice(0, 4).map((sk, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Roster Progress & CTA */}
      <div className="mt-5 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1.5">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-800" />
            Team Roster
          </span>
          <span className="text-emerald-800">
            {currentTeamSize} / {membersNeeded} members ({percentFilled}%)
          </span>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-emerald-800 rounded-full transition-all" style={{ width: `${percentFilled}%` }} />
        </div>

        <Link
          href={`/opportunities/${id}`}
          className="w-full flex items-center justify-center space-x-1.5 py-2 bg-gray-900 hover:bg-emerald-900 text-white font-medium text-xs rounded-lg transition-colors"
        >
          <span>View Opportunity →</span>
        </Link>
      </div>
    </div>
  );
}
