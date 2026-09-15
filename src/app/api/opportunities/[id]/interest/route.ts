import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const body = await req.json();
    const { message } = body;

    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: { creator: { include: { user: true } } },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found.' }, { status: 404 });
    }

    // Record Interest
    const interest = await prisma.opportunityInterest.create({
      data: {
        opportunityId: id,
        studentId: user.profile.id,
        message: message || "I'm interested in joining your team for this project!",
        status: 'Pending',
      },
    });

    // Create Notification for creator
    await prisma.notification.create({
      data: {
        userId: opportunity.creator.userId,
        title: 'New Interest Expressed! 🌟',
        message: `${user.name} (${user.profile.branch} ${user.profile.year}) expressed interest in "${opportunity.title}".`,
        type: 'interest',
        link: `/opportunities/${id}`,
      },
    });

    return NextResponse.json({ message: 'Interest expressed successfully.', interest });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
