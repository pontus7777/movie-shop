'use client'

import {
  Film,
  LayoutDashboard,
  Tags,
  ShoppingCart,
  Users,
  Clapperboard,
  Percent,
  Plus,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

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

import { authClient } from '@/lib/auth-client'

type AdminSidebarProps = {
  user: {
    name: string
    image?: string | null
  }
}

const navigation = [
  {
    title: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Movies',
    href: '/admin/movies',
    icon: Film,
  },
  {
    title: 'Genres',
    href: '/admin/genres',
    icon: Tags,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Crew',
    href: '/admin/crew',
    icon: Clapperboard,
  },
  {
    title: 'Discounts',
    href: '/admin/discounts',
    icon: Percent,
  },
]

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

  function goToProfile() {
    router.push('/profile')
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <ThemeModeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>

          <SidebarMenu>
            {navigation.map((item) => {
              const Icon = item.icon

              const active =
                item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={active}>
                    <Link href={item.href}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/movies/create">
                  <Plus />
                  <span>Add Movie</span>
                </Link>
              </SidebarMenuButton>

              <SidebarMenuBadge>
                <Plus />
              </SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-md
                p-2
                transition
                hover:bg-accent
              "
            >
              <Avatar className="h-9 w-9">
                {user.image && <AvatarImage src={user.image} />}

                <AvatarFallback>
                  {user.name
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col text-left">
                <span className="font-medium">{user.name}</span>

                <span className="text-xs text-muted-foreground">Administrator</span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={goToProfile}>Profile</DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={signingOut}
              className="text-destructive focus:text-destructive"
            >
              {signingOut ? 'Signing out...' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
