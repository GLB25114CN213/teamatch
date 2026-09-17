'use client';

import React, { useEffect, useState } from 'react';
import { MatchCard } from '@/components/MatchCard';
import { Search, Filter } from 'lucide-react';

export default function StudentsDirectoryPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');

  useEffect(() => {
    fetchStudents();
  }, [selectedBranch, selectedYear, selectedDomain]);

  const fetchStudents = () => {
    setLoading(true);
    let url = `/api/students?query=${encodeURIComponent(searchQuery)}`;
    if (selectedBranch !== 'All') url += `&branch=${encodeURIComponent(selectedBranch)}`;
    if (selectedYear !== 'All') url += `&year=${encodeURIComponent(selectedYear)}`;
    if (selectedDomain !== 'All') url += `&domain=${encodeURIComponent(selectedDomain)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.students) setStudents(data.students);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A2B22] block">
            GLBITM MATCHMAKING DIRECTORY
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif-editorial text-gray-900 leading-tight">
            Find the people <br />
            who <span className="text-[#0A2B22] italic font-serif-editorial">complete your team.</span>
          </h1>
          <p className="text-xs text-[#5A6963] max-w-lg pt-1">
            Discover verified students matched by technical evidence, verified skills, and availability.
          </p>
        </div>

        {/* Overlapping candidate avatars summary */}
        <div className="flex items-center space-x-3 bg-[#0A2B22] text-[#F8F7F5] px-4 py-2.5 rounded-xl border border-[#B7F34A]/20">
          <div className="avatar-stack avatar-stack-dark">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Student" className="w-6 h-6" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Student" className="w-6 h-6" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Student" className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-[#B7F34A]">
            {students.length} verified candidates
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="editorial-card p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search skills, people, domains (e.g. Python, Computer Vision, SIH)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-bold text-xs rounded-xl transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter Selection */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 text-xs">
          <span className="font-bold text-gray-600 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#0A2B22]" /> Filters:
          </span>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="p-2 bg-[#F8F7F5] border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
          >
            <option value="All">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="AI/DS">AI/DS</option>
            <option value="ME">ME</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-2 bg-[#F8F7F5] border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
          >
            <option value="All">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="p-2 bg-[#F8F7F5] border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
          >
            <option value="All">All Domains</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Web Dev">Web Dev</option>
            <option value="Cyber Security">Cyber Security</option>
            <option value="Mobile App">Mobile App</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500 editorial-card">Loading teammates...</div>
      ) : students.length === 0 ? (
        <div className="editorial-card p-12 text-center space-y-2">
          <p className="font-bold text-gray-900 text-base">No strong candidate matches found</p>
          <p className="text-xs text-[#5A6963]">Try loosening your search filters or domain selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((st, idx) => {
            const searchTerms = [searchQuery, selectedDomain].filter((t) => t && t !== 'All').map((t) => t.toLowerCase());
            let matchScore = 0;
            const matchReasons: string[] = [];

            const verified = st.verifiedSkills || [];
            const selfDeclared = st.selfDeclaredSkills || [];
            const projectCount = st.projectCount || 0;

            if (searchTerms.length > 0) {
              let matchedCount = 0;
              for (const term of searchTerms) {
                const vMatch = verified.find((v: any) => v.name.toLowerCase().includes(term));
                if (vMatch) {
                  matchedCount++;
                  matchReasons.push(`✓ Verified ${vMatch.name} evidence`);
                } else {
                  const sMatch = selfDeclared.find((s: any) => s.name.toLowerCase().includes(term));
                  if (sMatch) {
                    matchedCount++;
                    matchReasons.push(`✓ Self-declared ${sMatch.name}`);
                  }
                }
              }
              matchScore = Math.round((matchedCount / searchTerms.length) * 100);
            } else if (verified.length > 0 || projectCount > 0) {
              matchScore = Math.min(verified.length * 25 + projectCount * 15, 100);
              matchReasons.push(`✓ ${verified.length} verified skill${verified.length > 1 ? 's' : ''}`);
              if (projectCount > 0) matchReasons.push(`✓ ${projectCount} analyzed project evidence`);
            } else {
              matchScore = 0;
              matchReasons.push('✓ GLBITM Student Profile');
            }

            return (
              <MatchCard
                key={st.id}
                id={st.id}
                name={st.name}
                branch={st.branch}
                year={st.year}
                avatarUrl={st.avatarUrl}
                matchScore={matchScore}
                matchReasons={matchReasons}
                verifiedSkills={verified}
                selfDeclaredSkills={selfDeclared}
                availability={st.availability}
                projectCount={projectCount}
                featured={idx === 0}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
