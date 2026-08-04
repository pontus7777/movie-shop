import '@/app/globals.css'
import { requireAuth } from '@/lib/session-validation'
import Header from '@/app/(public)/_components/header/header'

export default async function UserPagesLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()


  return (
    <div className="bg-background flex min-h-screen w-full">
      <main className="flex flex-1 flex-col  min-h-screen w-full ">
        {/* Header */}
        <Header />

        {/* Page content */}
        <div className="flex-1 overflow-x-hidden">{children}</div>
      </main>
    </div>
  )
}
