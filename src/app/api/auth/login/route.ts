import { NextResponse } from 'next/server';
import { comparePassword, signJwtToken, validateGlbitmEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !validateGlbitmEmail(email)) {
      return NextResponse.json(
        { error: 'Login requires a valid verified GLBITM student email (@glbitm.ac.in).' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { profile: true },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Account not found. Please register first.' }, { status: 404 });
    }

    const validPassword = await comparePassword(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid password. Please try again.' }, { status: 401 });
    }

    const token = signJwtToken({ userId: user.id, email: user.email, name: user.name });
    const response = NextResponse.json({
      message: 'Logged in successfully.',
      user: { id: user.id, email: user.email, name: user.name, isVerified: user.isVerified },
      profile: user.profile,
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
