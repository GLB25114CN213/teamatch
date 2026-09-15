import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateTeammateMatchesForOpportunity } from '@/lib/matching';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        creator: { include: { user: true } },
        team: {
          include: {
            members: {
              include: {
                student: { include: { user: true } },
              },
            },
          },
        },
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found.' }, { status: 404 });
    }

    // Generate explainable candidate matches
    const recommendations = await calculateTeammateMatchesForOpportunity(id);

    return NextResponse.json({
      opportunity: {
        id: opportunity.id,
        title: opportunity.title,
        type: opportunity.type,
        description: opportunity.description,
        requiredSkills: JSON.parse(opportunity.requiredSkillsJson || '[]'),
        preferredExperience: opportunity.preferredExperience,
        membersNeeded: opportunity.membersNeeded,
        currentTeamSize: opportunity.currentTeamSize,
        deadline: opportunity.deadline,
        status: opportunity.status,
        creator: {
          id: opportunity.creator.id,
          name: opportunity.creator.user.name,
          branch: opportunity.creator.branch,
          year: opportunity.creator.year,
          avatarUrl: opportunity.creator.avatarUrl,
        },
        team: opportunity.team,
      },
      recommendations,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
