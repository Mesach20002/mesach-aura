ALTER TABLE "ConsentRecord"
  ADD COLUMN IF NOT EXISTS "version" TEXT NOT NULL DEFAULT 'legacy';

CREATE INDEX IF NOT EXISTS "ConsentRecord_userId_consentType_version_idx"
  ON "ConsentRecord"("userId", "consentType", "version");

CREATE TABLE IF NOT EXISTS "SkinProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "preferredName" TEXT NOT NULL,
  "ageRange" TEXT NOT NULL,
  "genderIdentity" TEXT,
  "country" TEXT,
  "selfReportedSkinType" TEXT NOT NULL,
  "skinConcerns" JSONB NOT NULL,
  "skinSensitivity" TEXT NOT NULL,
  "routineConsistency" TEXT NOT NULL,
  "allergiesOrSensitivities" TEXT,
  "primarySkinGoal" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SkinProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SkinProfile_userId_key"
  ON "SkinProfile"("userId");

ALTER TABLE "SkinProfile"
  ADD CONSTRAINT "SkinProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
