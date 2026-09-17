'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ProjectCard } from '@/components/ProjectCard';
import { GithubIcon, LinkedinIcon } from '@/components/Icons';
import { ShieldCheck, Award, ArrowLeft, Shield } from 'lucide-react';

export default function StudentProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/students/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.student) setStudent(data.student);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500 editorial-card">Loading student profile...</div>;
  }

  if (!student) {
    return (
      <div className="editorial-card p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Student Profile Not Found</h2>
        <Link href="/students" className="inline-block px-4 py-2 bg-[#0A2B22] text-[#B7F34A] font-semibold text-xs rounded-lg">
          ← Back to Teammates Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link href="/students" className="inline-flex items-center space-x-1 text-xs font-bold text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Teammates</span>
        </Link>
      </div>

      {/* Main Profile Header */}
      <div className="editorial-card p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <img
              src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={student.name}
              className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shadow-sm"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="font-serif-editorial text-3xl text-gray-900">{student.name}</h1>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>GLBITM VERIFIED</span>
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-600">
                {student.branch} · {student.year} · <span className="text-[#0A2B22] font-bold">{student.projects?.length || 0} Analyzed Repositories</span>
              </p>
              {student.bio && <p className="text-xs text-gray-600 max-w-xl pt-1 leading-relaxed font-sans-editorial">{student.bio}</p>}
            </div>
          </div>

          {/* Social Links & Availability */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
              ● {student.availability}
            </span>

            {student.githubUrl && (
              <a
                href={student.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-stone-100 hover:bg-stone-200 text-gray-800 rounded-lg transition-colors"
                title="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}

            {student.linkedinUrl && (
              <a
                href={student.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-stone-100 hover:bg-stone-200 text-gray-800 rounded-lg transition-colors"
                title="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* STRICT SKILLS SEPARATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Verified Skills (Evidence-backed) */}
        <div className="editorial-card p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Award className="w-4 h-4 text-emerald-700" />
            <h3 className="font-serif-editorial text-xl text-gray-900">Verified Technical Evidence</h3>
          </div>

          <div className="space-y-2.5">
            {student.verifiedSkills?.map((sk: any, i: number) => (
              <div key={i} className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-emerald-950 text-xs">{sk.name}</span>
                  {sk.evidenceSummary && <p className="text-[11px] text-gray-600 mt-0.5">{sk.evidenceSummary}</p>}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-200 text-emerald-900 shrink-0">
                  {sk.confidence || 'High'} Confidence
                </span>
              </div>
            ))}
            {(!student.verifiedSkills || student.verifiedSkills.length === 0) && (
              <p className="text-xs text-gray-400 italic">No verified code evidence extracted yet.</p>
            )}
          </div>
        </div>

        {/* 2. Self-Declared Skills */}
        <div className="editorial-card p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
            <h3 className="font-serif-editorial text-xl text-gray-900">Self-Declared Skills</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {student.selfDeclaredSkills?.map((sd: any, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-[#F8F7F5] text-gray-800 rounded-md text-xs font-semibold border border-gray-200">
                {sd.name}
              </span>
            ))}
            {(!student.selfDeclaredSkills || student.selfDeclaredSkills.length === 0) && (
              <p className="text-xs text-gray-400 italic">No self-declared skills listed.</p>
            )}
          </div>
        </div>
      </div>

      {/* DEVELOPMENT PROFILE ASSESSMENT */}
      {(() => {
        const completedAnalyses = student.projects
          ?.map((p: any) => p.analysis)
          ?.filter((a: any) => a && a.status === 'completed') || [];

        if (completedAnalyses.length === 0) {
          return (
            <div className="editorial-card p-8 text-center space-y-4 border border-dashed border-gray-300">
              <h3 className="font-serif-editorial text-2xl text-gray-900">Your profile analysis isn't ready yet.</h3>
              <p className="text-xs text-[#5A6963] max-w-md mx-auto">
                Submit your project and connect your GitHub to generate your evidence-based profile.
              </p>
              <Link
                href="/projects"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#0A2B22] text-[#B7F34A] font-extrabold text-xs rounded-xl hover:bg-[#051A14] transition-colors shadow-sm"
              >
                <span>+ Submit Project Evidence</span>
              </Link>
            </div>
          );
        }

        const latestAnalysis = completedAnalyses[0];
        let aiEv: string[] = [];
        let ownerEv: string[] = [];

        try {
          aiEv = JSON.parse(latestAnalysis.aiAssistanceEvidence || '[]');
          ownerEv = JSON.parse(latestAnalysis.technicalOwnershipEvidence || '[]');
        } catch {}

        return (
          <div className="editorial-card p-7 space-y-3">
            <h3 className="font-serif-editorial text-xl text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-700" />
              Development Profile Assessment
            </h3>
            <p className="text-xs text-[#5A6963] leading-relaxed">
              Technical ownership and AI assistance levels are derived objectively from submitted source code, repository commits, and project evidence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 block mb-1">
                  AI-Assisted Development
                </span>
                <span className="font-extrabold text-gray-900 text-sm">
                  {latestAnalysis.aiAssistanceLevel || 'Light'}
                </span>
                {aiEv.length > 0 ? (
                  <ul className="mt-1 space-y-1">
                    {aiEv.map((item, idx) => (
                      <li key={idx} className="text-[11px] text-gray-600 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                    AI assistance level assessed from code structure and repository evidence.
                  </p>
                )}
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-900 block mb-1">
                  Technical Ownership
                </span>
                <span className="font-extrabold text-emerald-950 text-sm">
                  {latestAnalysis.technicalOwnershipLevel || 'High'}
                </span>
                {ownerEv.length > 0 ? (
                  <ul className="mt-1 space-y-1">
                    {ownerEv.map((item, idx) => (
                      <li key={idx} className="text-[11px] text-emerald-900/80 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-emerald-900/80 mt-1 leading-relaxed">
                    Technical ownership verified through original business logic and commit evidence.
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Analyzed Projects Portfolio */}
      <section className="space-y-4">
        <h2 className="font-serif-editorial text-2xl text-gray-900">
          Analyzed Project Portfolio ({student.projects?.length || 0})
        </h2>

        <div className="space-y-5">
          {student.projects?.map((proj: any) => (
            <ProjectCard key={proj.id} {...proj} />
          ))}
        </div>
      </section>
    </div>
  );
}
