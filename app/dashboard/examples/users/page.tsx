import { getTranslations } from 'next-intl/server'

import { getUsers } from '@/modules/examples/server'
import { UsersTable } from '@/modules/examples/components/users-table'

interface IPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    q?: string
  }>
}

/**
 * Server Component page for users example.
 * Fetches data on the server based on URL search params.
 * Defaults are handled by the service, not here.
 */
export default async function UsersPage({ searchParams }: IPageProps) {
  const t = await getTranslations('users')
  const { data, pageCount, total } = await getUsers(await searchParams)

  return (
    <section className="p-3 h-full" aria-labelledby="users-page-heading">
      <h1 id="users-page-heading" className="sr-only">
        {t('pageTitle')}
      </h1>
      <UsersTable
        data={[...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data]}
        pageCount={pageCount}
        total={total}
      />
    </section>
  )
}
