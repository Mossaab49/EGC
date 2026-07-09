CREATE TABLE "PointTransaction" (
  "id" TEXT NOT NULL,
  "userId" UUID NOT NULL,
  "points" INTEGER NOT NULL,
  "source" TEXT NOT NULL,
  "reason" TEXT,
  "referenceId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PointTransaction_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PointTransaction_userId_createdAt_idx" ON "PointTransaction"("userId", "createdAt");
CREATE INDEX "PointTransaction_source_referenceId_idx" ON "PointTransaction"("source", "referenceId");

ALTER TABLE "PointTransaction"
  ADD CONSTRAINT "PointTransaction_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "PointTransaction" ("id", "userId", "points", "source", "reason", "referenceId", "createdAt")
SELECT
  gen_random_uuid()::text,
  "userId",
  "points",
  'WORDLE',
  'Backfill Wordle win points',
  "id",
  "createdAt"
FROM "WordleAttempt"
WHERE "points" > 0;