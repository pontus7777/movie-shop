import '@/app/globals.css'
import { Toaster } from 'sonner'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import { AdminSidebar } from './_components/admin-sidebar'
import { requireAdmin } from '@/lib/session-validation'

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await requireAdmin()
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex flex-1 flex-col">
          <div className="p-4">
            <SidebarTrigger />
          </div>
          <Toaster position="bottom-right" richColors />
          <div className="flex-1 p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
