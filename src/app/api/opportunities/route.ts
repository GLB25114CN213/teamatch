import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    const where: any = {};
    if (type && type !== 'All') where.type = type;

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        creator: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = opportunities.map((opp) => ({
      id: opp.id,
      title: opp.title,
      type: opp.type,
      description: opp.description,
      requiredSkills: JSON.parse(opp.requiredSkillsJson || '[]'),
      preferredExperience: opp.preferredExperience,
      membersNeeded: opp.membersNeeded,
      currentTeamSize: opp.currentTeamSize,
      deadline: opp.deadline,
      status: opp.status,
      creator: {
        id: opp.creator.id,
        name: opp.creator.user.name,
        branch: opp.creator.branch,
        year: opp.creator.year,
        avatarUrl: opp.creator.avatarUrl,
      },
      createdAt: opp.createdAt,
    }));

    return NextResponse.json({ opportunities: formatted });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, type, description, requiredSkills, preferredExperience, membersNeeded, deadline } = body;

    if (!title || !description || !type) {
      return NextResponse.json({ error: 'Title, description, and opportunity type are required.' }, { status: 400 });
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        creatorId: user.profile.id,
        title,
        type: type || 'SIH',
        description,
        requiredSkillsJson: typeof requiredSkills === 'string' ? requiredSkills : JSON.stringify(requiredSkills || []),
        preferredExperience,
        membersNeeded: Number(membersNeeded) || 4,
        currentTeamSize: 1,
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Open',
      },
    });

    // Create corresponding team container
    await prisma.team.create({
      data: {
        opportunityId: opportunity.id,
        name: `${title} Team`,
        members: {
          create: [{ studentId: user.profile.id, role: 'Leader' }],
        },
      },
    });

    return NextResponse.json({ message: 'Opportunity created successfully.', opportunity });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
