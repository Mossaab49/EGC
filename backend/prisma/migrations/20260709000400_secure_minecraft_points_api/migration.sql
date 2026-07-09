DROP INDEX IF EXISTS "PointTransaction_source_referenceId_idx";

CREATE UNIQUE INDEX "PointTransaction_source_referenceId_key"
  ON "PointTransaction"("source", "referenceId");

CREATE UNIQUE INDEX "User_minecraftName_ci_key"
  ON "User"(LOWER("minecraftName"))
  WHERE "minecraftName" IS NOT NULL;
