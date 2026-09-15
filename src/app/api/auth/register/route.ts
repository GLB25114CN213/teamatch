import { NextResponse } from 'next/server';
import { validateGlbitmEmail, generateOtp, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    if (!email || !validateGlbitmEmail(email)) {
      return NextResponse.json(
        { error: 'Registration is restricted strictly to verified GLBITM students (@glbitm.ac.in).' },
        { status: 400 }
      );
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json({ error: 'An account with this GLBITM email already exists. Please log in.' }, { status: 400 });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save token
    await prisma.verificationToken.create({
      data: {
        email: email.toLowerCase().trim(),
        token: otp,
        expiresAt,
      },
    });

    // Create draft unverified user if not existing
    const passwordHash = await hashPassword(password);
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name,
          passwordHash,
          isVerified: false,
        },
      });
    }

    return NextResponse.json({
      message: 'Verification code generated for your GLBITM email.',
      email: email.toLowerCase().trim(),
      otpPreview: otp, // Output in development response for easy test verification
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
