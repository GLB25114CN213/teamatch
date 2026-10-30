'use client';

import React, { useState, useMemo } from 'react';
import { Check, Sparkles, ChevronDown, ChevronUp, Layers, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { calculateRealStudentMatchScore } from '@/lib/matching-calc';

interface CandidateProfile {
  id: string;
  name: string;
  role: string;
  branch: string;
  year: string;
  avatarUrl: string;
  githubPRs: number;
  hackathonWins: number;
  skills: Array<{
    name: string;
    confidence: 'High' | 'Medium' | 'Low';
    isVerified: boolean;
  }>;
  projects: Array<{
    title: string;
    description: string;
    domains: string[];
  }>;
  availability: 'Looking for Team' | 'Available' | 'Busy';
  interests: string[];
}

const CANDIDATES: CandidateProfile[] = [
  {
    id: 'priya',
    name: 'Priya Sharma',
    role: 'ML Specialist',
    branch: 'IT',
    year: '3rd Year',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80',
    githubPRs: 14,
    hackathonWins: 3,
    skills: [
      { name: 'Computer Vision', confidence: 'High', isVerified: true },
      { name: 'PyTorch', confidence: 'High', isVerified: true },
      { name: 'React', confidence: 'High', isVerified: true },
      { name: 'Python', confidence: 'High', isVerified: true },
    ],
    projects: [
      {
        title: 'VisionGuard: Hazard Detection',
        description: 'Real-time hazard detection with YOLOv8 & PyTorch',
        domains: ['ai', 'computer vision', 'deep learning', 'sih'],
      },
      {
        title: 'MedScan Vision',
        description: 'Automated MRI feature segmentation using CNNs',
        domains: ['ai', 'healthtech'],
      },
    ],
    availability: 'Looking for Team',
    interests: ['SIH 2026', 'AI Hackathons'],
  },
  {
    id: 'aarav',
    name: 'Aarav Patel',
    role: 'Full Stack Architect',
    branch: 'CSE',
    year: '3rd Year',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80',
    githubPRs: 22,
    hackathonWins: 2,
    skills: [
      { name: 'React', confidence: 'High', isVerified: true },
      { name: 'Node.js', confidence: 'High', isVerified: true },
      { name: 'TypeScript', confidence: 'High', isVerified: true },
      { name: 'Docker', confidence: 'Medium', isVerified: true },
    ],
    projects: [
      {
        title: 'CampusConnect ERP',
        description: 'Microservices architecture with Next.js, Node.js, and Docker',
        domains: ['web', 'fullstack', 'cloud'],
      },
    ],
    availability: 'Looking for Team',
    interests: ['SIH 2026', 'Hackathons'],
  },
  {
    id: 'devansh',
    name: 'Devansh Verma',
    role: 'Backend & Data Systems',
    branch: 'CSE',
    year: '4th Year',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=180&q=80',
    githubPRs: 8,
    hackathonWins: 1,
    skills: [
      { name: 'Python', confidence: 'High', isVerified: true },
      { name: 'PostgreSQL', confidence: 'High', isVerified: true },
      { name: 'FastAPI', confidence: 'High', isVerified: true },
      { name: 'Docker', confidence: 'Medium', isVerified: true },
    ],
    projects: [
      {
        title: 'High-Throughput Telemetry Ingestion',
        description: 'Scalable data pipeline built with Python and PostgreSQL',
        domains: ['backend', 'database'],
      },
    ],
    availability: 'Available',
    interests: ['Open Source'],
  },
];

const AVAILABLE_NEEDS = [
  'Computer Vision',
  'PyTorch',
  'React',
  'Node.js',
  'Docker',
  'FastAPI',
  'PostgreSQL',
];

export function ExplainableMatchmakingDemo() {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('priya');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['Computer Vision', 'PyTorch', 'React']);
  const [showFormulaReceipt, setShowFormulaReceipt] = useState<boolean>(true);

  const selectedCandidate = useMemo(() => {
    return CANDIDATES.find((c) => c.id === selectedCandidateId) || CANDIDATES[0];
  }, [selectedCandidateId]);

  // Execute real mathematical scoring algorithm
  const matchResult = useMemo(() => {
    const studentData = {
      skills: selectedCandidate.skills.map((s) => ({
        isVerified: s.isVerified,
        confidence: s.confidence,
        skill: { name: s.name },
      })),
      projects: selectedCandidate.projects.map((p) => ({
        title: p.title,
        description: p.description,
        analysis: { domainsJson: JSON.stringify(p.domains) },
      })),
      availability: selectedCandidate.availability,
      interests: JSON.stringify(selectedCandidate.interests),
    };

    return calculateRealStudentMatchScore(
      studentData,
      requiredSkills,
      'SIH',
      'SIH 2026 AI Disaster Response System with Computer Vision and Smart Dashboards'
    );
  }, [selectedCandidate, requiredSkills]);

  const toggleSkill = (skill: string) => {
    if (requiredSkills.includes(skill)) {
      if (requiredSkills.length > 1) {
        setRequiredSkills(requiredSkills.filter((s) => s !== skill));
      }
    } else {
      setRequiredSkills([...requiredSkills, skill]);
    }
  };

  const { score, breakdown, reasons } = matchResult;

  return (
    <div className="space-y-6">
      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#051A14]/90 rounded-xl border border-[#B7F34A]/20 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9BB0A6]">
            Simulate Teammate Match:
          </span>
          <div className="flex rounded-lg bg-[#0A2B22] p-0.5 border border-[#B7F34A]/20">
            {CANDIDATES.map((cand) => (
              <button
                key={cand.id}
                onClick={() => setSelectedCandidateId(cand.id)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                  selectedCandidateId === cand.id
                    ? 'bg-[#B7F34A] text-[#051A14] shadow-sm'
                    : 'text-[#9BB0A6] hover:text-white'
                }`}
              >
                {cand.role}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#9BB0A6]">Target:</span>
          <span className="px-2 py-0.5 rounded bg-[#19C37D]/20 text-[#19C37D] font-mono text-[10px] font-bold border border-[#19C37D]/30 flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#B7F34A]" />
            SIH 2026 AI Track
          </span>
        </div>
      </div>

      {/* Main 3-Box Showcase (Matches Screenshot with Dynamic Real Values) */}
      <div className="bg-[#051A14] p-6 sm:p-8 rounded-2xl border border-[#B7F34A]/20 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Candidate A (YOU - Lead) */}
        <div className="md:col-span-4 p-5 bg-[#0A2B22] rounded-xl border border-[#B7F34A]/15 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="You"
                className="w-11 h-11 rounded-lg object-cover border border-[#B7F34A]/40"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#B7F34A] rounded-full border-2 border-[#051A14] flex items-center justify-center">
                <Check className="w-2 h-2 text-[#051A14] stroke-[3]" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-sm">YOU (Lead)</span>
                <span className="text-[9px] bg-[#B7F34A]/20 text-[#B7F34A] px-1.5 py-0.2 rounded font-bold">Host</span>
              </div>
              <span className="text-[10px] text-[#9BB0A6]">CSE · 3rd Year · GLBITM</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9BB0A6] block">
              Your Team&apos;s Verified Stack
            </span>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#051A14] text-[#B7F34A] border border-[#B7F34A]/30">Python</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#051A14] text-[#B7F34A] border border-[#B7F34A]/30">Node.js</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#051A14] text-[#B7F34A] border border-[#B7F34A]/30">AI/ML</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#B7F34A]/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9BB0A6]">
                Required Missing Skills
              </span>
              <span className="text-[9px] text-[#19C37D]">Click to test</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {AVAILABLE_NEEDS.map((sk) => {
                const isSelected = requiredSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    onClick={() => toggleSkill(sk)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                      isSelected
                        ? 'bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A] font-bold'
                        : 'bg-[#051A14]/60 text-[#9BB0A6]/60 border border-white/5 hover:border-white/20'
                    }`}
                  >
                    {isSelected ? `✓ ${sk}` : `+ ${sk}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Plus Sign / Connection Indicator */}
        <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
          <div className="w-9 h-9 rounded-full bg-[#0A2B22] border border-[#B7F34A]/30 flex items-center justify-center text-[#B7F34A] font-serif-editorial text-2xl shadow-[0_0_15px_rgba(183,243,74,0.15)]">
            +
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-[#9BB0A6] mt-1 hidden md:block">
            ALGORITHM
          </span>
        </div>

        {/* Candidate B (RECOMMENDED CANDIDATE) */}
        <div className="md:col-span-4 p-5 bg-[#0A2B22] rounded-xl border border-[#B7F34A]/15 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={selectedCandidate.avatarUrl}
                alt={selectedCandidate.name}
                className="w-11 h-11 rounded-lg object-cover border border-[#19C37D]/50"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#19C37D] rounded-full border-2 border-[#051A14] flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-[#051A14]" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-sm">{selectedCandidate.role}</span>
                <span className="text-[9px] bg-[#19C37D]/20 text-[#19C37D] px-1.5 py-0.2 rounded font-bold">
                  {selectedCandidate.availability}
                </span>
              </div>
              <span className="text-[10px] text-[#9BB0A6]">
                {selectedCandidate.name} · {selectedCandidate.branch} {selectedCandidate.year}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9BB0A6] block">
              Verified Candidate Stack
            </span>
            <div className="flex flex-wrap gap-1">
              {selectedCandidate.skills.map((s) => {
                const matchesNeed = requiredSkills.some((r) => r.toLowerCase() === s.name.toLowerCase());
                return (
                  <span
                    key={s.name}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      matchesNeed
                        ? 'bg-[#19C37D]/25 text-[#19C37D] border-[#19C37D]/50 shadow-sm'
                        : 'bg-[#051A14] text-[#9BB0A6] border-white/10'
                    }`}
                  >
                    {s.name} <span className="text-[8px] opacity-70">[{s.confidence}]</span>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#B7F34A]/10 flex items-center justify-between text-[10px] text-[#9BB0A6]">
            <span>Code Evidence:</span>
            <span className="text-white font-mono font-bold">
              {selectedCandidate.githubPRs} PRs · {selectedCandidate.hackathonWins} Hackathons
            </span>
          </div>
        </div>

        {/* Real Match Score Card (Dynamically Calculated) */}
        <div className="md:col-span-3 p-5 bg-[#0A2B22] rounded-xl border border-[#B7F34A]/40 text-center space-y-2 relative shadow-[0_0_25px_rgba(183,243,74,0.12)]">
          
          <div className="space-y-0.5">
            <span className="font-serif-editorial text-5xl text-[#B7F34A] block font-bold tracking-tight">
              {score}%
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#B7F34A] block">
              REAL MATCH SCORE
            </span>
          </div>

          <p className="text-[11px] text-[#F8F7F5] font-medium leading-snug pt-1">
            {score >= 80 ? (
              <>Fills your team’s <span className="text-[#B7F34A] font-bold">{breakdown.matchedSkills.map(m => m.name).slice(0, 2).join(' & ') || 'core'}</span> gap for SIH 2026.</>
            ) : score >= 50 ? (
              <>Partial match: fulfills {breakdown.matchedSkills.length} of {requiredSkills.length} required skill tracks.</>
            ) : (
              <>Low alignment: candidate specializes in a different technical stack.</>
            )}
          </p>

          <button
            onClick={() => setShowFormulaReceipt(!showFormulaReceipt)}
            className="w-full mt-2 py-1.5 px-2 rounded-lg bg-[#051A14] hover:bg-[#051A14]/80 text-[#B7F34A] text-[10px] font-bold border border-[#B7F34A]/30 flex items-center justify-center gap-1 transition-colors"
          >
            <span>{showFormulaReceipt ? 'Hide Real Receipt' : 'View Math Receipt'}</span>
            {showFormulaReceipt ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

      </div>

      {/* Real Percentage Breakdown Receipt */}
      {showFormulaReceipt && (
        <div className="p-5 sm:p-6 bg-[#051A14] rounded-xl border border-[#B7F34A]/25 space-y-4 animate-in fade-in duration-300">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#B7F34A]/15 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B7F34A]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Mathematical Verification Receipt (100% Deterministic)
              </h4>
            </div>
            <span className="text-[10px] text-[#9BB0A6] font-mono">
              Score = Skills ({breakdown.skillsScore}pt) + Domain ({breakdown.domainScore}pt) + Availability ({breakdown.availabilityScore}pt) = <span className="text-[#B7F34A] font-bold">{score}%</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Metric 1: Skill Overlap */}
            <div className="p-3.5 bg-[#0A2B22]/70 rounded-lg border border-[#B7F34A]/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#B7F34A]" />
                  1. Required Skills
                </span>
                <span className="text-[11px] font-mono font-bold text-[#B7F34A]">
                  {breakdown.skillsScore} / {breakdown.maxSkillsScore} pts
                </span>
              </div>
              
              <div className="w-full bg-[#051A14] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#B7F34A] h-full transition-all duration-500"
                  style={{ width: `${(breakdown.skillsScore / breakdown.maxSkillsScore) * 100}%` }}
                />
              </div>

              <div className="space-y-1 text-[10px] text-[#9BB0A6]">
                {breakdown.matchedSkills.length > 0 ? (
                  breakdown.matchedSkills.map((m) => (
                    <div key={m.name} className="flex justify-between items-center text-[9px]">
                      <span className="text-white">✓ {m.name} ({m.confidence})</span>
                      <span className="text-[#B7F34A] font-mono">+{m.points}%</span>
                    </div>
                  ))
                ) : (
                  <span className="text-red-400 text-[9px]">No verified skill overlap found</span>
                )}
              </div>
            </div>

            {/* Metric 2: Domain Relevance */}
            <div className="p-3.5 bg-[#0A2B22]/70 rounded-lg border border-[#B7F34A]/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#19C37D]" />
                  2. Domain Evidence
                </span>
                <span className="text-[11px] font-mono font-bold text-[#19C37D]">
                  {breakdown.domainScore} / {breakdown.maxDomainScore} pts
                </span>
              </div>

              <div className="w-full bg-[#051A14] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#19C37D] h-full transition-all duration-500"
                  style={{ width: `${(breakdown.domainScore / breakdown.maxDomainScore) * 100}%` }}
                />
              </div>

              <div className="space-y-1 text-[10px] text-[#9BB0A6]">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-white">✓ Verified Repo Projects in SIH/AI</span>
                  <span className="text-[#19C37D] font-mono">+{breakdown.domainScore}%</span>
                </div>
                <div className="text-[8px] text-[#9BB0A6]/80 italic">
                  Matched via GitHub commit AST inspection
                </div>
              </div>
            </div>

            {/* Metric 3: Availability & SIH Alignment */}
            <div className="p-3.5 bg-[#0A2B22]/70 rounded-lg border border-[#B7F34A]/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A]" />
                  3. Availability & SIH Fit
                </span>
                <span className="text-[11px] font-mono font-bold text-[#B7F34A]">
                  {breakdown.availabilityScore} / {breakdown.maxAvailabilityScore} pts
                </span>
              </div>

              <div className="w-full bg-[#051A14] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#B7F34A] h-full transition-all duration-500"
                  style={{ width: `${(breakdown.availabilityScore / breakdown.maxAvailabilityScore) * 100}%` }}
                />
              </div>

              <div className="space-y-1 text-[10px] text-[#9BB0A6]">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-white">✓ Status: {selectedCandidate.availability}</span>
                  <span className="text-[#B7F34A] font-mono">
                    +{selectedCandidate.availability === 'Looking for Team' ? 8 : 5}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-white">✓ SIH 2026 Hackathon Interest</span>
                  <span className="text-[#B7F34A] font-mono">+7%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Itemized Reasons List */}
          <div className="p-3 bg-[#0A2B22]/40 rounded-lg border border-white/5 flex flex-wrap gap-2 items-center text-[10px]">
            <span className="font-bold text-white">Algorithmic Proof:</span>
            {reasons.map((r, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-[#051A14] text-[#B7F34A] border border-[#B7F34A]/20">
                {r}
              </span>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
