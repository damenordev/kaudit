import { db } from '@/core/db'
import { user } from '@/modules/auth/models/auth.schema'
import { eq } from 'drizzle-orm'

export async function checkOnboardingStatus(userId: string): Promise<boolean> {
  const [foundUser] = await db
    .select({ onboardingCompletedAt: user.onboardingCompletedAt })
    .from(user)
    .where(eq(user.id, userId))

  return foundUser?.onboardingCompletedAt !== null
}

export async function getUserOnboardingInfo(userId: string) {
  const [foundUser] = await db
    .select({
      onboardingCompletedAt: user.onboardingCompletedAt,
      name: user.name,
      email: user.email,
      image: user.image,
    })
    .from(user)
    .where(eq(user.id, userId))

  return foundUser ?? null
}

export async function completeOnboarding(userId: string): Promise<void> {
  await db
    .update(user)
    .set({
      onboardingCompletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
}
