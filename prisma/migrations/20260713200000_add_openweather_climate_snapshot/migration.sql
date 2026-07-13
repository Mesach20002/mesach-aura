CREATE TABLE "ClimateSnapshot" (
  "id" TEXT NOT NULL,
  "reportId" TEXT NOT NULL,
  "locationName" TEXT,
  "country" TEXT,
  "latitudeRounded" DOUBLE PRECISION,
  "longitudeRounded" DOUBLE PRECISION,
  "temperatureCelsius" DOUBLE PRECISION NOT NULL,
  "feelsLikeCelsius" DOUBLE PRECISION,
  "humidityPercent" INTEGER NOT NULL,
  "pressureHpa" INTEGER,
  "windSpeedMps" DOUBLE PRECISION,
  "cloudCoverPercent" INTEGER,
  "visibilityMeters" INTEGER,
  "condition" TEXT,
  "description" TEXT,
  "uvIndex" DOUBLE PRECISION,
  "pm25" DOUBLE PRECISION,
  "pm10" DOUBLE PRECISION,
  "airQualityIndex" INTEGER,
  "provider" TEXT NOT NULL DEFAULT 'openweather',
  "recommendations" JSONB NOT NULL,
  "observedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ClimateSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClimateSnapshot_reportId_key"
  ON "ClimateSnapshot"("reportId");

ALTER TABLE "ClimateSnapshot"
  ADD CONSTRAINT "ClimateSnapshot_reportId_fkey"
  FOREIGN KEY ("reportId") REFERENCES "SkinReport"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
