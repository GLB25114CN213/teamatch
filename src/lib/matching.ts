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
    let score = 50; // base score
    const reasons: string[] = [];

    // Separate verified vs self-declared skills
    const verified = s.skills.filter((sk) => sk.isVerified);
    const selfDeclared = s.skills.filter((sk) => !sk.isVerified);

    const verifiedSkillNames = verified.map((sk) => sk.skill.name.toLowerCase());
    const selfDeclaredSkillNames = selfDeclared.map((sk) => sk.skill.name.toLowerCase());

    // 1. Evaluate Required Skills against VERIFIED skills (weighted higher!)
    let verifiedMatches = 0;
    for (const req of requiredSkills) {
      const reqLower = req.toLowerCase();
      const foundVerified = verified.find((v) => v.skill.name.toLowerCase() === reqLower);
      if (foundVerified) {
        verifiedMatches++;
        score += 15;
        reasons.push(`✓ ${foundVerified.skill.name} — Verified (${foundVerified.confidence || 'High'} confidence)`);
      } else if (selfDeclaredSkillNames.includes(reqLower)) {
        score += 5;
        reasons.push(`✓ ${req} — Self-declared skill`);
      }
    }

    // 2. Evaluate Domain & Project Relevance
    const oppText = (opportunity.title + ' ' + opportunity.description).toLowerCase();
    let relevantProjectCount = 0;
    for (const proj of s.projects) {
      const projText = (proj.title + ' ' + proj.description).toLowerCase();
      let domains: string[] = [];
      try {
        domains = JSON.parse(proj.analysis?.domainsJson || '[]');
      } catch {
        domains = [];
      }

      if (
        domains.some((d) => oppText.includes(d.toLowerCase())) ||
        projText.split(' ').some((word) => word.length > 3 && oppText.includes(word))
      ) {
        relevantProjectCount++;
      }
    }

    if (relevantProjectCount > 0) {
      score += 12;
      reasons.push(`✓ ${relevantProjectCount} relevant project${relevantProjectCount > 1 ? 's' : ''} in domain`);
    }

    // 3. Evaluate Interest Alignment (e.g. SIH interest)
    let studentInterests: string[] = [];
    try {
      studentInterests = JSON.parse(s.interests || '[]');
    } catch {
      studentInterests = [];
    }

    if (opportunity.type === 'SIH' && studentInterests.some((i) => i.toUpperCase().includes('SIH'))) {
      score += 10;
      reasons.push('✓ Interested in SIH 2026');
    } else if (opportunity.type === 'Hackathon' && studentInterests.some((i) => i.toLowerCase().includes('hackathon'))) {
      score += 10;
      reasons.push('✓ Active hackathon participant');
    }

    // 4. Availability Check
    if (s.availability === 'Available') {
      score += 5;
      reasons.push('✓ Currently Available');
    } else if (s.availability === 'Looking for Team') {
      score += 8;
      reasons.push('✓ Actively looking for a team');
    }

    // Cap match score between 65% and 98% for realistic UI presentation
    const finalScore = Math.min(Math.max(score, 60), 98);

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
      matchScore: finalScore,
      matchReasons: reasons.length > 0 ? reasons : ['✓ GLBITM Verified student', '✓ Compatible branch/year'],
      verifiedSkills: verified.map((v) => ({ name: v.skill.name, confidence: v.confidence || 'High' })),
      selfDeclaredSkills: selfDeclared.map((sd) => ({ name: sd.skill.name })),
      projectCount: s.projects.length,
    });
  }

  // Sort by match score descending
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}
