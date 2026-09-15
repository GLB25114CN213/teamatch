import { NextResponse } from 'next/server';
import { signJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, branch, year, linkedinUrl, githubUrl } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and verification code are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Verify OTP token
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: {
        email: cleanEmail,
        token: otp,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!tokenRecord) {
      return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 400 });
    }

    // Mark user as verified
    const user = await prisma.user.update({
      where: { email: cleanEmail },
      data: { isVerified: true },
    });

    // Create or update StudentProfile
    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        branch: branch || 'CSE',
        year: year || '3rd Year',
        linkedinUrl: linkedinUrl || `https://linkedin.com/in/${user.name.toLowerCase().replace(/\s+/g, '-')}`,
        githubUrl: githubUrl || `https://github.com/${user.name.toLowerCase().replace(/\s+/g, '')}`,
      },
      create: {
        userId: user.id,
        branch: branch || 'CSE',
        year: year || '3rd Year',
        linkedinUrl: linkedinUrl || `https://linkedin.com/in/${user.name.toLowerCase().replace(/\s+/g, '-')}`,
        githubUrl: githubUrl || `https://github.com/${user.name.toLowerCase().replace(/\s+/g, '')}`,
        interests: JSON.stringify(['SIH 2026', 'Web Development']),
        preferredDomains: JSON.stringify(['AI/ML', 'Web Development']),
      },
    });

    // Clean verification token
    await prisma.verificationToken.deleteMany({ where: { email: cleanEmail } });

    // Generate JWT cookie
    const token = signJwtToken({ userId: user.id, email: user.email, name: user.name });
    const response = NextResponse.json({
      message: 'Email verified successfully. Welcome to GLBITM TeamMatch!',
      user: { id: user.id, email: user.email, name: user.name },
      profile,
    });

    response.cookies.set('teamatch_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
