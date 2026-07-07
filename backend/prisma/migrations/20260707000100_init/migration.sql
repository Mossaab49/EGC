CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MEMBER');
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INVITED');
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'PAST', 'DRAFT');
CREATE TYPE "TournamentStatus" AS ENUM ('ACTIVE', 'DRAFT', 'FINISHED');
CREATE TYPE "MinecraftRequestStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING');

CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
  "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
  "points" INTEGER NOT NULL DEFAULT 0,
  "status" "MemberStatus" NOT NULL DEFAULT 'INVITED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Event" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "dateLabel" TEXT NOT NULL,
  "venue" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
  "category" TEXT NOT NULL,
  "details" TEXT NOT NULL,
  "rules" TEXT NOT NULL,
  "postUrl" TEXT NOT NULL,
  "isSignupOpen" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tournament" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "game" TEXT NOT NULL,
  "dateLabel" TEXT NOT NULL,
  "capacity" INTEGER NOT NULL,
  "registered" INTEGER NOT NULL DEFAULT 0,
  "status" "TournamentStatus" NOT NULL DEFAULT 'DRAFT',
  "reward" TEXT NOT NULL,
  "format" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TournamentEntry" (
  "id" TEXT NOT NULL,
  "userId" UUID NOT NULL,
  "tournamentId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TournamentEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Word" (
  "id" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WordleAttempt" (
  "id" TEXT NOT NULL,
  "userId" UUID NOT NULL,
  "guess" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "isCorrect" BOOLEAN NOT NULL,
  "points" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WordleAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MinecraftRequest" (
  "id" TEXT NOT NULL,
  "userId" UUID,
  "name" TEXT NOT NULL,
  "launcher" TEXT NOT NULL,
  "status" "MinecraftRequestStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MinecraftRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "TournamentEntry_userId_tournamentId_key" ON "TournamentEntry"("userId", "tournamentId");
CREATE UNIQUE INDEX "Word_value_key" ON "Word"("value");

ALTER TABLE "TournamentEntry"
  ADD CONSTRAINT "TournamentEntry_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TournamentEntry"
  ADD CONSTRAINT "TournamentEntry_tournamentId_fkey"
  FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WordleAttempt"
  ADD CONSTRAINT "WordleAttempt_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MinecraftRequest"
  ADD CONSTRAINT "MinecraftRequest_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
