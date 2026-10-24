import { prisma } from '../src/lib/prisma';
import { hashPassword, comparePassword, signJwtToken, verifyJwtToken } from '../src/lib/auth';
import { calculateTeammateMatchesForOpportunity, calculateRealStudentMatchScore } from '../src/lib/matching';

async function testFullFlow() {
  console.log('--- 1. Testing Password & JWT ---');
  const password = 'mypassword123';
  const hashed = await hashPassword(password);
  const isValid = await comparePassword(password, hashed);
  if (!isValid) throw new Error('Password hashing failed');
  console.log('✓ Password hashing and verification passed');

  const token = signJwtToken({ userId: 'u1', email: 'u1@test.com', name: 'User One' });
  const decoded = verifyJwtToken(token);
  if (!decoded || decoded.userId !== 'u1') throw new Error('JWT verification failed');
  console.log('✓ JWT signing and verification passed');

  console.log('\n--- 2. Testing Database User & Profile Creation ---');
  const timestamp = Date.now();
  const testEmail = `builder_${timestamp}@test.com`;
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      name: 'Rohan Sharma',
      passwordHash: hashed,
      isVerified: true,
      profile: {
        create: {
          branch: 'CSE',
          year: '3rd Year',
          bio: 'Passionate fullstack engineer with AI/ML interest',
          githubUrl: 'https://github.com/rohansharma',
          linkedinUrl: 'https://linkedin.com/in/rohansharma',
          interests: JSON.stringify(['SIH 2026', 'Hackathons']),
          preferredDomains: JSON.stringify(['AI/ML', 'Web Dev']),
        },
      },
    },
    include: { profile: true },
  });

  if (!user || !user.profile) throw new Error('Failed to create user with profile');
  console.log(`✓ User created: ${user.name} (${user.email}), profileId: ${user.profile.id}`);

  console.log('\n--- 3. Testing Skill Attachment ---');
  const skill = await prisma.skill.upsert({
    where: { name: 'Python' },
    update: {},
    create: { name: 'Python', category: 'Technical' },
  });

  await prisma.studentSkill.create({
    data: {
      studentId: user.profile.id,
      skillId: skill.id,
      isVerified: true,
      confidence: 'High',
      evidenceCount: 3,
      evidenceSummary: 'Extracted from repository commits',
    },
  });
  console.log('✓ Verified skill attached to student');

  console.log('\n--- 4. Testing Project Creation & Analysis Storage ---');
  const project = await prisma.project.create({
    data: {
      studentId: user.profile.id,
      title: 'AI Smart Irrigation System',
      description: 'IoT and Deep Learning automated soil monitoring and drip control.',
      githubUrl: 'https://github.com/rohansharma/smart-irrigation',
      technologies: JSON.stringify(['Python', 'PyTorch', 'IoT']),
      analysis: {
        create: {
          status: 'completed',
          skillsJson: JSON.stringify([{ name: 'Python', confidence: 'High' }]),
          domainsJson: JSON.stringify(['IoT', 'AI/ML']),
          complexity: 'Intermediate',
          aiAssistanceLevel: 'Minimal',
          technicalOwnershipLevel: 'High',
          summary: 'Original embedded Python implementation with deep learning pipeline.',
        },
      },
    },
    include: { analysis: true },
  });

  if (!project.analysis || project.analysis.status !== 'completed') {
    throw new Error('Project analysis record invalid');
  }
  console.log(`✓ Project and Analysis stored: "${project.title}" status=${project.analysis.status}`);

  console.log('\n--- 5. Testing Opportunity Creation ---');
  const opportunity = await prisma.opportunity.create({
    data: {
      creatorId: user.profile.id,
      title: 'SIH 2026 Smart Agriculture Team',
      type: 'SIH',
      description: 'Looking for a Python and IoT specialist to complete our 5-person roster.',
      requiredSkillsJson: JSON.stringify(['Python', 'IoT']),
      membersNeeded: 4,
    },
  });
  console.log(`✓ Opportunity created: "${opportunity.title}" (ID: ${opportunity.id})`);

  console.log('\n--- 6. Testing Match Scoring ---');
  const matchResult = calculateRealStudentMatchScore(
    {
      ...user.profile,
      skills: [
        {
          skill: { name: 'Python' },
          isVerified: true,
          confidence: 'High',
        },
      ],
      interests: JSON.stringify(['SIH 2026']),
      preferredDomains: JSON.stringify(['AI/ML']),
    },
    ['Python', 'IoT'],
    'SIH',
    'SIH 2026 Smart Agriculture'
  );

  console.log(`✓ Match score calculated: ${matchResult.score}%`);
  console.log('Match reasons:', matchResult.reasons);
  if (typeof matchResult.score !== 'number' || matchResult.score <= 0) {
    throw new Error('Match score calculation failed');
  }

  console.log('\n=========================================');
  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');
  console.log('=========================================');
}

testFullFlow()
  .catch((err) => {
    console.error('Test Flow Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
