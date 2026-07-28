'use client'

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
import { UserAddress } from './user-address'
import { UserPhoneNumber } from './user-phone-number'

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: { include: { movie: true } }
    shippingAddress: true
  }
}>

type Props = {
  session: AuthSession
  orders: OrderWithItems[]
}
/* -------------------------------------------------------
   MAIN TAB CONTENT
------------------------------------------------------- */
export default function TabContent({ session, orders }: Props) {
  const [tab, setTab] = useState<'orders' | 'profile' | 'settings'>('orders')

  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)


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
        <div className="flex min-h-225">
          {/* SIDEBAR */}
          <aside className="w-52 border-r py-5 px-3 flex flex-col gap-3">
            {session.user.role === 'admin' && (
              <>
                <div className="my-2 border-t" />
                <Link
                  href="/admin"
                  className="px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50"
                >
                  Dashboard
                </Link>
              </>
            )}

            <p className="px-2 mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              Account
            </p>

            <div
              onClick={() => setTab('profile')}
              className={`px-3 py-2 rounded-lg cursor-pointer ${tab === 'profile'
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-muted/50'
                }`}
            >
              Profile
            </div>

            <div
              onClick={() => setTab('orders')}
              className={`px-3 py-2 rounded-lg cursor-pointer ${tab === 'orders'
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-muted/50'
                }`}
            >
              Orders
            </div>

            <div
              onClick={() => setTab('settings')}
              className={`px-3 py-2 rounded-lg cursor-pointer ${tab === 'settings'
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-muted/50'
                }`}
            >
              Settings
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <main className="flex-1 py-5 px-6">
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
                  <div className="flex flex-col gap-2">
                    <button className="text-sm text-red-400 hover:text-red-300">
                      Change Picture
                    </button>
                    <button className="text-sm text-red-400 hover:text-red-300">
                      Remove Picture
                    </button>
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
