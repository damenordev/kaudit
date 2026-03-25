'use server'

import { completeOnboarding } from '../services/onboarding.service'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { routesConfig } from '@/core/config/routes.config'

export async function completeOnboardingAction(): Promise<void> {
  const { getSession } = await import('@/modules/auth/services')
  const session = await getSession()

  if (!session?.user?.id) {
    redirect(routesConfig.auth.signIn)
  }

  await completeOnboarding(session.user.id)

  revalidatePath(routesConfig.dashboard.root)
  redirect(routesConfig.dashboard.root)
}

export async function skipOnboardingAction(): Promise<void> {
  const { getSession } = await import('@/modules/auth/services')
  const session = await getSession()

  if (!session?.user?.id) {
    redirect(routesConfig.auth.signIn)
  }

  await completeOnboarding(session.user.id)

  revalidatePath(routesConfig.dashboard.root)
  redirect(routesConfig.dashboard.root)
}
