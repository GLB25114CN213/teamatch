'use client';

import React from 'react';
import { ExternalLink, RefreshCw, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import { GithubIcon } from '@/components/Icons';

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  role?: string | null;
  teamSize?: number;
  analysis?: {
    status: string;
    complexity?: string;
    aiAssistanceLevel?: string;
    aiAssistanceEvidence?: string;
    technicalOwnershipLevel?: string;
    technicalOwnershipEvidence?: string;
    skillsJson?: string;
    failureReason?: string | null;
  } | null;
  onReanalyze?: (id: string) => void;
}

export function ProjectCard({
  id,
  title,
  description,
  githubUrl,
  liveUrl,
  role,
  teamSize,
  analysis,
  onReanalyze,
}: ProjectCardProps) {
  let verifiedSkills: any[] = [];
  let aiEvidence: string[] = [];
  let ownershipEvidence: string[] = [];

  try {
    verifiedSkills = JSON.parse(analysis?.skillsJson || '[]');
    aiEvidence = JSON.parse(analysis?.aiAssistanceEvidence || '[]');
    ownershipEvidence = JSON.parse(analysis?.technicalOwnershipEvidence || '[]');
  } catch {}

  const isAnalyzing = analysis?.status === 'analyzing' || analysis?.status === 'queued';
  const isFailed = analysis?.status === 'failed';

  return (
    <div className="card-editorial p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900 text-base">{title}</h3>
            {analysis?.complexity && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                {analysis.complexity}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-0.5">
            Role: <span className="font-semibold text-gray-800">{role || 'Contributor'}</span> · Team Size: {teamSize || 1}
          </p>
        </div>

        {/* AI Status */}
        <div className="shrink-0 text-right">
          {isAnalyzing ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing...</span>
            </span>
          ) : isFailed ? (
            <button
              onClick={() => onReanalyze && onReanalyze(id)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Retry Analysis</span>
            </button>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>AI Verified</span>
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 mt-3 leading-relaxed">{description}</p>

      {/* Verified Skills */}
      {verifiedSkills.length > 0 && (
        <div className="mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
            Evidence-Extracted Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {verifiedSkills.map((sk: any, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
                {sk.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Assessment */}
      {analysis && analysis.status === 'completed' && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-stone-50/90 rounded-xl border border-stone-200/80">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">AI-Assisted Dev</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                {analysis.aiAssistanceLevel || 'Light'}
              </span>
            </div>
            {aiEvidence.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {aiEvidence.map((ev, idx) => (
                  <li key={idx} className="text-[11px] text-gray-600 flex items-center space-x-1">
                    <span className="w-1 h-1 rounded-full bg-stone-400 shrink-0" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-700" />
                Technical Ownership
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                {analysis.technicalOwnershipLevel || 'High'}
              </span>
            </div>
            {ownershipEvidence.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {ownershipEvidence.map((ev, idx) => (
                  <li key={idx} className="text-[11px] text-gray-600 flex items-center space-x-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Footer Links */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center space-x-4 text-xs font-medium">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>Repository Code</span>
          </a>
        )}
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 text-emerald-800 hover:text-emerald-900 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Demo</span>
          </a>
        )}
      </div>
    </div>
  );
}
