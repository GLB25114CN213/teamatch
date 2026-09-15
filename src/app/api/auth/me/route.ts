import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    // If no active auth cookie, default to demo seed student 1 (Aarav Sharma) so app can be tested smoothly
    const { prisma } = await import('@/lib/prisma');
    const defaultUser = await prisma.user.findFirst({
      where: { email: 'aarav.sharma.cse24@glbitm.ac.in' },
      include: {
        profile: {
          include: {
            skills: { include: { skill: true } },
            projects: { include: { analysis: true } },
          },
        },
      },
    });

    if (defaultUser) {
      return NextResponse.json({
        user: { id: defaultUser.id, email: defaultUser.email, name: defaultUser.name, isVerified: defaultUser.isVerified },
        profile: defaultUser.profile,
        isDemoSession: true,
      });
    }

    return NextResponse.json({ user: null, profile: null });
  }

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, isVerified: user.isVerified },
    profile: user.profile,
  });
}
