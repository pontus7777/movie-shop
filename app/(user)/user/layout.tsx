import '@/app/globals.css'
import { requireSignedIn } from '@/lib/require-signed-in'
import { Toaster } from 'sonner'
import { UserPageHeader } from './_components/user-header'

export default async function UserPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await requireSignedIn()
  return (
    <div className="flex min-h-screen w-full">
      <main className="flex flex-1 flex-col">
        <UserPageHeader />
        <Toaster position="bottom-right" richColors />
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  )
}
