'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

import { db } from '@/core/db'
import { auth } from '@/modules/auth/lib/auth.config'
import { user } from '@/modules/auth/models/auth.schema'
import { userProfile, type TUserProfile } from '../models/profile.schema'

// Tipos para los formularios
export interface TProfileFormData {
  name: string
  bio?: string
  phone?: string
  location?: string
}

// Obtener sesion actual
async function getCurrentSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

// Obtener perfil del usuario actual
export async function getProfile(): Promise<TUserProfile | null> {
  const session = await getCurrentSession()

  if (!session?.user?.id) {
    return null
  }

  const [profile] = await db.select().from(userProfile).where(eq(userProfile.userId, session.user.id))

  return profile ?? null
}

// Obtener datos del usuario actual
export async function getCurrentUser() {
  const session = await getCurrentSession()

  if (!session?.user?.id) {
    return null
  }

  return session.user
}

// Crear o actualizar datos personales
export async function upsertProfile(data: TProfileFormData) {
  const session = await getCurrentSession()

  if (!session?.user?.id) {
    throw new Error('No autorizado')
  }

  // Actualizar nombre en tabla user
  await db.update(user).set({ name: data.name, updatedAt: new Date() }).where(eq(user.id, session.user.id))

  // Crear o actualizar perfil
  await db
    .insert(userProfile)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      bio: data.bio ?? null,
      phone: data.phone ?? null,
      location: data.location ?? null,
    })
    .onConflictDoUpdate({
      target: userProfile.userId,
      set: {
        bio: data.bio ?? null,
        phone: data.phone ?? null,
        location: data.location ?? null,
        updatedAt: new Date(),
      },
    })

  revalidatePath('/dashboard/settings')
  return { success: true }
}

// Subir avatar
export async function uploadAvatar(formData: FormData) {
  const session = await getCurrentSession()

  if (!session?.user?.id) {
    throw new Error('No autorizado')
  }

  const file = formData.get('avatar') as File

  if (!file) {
    throw new Error('No se proporciono archivo')
  }

  // Validar tipo y tamano
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido. Usa JPG, PNG o WebP.')
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error('El archivo es demasiado grande. Maximo 2MB.')
  }

  // Generar nombre unico
  const ext = file.name.split('.').pop()
  const fileName = `${session.user.id}-${Date.now()}.${ext}`
  const filePath = `public/uploads/avatars/${fileName}`

  // Guardar archivo
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fs = await import('fs/promises')
  await fs.mkdir('public/uploads/avatars', { recursive: true })
  await fs.writeFile(filePath, buffer)

  // Actualizar imagen en tabla user
  const avatarUrl = `/uploads/avatars/${fileName}`

  await db.update(user).set({ image: avatarUrl, updatedAt: new Date() }).where(eq(user.id, session.user.id))

  revalidatePath('/dashboard/settings')
  return { success: true, avatarUrl }
}

// Cambiar contrasena
export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  const session = await getCurrentSession()

  if (!session?.user?.id) {
    throw new Error('No autorizado')
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
    })

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch {
    throw new Error('Error al cambiar la contrasena')
  }
}

// Eliminar cuenta
export async function deleteAccount() {
  const session = await getCurrentSession()

  if (!session?.user?.id) {
    throw new Error('No autorizado')
  }

  // Cascade delete se encarga de perfil, sesiones, cuentas
  await db.delete(user).where(eq(user.id, session.user.id))

  // Cerrar sesion
  await auth.api.signOut({ headers: await headers() })

  redirect('/')
}
