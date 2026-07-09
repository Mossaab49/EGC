ALTER TABLE "TournamentEntry" ADD COLUMN "userName" TEXT;

UPDATE "TournamentEntry"
SET "userName" = "User"."name"
FROM "User"
WHERE "TournamentEntry"."userId" = "User"."id";

UPDATE "TournamentEntry"
SET "userName" = ''
WHERE "userName" IS NULL;

ALTER TABLE "TournamentEntry" ALTER COLUMN "userName" SET NOT NULL;
ALTER TABLE "TournamentEntry" ALTER COLUMN "userName" SET DEFAULT '';