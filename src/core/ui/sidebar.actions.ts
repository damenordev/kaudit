'use server'

import { cookies } from 'next/headers'
import {
  SIDEBAR_VARIANT_COOKIE_NAME,
  SIDEBAR_COOKIE_MAX_AGE,
  type TSidebarVariant,
} from './sidebar.constants'

export async function setSidebarVariantAction(variant: TSidebarVariant): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SIDEBAR_VARIANT_COOKIE_NAME, variant, {
    path: '/',
    maxAge: SIDEBAR_COOKIE_MAX_AGE,
  })
}
