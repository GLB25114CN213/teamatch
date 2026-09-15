import { NextResponse } from 'next/server';
import { processProjectAiAnalysis } from '@/lib/ai-analyzer';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    // Trigger re-analysis
    processProjectAiAnalysis(id).catch((err) => {
      console.error('Async AI re-analysis background task error:', err);
    });

    return NextResponse.json({ message: 'AI re-analysis queued successfully.' });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
