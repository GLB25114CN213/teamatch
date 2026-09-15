import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const branch = searchParams.get('branch') || '';
    const year = searchParams.get('year') || '';
    const availability = searchParams.get('availability') || '';

    const where: any = {};

    if (branch && branch !== 'All') where.branch = branch;
    if (year && year !== 'All') where.year = year;
    if (availability && availability !== 'All') where.availability = availability;

    if (query) {
      where.OR = [
        { user: { name: { contains: query } } },
        { bio: { contains: query } },
        { branch: { contains: query } },
      ];
    }

    const students = await prisma.studentProfile.findMany({
      where,
      include: {
        user: true,
        skills: {
          include: { skill: true },
        },
        projects: {
          include: { analysis: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = students.map((s) => {
      const verified = s.skills.filter((sk) => sk.isVerified);
      const selfDeclared = s.skills.filter((sk) => !sk.isVerified);

      return {
        id: s.id,
        name: s.user.name,
        email: s.user.email,
        branch: s.branch,
        year: s.year,
        bio: s.bio,
        avatarUrl: s.avatarUrl,
        linkedinUrl: s.linkedinUrl,
        githubUrl: s.githubUrl,
        availability: s.availability,
        verifiedSkills: verified.map((v) => ({ name: v.skill.name, confidence: v.confidence || 'High' })),
        selfDeclaredSkills: selfDeclared.map((sd) => ({ name: sd.skill.name })),
        projectCount: s.projects.length,
      };
    });

    return NextResponse.json({ students: formatted });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
