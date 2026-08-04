import '@/app/globals.css'

import Link from 'next/link'
import { Home } from 'lucide-react'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

import { AdminSidebar } from './_components/admin-sidebar'
import { requireAdmin } from '@/lib/session-validation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminSession = await requireAdmin()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar user={adminSession.user} />

        <main className="flex flex-1 flex-col">
          <header
            className="
              flex
              h-14
              items-center
              justify-between
              border-b
              px-4
            "
          >
            <SidebarTrigger />

            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Home />
                Back to Store
              </Link>
            </Button>
          </header>

          <div className="flex-1 p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
