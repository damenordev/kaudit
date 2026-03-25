import { cookies } from 'next/headers'
import { SIDEBAR_STATE_COOKIE_NAME, SIDEBAR_VARIANT_COOKIE_NAME, type TSidebarVariant } from './sidebar.constants'

export async function getSidebarState() {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get(SIDEBAR_STATE_COOKIE_NAME)?.value !== 'false'

  const variantCookie = cookieStore.get(SIDEBAR_VARIANT_COOKIE_NAME)?.value
  const defaultVariant = (
    variantCookie && ['inset', 'sidebar', 'floating'].includes(variantCookie) ? variantCookie : 'inset'
  ) as TSidebarVariant

  return { defaultOpen, defaultVariant }
}
