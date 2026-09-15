'use client';

import React, { useEffect, useState } from 'react';

export interface MatchScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function MatchScoreRing({ score, size = 64, strokeWidth = 5 }: MatchScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const increment = Math.max(1, Math.floor(score / (duration / 16)));

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 transform">
        {/* Background Circle Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(183, 243, 74, 0.15)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#B7F34A"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {/* Score Text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-black text-sm text-[#B7F34A] leading-none">{displayScore}%</span>
        <span className="text-[8px] font-extrabold text-[#9BB0A6] uppercase tracking-wider mt-0.5">MATCH</span>
      </div>
    </div>
  );
}
