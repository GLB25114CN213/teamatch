import { prisma } from './prisma';

export interface MatchRecommendation {
  studentId: string;
  studentName: string;
  avatarUrl: string | null;
  branch: string;
  year: string;
  bio: string | null;
  linkedinUrl: string;
  githubUrl: string;
  availability: string;
  matchScore: number;
  matchReasons: string[];
  verifiedSkills: { name: string; confidence: string }[];
  selfDeclaredSkills: { name: string }[];
  projectCount: number;
}

export function calculateRealStudentMatchScore(
  student: {
    skills: Array<{ isVerified: boolean; confidence?: string | null; skill: { name: string } }>;
    projects: Array<{ title: string; description: string; analysis?: { domainsJson?: string } | null }>;
    interests?: string | null;
    availability?: string;
  },
  requiredSkills: string[],
  opportunityType?: string,
  opportunityTitleDesc?: string
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  const verified = student.skills.filter((s) => s.isVerified);
  const selfDeclared = student.skills.filter((s) => !s.isVerified);
  const verifiedMap = new Map(verified.map((v) => [v.skill.name.toLowerCase(), v]));
  const selfDeclaredSet = new Set(selfDeclared.map((s) => s.skill.name.toLowerCase()));

  // 1. Required Skills Overlap (Weight: up to 60%)
  if (requiredSkills.length > 0) {
    const pointsPerSkill = 60 / requiredSkills.length;

    for (const req of requiredSkills) {
      const reqLower = req.toLowerCase();
      const verifiedMatch = verifiedMap.get(reqLower);
      if (verifiedMatch) {
        const mult = verifiedMatch.confidence === 'High' ? 1.0 : verifiedMatch.confidence === 'Medium' ? 0.85 : 0.7;
        const pts = Math.round(pointsPerSkill * mult);
        score += pts;
        reasons.push(`✓ ${verifiedMatch.skill.name} — Verified (${verifiedMatch.confidence || 'High'} confidence)`);
      } else if (selfDeclaredSet.has(reqLower)) {
        const pts = Math.round(pointsPerSkill * 0.4);
        score += pts;
        reasons.push(`✓ ${req} — Self-declared skill`);
      }
    }
  } else {
    // Evaluate verified skills density if no specific requirements specified (max 40 pts)
    const verifiedCount = verified.length;
    if (verifiedCount > 0) {
      const pts = Math.min(verifiedCount * 10, 40);
      score += pts;
      reasons.push(`✓ ${verifiedCount} verified technical skill${verifiedCount > 1 ? 's' : ''}`);
    }
  }

  // 2. Domain & Project Evidence Relevance (Weight: up to 25%)
  if (opportunityTitleDesc) {
    const text = opportunityTitleDesc.toLowerCase();
    let relevantProjectCount = 0;

    for (const proj of student.projects) {
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
      const pts = Math.min(relevantProjectCount * 12.5, 25);
      score += Math.round(pts);
      reasons.push(`✓ ${relevantProjectCount} relevant project${relevantProjectCount > 1 ? 's' : ''} in domain`);
    }
  }

  // 3. Availability & Interest Alignment (Weight: up to 15%)
  if (student.availability === 'Looking for Team') {
    score += 8;
    reasons.push('✓ Actively looking for a team');
  } else if (student.availability === 'Available') {
    score += 5;
    reasons.push('✓ Currently Available');
  }

  if (opportunityType) {
    let interests: string[] = [];
    try {
      interests = JSON.parse(student.interests || '[]');
    } catch {
      interests = [];
    }

    if (opportunityType === 'SIH' && interests.some((i) => i.toUpperCase().includes('SIH'))) {
      score += 7;
      reasons.push('✓ Interested in SIH 2026');
    } else if (opportunityType === 'Hackathon' && interests.some((i) => i.toLowerCase().includes('hackathon'))) {
      score += 7;
      reasons.push('✓ Active hackathon participant');
    }
  }

  const finalScore = Math.min(Math.round(score), 100);
  return {
    score: finalScore,
    reasons: reasons.length > 0 ? reasons : ['✓ GLBITM Verified student'],
  };
}

export async function calculateTeammateMatchesForOpportunity(
  opportunityId: string
): Promise<MatchRecommendation[]> {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });

  if (!opportunity) return [];

  let requiredSkills: string[] = [];
  try {
    requiredSkills = JSON.parse(opportunity.requiredSkillsJson || '[]');
  } catch {
    requiredSkills = [];
  }

  // Fetch all GLBITM students except creator
  const students = await prisma.studentProfile.findMany({
    where: {
      id: { not: opportunity.creatorId },
    },
    include: {
      user: true,
      skills: {
        include: { skill: true },
      },
      projects: {
        include: { analysis: true },
      },
    },
  });

  const recommendations: MatchRecommendation[] = [];

  for (const s of students) {
    const verified = s.skills.filter((sk) => sk.isVerified);
    const selfDeclared = s.skills.filter((sk) => !sk.isVerified);

    const { score, reasons } = calculateRealStudentMatchScore(
      s,
      requiredSkills,
      opportunity.type,
      `${opportunity.title} ${opportunity.description}`
    );

    recommendations.push({
      studentId: s.id,
      studentName: s.user.name,
      avatarUrl: s.avatarUrl,
      branch: s.branch,
      year: s.year,
      bio: s.bio,
      linkedinUrl: s.linkedinUrl,
      githubUrl: s.githubUrl,
      availability: s.availability,
      matchScore: score,
      matchReasons: reasons,
      verifiedSkills: verified.map((v) => ({ name: v.skill.name, confidence: v.confidence || 'High' })),
      selfDeclaredSkills: selfDeclared.map((sd) => ({ name: sd.skill.name })),
      projectCount: s.projects.length,
    });
  }

  // Sort by real match score descending
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

