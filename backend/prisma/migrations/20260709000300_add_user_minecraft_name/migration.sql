ALTER TABLE "User"
  ADD COLUMN "minecraftName" TEXT;

CREATE UNIQUE INDEX "User_minecraftName_key" ON "User"("minecraftName");
