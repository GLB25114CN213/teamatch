import { prisma } from './prisma';
import { calculateRealStudentMatchScore, type MatchBreakdown, type MatchScoreResult } from './matching-calc';

export { calculateRealStudentMatchScore };
export type { MatchBreakdown, MatchScoreResult };

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
    const sObj = s as any;
    const verified = (sObj.skills || []).filter((sk: any) => sk.isVerified);
    const selfDeclared = (sObj.skills || []).filter((sk: any) => !sk.isVerified);

    const { score, reasons } = calculateRealStudentMatchScore(
      sObj,
      requiredSkills,
      opportunity.type,
      `${opportunity.title} ${opportunity.description}`
    );

    recommendations.push({
      studentId: sObj.id,
      studentName: sObj.user?.name || '',
      avatarUrl: sObj.avatarUrl,
      branch: sObj.branch,
      year: sObj.year,
      bio: sObj.bio,
      linkedinUrl: sObj.linkedinUrl,
      githubUrl: sObj.githubUrl,
      availability: sObj.availability,
      matchScore: score,
      matchReasons: reasons,
      verifiedSkills: verified.map((v: any) => ({ name: v.skill?.name || v.name || '', confidence: v.confidence || 'High' })),
      selfDeclaredSkills: selfDeclared.map((sd: any) => ({ name: sd.skill?.name || sd.name || '' })),
      projectCount: (sObj.projects || []).length,
    });
  }

  // Sort by real match score descending
  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

