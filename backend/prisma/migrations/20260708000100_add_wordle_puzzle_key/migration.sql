ALTER TABLE "WordleAttempt" ADD COLUMN "puzzleKey" TEXT NOT NULL DEFAULT 'legacy';
CREATE INDEX "WordleAttempt_userId_puzzleKey_idx" ON "WordleAttempt"("userId", "puzzleKey");
