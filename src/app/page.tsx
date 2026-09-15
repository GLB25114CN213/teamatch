'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Users,
  FolderCode,
  Compass,
  Check,
  Zap,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { NetworkGraphHero } from '@/components/NetworkGraphHero';

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-16 bg-noise">
      
      {/* SECTION 1: FULL-SCREEN CINEMATIC HERO */}
      <section className="relative overflow-hidden bg-[#051A14] text-[#F8F7F5] rounded-3xl p-8 sm:p-14 md:p-16 border border-[#B7F34A]/25 shadow-2xl ambient-glow-dark">
        {/* Ambient lighting arcs */}
        <div className="absolute top-0 right-0 w-[32rem] h-[32rem] bg-[#B7F34A]/10 rounded-full blur-3xl pointer-events-none ambient-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#19C37D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0A2B22] text-[#B7F34A] border border-[#B7F34A]/30 text-xs font-extrabold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B7F34A]" />
              <span>BUILT FOR GLBITM STUDENTS</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif-editorial leading-[1.05] text-white">
                Build better <br />
                teams, <span className="text-[#B7F34A] italic font-serif-editorial">together.</span>
              </h1>
              <p className="text-base sm:text-lg text-[#9BB0A6] max-w-xl leading-relaxed pt-1 font-sans-editorial">
                Find the right people for hackathons, projects, research and ideas based on verified code evidence and complementary technical skills.
              </p>
            </div>

            {/* Overlapping candidate network summary */}
            <div className="flex items-center space-x-3 pt-2">
              <div className="avatar-stack avatar-stack-dark">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Student" className="w-8 h-8" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Student" className="w-8 h-8" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Student" className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-[#9BB0A6]">
                Over 14 verified GLBITM candidates matched today
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-[#B7F34A] hover:bg-[#A6E239] text-[#051A14] font-black text-xs rounded-xl transition-all active:scale-95 shadow-lg shadow-[#B7F34A]/10"
              >
                <Users className="w-4 h-4 stroke-[2.5]" />
                <span>Find Your Teammates</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
              <Link
                href="/opportunities"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#0A2B22] hover:bg-[#0E3A2E] text-white font-bold text-xs rounded-xl border border-[#B7F34A]/25 transition-colors active:scale-95"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Opportunities</span>
              </Link>
            </div>
          </div>

          {/* Right Visual: Interactive SVG Network Hero */}
          <div className="lg:col-span-5">
            <NetworkGraphHero />
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section className="editorial-card p-8 sm:p-12 md:p-16 text-center space-y-10">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A2B22] block">
            THE CAMPUS TEAMMAKING PARADOX
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl text-gray-900 leading-tight">
            “Great ideas rarely fail because of the idea.”
          </h2>
          <p className="font-serif-editorial italic text-2xl sm:text-3xl text-[#0A2B22] leading-snug">
            They fail because the right people never found each other.
          </p>
          <p className="text-xs sm:text-sm text-[#5A6963] max-w-xl mx-auto leading-relaxed pt-2 font-sans-editorial">
            College group chats are noisy. Self-declared resumes are unreliable. TeamMatch bridges the gap between raw idea and high-execution team by using verified technical evidence.
          </p>
        </div>

        {/* Visual Flow Transition */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4">
          <div className="p-5 bg-[#F8F7F5] rounded-2xl border border-gray-200 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">STEP 01</span>
            <span className="font-serif-editorial text-xl text-gray-900 block">IDEA</span>
            <span className="text-[11px] text-[#5A6963]">SIH 2026 or Hackathon</span>
          </div>
          <div className="p-5 bg-[#F8F7F5] rounded-2xl border border-gray-200 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">STEP 02</span>
            <span className="font-serif-editorial text-xl text-gray-900 block">SKILLS</span>
            <span className="text-[11px] text-[#5A6963]">GitHub Code Evidence</span>
          </div>
          <div className="p-5 bg-[#F8F7F5] rounded-2xl border border-gray-200 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">STEP 03</span>
            <span className="font-serif-editorial text-xl text-gray-900 block">PEOPLE</span>
            <span className="text-[11px] text-[#5A6963]">Verified GLBITM Students</span>
          </div>
          <div className="p-5 bg-[#0A2B22] text-white rounded-2xl border border-[#B7F34A]/30 space-y-1 shadow-md">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B7F34A] block">STEP 04</span>
            <span className="font-serif-editorial text-xl text-[#B7F34A] block">TEAM</span>
            <span className="text-[11px] text-[#9BB0A6]">Complementary Execution</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW TEAMMATCH WORKS */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A2B22] block">
            THE ENGINE
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl text-gray-900">
            How TeamMatch Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="editorial-card p-7 space-y-4 relative group">
            <span className="font-serif-editorial text-4xl text-[#0A2B22]/20 font-bold block">01</span>
            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-900 border border-emerald-200 inline-block">
                VERIFY
              </span>
              <h3 className="font-serif-editorial text-xl text-gray-900">GLBITM Students Only</h3>
            </div>
            <p className="text-xs text-[#5A6963] leading-relaxed font-sans-editorial">
              Sign up strictly with your official student email (@glbitm.ac.in). Zero anonymous accounts or outside spam.
            </p>
          </div>

          <div className="editorial-card p-7 space-y-4 relative group">
            <span className="font-serif-editorial text-4xl text-[#0A2B22]/20 font-bold block">02</span>
            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-900 border border-emerald-200 inline-block">
                SHOW EVIDENCE
              </span>
              <h3 className="font-serif-editorial text-xl text-gray-900">Connect GitHub & Code</h3>
            </div>
            <p className="text-xs text-[#5A6963] leading-relaxed font-sans-editorial">
              Submit your repositories or code archives. TeamMatch AI extracts real technologies from your commit history.
            </p>
          </div>

          <div className="editorial-card p-7 space-y-4 relative group">
            <span className="font-serif-editorial text-4xl text-[#0A2B22]/20 font-bold block">03</span>
            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-900 border border-emerald-200 inline-block">
                MATCH
              </span>
              <h3 className="font-serif-editorial text-xl text-gray-900">Discover Your Match</h3>
            </div>
            <p className="text-xs text-[#5A6963] leading-relaxed font-sans-editorial">
              Receive explainable recommendations of teammates whose proven code skills complement what you lack.
            </p>
          </div>

          <div className="editorial-card p-7 space-y-4 relative group">
            <span className="font-serif-editorial text-4xl text-[#0A2B22]/20 font-bold block">04</span>
            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-900 border border-emerald-200 inline-block">
                BUILD
              </span>
              <h3 className="font-serif-editorial text-xl text-gray-900">Build Together</h3>
            </div>
            <p className="text-xs text-[#5A6963] leading-relaxed font-sans-editorial">
              Form high-performing teams for SIH 2026, external hackathons, research papers, and college projects.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: MATCHMAKING VISUALIZATION */}
      <section className="editorial-card-dark p-8 sm:p-12 md:p-16 space-y-10 relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B7F34A] block">
            EXPLAINABLE MATCHMAKING
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl text-white leading-tight">
            Don’t just find a teammate. <br />
            <span className="text-[#B7F34A] italic font-serif-editorial">Find the missing skill.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9BB0A6] font-sans-editorial max-w-lg leading-relaxed">
            TeamMatch analyzes project requirements against verified developer profiles to explain exactly why candidates match.
          </p>
        </div>

        {/* Large Interactive Match Showcase */}
        <div className="bg-[#051A14] p-6 sm:p-8 rounded-2xl border border-[#B7F34A]/20 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Candidate A (YOU) */}
          <div className="md:col-span-4 p-5 bg-[#0A2B22] rounded-xl border border-[#B7F34A]/15 space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="You"
                className="w-10 h-10 rounded-lg object-cover border border-[#B7F34A]/30"
              />
              <div>
                <span className="font-extrabold text-white text-sm block">YOU (Lead)</span>
                <span className="text-[10px] text-[#9BB0A6]">CSE · 3rd Year</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#9BB0A6] block">Verified Stack</span>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#051A14] text-[#B7F34A] border border-[#B7F34A]/30">Python</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#051A14] text-[#B7F34A] border border-[#B7F34A]/30">Node.js</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#051A14] text-[#B7F34A] border border-[#B7F34A]/30">AI/ML</span>
              </div>
            </div>
          </div>

          {/* Plus Sign / Connection Indicator */}
          <div className="md:col-span-1 text-center font-serif-editorial text-3xl text-[#B7F34A]">
            +
          </div>

          {/* Candidate B (RECOMMENDED MATCH) */}
          <div className="md:col-span-4 p-5 bg-[#0A2B22] rounded-xl border border-[#B7F34A]/15 space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                alt="Candidate Profile"
                className="w-10 h-10 rounded-lg object-cover border border-[#B7F34A]/30"
              />
              <div>
                <span className="font-extrabold text-white text-sm block">ML Specialist</span>
                <span className="text-[10px] text-[#9BB0A6]">IT · 3rd Year</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-[#9BB0A6] block">Verified Stack</span>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#19C37D]/20 text-[#19C37D] border border-[#19C37D]/30">Computer Vision</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#19C37D]/20 text-[#19C37D] border border-[#19C37D]/30">PyTorch</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#19C37D]/20 text-[#19C37D] border border-[#19C37D]/30">React</span>
              </div>
            </div>
          </div>

          {/* Match Score Result */}
          <div className="md:col-span-3 p-5 bg-[#0A2B22] rounded-xl border border-[#B7F34A]/30 text-center space-y-2">
            <span className="font-serif-editorial text-4xl text-[#B7F34A] block font-bold">94%</span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#B7F34A] block">MATCH SCORE</span>
            <p className="text-[11px] text-[#F8F7F5] font-medium leading-tight pt-1">
              “Fills your team’s Computer Vision & Frontend gap for SIH 2026.”
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 5: VERIFIED PROJECTS PORTFOLIO */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A2B22] block">
              STUDENT PORTFOLIO
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl text-gray-900">
              Built by GLBITM Students. Verified by Code.
            </h2>
          </div>
          <Link href="/projects" className="text-xs font-bold text-[#0A2B22] hover:text-[#19C37D] flex items-center gap-1">
            <span>Explore All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="editorial-card p-6 space-y-4">
            <div className="editorial-image-container h-44 w-full bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Project"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-900 border border-emerald-200">
                  SIH 2026 Entry
                </span>
                <span className="text-xs font-semibold text-gray-500">Student Team Project (CSE)</span>
              </div>
              <h3 className="font-serif-editorial text-2xl text-gray-900">AI Women Safety & Geo-Alert Engine</h3>
              <p className="text-xs text-[#5A6963] leading-relaxed">
                Real-time computer vision threat detection paired with WebSocket emergency broadcast.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-medium border border-gray-200">Python</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-medium border border-gray-200">PyTorch</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-medium border border-gray-200">FastAPI</span>
              </div>
            </div>
          </div>

          <div className="editorial-card p-6 space-y-4">
            <div className="editorial-image-container h-44 w-full bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                alt="Project"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-900 border border-emerald-200">
                  Research Project
                </span>
                <span className="text-xs font-semibold text-gray-500">Student Team Project (IT)</span>
              </div>
              <h3 className="font-serif-editorial text-2xl text-gray-900">Distributed Micro-Loans Protocol</h3>
              <p className="text-xs text-[#5A6963] leading-relaxed">
                High-throughput smart contract engine for peer-to-peer student micro-finance.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-medium border border-gray-200">Solidity</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-medium border border-gray-200">Next.js</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-medium border border-gray-200">Ethers.js</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: OPPORTUNITIES SHOWCASE */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A2B22] block">
              CAMPUS ANNOUNCEMENTS
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl text-gray-900">
              Find something worth building.
            </h2>
          </div>
          <Link
            href="/opportunities"
            className="px-5 py-2.5 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-extrabold text-xs rounded-xl transition-colors shadow-sm"
          >
            Explore Opportunities →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="editorial-card p-6 space-y-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-800 border border-stone-200 inline-block">
              SIH 2026
            </span>
            <h3 className="font-serif-editorial text-xl text-gray-900">Smart Agriculture Moisture Sensor Engine</h3>
            <p className="text-xs text-[#5A6963] line-clamp-2">Seeking IoT hardware developer and React Native mobile builder.</p>
            <div className="pt-2 text-xs font-semibold text-emerald-800">3 / 5 Teammates Joined</div>
          </div>

          <div className="editorial-card p-6 space-y-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-800 border border-stone-200 inline-block">
              Hackathon
            </span>
            <h3 className="font-serif-editorial text-xl text-gray-900">HackNoida 2026 Decentralized Storage</h3>
            <p className="text-xs text-[#5A6963] line-clamp-2">Building decentralized file backup service. Need Go backend lead.</p>
            <div className="pt-2 text-xs font-semibold text-emerald-800">2 / 4 Teammates Joined</div>
          </div>

          <div className="editorial-card p-6 space-y-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-800 border border-stone-200 inline-block">
              Research Paper
            </span>
            <h3 className="font-serif-editorial text-xl text-gray-900">LLM Hallucination Reduction Study</h3>
            <p className="text-xs text-[#5A6963] line-clamp-2">Collaborative paper targeting IEEE conference. Need PyTorch NLP researcher.</p>
            <div className="pt-2 text-xs font-semibold text-emerald-800">1 / 3 Teammates Joined</div>
          </div>
        </div>
      </section>

      {/* SECTION 7: WHY TEAMMATCH (COMPARISON) */}
      <section className="editorial-card p-8 sm:p-12 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A2B22] block">
            THE TEAMMATCH ADVANTAGE
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-gray-900">
            Why TeamMatch?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Old Way */}
          <div className="p-7 bg-[#F8F7F5] rounded-2xl border border-gray-200 space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-700 block">
              TRADITIONAL TEAM FORMATION
            </span>
            <h3 className="font-serif-editorial text-2xl text-gray-800">“I know a few people.”</h3>
            <ul className="space-y-2 text-xs text-[#5A6963]">
              <li className="flex items-center gap-2">✕ Relying on personal friend circles only</li>
              <li className="flex items-center gap-2">✕ Unverified self-declared resume claims</li>
              <li className="flex items-center gap-2">✕ Overlapping duplicate skills in team</li>
              <li className="flex items-center gap-2">✕ High drop-out rate during hackathons</li>
            </ul>
          </div>

          {/* TeamMatch Way */}
          <div className="p-7 bg-[#0A2B22] text-white rounded-2xl border border-[#B7F34A]/30 space-y-4 shadow-xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B7F34A] block">
              WITH TEAMMATCH
            </span>
            <h3 className="font-serif-editorial text-2xl text-[#B7F34A]">“I know who complements my skills.”</h3>
            <ul className="space-y-2 text-xs text-[#9BB0A6]">
              <li className="flex items-center gap-2 text-white">✓ GLBITM verified student accounts</li>
              <li className="flex items-center gap-2 text-white">✓ Code evidence extracted from GitHub commits</li>
              <li className="flex items-center gap-2 text-white">✓ Automated skill gap analysis</li>
              <li className="flex items-center gap-2 text-white">✓ High-execution complementary teams</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="editorial-card-dark p-10 sm:p-16 text-center space-y-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="font-serif-editorial text-3xl sm:text-5xl text-white leading-tight">
            Your next project needs more than you. <br />
            <span className="text-[#B7F34A] italic font-serif-editorial">It needs the right team.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9BB0A6] font-sans-editorial">
            Join verified GLBITM builders, form complementary rosters, and execute SIH 2026 ideas together.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/auth/register"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-[#B7F34A] hover:bg-[#A6E239] text-[#051A14] font-black text-sm rounded-xl transition-all active:scale-95 shadow-xl shadow-[#B7F34A]/20"
          >
            <Users className="w-4 h-4 stroke-[2.5]" />
            <span>Join TeamMatch</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
          <p className="text-[11px] text-[#9BB0A6] mt-3 font-semibold">Exclusively for GLBITM students.</p>
        </div>
      </section>

    </div>
  );
}
