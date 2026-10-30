export interface MatchBreakdown {
  skillsScore: number;
  maxSkillsScore: number;
  domainScore: number;
  maxDomainScore: number;
  availabilityScore: number;
  maxAvailabilityScore: number;
  matchedSkills: Array<{ name: string; confidence: string; points: number }>;
}

export interface MatchScoreResult {
  score: number;
  reasons: string[];
  breakdown: MatchBreakdown;
}

export function calculateRealStudentMatchScore(
  student: {
    skills?: Array<{ isVerified: boolean; confidence?: string | null; skill: { name: string } }>;
    projects?: Array<{ title: string; description: string; analysis?: { domainsJson?: string } | null }>;
    interests?: string | null;
    preferredDomains?: string | null;
    availability?: string;
  },
  requiredSkills: string[],
  opportunityType?: string,
  opportunityTitleDesc?: string
): MatchScoreResult {
  const reasons: string[] = [];
  const matchedSkills: Array<{ name: string; confidence: string; points: number }> = [];
  
  let skillsScore = 0;
  const maxSkillsScore = 60;

  let domainScore = 0;
  const maxDomainScore = 25;

  let availabilityScore = 0;
  const maxAvailabilityScore = 15;

  const skillsList = student.skills || [];
  const projectsList = student.projects || [];

  const verified = skillsList.filter((s) => s.isVerified);
  const selfDeclared = skillsList.filter((s) => !s.isVerified);
  const verifiedMap = new Map(verified.map((v) => [v.skill.name.toLowerCase(), v]));
  const selfDeclaredSet = new Set(selfDeclared.map((s) => s.skill.name.toLowerCase()));

  // 1. Required Skills Overlap (Weight: up to 60%)
  if (requiredSkills.length > 0) {
    const pointsPerSkill = maxSkillsScore / requiredSkills.length;

    for (const req of requiredSkills) {
      const reqLower = req.toLowerCase();
      const verifiedMatch = verifiedMap.get(reqLower);
      if (verifiedMatch) {
        const mult = verifiedMatch.confidence === 'High' ? 1.0 : verifiedMatch.confidence === 'Medium' ? 0.85 : 0.7;
        const pts = Math.round(pointsPerSkill * mult);
        skillsScore += pts;
        matchedSkills.push({
          name: verifiedMatch.skill.name,
          confidence: verifiedMatch.confidence || 'High',
          points: pts,
        });
        reasons.push(`✓ ${verifiedMatch.skill.name} — Verified (${verifiedMatch.confidence || 'High'} confidence: +${pts}%)`);
      } else if (selfDeclaredSet.has(reqLower)) {
        const pts = Math.round(pointsPerSkill * 0.4);
        skillsScore += pts;
        matchedSkills.push({
          name: req,
          confidence: 'Self-declared',
          points: pts,
        });
        reasons.push(`✓ ${req} — Self-declared skill (+${pts}%)`);
      }
    }
  } else {
    // Evaluate verified skills density if no specific requirements specified (max 40 pts)
    const verifiedCount = verified.length;
    if (verifiedCount > 0) {
      const pts = Math.min(verifiedCount * 10, 40);
      skillsScore += pts;
      reasons.push(`✓ ${verifiedCount} verified technical skill${verifiedCount > 1 ? 's' : ''} (+${pts}%)`);
    }
  }
  skillsScore = Math.min(skillsScore, maxSkillsScore);

  // 2. Domain & Project Evidence Relevance (Weight: up to 25%)
  if (opportunityTitleDesc) {
    const text = opportunityTitleDesc.toLowerCase();
    let relevantProjectCount = 0;

    for (const proj of projectsList) {
      const projText = (proj.title + ' ' + proj.description).toLowerCase();
      let domains: string[] = [];
      try {
        domains = JSON.parse(proj.analysis?.domainsJson || '[]');
      } catch {
        domains = [];
      }

      if (
        domains.some((d) => text.includes(d.toLowerCase())) ||
        projText.split(' ').some((w) => w.length > 3 && text.includes(w))
      ) {
        relevantProjectCount++;
      }
    }

    if (relevantProjectCount > 0) {
      const pts = Math.min(Math.round(relevantProjectCount * 12.5), maxDomainScore);
      domainScore = pts;
      reasons.push(`✓ ${relevantProjectCount} verified project${relevantProjectCount > 1 ? 's' : ''} in domain (+${pts}%)`);
    }
  }

  // 3. Availability & Interest Alignment (Weight: up to 15%)
  if (student.availability === 'Looking for Team') {
    availabilityScore += 8;
    reasons.push('✓ Actively looking for a team (+8%)');
  } else if (student.availability === 'Available') {
    availabilityScore += 5;
    reasons.push('✓ Currently Available (+5%)');
  }

  if (opportunityType) {
    let interests: string[] = [];
    try {
      interests = JSON.parse(student.interests || '[]');
    } catch {
      interests = [];
    }

    if (opportunityType === 'SIH' && interests.some((i) => i.toUpperCase().includes('SIH'))) {
      availabilityScore += 7;
      reasons.push('✓ Interested in SIH 2026 (+7%)');
    } else if (opportunityType === 'Hackathon' && interests.some((i) => i.toLowerCase().includes('hackathon'))) {
      availabilityScore += 7;
      reasons.push('✓ Active hackathon participant (+7%)');
    }
  }
  availabilityScore = Math.min(availabilityScore, maxAvailabilityScore);

  const totalCalculated = skillsScore + domainScore + availabilityScore;
  const finalScore = Math.min(Math.max(totalCalculated, 0), 100);

  return {
    score: finalScore,
    reasons: reasons.length > 0 ? reasons : ['✓ GLBITM Verified student profile'],
    breakdown: {
      skillsScore,
      maxSkillsScore,
      domainScore,
      maxDomainScore,
      availabilityScore,
      maxAvailabilityScore,
      matchedSkills,
    },
  };
}
