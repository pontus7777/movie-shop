'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Prisma } from '@/generated/prisma/client'
import { UserProfile } from './user-profile'
import { UserOrderList } from './user-order-list'
import { DeleteUserAccountButton } from './delete-account-button'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import ChangeEmailModal from './change-email-modal'
import ChangePasswordModal from './change-password-modal'
import Link from 'next/link'
import { AuthSession } from '@/lib/session-validation'
import { UserMovieLibrary } from './user-movie-library'
import { UserAddress } from './user-address'
import { UserPhoneNumber } from './user-phone-number'
import { Address } from './address-manager'
import { UserWishlist } from './user-wishlist'
import { LayoutDashboard } from 'lucide-react'

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

  // Convert shippingAddress into usable UI addresses
  const initialAddresses = orders
    .map((o) => o.shippingAddress)
    .filter(Boolean)
    .map((addr) => ({
      id: addr!.id,
      firstName: addr!.firstName,
      lastName: addr!.lastName,
      street: addr!.street,
      postalCode: addr!.postalCode,
      city: addr!.city,
      country: addr!.country,
      orderId: addr!.orderId,
    }))

  const purchasedMovies = Array.from(
    new Map(
      orders
        .filter((order) => order.status === 'PAID')
        .flatMap((order) => order.items)
        .map((item) => [item.movie.id, item.movie]),
    ).values(),
  )

  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    postalCode: '',
    city: '',
    country: '',
  })

  function addAddress() {
    if (!newAddress.street.trim() || !newAddress.firstName.trim()) {
      toast.error('Please fill in at least first name and street')
      return
    }

    const newAddr: Address = {
      id: crypto.randomUUID(),
      firstName: newAddress.firstName,
      lastName: newAddress.lastName,
      street: newAddress.street,
      postalCode: newAddress.postalCode,
      city: newAddress.city,
      country: newAddress.country,
      orderId: crypto.randomUUID(),
    }

    setAddresses((prev) => [...prev, newAddr])
    setNewAddress({
      firstName: '',
      lastName: '',
      street: '',
      postalCode: '',
      city: '',
      country: '',
    })
    toast.success('Address added')
  }

  function deleteAddress(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    toast.success('Address deleted')
  }

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
          <aside className="w-full md:w-52 border-b md:border-b-0 md:border-r py-3 md:py-5 px-3 flex flex-row md:flex-col gap-2 md:gap-3 overflow-x-auto">
            {session.user.role === 'admin' && (
              <>
                <div className="hidden md:block my-2 border-t" />
                <Link
                  href="/admin"
                  className="flex shrink-0 items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50"
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  <span className="truncate">Dashboard</span>
                </Link>
              </>
            )}

            <p className="hidden md:block px-2 mb-2 text-[15px] uppercase tracking-widest text-muted-foreground">
              Account
            </p>

            <div
              onClick={() => setTab('profile')}
              className={`shrink-0 px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap ${tab === 'profile'
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-muted/50'
                }`}
            >
              Profile
            </div>

            <div
              onClick={() => setTab('orders')}
              className={`shrink-0 px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap ${tab === 'orders'
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-muted/50'
                }`}
            >
              Orders
            </div>

            <div
              onClick={() => setTab('library')}
              className={`shrink-0 px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap ${tab === 'library'
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-muted/50'
                }`}
            >
              My Library
            </div>

            <div
              onClick={() => setTab('wishlist')}
              className={`shrink-0 px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap ${tab === 'wishlist'
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-muted/50'
                }`}
            >
              My Wishlist
            </div>

            <div
              onClick={() => setTab('settings')}
              className={`shrink-0 px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap ${tab === 'settings'
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-muted/50'
                }`}
            >
              Settings
            </div>
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
              <div className="max-w-xl space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-white">
                    {session.user.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                </div>

                {/* Edit Name */}
                <UserProfile user={session.user} />

                {/* Email */}
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-normal">{session.user.email}</p>
                  <button
                    className="text-sm text-red-400 hover:text-red-300 mt-1"
                    onClick={() => setShowEmailModal(true)}
                  >
                    Change Email
                  </button>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-normal">{session.user.mobileNumber ?? 'Not added'}</p>
                  <UserPhoneNumber user={session.user} />
                </div>

                {/* Address Book */}
                {/* Address */}
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-normal whitespace-pre-line">{session.user.address ?? 'Not added'}</p>
                  <UserAddress user={session.user} />
                </div>
              </div>
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
