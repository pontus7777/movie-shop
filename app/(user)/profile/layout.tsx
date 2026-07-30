import '@/app/globals.css'
import { requireAuth } from '@/lib/session-validation'
import Header from '@/app/(public)/_components/header/header'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function UserPagesLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div className="bg-background flex min-h-screen w-full">
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <Header userName={session?.user.name ?? null} />

        {/* Page content */}
        <div className="flex-1 px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
