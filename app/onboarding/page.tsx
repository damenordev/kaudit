import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { OnboardingWizard } from '@/modules/onboarding'
import { getSession } from '@/modules/auth/services'
import { checkOnboardingStatus } from '@/modules/onboarding/server'
import { routesConfig } from '@/core/config/routes.config'
import {
  TIMEZONE_COOKIE_NAME,
  DATE_FORMAT_COOKIE_NAME,
  DEFAULT_TIMEZONE,
  DEFAULT_DATE_FORMAT,
  type TDateFormat,
} from '@/core/i18n/dates'
import { getSidebarState } from '@/core/ui/navigation/sidebar.server'

export default async function OnboardingPage() {
  const session = await getSession()

  if (!session?.user?.id) {
    redirect(routesConfig.auth.signIn)
  }

  const isCompleted = await checkOnboardingStatus(session.user.id)
  if (isCompleted) {
    redirect(routesConfig.dashboard.root)
  }

  const cookieStore = await cookies()
  const timezone = cookieStore.get(TIMEZONE_COOKIE_NAME)?.value ?? DEFAULT_TIMEZONE
  const dateFormat = (cookieStore.get(DATE_FORMAT_COOKIE_NAME)?.value as TDateFormat) ?? DEFAULT_DATE_FORMAT
  const { defaultVariant: sidebarVariant } = await getSidebarState()

  const user = {
    id: session.user.id,
    name: session.user.name || '',
    email: session.user.email || '',
    image: session.user.image ?? null,
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-6">
      <OnboardingWizard timezone={timezone} dateFormat={dateFormat} sidebarVariant={sidebarVariant} user={user} />
    </main>
  )
}
