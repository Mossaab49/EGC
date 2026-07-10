import { EventStatus, MemberStatus, PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Security: this seed must never run automatically in production unless
// ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD are explicitly provided and changed.

const prisma = new PrismaClient();

const PASSWORD_HASH_ROUNDS = 10;
const ADMIN_EMAIL = getRequiredEnv('ADMIN_SEED_EMAIL');
const ADMIN_PASSWORD = getRequiredEnv('ADMIN_SEED_PASSWORD');

const demoEvents = [
  {
    id: 'fifa-summer',
    title: 'FIFA 2v2 - Summer Cup',
    dateLabel: '20 juillet - 14:00',
    venue: 'ENSAT Arena',
    imageUrl: '',
    status: EventStatus.UPCOMING,
    category: 'Sport gaming',
    details: 'Tournoi 2v2 ouvert aux membres EGC. Equipes de deux, tirage du bracket avant le coup d envoi.',
    rules: 'Arriver 20 minutes avant le match. Manette personnelle autorisee.',
    postUrl: '#',
    isSignupOpen: true,
  },
  {
    id: 'valorant-campus',
    title: 'Valorant - Campus Clash',
    dateLabel: '02 aout - 10:00',
    venue: 'Amphi ENSAT',
    imageUrl: '',
    status: EventStatus.UPCOMING,
    category: 'FPS',
    details: 'Rencontre Valorant avec phases de groupes et finale en BO3.',
    rules: 'Compte Riot obligatoire. Discord EGC requis pour les annonces.',
    postUrl: '#',
    isSignupOpen: false,
  },
  {
    id: 'rocket-night',
    title: 'Rocket League Night',
    dateLabel: '12 juin - 18:00',
    venue: 'Salle B12',
    imageUrl: '',
    status: EventStatus.PAST,
    category: 'Arcade',
    details: 'Soiree Rocket League casual avec rotations rapides et finale showmatch.',
    rules: 'Evenement termine.',
    postUrl: '#rocket-night',
    isSignupOpen: false,
  },
];

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
  console.info('Admin password: defined through environment variable.');

  for (const event of demoEvents) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: event,
      create: event,
    });
  }

  console.info(`Seeded events: ${demoEvents.length}`);
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required to run prisma seed. Set it explicitly before seeding.`);
  }
  return value;
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
