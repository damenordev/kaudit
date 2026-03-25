import { eq } from 'drizzle-orm'

import { db } from '@/core/db'
import { user } from '@/modules/auth/models/auth.schema'
import { userProfile } from '../models/profile.schema'

// Obtener perfil del usuario por ID
export async function getProfileByUserId(userId: string) {
  const [profile] = await db.select().from(userProfile).where(eq(userProfile.userId, userId))

  return profile ?? null
}

// Obtener usuario con perfil
export async function getUserWithProfile(userId: string) {
  const [result] = await db
    .select()
    .from(user)
    .leftJoin(userProfile, eq(user.id, userProfile.userId))
    .where(eq(user.id, userId))

  return result ?? null
}
