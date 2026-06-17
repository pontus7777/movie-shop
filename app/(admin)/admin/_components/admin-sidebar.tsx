import { ThemeModeToggle } from '@/components/theme-mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="space-y-4 text-2xl font-bold">Dashboard</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Button asChild>
            <Link href={'/admin/create'}>Add Movie</Link>
          </Button>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          {/* Maybe a Admin profile */}
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p>Logged in Admin</p>
        </SidebarGroup>
        <ThemeModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
