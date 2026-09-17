import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeGithubUrl } from '@/lib/github';
import { processProjectAiAnalysis } from '@/lib/ai-analyzer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    const currentUser = await getCurrentUser();
    const targetStudentId = studentId || currentUser?.profile?.id;

    if (!targetStudentId) {
      return NextResponse.json({ projects: [] });
    }

    const projects = await prisma.project.findMany({
      where: { studentId: targetStudentId },
      include: {
        analysis: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, githubUrl, liveUrl, demoUrl, role, teamSize, technologies, uploadedFiles, branch, year, bio, linkedinUrl } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Project title and description are required.' }, { status: 400 });
    }

    const studentId = user.profile.id;

    // Update profile metadata if provided
    const profileUpdateData: any = {};
    if (branch) profileUpdateData.branch = branch;
    if (year) profileUpdateData.year = year;
    if (bio !== undefined) profileUpdateData.bio = bio;
    if (linkedinUrl) profileUpdateData.linkedinUrl = linkedinUrl;
    if (githubUrl) profileUpdateData.githubUrl = githubUrl;

    if (Object.keys(profileUpdateData).length > 0) {
      await prisma.studentProfile.update({
        where: { id: studentId },
        data: profileUpdateData,
      });
    }

    const normalizedUrl = githubUrl ? normalizeGithubUrl(githubUrl) : null;

    let project;

    // Check for project deduplication by (studentId, normalizedGithubUrl)
    if (normalizedUrl) {
      const existingProject = await prisma.project.findFirst({
        where: {
          studentId,
          normalizedGithubUrl: normalizedUrl,
        },
      });

      if (existingProject) {
        // Project already exists! Update existing project rather than creating duplicate
        project = await prisma.project.update({
          where: { id: existingProject.id },
          data: {
            title,
            description,
            githubUrl,
            liveUrl,
            demoUrl,
            role,
            teamSize: Number(teamSize) || 1,
            technologies: typeof technologies === 'string' ? technologies : JSON.stringify(technologies || []),
            uploadedFilesJson: typeof uploadedFiles === 'string' ? uploadedFiles : JSON.stringify(uploadedFiles || []),
          },
        });
      }
    }

    if (!project) {
      // Create new project
      project = await prisma.project.create({
        data: {
          studentId,
          title,
          description,
          githubUrl,
          normalizedGithubUrl: normalizedUrl,
          liveUrl,
          demoUrl,
          role,
          teamSize: Number(teamSize) || 1,
          technologies: typeof technologies === 'string' ? technologies : JSON.stringify(technologies || []),
          uploadedFilesJson: typeof uploadedFiles === 'string' ? uploadedFiles : JSON.stringify(uploadedFiles || []),
          analysis: {
            create: {
              status: 'queued',
            },
          },
        },
      });
    }

    // Trigger Asynchronous AI Pipeline in non-blocking background execution
    processProjectAiAnalysis(project.id).catch((err) => {
      console.error('Async AI Analysis background task error:', err);
    });

    return NextResponse.json({
      message: 'Project submitted successfully. AI analysis has been queued.',
      project,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
