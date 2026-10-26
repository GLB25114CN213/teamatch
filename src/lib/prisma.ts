// Pure In-Memory Database Store (Zero External DB / No Prisma Required)
import crypto from 'crypto';

function uuid() {
  return crypto.randomUUID();
}

interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface StudentProfile {
  id: string;
  userId: string;
  branch: string;
  year: string;
  linkedinUrl: string;
  githubUrl: string;
  githubAccessToken?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  availability: string;
  preferredTeamSize: number;
  interests: string;
  preferredDomains: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: string;
  studentId: string;
  title: string;
  description: string;
  githubUrl?: string | null;
  normalizedGithubUrl?: string | null;
  liveUrl?: string | null;
  demoUrl?: string | null;
  role?: string | null;
  teamSize: number;
  technologies: string;
  uploadedFilesJson: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectAnalysis {
  id: string;
  projectId: string;
  status: string;
  skillsJson: string;
  domainsJson: string;
  complexity: string;
  aiAssistanceLevel: string;
  aiAssistanceEvidence: string;
  technicalOwnershipLevel: string;
  technicalOwnershipEvidence: string;
  summary?: string | null;
  retryCount: number;
  failureReason?: string | null;
  analyzedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Opportunity {
  id: string;
  creatorId: string;
  title: string;
  type: string;
  description: string;
  requiredSkillsJson: string;
  preferredExperience?: string | null;
  membersNeeded: number;
  currentTeamSize: number;
  deadline?: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Team {
  id: string;
  opportunityId: string;
  name: string;
  createdAt: Date;
}

interface TeamMember {
  id: string;
  teamId: string;
  studentId: string;
  role: string;
  joinedAt: Date;
}

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface StudentSkill {
  id: string;
  studentId: string;
  skillId: string;
  isVerified: boolean;
  confidence?: string | null;
  evidenceCount: number;
  evidenceSummary?: string | null;
  createdAt: Date;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  isRead: boolean;
  createdAt: Date;
}

interface OpportunityInterest {
  id: string;
  opportunityId: string;
  studentId: string;
  message?: string | null;
  status: string;
  createdAt: Date;
}

interface RepositoryCache {
  id: string;
  repoUrl: string;
  normalizedUrl: string;
  lastCommitSha?: string | null;
  analysisJson: string;
  updatedAt: Date;
}

interface VerificationToken {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

// Global In-Memory Database Store singleton across Next.js Hot Reloads
const globalStore = globalThis as unknown as {
  __teamatch_db__?: {
    users: User[];
    profiles: StudentProfile[];
    projects: Project[];
    analyses: ProjectAnalysis[];
    opportunities: Opportunity[];
    teams: Team[];
    teamMembers: TeamMember[];
    skills: Skill[];
    studentSkills: StudentSkill[];
    notifications: Notification[];
    interests: OpportunityInterest[];
    repoCache: RepositoryCache[];
    tokens: VerificationToken[];
  };
};

if (!globalStore.__teamatch_db__) {
  // Pre-seed with sample GLBITM opportunities and student profile for immediate usability
  const u1Id = uuid();
  const p1Id = uuid();

  globalStore.__teamatch_db__ = {
    users: [
      {
        id: u1Id,
        email: 'alex.johnson@example.com',
        name: 'Alex Johnson',
        passwordHash: null,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    profiles: [
      {
        id: p1Id,
        userId: u1Id,
        branch: 'CSE',
        year: '3rd Year',
        linkedinUrl: 'https://linkedin.com/in/alexjohnson',
        githubUrl: 'https://github.com/alexjohnson',
        bio: 'Full-stack builder passionate about Hackathons and Web Development.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        availability: 'Available',
        preferredTeamSize: 4,
        interests: JSON.stringify(['Hackathons', 'SIH 2026']),
        preferredDomains: JSON.stringify(['AI/ML', 'Web Dev']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    projects: [],
    analyses: [],
    opportunities: [
      {
        id: uuid(),
        creatorId: p1Id,
        title: 'Smart Agriculture IoT Engine',
        type: 'SIH',
        description: 'Building automated moisture sensing & crop health detection.',
        requiredSkillsJson: JSON.stringify(['Python', 'IoT', 'FastAPI']),
        preferredExperience: 'Prior hackathon or sensor experience',
        membersNeeded: 4,
        currentTeamSize: 1,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Open',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        creatorId: p1Id,
        title: 'Decentralized Campus Identity',
        type: 'Hackathon',
        description: 'Zero-knowledge proof credential verification for university student IDs.',
        requiredSkillsJson: JSON.stringify(['Next.js', 'Solidity', 'TypeScript']),
        preferredExperience: 'Smart contract development',
        membersNeeded: 3,
        currentTeamSize: 1,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'Open',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    teams: [],
    teamMembers: [],
    skills: [
      { id: uuid(), name: 'Python', category: 'Technical' },
      { id: uuid(), name: 'React', category: 'Technical' },
      { id: uuid(), name: 'FastAPI', category: 'Technical' },
    ],
    studentSkills: [],
    notifications: [],
    interests: [],
    repoCache: [],
    tokens: [],
  };
}

const db = globalStore.__teamatch_db__;

// Helper to attach student relations
function enrichStudentProfile(profile: StudentProfile, include?: any) {
  const result: any = { ...profile };
  if (include?.user) {
    result.user = db.users.find((u) => u.id === profile.userId) || null;
  }
  if (include?.skills) {
    const sSkills = db.studentSkills.filter((sk) => sk.studentId === profile.id);
    result.skills = sSkills.map((sk) => {
      const skObj: any = { ...sk };
      if (include.skills.include?.skill) {
        skObj.skill = db.skills.find((s) => s.id === sk.skillId) || { name: 'Unknown', category: 'Technical' };
      }
      return skObj;
    });
  }
  if (include?.projects) {
    const projs = db.projects.filter((p) => p.studentId === profile.id);
    result.projects = projs.map((p) => {
      const pObj: any = { ...p };
      if (include.projects.include?.analysis) {
        pObj.analysis = db.analyses.find((a) => a.projectId === p.id) || null;
      }
      return pObj;
    });
  }
  return result;
}

// Helper to attach opportunity relations
function enrichOpportunity(opp: Opportunity, include?: any) {
  const result: any = { ...opp };
  if (include?.creator) {
    const creator = db.profiles.find((p) => p.id === opp.creatorId);
    if (creator) {
      result.creator = enrichStudentProfile(creator, include.creator.include);
    }
  }
  if (include?.team) {
    const team = db.teams.find((t) => t.opportunityId === opp.id);
    if (team) {
      const tObj: any = { ...team };
      if (include.team.include?.members) {
        const members = db.teamMembers.filter((m) => m.teamId === team.id);
        tObj.members = members.map((m) => {
          const mObj: any = { ...m };
          if (include.team.include.members.include?.student) {
            const student = db.profiles.find((p) => p.id === m.studentId);
            if (student) {
              mObj.student = enrichStudentProfile(student, include.team.include.members.include.student.include);
            }
          }
          return mObj;
        });
      }
      result.team = tObj;
    } else {
      result.team = null;
    }
  }
  return result;
}

// In-Memory Prisma replacement
export const prisma = {
  $disconnect: async () => {},

  user: {
    findUnique: async ({ where, include }: { where: { email?: string; id?: string }; include?: any }) => {
      const user = db.users.find((u) => (where.email && u.email === where.email) || (where.id && u.id === where.id));
      if (!user) return null;
      const res: any = { ...user };
      if (include?.profile) {
        const profile = db.profiles.find((p) => p.userId === user.id);
        res.profile = profile ? enrichStudentProfile(profile, include.profile.include) : null;
      }
      return res;
    },
    findFirst: async ({ where }: any = {}) => {
      return db.users[0] || null;
    },
    findMany: async () => {
      return [...db.users];
    },
    create: async ({ data, include }: { data: any; include?: any }) => {
      const newUser: User = {
        id: data.id || uuid(),
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash || null,
        isVerified: data.isVerified !== undefined ? data.isVerified : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.users.push(newUser);

      if (data.profile?.create) {
        const newProfile: StudentProfile = {
          id: uuid(),
          userId: newUser.id,
          branch: data.profile.create.branch || 'CSE',
          year: data.profile.create.year || '3rd Year',
          linkedinUrl: data.profile.create.linkedinUrl || '',
          githubUrl: data.profile.create.githubUrl || '',
          bio: data.profile.create.bio || null,
          avatarUrl: data.profile.create.avatarUrl || null,
          availability: 'Available',
          preferredTeamSize: 4,
          interests: data.profile.create.interests || JSON.stringify(['Hackathons']),
          preferredDomains: data.profile.create.preferredDomains || JSON.stringify(['Web Dev']),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        db.profiles.push(newProfile);
      }

      const res: any = { ...newUser };
      if (include?.profile) {
        const profile = db.profiles.find((p) => p.userId === newUser.id);
        res.profile = profile ? enrichStudentProfile(profile, include.profile.include) : null;
      }
      return res;
    },
    update: async ({ where, data }: { where: { email?: string; id?: string }; data: any }) => {
      const user = db.users.find((u) => (where.email && u.email === where.email) || (where.id && u.id === where.id));
      if (!user) throw new Error('User not found');
      Object.assign(user, data, { updatedAt: new Date() });
      return user;
    },
  },

  studentProfile: {
    findUnique: async ({ where, include }: { where: { id?: string; userId?: string }; include?: any }) => {
      const profile = db.profiles.find((p) => (where.id && p.id === where.id) || (where.userId && p.userId === where.userId));
      if (!profile) return null;
      return enrichStudentProfile(profile, include);
    },
    findMany: async ({ where, include, orderBy }: any = {}) => {
      let list = [...db.profiles];
      if (where) {
        if (where.branch && where.branch !== 'All') list = list.filter((p) => p.branch === where.branch);
        if (where.year && where.year !== 'All') list = list.filter((p) => p.year === where.year);
        if (where.availability && where.availability !== 'All') list = list.filter((p) => p.availability === where.availability);
        if (where.id?.not) list = list.filter((p) => p.id !== where.id.not);
        if (where.OR) {
          list = list.filter((p) => {
            const user = db.users.find((u) => u.id === p.userId);
            return where.OR.some((cond: any) => {
              if (cond.user?.name?.contains && user) return user.name.toLowerCase().includes(cond.user.name.contains.toLowerCase());
              if (cond.bio?.contains && p.bio) return p.bio.toLowerCase().includes(cond.bio.contains.toLowerCase());
              if (cond.branch?.contains) return p.branch.toLowerCase().includes(cond.branch.contains.toLowerCase());
              return false;
            });
          });
        }
      }
      return list.map((p) => enrichStudentProfile(p, include));
    },
    create: async ({ data }: { data: any }) => {
      const profile: StudentProfile = {
        id: data.id || uuid(),
        userId: data.userId,
        branch: data.branch || 'CSE',
        year: data.year || '3rd Year',
        linkedinUrl: data.linkedinUrl || '',
        githubUrl: data.githubUrl || '',
        bio: data.bio || null,
        avatarUrl: data.avatarUrl || null,
        availability: data.availability || 'Available',
        preferredTeamSize: data.preferredTeamSize || 4,
        interests: typeof data.interests === 'string' ? data.interests : JSON.stringify(data.interests || []),
        preferredDomains: typeof data.preferredDomains === 'string' ? data.preferredDomains : JSON.stringify(data.preferredDomains || []),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.profiles.push(profile);
      return profile;
    },
    update: async ({ where, data }: { where: { id?: string; userId?: string }; data: any }) => {
      const profile = db.profiles.find((p) => (where.id && p.id === where.id) || (where.userId && p.userId === where.userId));
      if (!profile) throw new Error('StudentProfile not found');
      Object.assign(profile, data, { updatedAt: new Date() });
      return profile;
    },
    upsert: async ({ where, create, update }: any) => {
      const profile = db.profiles.find((p) => (where.id && p.id === where.id) || (where.userId && p.userId === where.userId));
      if (profile) {
        Object.assign(profile, update, { updatedAt: new Date() });
        return profile;
      }
      const newP: StudentProfile = {
        id: uuid(),
        userId: create.userId,
        branch: create.branch || 'CSE',
        year: create.year || '3rd Year',
        linkedinUrl: create.linkedinUrl || '',
        githubUrl: create.githubUrl || '',
        bio: create.bio || null,
        avatarUrl: create.avatarUrl || null,
        availability: create.availability || 'Available',
        preferredTeamSize: create.preferredTeamSize || 4,
        interests: create.interests || JSON.stringify(['Hackathons']),
        preferredDomains: create.preferredDomains || JSON.stringify(['Web Dev']),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.profiles.push(newP);
      return newP;
    },
  },

  project: {
    findMany: async ({ where, include, orderBy }: any = {}) => {
      let list = [...db.projects];
      if (where?.studentId) list = list.filter((p) => p.studentId === where.studentId);
      return list.map((p) => {
        const res: any = { ...p };
        if (include?.analysis) {
          res.analysis = db.analyses.find((a) => a.projectId === p.id) || null;
        }
        return res;
      });
    },
    findUnique: async ({ where, include }: { where: { id: string }; include?: any }) => {
      const p = db.projects.find((proj) => proj.id === where.id);
      if (!p) return null;
      const res: any = { ...p };
      if (include?.analysis) {
        res.analysis = db.analyses.find((a) => a.projectId === p.id) || null;
      }
      if (include?.student) {
        const student = db.profiles.find((s) => s.id === p.studentId);
        res.student = student ? enrichStudentProfile(student, include.student.include) : null;
      }
      return res;
    },
    findFirst: async ({ where }: any = {}) => {
      return (
        db.projects.find((p) => {
          if (where?.studentId && p.studentId !== where.studentId) return false;
          if (where?.normalizedGithubUrl && p.normalizedGithubUrl !== where.normalizedGithubUrl) return false;
          return true;
        }) || null
      );
    },
    create: async ({ data, include }: { data: any; include?: any }) => {
      const proj: Project = {
        id: data.id || uuid(),
        studentId: data.studentId,
        title: data.title,
        description: data.description,
        githubUrl: data.githubUrl || null,
        normalizedGithubUrl: data.normalizedGithubUrl || null,
        liveUrl: data.liveUrl || null,
        demoUrl: data.demoUrl || null,
        role: data.role || null,
        teamSize: data.teamSize || 1,
        technologies: data.technologies || '[]',
        uploadedFilesJson: data.uploadedFilesJson || '[]',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.projects.push(proj);

      let createdAnalysis: ProjectAnalysis | null = null;
      if (data.analysis?.create) {
        createdAnalysis = {
          id: uuid(),
          projectId: proj.id,
          status: data.analysis.create.status || 'completed',
          skillsJson: data.analysis.create.skillsJson || '[]',
          domainsJson: data.analysis.create.domainsJson || '[]',
          complexity: data.analysis.create.complexity || 'Intermediate',
          aiAssistanceLevel: data.analysis.create.aiAssistanceLevel || 'Light',
          aiAssistanceEvidence: data.analysis.create.aiAssistanceEvidence || '[]',
          technicalOwnershipLevel: data.analysis.create.technicalOwnershipLevel || 'High',
          technicalOwnershipEvidence: data.analysis.create.technicalOwnershipEvidence || '[]',
          summary: data.analysis.create.summary || 'Project analyzed.',
          retryCount: 0,
          failureReason: null,
          analyzedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        db.analyses.push(createdAnalysis);
      }

      const res: any = { ...proj };
      if (include?.analysis) {
        res.analysis = createdAnalysis || db.analyses.find((a) => a.projectId === proj.id) || null;
      }
      return res;
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const proj = db.projects.find((p) => p.id === where.id);
      if (!proj) throw new Error('Project not found');
      Object.assign(proj, data, { updatedAt: new Date() });
      return proj;
    },
  },

  projectAnalysis: {
    findUnique: async ({ where }: { where: { projectId: string } }) => {
      return db.analyses.find((a) => a.projectId === where.projectId) || null;
    },
    upsert: async ({ where, create, update }: any) => {
      const existing = db.analyses.find((a) => a.projectId === where.projectId);
      if (existing) {
        Object.assign(existing, update, { updatedAt: new Date() });
        return existing;
      }
      const newAnalysis: ProjectAnalysis = {
        id: uuid(),
        projectId: where.projectId,
        status: create.status || 'queued',
        skillsJson: create.skillsJson || '[]',
        domainsJson: create.domainsJson || '[]',
        complexity: create.complexity || 'Intermediate',
        aiAssistanceLevel: create.aiAssistanceLevel || 'Light',
        aiAssistanceEvidence: create.aiAssistanceEvidence || '[]',
        technicalOwnershipLevel: create.technicalOwnershipLevel || 'High',
        technicalOwnershipEvidence: create.technicalOwnershipEvidence || '[]',
        summary: create.summary || null,
        retryCount: 0,
        failureReason: null,
        analyzedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.analyses.push(newAnalysis);
      return newAnalysis;
    },
    update: async ({ where, data }: { where: { projectId: string }; data: any }) => {
      const existing = db.analyses.find((a) => a.projectId === where.projectId);
      if (!existing) throw new Error('ProjectAnalysis not found');
      Object.assign(existing, data, { updatedAt: new Date() });
      return existing;
    },
  },

  opportunity: {
    findMany: async ({ where, include, orderBy }: any = {}) => {
      let list = [...db.opportunities];
      if (where?.type && where.type !== 'All') list = list.filter((o) => o.type === where.type);
      return list.map((o) => enrichOpportunity(o, include));
    },
    findUnique: async ({ where, include }: { where: { id: string }; include?: any }) => {
      const opp = db.opportunities.find((o) => o.id === where.id);
      if (!opp) return null;
      return enrichOpportunity(opp, include);
    },
    create: async ({ data }: { data: any }) => {
      const opp: Opportunity = {
        id: data.id || uuid(),
        creatorId: data.creatorId,
        title: data.title,
        type: data.type || 'SIH',
        description: data.description,
        requiredSkillsJson: typeof data.requiredSkillsJson === 'string' ? data.requiredSkillsJson : JSON.stringify(data.requiredSkillsJson || []),
        preferredExperience: data.preferredExperience || null,
        membersNeeded: data.membersNeeded || 4,
        currentTeamSize: data.currentTeamSize || 1,
        deadline: data.deadline ? new Date(data.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: data.status || 'Open',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.opportunities.unshift(opp);
      return opp;
    },
  },

  team: {
    create: async ({ data }: { data: any }) => {
      const team: Team = {
        id: uuid(),
        opportunityId: data.opportunityId,
        name: data.name,
        createdAt: new Date(),
      };
      db.teams.push(team);

      if (data.members?.create) {
        for (const m of data.members.create) {
          db.teamMembers.push({
            id: uuid(),
            teamId: team.id,
            studentId: m.studentId,
            role: m.role || 'Member',
            joinedAt: new Date(),
          });
        }
      }
      return team;
    },
  },

  skill: {
    upsert: async ({ where, create }: { where: { name: string }; update: any; create: any }) => {
      let skill = db.skills.find((s) => s.name.toLowerCase() === where.name.toLowerCase());
      if (!skill) {
        skill = { id: uuid(), name: create.name, category: create.category || 'Technical' };
        db.skills.push(skill);
      }
      return skill;
    },
  },

  studentSkill: {
    create: async ({ data }: { data: any }) => {
      const item: StudentSkill = {
        id: uuid(),
        studentId: data.studentId,
        skillId: data.skillId,
        isVerified: data.isVerified !== undefined ? data.isVerified : true,
        confidence: data.confidence || 'High',
        evidenceCount: data.evidenceCount || 1,
        evidenceSummary: data.evidenceSummary || null,
        createdAt: new Date(),
      };
      db.studentSkills.push(item);
      return item;
    },
    upsert: async ({ where, create, update }: any) => {
      let existing = db.studentSkills.find(
        (sk) => sk.studentId === create.studentId && sk.skillId === create.skillId && sk.isVerified === create.isVerified
      );
      if (existing) {
        Object.assign(existing, update);
        return existing;
      }
      const item: StudentSkill = {
        id: uuid(),
        studentId: create.studentId,
        skillId: create.skillId,
        isVerified: create.isVerified !== undefined ? create.isVerified : true,
        confidence: create.confidence || 'High',
        evidenceCount: create.evidenceCount || 1,
        evidenceSummary: create.evidenceSummary || null,
        createdAt: new Date(),
      };
      db.studentSkills.push(item);
      return item;
    },
  },

  opportunityInterest: {
    create: async ({ data }: { data: any }) => {
      const item: OpportunityInterest = {
        id: uuid(),
        opportunityId: data.opportunityId,
        studentId: data.studentId,
        message: data.message || null,
        status: 'Pending',
        createdAt: new Date(),
      };
      db.interests.push(item);
      return item;
    },
  },

  notification: {
    findMany: async ({ where }: any = {}) => {
      let list = [...db.notifications];
      if (where?.userId) list = list.filter((n) => n.userId === where.userId);
      return list;
    },
    create: async ({ data }: { data: any }) => {
      const n: Notification = {
        id: uuid(),
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        link: data.link || null,
        isRead: false,
        createdAt: new Date(),
      };
      db.notifications.unshift(n);
      return n;
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const n = db.notifications.find((notif) => notif.id === where.id);
      if (n) Object.assign(n, data);
      return n;
    },
    updateMany: async ({ where, data }: { where: { userId?: string; isRead?: boolean }; data: any }) => {
      for (const n of db.notifications) {
        if (
          (!where?.userId || n.userId === where.userId) &&
          (where?.isRead === undefined || n.isRead === where.isRead)
        ) {
          Object.assign(n, data);
        }
      }
      return { count: db.notifications.length };
    },
  },

  repositoryCache: {
    findUnique: async ({ where }: { where: { normalizedUrl?: string; repoUrl?: string } }) => {
      return (
        db.repoCache.find(
          (c) => (where.normalizedUrl && c.normalizedUrl === where.normalizedUrl) || (where.repoUrl && c.repoUrl === where.repoUrl)
        ) || null
      );
    },
    upsert: async ({ where, create, update }: any) => {
      const existing = db.repoCache.find((c) => c.normalizedUrl === where.normalizedUrl);
      if (existing) {
        Object.assign(existing, update, { updatedAt: new Date() });
        return existing;
      }
      const item: RepositoryCache = {
        id: uuid(),
        repoUrl: create.repoUrl,
        normalizedUrl: create.normalizedUrl,
        analysisJson: create.analysisJson || '{}',
        updatedAt: new Date(),
      };
      db.repoCache.push(item);
      return item;
    },
  },

  verificationToken: {
    findFirst: async ({ where }: any = {}) => {
      return (
        db.tokens.find((t) => {
          if (where?.email && t.email !== where.email) return false;
          if (where?.token && t.token !== where.token) return false;
          return true;
        }) || null
      );
    },
    create: async ({ data }: { data: any }) => {
      const t: VerificationToken = {
        id: uuid(),
        email: data.email,
        token: data.token,
        expiresAt: data.expiresAt,
        attempts: 0,
        createdAt: new Date(),
      };
      db.tokens.push(t);
      return t;
    },
    deleteMany: async ({ where }: any = {}) => {
      db.tokens = db.tokens.filter((t) => where?.email && t.email !== where.email);
      return { count: 0 };
    },
  },
};
