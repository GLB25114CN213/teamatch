import { NextResponse } from 'next/server';
import { validateGlbitmEmail, hashPassword, signJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password, branch, year, bio, linkedinUrl, githubUrl } = body;

    if (!email || !validateGlbitmEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        name: name.trim(),
        passwordHash,
        isVerified: true,
      },
    });

    const profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        branch: branch || 'CSE',
        year: year || '3rd Year',
        bio: bio || null,
        linkedinUrl: linkedinUrl || `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`,
        githubUrl: githubUrl || `https://github.com/${name.toLowerCase().replace(/\s+/g, '')}`,
        interests: JSON.stringify(['Hackathons', 'Web Development']),
        preferredDomains: JSON.stringify(['AI/ML', 'Web Dev']),
      },
    });

    const token = signJwtToken({ userId: user.id, email: user.email, name: user.name });
    const response = NextResponse.json({
      message: 'Account created successfully! Welcome to TeamMatch.',
      user: { id: user.id, email: user.email, name: user.name, isVerified: true },
      profile,
    });

    response.cookies.set('teamatch_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
