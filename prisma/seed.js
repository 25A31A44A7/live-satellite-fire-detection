const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for LIVE-SATELLITE...');

  const passwordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@live-satellite.org' },
    update: { passwordHash },
    create: {
      name: 'Satellite Commander',
      email: 'admin@live-satellite.org',
      passwordHash,
      role: 'ADMIN',
      preferences: {
        create: {
          criticalAlerts: true,
          highAlerts: true,
          moderateAlerts: true,
          lowAlerts: false,
          browserNotify: true,
          emailNotify: false,
          targetRegion: 'All Regions',
          minFRP: 5.0,
        },
      },
    },
  });

  // 2. Create Standard User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@live-satellite.org' },
    update: { passwordHash: userPasswordHash },
    create: {
      name: 'Operations Analyst',
      email: 'demo@live-satellite.org',
      passwordHash: userPasswordHash,
      role: 'USER',
      preferences: {
        create: {
          criticalAlerts: true,
          highAlerts: true,
          moderateAlerts: false,
          lowAlerts: false,
          browserNotify: true,
          emailNotify: false,
          targetRegion: 'Andhra Pradesh & Gujarat Hubs',
          minFRP: 15.0,
        },
      },
    },
  });

  console.log('✅ Seeded users:', admin.email, demoUser.email);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
