import '@/app/globals.css'
import { UserPageHeader } from './_components/user-header'
import { requireAuth } from '@/lib/session-validation'

export default async function UserPagesLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()

  return (
    <div className="bg-background flex min-h-screen w-full">
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <UserPageHeader />

        {/* Page content */}
        <div className="flex-1 px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
