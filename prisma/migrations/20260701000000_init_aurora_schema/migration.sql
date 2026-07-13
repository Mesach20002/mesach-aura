CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "ScanStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
CREATE TYPE "SeverityBand" AS ENUM ('LOW', 'MODERATE', 'HIGH');
CREATE TYPE "SkinType" AS ENUM (
  'NORMAL',
  'DRY',
  'OILY',
  'COMBINATION',
  'SENSITIVE_LOOKING'
);

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SkinReport" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "skinType" "SkinType" NOT NULL,
  "summary" TEXT NOT NULL,
  "guidance" JSONB NOT NULL,
  "disclaimer" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SkinReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SkinAssessment" (
  "id" TEXT NOT NULL,
  "reportId" TEXT NOT NULL,
  "hydrationBand" "SeverityBand" NOT NULL,
  "textureBand" "SeverityBand" NOT NULL,
  "poresBand" "SeverityBand" NOT NULL,
  "rednessBand" "SeverityBand" NOT NULL,
  "pigmentationBand" "SeverityBand" NOT NULL,
  "fineLinesBand" "SeverityBand" NOT NULL,
  "dullnessBand" "SeverityBand" NOT NULL,
  "oilinessBand" "SeverityBand" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SkinAssessment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductRecommendation" (
  "id" TEXT NOT NULL,
  "reportId" TEXT NOT NULL,
  "productName" TEXT NOT NULL,
  "productUrl" TEXT,
  "matchedConcerns" JSONB NOT NULL,
  "reason" TEXT NOT NULL,
  "priorityBand" "SeverityBand" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProductRecommendation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConsentRecord" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "reportId" TEXT,
  "consentType" TEXT NOT NULL,
  "accepted" BOOLEAN NOT NULL,
  "acceptedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ScanEvent" (
  "id" TEXT NOT NULL,
  "reportId" TEXT,
  "status" "ScanStatus" NOT NULL,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ScanEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "SkinReport_userId_idx" ON "SkinReport"("userId");
CREATE INDEX "SkinReport_createdAt_idx" ON "SkinReport"("createdAt");
CREATE UNIQUE INDEX "SkinAssessment_reportId_key"
  ON "SkinAssessment"("reportId");
CREATE INDEX "ProductRecommendation_productName_idx"
  ON "ProductRecommendation"("productName");
CREATE INDEX "ScanEvent_status_idx" ON "ScanEvent"("status");
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");

ALTER TABLE "SkinReport"
  ADD CONSTRAINT "SkinReport_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SkinAssessment"
  ADD CONSTRAINT "SkinAssessment_reportId_fkey"
  FOREIGN KEY ("reportId") REFERENCES "SkinReport"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductRecommendation"
  ADD CONSTRAINT "ProductRecommendation_reportId_fkey"
  FOREIGN KEY ("reportId") REFERENCES "SkinReport"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConsentRecord"
  ADD CONSTRAINT "ConsentRecord_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ConsentRecord"
  ADD CONSTRAINT "ConsentRecord_reportId_fkey"
  FOREIGN KEY ("reportId") REFERENCES "SkinReport"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ScanEvent"
  ADD CONSTRAINT "ScanEvent_reportId_fkey"
  FOREIGN KEY ("reportId") REFERENCES "SkinReport"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AuditLog"
  ADD CONSTRAINT "AuditLog_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
