import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processProjectAiAnalysis } from '@/lib/ai-analyzer';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        student: {
          include: { user: true },
        },
        analysis: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
