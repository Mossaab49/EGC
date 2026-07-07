import { PrismaClient, UserRole, MemberStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const PASSWORD_HASH_ROUNDS = 10;
const ADMIN_EMAIL = 'ensatgamingclub@gmail.com';
const ADMIN_PASSWORD = 'P@$$w04d';

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, PASSWORD_HASH_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: 'EGC-Admin',
      passwordHash,
      role: UserRole.ADMIN,
      status: MemberStatus.ACTIVE,
      mustChangePassword: true,
    },
    create: {
      name: 'EGC-Admin',
      email: ADMIN_EMAIL,
      passwordHash,
      role: UserRole.ADMIN,
      status: MemberStatus.ACTIVE,
      mustChangePassword: true,
    },
    select: {
      email: true,
      role: true,
      status: true,
      mustChangePassword: true,
    },
  });

  console.info('Seed completed:', admin);
  console.info(`Admin login: ${ADMIN_EMAIL}`);
  console.info(`Admin password: ${ADMIN_PASSWORD}`);
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
