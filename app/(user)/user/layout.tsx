import '@/app/globals.css'
import { requireSignedIn } from '@/lib/require-signed-in'
import { Toaster } from 'sonner'
import { UserPageHeader } from './_components/user-header'

export default async function UserPagesLayout({ children }: { children: React.ReactNode }) {
  await requireSignedIn()

  return (
    <div className="bg-background flex min-h-screen w-full">
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <UserPageHeader />

        {/* Toasts */}
        <Toaster position="bottom-right" richColors />

        {/* Page content */}
        <div className="flex-1 px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
