import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const student = await prisma.studentProfile.findUnique({
      where: { id },
      include: {
        user: true,
        skills: {
          include: { skill: true },
        },
        projects: {
          include: { analysis: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    const verified = student.skills.filter((sk) => sk.isVerified);
    const selfDeclared = student.skills.filter((sk) => !sk.isVerified);

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.user.name,
        branch: student.branch,
        year: student.year,
        bio: student.bio,
        avatarUrl: student.avatarUrl,
        linkedinUrl: student.linkedinUrl,
        githubUrl: student.githubUrl,
        availability: student.availability,
        interests: JSON.parse(student.interests || '[]'),
        preferredDomains: JSON.parse(student.preferredDomains || '[]'),
        verifiedSkills: verified.map((v) => ({
          name: v.skill.name,
          confidence: v.confidence || 'High',
          evidenceSummary: v.evidenceSummary,
        })),
        selfDeclaredSkills: selfDeclared.map((sd) => ({ name: sd.skill.name })),
        projects: student.projects,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
