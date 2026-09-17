import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
} catch {}

const prisma = new PrismaClient();

const DEMO_EMAILS = [
  'aarav.sharma.cse24@glbitm.ac.in',
  'ananya.verma.cse25@glbitm.ac.in',
  'rohan.gupta.it23@glbitm.ac.in',
  'priya.patel.ece24@glbitm.ac.in',
];

async function cleanDemoData() {
  console.log('🧹 Cleaning demo user profile records...');

  for (const email of DEMO_EMAILS) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      console.log(`Removing demo user: ${email} (${user.id})`);
      await prisma.user.delete({ where: { id: user.id } });
    }
  }

  console.log('✅ Demo profile cleanup complete. Real user data remains intact.');
}

cleanDemoData()
  .catch((err) => {
    console.error('❌ Failed to clean demo data:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
