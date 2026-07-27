'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { ThemeModeToggle } from '@/components/theme-mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

type AdminSidebarProps = {
  user: {
    name: string
    image?: string | null
  }
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await authClient.signOut()
    setSigningOut(false)
    router.push('/')
    router.refresh()
  }
  async function goToProfile() {
    router.push('/user')
    router.refresh()
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-4">
          <h1 className="space-y-4 text-2xl font-bold">Dashboard</h1>
          <ThemeModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={pathname === '/admin' ? 'border-b-2 border-b-blue-400' : ''}
                isActive={pathname === '/admin'}
              >
                <Link href={'/admin'}>Overview</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={pathname === '/admin/movies' ? 'border-b-2 border-b-blue-400' : ''}
                isActive={pathname === '/admin/movies'}
              >
                <Link href={'/admin/movies'}>Movies</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={pathname === '/admin/genres' ? 'border-b-2 border-b-blue-400' : ''}
                isActive={pathname === '/admin/genres'}
              >
                <Link href={'/admin/genres'}>Genres</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={pathname === '/admin/orders' ? 'border-b-2 border-b-blue-400' : ''}
                isActive={pathname === '/admin/orders'}
              >
                <Link href={'/admin/orders'}>Orders</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={pathname === '/admin/users' ? 'border-b-2 border-b-blue-400' : ''}
                isActive={pathname === '/admin/users'}
              >
                <Link href={'/admin/users'}>Users</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={pathname === '/admin/crew' ? 'border-b-2 border-b-blue-400' : ''}
                isActive={pathname === '/admin/crew'}
              >
                <Link href={'/admin/crew'}>Crew</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={pathname === '/admin/discounts' ? 'border-b-2 border-b-blue-400' : ''}
                isActive={pathname === '/admin/discounts'}
              >
                <Link href={'/admin/discounts'}>Discounts</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/admin/movies/create'}>
                <Link href={'/admin/movies/create'}>Add Movie</Link>
              </SidebarMenuButton>
              <SidebarMenuBadge>
                <Plus />
              </SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-accent flex w-full items-center gap-3 rounded-md p-2 transition">
                <Avatar className="h-9 w-9">
                  {user.image && <AvatarImage src={user.image} />}
                  <AvatarFallback>
                    {user.name
                      ? user.name
                          .split(' ')
                          .filter(Boolean)
                          .map((word) => word[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col text-left">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-muted-foreground text-xs">Administrator</span>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={goToProfile}>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={signingOut}
                className="text-destructive focus:text-destructive"
              >
                {signingOut ? 'Signing out...' : 'Sign out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
