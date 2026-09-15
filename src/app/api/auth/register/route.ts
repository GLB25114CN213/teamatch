import { NextResponse } from 'next/server';
import { validateGlbitmEmail, generateOtp, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/email';

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

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json({ error: 'An account with this GLBITM email already exists. Please log in.' }, { status: 400 });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save token
    await prisma.verificationToken.create({
      data: {
        email: cleanEmail,
        token: otp,
        expiresAt,
      },
    });

    // Create draft unverified user if not existing
    const passwordHash = await hashPassword(password);
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: cleanEmail,
          name,
          passwordHash,
          isVerified: false,
        },
      });
    }

    // Send OTP email via SMTP
    const emailResult = await sendOtpEmail({
      toEmail: cleanEmail,
      studentName: name,
      otp,
    });

    const isSmtpActive = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

    return NextResponse.json({
      message: isSmtpActive
        ? `A 6-digit verification code has been sent to your GLBITM inbox (${cleanEmail}).`
        : 'Verification code generated for your GLBITM email.',
      email: cleanEmail,
      // Only include on-screen preview if SMTP is not configured
      otpPreview: isSmtpActive ? undefined : otp,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
