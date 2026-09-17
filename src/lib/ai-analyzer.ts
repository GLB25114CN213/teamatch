import { GoogleGenAI } from '@google/genai';
import { prisma } from './prisma';
import { fetchGithubRepoDetails, normalizeGithubUrl } from './github';

export async function processProjectAiAnalysis(projectId: string) {
  console.log(`🤖 Starting AI analysis for Project ID: ${projectId}`);

  // 1. Fetch project with student profile
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      student: {
        include: {
          user: true,
        },
      },
      analysis: true,
    },
  });

  if (!project) return;

  // Update status to 'analyzing'
  await prisma.projectAnalysis.upsert({
    where: { projectId },
    update: { status: 'analyzing', failureReason: null },
    create: { projectId, status: 'analyzing' },
  });

  try {
    const normalizedUrl = project.githubUrl ? normalizeGithubUrl(project.githubUrl) : null;
    let result: any = null;

    // Check RepositoryCache first if repository URL exists
    if (normalizedUrl) {
      const cached = await prisma.repositoryCache.findUnique({
        where: { normalizedUrl },
      });

      if (cached && cached.analysisJson) {
        try {
          result = JSON.parse(cached.analysisJson);
          console.log(`⚡ Reusing cached AI analysis for repository: ${normalizedUrl}`);
        } catch {
          result = null;
        }
      }
    }

    // Fetch GitHub details if githubUrl exists and not cached
    let repoEvidence = null;
    if (project.githubUrl) {
      try {
        repoEvidence = await fetchGithubRepoDetails(project.githubUrl);
      } catch (e) {
        console.warn('Failed to fetch GitHub repo details:', e);
      }
    }

    if (!result) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured in environment variables. Real AI analysis cannot be performed.');
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Analyze this college technical project and GitHub evidence for TeamMatch skill verification.
Title: ${project.title}
Description: ${project.description}
Role: ${project.role || 'Contributor'}
Technologies declared: ${project.technologies}
GitHub Data: ${JSON.stringify(repoEvidence)}

Return ONLY a raw JSON object with NO markdown formatting, matching this EXACT TypeScript schema:
{
  "skills": [{ "name": string, "confidence": "High"|"Medium"|"Low", "evidence": string, "source": string }],
  "domains": string[],
  "complexity": "Beginner" | "Intermediate" | "Advanced",
  "aiAssistance": {
    "level": "Minimal" | "Light" | "Moderate" | "Heavy" | "Insufficient",
    "evidence": string[]
  },
  "technicalOwnership": {
    "level": "High" | "Medium" | "Low",
    "evidence": string[]
  },
  "summary": string
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      result = JSON.parse(cleanJson);

      // Cache result if normalized URL exists
      if (normalizedUrl && result) {
        await prisma.repositoryCache.upsert({
          where: { normalizedUrl },
          update: { analysisJson: JSON.stringify(result) },
          create: {
            repoUrl: project.githubUrl || normalizedUrl,
            normalizedUrl,
            analysisJson: JSON.stringify(result),
          },
        });
      }
    }

    // 2. Save Analysis to DB
    await prisma.projectAnalysis.update({
      where: { projectId },
      data: {
        status: 'completed',
        skillsJson: JSON.stringify(result.skills || []),
        domainsJson: JSON.stringify(result.domains || []),
        complexity: result.complexity || 'Intermediate',
        aiAssistanceLevel: result.aiAssistance?.level || 'Light',
        aiAssistanceEvidence: JSON.stringify(result.aiAssistance?.evidence || []),
        technicalOwnershipLevel: result.technicalOwnership?.level || 'High',
        technicalOwnershipEvidence: JSON.stringify(result.technicalOwnership?.evidence || []),
        summary: result.summary || 'Project evidence analyzed successfully.',
        failureReason: null,
        analyzedAt: new Date(),
      },
    });

    // 3. Register Extracted Skills into StudentSkill as VERIFIED SKILLS
    const extractedSkills = result.skills || [];
    for (const sk of extractedSkills) {
      if (!sk.name) continue;

      const skillRecord = await prisma.skill.upsert({
        where: { name: sk.name },
        update: {},
        create: { name: sk.name, category: 'Technical' },
      });

      await prisma.studentSkill.upsert({
        where: {
          studentId_skillId_isVerified: {
            studentId: project.studentId,
            skillId: skillRecord.id,
            isVerified: true,
          },
        },
        update: {
          confidence: sk.confidence || 'High',
          evidenceCount: { increment: 1 },
          evidenceSummary: `${sk.evidence || 'Extracted from repository'} (Source: ${sk.source || 'Project Evidence'})`,
        },
        create: {
          studentId: project.studentId,
          skillId: skillRecord.id,
          isVerified: true,
          confidence: sk.confidence || 'High',
          evidenceCount: 1,
          evidenceSummary: `${sk.evidence || 'Extracted from repository'} (Source: ${sk.source || 'Project Evidence'})`,
        },
      });
    }

    console.log(`✅ AI analysis completed for Project ID: ${projectId}`);
  } catch (err) {
    const errorMsg = (err as Error).message || 'Unknown analysis error';
    console.error(`❌ AI Analysis failed for Project ID: ${projectId}:`, errorMsg);

    await prisma.projectAnalysis.update({
      where: { projectId },
      data: {
        status: 'failed',
        failureReason: errorMsg,
        retryCount: { increment: 1 },
      },
    });
  }
}

