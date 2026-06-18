import { Toaster } from "sonner";
import '@/app/globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './_components/admin-sidebar';


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <SidebarTrigger />
           <Toaster position="bottom-right" richColors />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
