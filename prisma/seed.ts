import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting GLBITM TeamMatch Database Seeding...');

  // Clean existing tables
  await prisma.notification.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.opportunityInterest.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.projectAnalysis.deleteMany();
  await prisma.project.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Skills Catalog
  const skillsData = [
    { name: 'Python', category: 'Technical' },
    { name: 'PyTorch', category: 'Technical' },
    { name: 'React', category: 'Technical' },
    { name: 'Next.js', category: 'Technical' },
    { name: 'Node.js', category: 'Technical' },
    { name: 'FastAPI', category: 'Technical' },
    { name: 'TypeScript', category: 'Technical' },
    { name: 'Tailwind CSS', category: 'Technical' },
    { name: 'Go', category: 'Technical' },
    { name: 'Docker', category: 'Technical' },
    { name: 'PostgreSQL', category: 'Technical' },
    { name: 'C++', category: 'Technical' },
    { name: 'Embedded C', category: 'Technical' },
    { name: 'Arduino', category: 'Technical' },
    { name: 'IoT', category: 'Technical' },
    { name: 'TensorFlow', category: 'Technical' },
    { name: 'Pandas', category: 'Technical' },
    { name: 'SQL', category: 'Technical' },
    { name: 'Rust', category: 'Technical' },
    { name: 'Solidity', category: 'Technical' },
    { name: 'Figma', category: 'Design' },
    { name: 'UI/UX', category: 'Design' },
    { name: 'Leadership', category: 'Soft Skill' },
    { name: 'Public Speaking', category: 'Soft Skill' },
    { name: 'Agile', category: 'Soft Skill' },
    { name: 'System Design', category: 'Technical' },
    { name: 'Robotics', category: 'Technical' },
  ];

  const skillMap: Record<string, string> = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap[s.name] = created.id;
  }

  // 2. Create Students & Profiles
  // Student 1: Aarav Sharma (CSE 3rd Year)
  const user1 = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma.cse24@glbitm.ac.in',
      isVerified: true,
      profile: {
        create: {
          branch: 'CSE',
          year: '3rd Year',
          linkedinUrl: 'https://linkedin.com/in/aarav-sharma-glbitm',
          githubUrl: 'https://github.com/aaravsharma-dev',
          bio: 'Fullstack AI developer passionate about SIH 2026 and computer vision applications.',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          availability: 'Available',
          preferredTeamSize: 5,
          interests: JSON.stringify(['SIH 2026', 'Computer Vision', 'FastAPI', 'Healthcare AI']),
          preferredDomains: JSON.stringify(['AI/ML', 'Web Development', 'Healthcare']),
        },
      },
    },
    include: { profile: true },
  });

  // Student 2: Ananya Verma (CSE 2nd Year)
  const user2 = await prisma.user.create({
    data: {
      name: 'Ananya Verma',
      email: 'ananya.verma.cse25@glbitm.ac.in',
      isVerified: true,
      profile: {
        create: {
          branch: 'CSE',
          year: '2nd Year',
          linkedinUrl: 'https://linkedin.com/in/ananya-verma-ui',
          githubUrl: 'https://github.com/ananya-frontend',
          bio: 'Frontend enthusiast & Figma designer craft responsive web experiences.',
          avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
          availability: 'Available',
          preferredTeamSize: 4,
          interests: JSON.stringify(['React', 'Next.js', 'EdTech', 'Hackathons']),
          preferredDomains: JSON.stringify(['Web Development', 'UI/UX', 'EdTech']),
        },
      },
    },
    include: { profile: true },
  });

  // Student 3: Rohan Gupta (IT 4th Year)
  const user3 = await prisma.user.create({
    data: {
      name: 'Rohan Gupta',
      email: 'rohan.gupta.it23@glbitm.ac.in',
      isVerified: true,
      profile: {
        create: {
          branch: 'IT',
          year: '4th Year',
          linkedinUrl: 'https://linkedin.com/in/rohan-gupta-cloud',
          githubUrl: 'https://github.com/rohangupta-cloud',
          bio: 'Backend & Cloud architect working with Microservices, Docker, and PostgreSQL.',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          availability: 'Looking for Team',
          preferredTeamSize: 4,
          interests: JSON.stringify(['Docker', 'Microservices', 'PostgreSQL', 'System Design']),
          preferredDomains: JSON.stringify(['Cloud', 'Backend', 'DevOps']),
        },
      },
    },
    include: { profile: true },
  });

  // Student 4: Priya Patel (ECE 3rd Year)
  const user4 = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya.patel.ece24@glbitm.ac.in',
      isVerified: true,
      profile: {
        create: {
          branch: 'ECE',
          year: '3rd Year',
          linkedinUrl: 'https://linkedin.com/in/priya-patel-iot',
          githubUrl: 'https://github.com/priyapatel-embedded',
          bio: 'IoT hardware developer working on ESP32 mesh networks & autonomous drones.',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          availability: 'Available',
          preferredTeamSize: 4,
          interests: JSON.stringify(['IoT', 'Embedded C', 'Robotics', 'SIH 2026']),
          preferredDomains: JSON.stringify(['IoT', 'Robotics', 'Hardware']),
        },
      },
    },
    include: { profile: true },
  });

  const p1 = user1.profile!;
  const p2 = user2.profile!;
  const p3 = user3.profile!;
  const p4 = user4.profile!;

  // 3. Assign VERIFIED vs SELF-DECLARED Skills for students
  // Aarav
  await prisma.studentSkill.createMany({
    data: [
      // Verified Skills
      { studentId: p1.id, skillId: skillMap['Python'], isVerified: true, confidence: 'High', evidenceCount: 4, evidenceSummary: 'Extracted from 4 repos + PyTorch model code' },
      { studentId: p1.id, skillId: skillMap['PyTorch'], isVerified: true, confidence: 'High', evidenceCount: 2, evidenceSummary: 'YOLOv8 & OpenCV code in sih-womens-safety repo' },
      { studentId: p1.id, skillId: skillMap['FastAPI'], isVerified: true, confidence: 'High', evidenceCount: 3, evidenceSummary: 'REST API backend in vision-health-ai' },
      { studentId: p1.id, skillId: skillMap['React'], isVerified: true, confidence: 'Medium', evidenceCount: 2, evidenceSummary: 'Frontend components in smart-campus-dashboard' },
      // Self-declared Skills
      { studentId: p1.id, skillId: skillMap['Leadership'], isVerified: false },
      { studentId: p1.id, skillId: skillMap['Public Speaking'], isVerified: false },
      { studentId: p1.id, skillId: skillMap['UI/UX'], isVerified: false },
    ],
  });

  // Ananya
  await prisma.studentSkill.createMany({
    data: [
      // Verified Skills
      { studentId: p2.id, skillId: skillMap['React'], isVerified: true, confidence: 'High', evidenceCount: 3, evidenceSummary: 'Extracted from 3 active React repositories' },
      { studentId: p2.id, skillId: skillMap['TypeScript'], isVerified: true, confidence: 'High', evidenceCount: 3, evidenceSummary: 'Strong TypeScript typing in alumni-connect' },
      { studentId: p2.id, skillId: skillMap['Tailwind CSS'], isVerified: true, confidence: 'High', evidenceCount: 3, evidenceSummary: 'Tailwind styling in portfolio-v2' },
      { studentId: p2.id, skillId: skillMap['Next.js'], isVerified: true, confidence: 'Medium', evidenceCount: 1, evidenceSummary: 'App Router architecture in alumni-connect' },
      // Self-declared Skills
      { studentId: p2.id, skillId: skillMap['Figma'], isVerified: false },
      { studentId: p2.id, skillId: skillMap['UI/UX'], isVerified: false },
    ],
  });

  // Rohan
  await prisma.studentSkill.createMany({
    data: [
      // Verified Skills
      { studentId: p3.id, skillId: skillMap['Docker'], isVerified: true, confidence: 'High', evidenceCount: 4, evidenceSummary: 'Dockerfile & docker-compose configurations in 4 repos' },
      { studentId: p3.id, skillId: skillMap['PostgreSQL'], isVerified: true, confidence: 'High', evidenceCount: 3, evidenceSummary: 'Complex SQL schemas in microservice-auth-hub' },
      { studentId: p3.id, skillId: skillMap['Node.js'], isVerified: true, confidence: 'High', evidenceCount: 3, evidenceSummary: 'Express microservice handlers' },
      { studentId: p3.id, skillId: skillMap['Go'], isVerified: true, confidence: 'Medium', evidenceCount: 1, evidenceSummary: 'Go microservice implementation' },
      // Self-declared Skills
      { studentId: p3.id, skillId: skillMap['System Design'], isVerified: false },
      { studentId: p3.id, skillId: skillMap['Agile'], isVerified: false },
    ],
  });

  // Priya
  await prisma.studentSkill.createMany({
    data: [
      // Verified Skills
      { studentId: p4.id, skillId: skillMap['Embedded C'], isVerified: true, confidence: 'High', evidenceCount: 3, evidenceSummary: 'Firmware C code for ESP32 and STM32' },
      { studentId: p4.id, skillId: skillMap['Arduino'], isVerified: true, confidence: 'High', evidenceCount: 4, evidenceSummary: 'Sensor drivers and serial telemetry' },
      { studentId: p4.id, skillId: skillMap['C++'], isVerified: true, confidence: 'High', evidenceCount: 3, evidenceSummary: 'Drone flight controller algorithms' },
      { studentId: p4.id, skillId: skillMap['IoT'], isVerified: true, confidence: 'High', evidenceCount: 3, evidenceSummary: 'MQTT & WebSocket sensor communication' },
      // Self-declared Skills
      { studentId: p4.id, skillId: skillMap['Robotics'], isVerified: false },
    ],
  });

  // 4. Projects & AI Project Analyses
  // Project 1 (Aarav): Women Safety Platform
  const proj1 = await prisma.project.create({
    data: {
      studentId: p1.id,
      title: "SIH Women's Safety & Real-Time Alert Engine",
      description: 'An AI-powered computer vision and geolocation panic button alert system built for Smart India Hackathon 2026.',
      githubUrl: 'https://github.com/aaravsharma-dev/sih-womens-safety',
      normalizedGithubUrl: 'github.com/aaravsharma-dev/sih-womens-safety',
      liveUrl: 'https://womens-safety-demo.glbitm.app',
      role: 'Team Lead & AI Architect',
      teamSize: 3,
      technologies: JSON.stringify(['Python', 'PyTorch', 'FastAPI', 'OpenCV', 'React']),
      analysis: {
        create: {
          status: 'completed',
          skillsJson: JSON.stringify([
            { name: 'Python', confidence: 'High', evidence: 'Core backend API & model inference pipeline', source: 'GitHub Repositories' },
            { name: 'PyTorch', confidence: 'High', evidence: 'YOLOv8 pose estimation & alert classifier', source: 'Source Code' },
            { name: 'FastAPI', confidence: 'High', evidence: 'Async REST API with WebSockets', source: 'GitHub Repositories' },
          ]),
          domainsJson: JSON.stringify(['AI/ML', 'Healthcare', 'Cybersecurity']),
          complexity: 'Advanced',
          aiAssistanceLevel: 'Moderate',
          aiAssistanceEvidence: JSON.stringify([
            'Scaffolding code generated for boilerplate FastAPI routers',
            'Iterative custom commit history on computer vision inference modules',
          ]),
          technicalOwnershipLevel: 'High',
          technicalOwnershipEvidence: JSON.stringify([
            'Student implemented core custom PyTorch loss function & model pipeline',
            'Database migration commits and original architectural docs authored by student',
          ]),
          summary: 'High-complexity AI project demonstrating deep understanding of computer vision and real-time backend API streaming.',
          analyzedAt: new Date(),
        },
      },
    },
  });

  // Project 2 (Ananya): GLBITM Alumni Connect
  const proj2 = await prisma.project.create({
    data: {
      studentId: p2.id,
      title: 'GLBITM Alumni Connect Portal',
      description: 'Interactive portal for GLBITM students to discover and request mentorship from verified alumni.',
      githubUrl: 'https://github.com/ananya-frontend/glbitm-alumni-connect',
      normalizedGithubUrl: 'github.com/ananya-frontend/glbitm-alumni-connect',
      liveUrl: 'https://alumni.glbitm.ac.in',
      role: 'Lead Frontend Developer',
      teamSize: 2,
      technologies: JSON.stringify(['React', 'Next.js', 'TypeScript', 'Tailwind CSS']),
      analysis: {
        create: {
          status: 'completed',
          skillsJson: JSON.stringify([
            { name: 'React', confidence: 'High', evidence: '18 reusable UI components', source: 'GitHub Repositories' },
            { name: 'TypeScript', confidence: 'High', evidence: 'Strict interface definitions throughout src/types', source: 'Source Code' },
            { name: 'Tailwind CSS', confidence: 'High', evidence: 'Custom responsive design system', source: 'GitHub Repositories' },
          ]),
          domainsJson: JSON.stringify(['Web Development', 'EdTech', 'UI/UX']),
          complexity: 'Intermediate',
          aiAssistanceLevel: 'Light',
          aiAssistanceEvidence: JSON.stringify([
            'Clean hand-crafted React components with modular directory structure',
            'Original Tailwind theme configurations',
          ]),
          technicalOwnershipLevel: 'High',
          technicalOwnershipEvidence: JSON.stringify([
            'Consistent single-developer commit history spanning 4 weeks',
            'Detailed README documentation and Figma design asset alignment',
          ]),
          summary: 'Solid frontend web application with high UI polish and clean TypeScript architecture.',
          analyzedAt: new Date(),
        },
      },
    },
  });

  // Project 3 (Priya): ESP32 Agriculture Bot
  const proj3 = await prisma.project.create({
    data: {
      studentId: p4.id,
      title: 'Smart Drone Soil & Moisture Sensor Mesh',
      description: 'ESP32 mesh network connected to an autonomous drone for real-time crop moisture monitoring.',
      githubUrl: 'https://github.com/priyapatel-embedded/smart-agriculture-iot',
      normalizedGithubUrl: 'github.com/priyapatel-embedded/smart-agriculture-iot',
      role: 'Embedded Hardware Developer',
      teamSize: 3,
      technologies: JSON.stringify(['Embedded C', 'Arduino', 'C++', 'IoT']),
      analysis: {
        create: {
          status: 'completed',
          skillsJson: JSON.stringify([
            { name: 'Embedded C', confidence: 'High', evidence: 'ESP-IDF C drivers for soil sensors', source: 'GitHub Repositories' },
            { name: 'C++', confidence: 'High', evidence: 'Drone telemetry protocol parser', source: 'Source Code' },
            { name: 'IoT', confidence: 'High', evidence: 'MQTT payload publishing & ESP-NOW mesh code', source: 'GitHub Repositories' },
          ]),
          domainsJson: JSON.stringify(['IoT', 'Robotics', 'Sustainability']),
          complexity: 'Advanced',
          aiAssistanceLevel: 'Minimal',
          aiAssistanceEvidence: JSON.stringify([
            'Hardware register configurations and peripheral pin mappings',
            'Custom telemetry protocols not found in generic AI templates',
          ]),
          technicalOwnershipLevel: 'High',
          technicalOwnershipEvidence: JSON.stringify([
            'Complete hardware schematic references and C logic authored by student',
            'Deep hardware debugging commit messages',
          ]),
          summary: 'Impressive hardware-software integration with direct microcontroller pin programming.',
          analyzedAt: new Date(),
        },
      },
    },
  });

  // 5. Create Opportunities
  const opp1 = await prisma.opportunity.create({
    data: {
      creatorId: p1.id,
      title: 'SIH 2026 — AI Women Safety & Emergency Geo-Mesh',
      type: 'SIH',
      description: 'Building a production-ready solution for Smart India Hackathon 2026. We need a strong Frontend React developer and an IoT/Hardware student for device triggers.',
      requiredSkillsJson: JSON.stringify(['Python', 'PyTorch', 'React', 'IoT', 'FastAPI']),
      preferredExperience: 'Previous hackathon experience or strong GitHub evidence.',
      membersNeeded: 5,
      currentTeamSize: 3,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      status: 'Open',
    },
  });

  const opp2 = await prisma.opportunity.create({
    data: {
      creatorId: p4.id,
      title: 'Autonomous Drone Pest Detection System',
      type: 'Hackathon',
      description: 'GLBITM TechFest entry combining ESP32 drone cameras with computer vision for field pest identification.',
      requiredSkillsJson: JSON.stringify(['Embedded C', 'Arduino', 'Python', 'C++', 'IoT']),
      preferredExperience: 'Experience with Arduino or OpenCV.',
      membersNeeded: 4,
      currentTeamSize: 2,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), // 15 days
      status: 'Open',
    },
  });

  const opp3 = await prisma.opportunity.create({
    data: {
      creatorId: p2.id,
      title: 'GLBITM Campus Event & Peer Tutoring Platform',
      type: 'Startup',
      description: 'A mobile-first web app for GLBITM students to book peer tutors and register for technical club events.',
      requiredSkillsJson: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Node.js']),
      preferredExperience: 'Good sense of UI design & TypeScript.',
      membersNeeded: 4,
      currentTeamSize: 2,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45), // 45 days
      status: 'Open',
    },
  });

  // 6. Create Initial Team & Member Associations
  const team1 = await prisma.team.create({
    data: {
      opportunityId: opp1.id,
      name: "SIH Team Shield (Women's Safety)",
      members: {
        create: [
          { studentId: p1.id, role: 'Leader' },
          { studentId: p3.id, role: 'Member' },
        ],
      },
    },
  });

  // 7. Create Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        title: 'Welcome to TeamMatch GLBITM! 🚀',
        message: 'Your college email has been verified. Submit your first project to trigger AI skill analysis.',
        type: 'opportunity',
        link: '/profile',
      },
      {
        userId: user2.id,
        title: 'New Teammate Recommendation 🔥',
        message: 'Aarav Sharma (94% Match) is looking for a React developer for SIH 2026.',
        type: 'opportunity',
        link: '/opportunities/' + opp1.id,
      },
      {
        userId: user4.id,
        title: 'Project Analysis Complete ✓',
        message: 'AI analyzed your Smart Drone Soil & Moisture Sensor Mesh project. 4 verified skills detected.',
        type: 'team_update',
        link: '/projects/' + proj3.id,
      },
    ],
  });

  console.log('✅ GLBITM TeamMatch Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
