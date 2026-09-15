'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

export function NetworkGraphHero() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[340px] sm:h-[380px] bg-[#0A2B22]/80 rounded-2xl border border-[#B7F34A]/20 p-4 overflow-hidden flex items-center justify-center">
      {/* Background SVG Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="heroGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#B7F34A" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
      </svg>

      {/* SVG Connecting Network Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
        {/* Connection Line: Node 1 (Aarav) to Center Hub */}
        <line
          x1="90"
          y1="90"
          x2="200"
          y2="150"
          stroke={hoveredNode === 'aarav' ? '#B7F34A' : '#19C37D'}
          strokeWidth={hoveredNode === 'aarav' ? '3' : '1.5'}
          className="animate-dash-line transition-all duration-300"
        />

        {/* Connection Line: Node 2 (Priya) to Center Hub */}
        <line
          x1="310"
          y1="80"
          x2="200"
          y2="150"
          stroke={hoveredNode === 'priya' ? '#B7F34A' : '#19C37D'}
          strokeWidth={hoveredNode === 'priya' ? '3' : '1.5'}
          className="animate-dash-line transition-all duration-300"
        />

        {/* Connection Line: Node 3 (Rohan) to Center Hub */}
        <line
          x1="180"
          y1="250"
          x2="200"
          y2="150"
          stroke={hoveredNode === 'rohan' ? '#B7F34A' : '#19C37D'}
          strokeWidth={hoveredNode === 'rohan' ? '3' : '1.5'}
          className="animate-dash-line transition-all duration-300"
        />

        {/* Inter-Node Connection: Aarav to Priya */}
        <path
          d="M 90 90 Q 200 40 310 80"
          fill="none"
          stroke="#B7F34A"
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeDasharray="4 4"
        />
      </svg>

      {/* CENTER HUB: SIH 2026 Team Opportunity */}
      <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#051A14] border-2 border-[#B7F34A] shadow-[0_0_30px_rgba(183,243,74,0.3)] flex flex-col items-center justify-center p-2 transition-transform duration-300 hover:scale-105">
          <span className="font-black text-xl sm:text-2xl text-[#B7F34A] leading-none">94%</span>
          <span className="text-[8px] font-extrabold text-[#9BB0A6] uppercase tracking-wider mt-0.5">MATCH HUB</span>
          <span className="text-[7px] text-[#19C37D] font-bold block">SIH 2026</span>
        </div>
      </div>

      {/* NODE 1: Aarav Sharma (Top Left) */}
      <div
        onMouseEnter={() => setHoveredNode('aarav')}
        onMouseLeave={() => setHoveredNode(null)}
        className={`absolute z-10 top-[15%] left-[8%] sm:left-[12%] flex items-center space-x-2.5 p-2 pr-3 bg-[#051A14]/90 rounded-xl border transition-all duration-300 cursor-pointer ${
          hoveredNode === 'aarav'
            ? 'border-[#B7F34A] scale-105 shadow-[0_0_20px_rgba(183,243,74,0.25)]'
            : 'border-[#B7F34A]/20 hover:border-[#B7F34A]/50'
        }`}
      >
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="Aarav"
            className="w-10 h-10 rounded-lg object-cover border border-[#B7F34A]/40"
          />
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#19C37D] rounded-full border-2 border-[#051A14] flex items-center justify-center">
            <Check className="w-2 h-2 text-[#051A14] stroke-[3]" />
          </span>
        </div>
        <div>
          <h4 className="font-extrabold text-xs text-white">Aarav S.</h4>
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-[#B7F34A] text-[#051A14]">
            Python
          </span>
        </div>
      </div>

      {/* NODE 2: Priya Patel (Top Right) */}
      <div
        onMouseEnter={() => setHoveredNode('priya')}
        onMouseLeave={() => setHoveredNode(null)}
        className={`absolute z-10 top-[12%] right-[8%] sm:right-[12%] flex items-center space-x-2.5 p-2 pr-3 bg-[#051A14]/90 rounded-xl border transition-all duration-300 cursor-pointer ${
          hoveredNode === 'priya'
            ? 'border-[#B7F34A] scale-105 shadow-[0_0_20px_rgba(183,243,74,0.25)]'
            : 'border-[#B7F34A]/20 hover:border-[#B7F34A]/50'
        }`}
      >
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
            alt="Priya"
            className="w-10 h-10 rounded-lg object-cover border border-[#B7F34A]/40"
          />
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#19C37D] rounded-full border-2 border-[#051A14] flex items-center justify-center">
            <Check className="w-2 h-2 text-[#051A14] stroke-[3]" />
          </span>
        </div>
        <div>
          <h4 className="font-extrabold text-xs text-white">Priya P.</h4>
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-[#19C37D] text-[#051A14]">
            PyTorch
          </span>
        </div>
      </div>

      {/* NODE 3: Rohan Gupta (Bottom Center) */}
      <div
        onMouseEnter={() => setHoveredNode('rohan')}
        onMouseLeave={() => setHoveredNode(null)}
        className={`absolute z-10 bottom-[10%] left-[30%] sm:left-[35%] flex items-center space-x-2.5 p-2 pr-3 bg-[#051A14]/90 rounded-xl border transition-all duration-300 cursor-pointer ${
          hoveredNode === 'rohan'
            ? 'border-[#B7F34A] scale-105 shadow-[0_0_20px_rgba(183,243,74,0.25)]'
            : 'border-[#B7F34A]/20 hover:border-[#B7F34A]/50'
        }`}
      >
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
            alt="Rohan"
            className="w-10 h-10 rounded-lg object-cover border border-[#B7F34A]/40"
          />
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#19C37D] rounded-full border-2 border-[#051A14] flex items-center justify-center">
            <Check className="w-2 h-2 text-[#051A14] stroke-[3]" />
          </span>
        </div>
        <div>
          <h4 className="font-extrabold text-xs text-white">Rohan G.</h4>
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-[#EFECE6] text-[#051A14]">
            FastAPI
          </span>
        </div>
      </div>

      {/* Connecting concept label footer */}
      <div className="absolute bottom-2 left-3 right-3 text-center pointer-events-none">
        <span className="text-[9px] font-extrabold tracking-widest text-[#9BB0A6] uppercase">
          PEOPLE → SKILLS → CONNECTIONS → TEAMS
        </span>
      </div>
    </div>
  );
}
