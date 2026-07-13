import { getPrismaClient, isPrismaAvailable } from "@/lib/db/client"
import { devAuthUser, isDevAuthBypassEnabled } from "@/lib/auth/dev-session"
import {
  REQUIRED_CONSENT_VERSION,
  SKIN_SCAN_CONSENT_TYPE,
  type ConsentProfileInput,
} from "@/lib/consent/config"

export async function hasCompletedLatestConsent(
  userId: string
): Promise<boolean> {
  if (isDevAuthBypassEnabled() && userId === devAuthUser.id) {
    return true
  }

  if (!isPrismaAvailable) {
    return false
  }

  const consent = await getPrismaClient().consentRecord.findFirst({
    where: {
      userId,
      consentType: SKIN_SCAN_CONSENT_TYPE,
      version: REQUIRED_CONSENT_VERSION,
      accepted: true,
    },
    select: { id: true },
  })

  return consent !== null
}

export async function saveConsentOnboarding(
  userId: string,
  profile: ConsentProfileInput
): Promise<void> {
  if (!isPrismaAvailable) {
    throw new Error(
      "Consent cannot be saved because the PostgreSQL database is unavailable."
    )
  }

  const prisma = getPrismaClient()

  await prisma.$transaction(async (transaction) => {
    await transaction.skinProfile.upsert({
      where: { userId },
      update: profile,
      create: {
        userId,
        ...profile,
      },
    })

    await transaction.consentRecord.deleteMany({
      where: {
        userId,
        consentType: SKIN_SCAN_CONSENT_TYPE,
        version: REQUIRED_CONSENT_VERSION,
      },
    })

    const consent = await transaction.consentRecord.create({
      data: {
        userId,
        consentType: SKIN_SCAN_CONSENT_TYPE,
        version: REQUIRED_CONSENT_VERSION,
        accepted: true,
        acceptedAt: new Date(),
      },
    })

    await transaction.auditLog.create({
      data: {
        userId,
        action: "CONSENT_ACCEPTED",
        entityType: "ConsentRecord",
        entityId: consent.id,
      },
    })
  })
}
