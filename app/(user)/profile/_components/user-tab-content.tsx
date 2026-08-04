'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Prisma } from '@/generated/prisma/client'
import { UserProfile } from './user-profile'
import { UserOrderList } from './user-order-list'
import { DeleteUserAccountButton } from './delete-account-button'
import { Button } from '@/components/ui/button'
import ChangeEmailModal from './change-email-modal'
import ChangePasswordModal from './change-password-modal'
import Link from 'next/link'
import { AuthSession } from '@/lib/session-validation'
import { UserMovieLibrary } from './user-movie-library'
import { UserAddress } from './user-address'
import { UserPhoneNumber } from './user-phone-number'
import { UserWishlist } from './user-wishlist'
import {
  LayoutDashboard,
  Camera,
  Trash2,
  Pencil,
  User,
  ShoppingBag,
  PlayCircle,
  Heart,
  Settings,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: { include: { movie: true } }
    shippingAddress: true
  }
}>

type WishlistItemType = Prisma.WishlistItemGetPayload<{
  include: { movie: true }
}>

type Props = {
  session: AuthSession
  orders: OrderWithItems[]
  wishlistItems: WishlistItemType[]
}

const editTriggerClass =
  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'

const accountNavItems = [
  { tab: 'profile', label: 'Profile', icon: User },
  { tab: 'orders', label: 'Orders', icon: ShoppingBag },
  { tab: 'library', label: 'My Library', icon: PlayCircle },
  { tab: 'wishlist', label: 'My Wishlist', icon: Heart },
  { tab: 'settings', label: 'Settings', icon: Settings },
] as const

/* -------------------------------------------------------
   MAIN TAB CONTENT
------------------------------------------------------- */
export default function TabContent({ session, orders, wishlistItems }: Props) {

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const playMovieId = searchParams.get('play')

  // const [tab, setTab] = useState<'orders' | 'library' | 'profile' | 'settings'>('orders')
  const tab = (searchParams.get('tab') as 'orders' | 'library' | 'wishlist' | 'profile' | 'settings') || 'orders'

  function setTab(newTab: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', newTab)
    router.push(`${pathname}?${params.toString()}`)
  }


  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const purchasedMovies = Array.from(
    new Map(
      orders
        .filter((order) => order.status === 'PAID')
        .flatMap((order) => order.items)
        .map((item) => [item.movie.id, item.movie]),
    ).values(),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <div className="border-b bg-card px-6 py-4">
        <div className="mx-auto max-w-10xl flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
            {session.user.name.charAt(0).toUpperCase() ?? '?'}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{session.user.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {session.user.email} · Member since{' '}
              {new Date(session.user.createdAt ?? new Date()).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="mx-auto max-w-10xl">
        <div className="flex flex-col md:flex-row min-h-225">

          {/* SIDEBAR */}
          <aside className="w-full shrink-0 bg-card md:w-56 border-b md:border-b-0 md:border-r py-3 md:py-5 px-3 flex flex-row md:flex-col gap-1 overflow-x-auto">
            <p className="hidden md:block px-3 mb-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Account
            </p>

            {accountNavItems.map(({ tab: itemTab, label, icon: Icon }) => (
              <button
                key={itemTab}
                type="button"
                onClick={() => setTab(itemTab)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${tab === itemTab
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}

            {session.user.role === 'admin' && (
              <>
                <div className="my-2 border-t hidden md:block" />
                <p className="hidden md:block px-3 mb-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  Admin
                </p>
                <Link
                  href="/admin"
                  className="flex shrink-0 items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground whitespace-nowrap"
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  <span className="truncate">Dashboard</span>
                </Link>
              </>
            )}
          </aside>

          {/* RIGHT CONTENT */}
          <main className="flex-1 py-5 px-6 md:px-6 min-w-0">

            {/* LIBRARY */}
            {tab === 'library' && (
              <UserMovieLibrary movies={purchasedMovies} autoPlayMovieId={playMovieId} />
            )}

            {/* ORDERS */}
            {tab === 'orders' && <UserOrderList orders={orders} />}

            {/* PROFILE */}
            {tab === 'profile' && (
              <Card className="max-w-2xl">
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary text-2xl font-semibold text-white">
                        {session.user.name?.charAt(0).toUpperCase() ?? '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <button className={editTriggerClass}>
                        <Camera className="h-3.5 w-3.5" />
                        Change Picture
                      </button>
                      <button className={editTriggerClass}>
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove Picture
                      </button>
                    </div>
                  </div>

                  <Separator />

                  {/* Name */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{session.user.name}</p>
                    </div>
                    <UserProfile user={session.user} />
                  </div>

                  <Separator />

                  {/* Email */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{session.user.email}</p>
                    </div>
                    <button className={editTriggerClass} onClick={() => setShowEmailModal(true)}>
                      <Pencil className="h-3.5 w-3.5" />
                      Change Email
                    </button>
                  </div>

                  <Separator />

                  {/* Phone */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{session.user.mobileNumber ?? 'Not added'}</p>
                    </div>
                    <UserPhoneNumber user={session.user} />
                  </div>

                  <Separator />

                  {/* Address */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium whitespace-pre-line">
                        {session.user.address ?? 'Not added'}
                      </p>
                    </div>
                    <UserAddress user={session.user} />
                  </div>
                </CardContent>
              </Card>
            )}



            {/* WISHLIST */}
            {tab === 'wishlist' &&
              <UserWishlist items={wishlistItems} />
            }



            {/* SETTINGS */}
            {tab === 'settings' && (
              <div className="max-w-xl space-y-6">
                <div>
                  <p className="text-lg font-semibold mb-1">Security</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Manage your password and account security.
                  </p>
                  <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
                    Change Password
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-lg font-semibold mb-1 text-destructive">Danger Zone</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Permanently delete your account and all associated data. This cannot be undone.
                  </p>
                  <DeleteUserAccountButton variant="destructive" />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <ChangeEmailModal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        currentEmail={session.user.email}
      />

      <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  )
}
