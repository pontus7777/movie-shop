import '@/app/globals.css'

import Footer from '@/app/(public)/_components/footer'
import Header from '@/app/(public)/_components/header/header'

import { requireAuth } from '@/lib/session-validation'

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // await requireAuth()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />

      <main className="flex-1 overflow-x-hidden">{children}</main>

      <Footer />
    </div>
  )
}
