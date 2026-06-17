import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="space-y-4 text-2xl font-bold">Header</h1>
      </SidebarHeader>
      <SidebarContent>
        <p>Content</p>
      </SidebarContent>

      <SidebarFooter>
        <div>
          <p>Footer</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
