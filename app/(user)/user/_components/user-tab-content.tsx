'use client'

import { useState } from 'react'
import { User } from 'better-auth'
import { Prisma } from '@/generated/prisma/client'
import { UserProfile } from './user-profile'
import { UserOrderList } from './user-order-list'
import { DeleteUserAccountButton } from './delete-account-button'
import { authClient } from '@/lib/auth-client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: { include: { movie: true } }
    shippingAddress: true
  }
}>

/* -------------------------------------------------------
   CHANGE EMAIL MODAL
------------------------------------------------------- */
function ChangeEmailModal({
  open,
  onClose,
  currentEmail,
}: {
  open: boolean
  onClose: () => void
  currentEmail: string | null
}) {
  const [email, setEmail] = useState(currentEmail || '')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      toast.success('Email updated')
      onClose()
    } catch {
      toast.error('Failed to update email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Email</DialogTitle>
        </DialogHeader>

        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter new email"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* -------------------------------------------------------
   CHANGE PASSWORD MODAL
------------------------------------------------------- */
function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    // validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    setLoading(true)
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true, // ★ signs out all other devices on password change
      })

      if (result.error) {
        toast.error(result.error.message ?? 'Failed to change password')
        return
      }

      toast.success('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      onClose()
    } catch {
      toast.error('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Current password</label>
            <Input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">New password</label>
            <Input
              type="password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Confirm new password</label>
            <Input
              type="password"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Change password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
/* -------------------------------------------------------
   ADDRESS MANAGER (UI ONLY)
------------------------------------------------------- */

type Address = {
  id: string
  firstName: string
  lastName: string
  street: string
  postalCode: string
  city: string
  country: string
  orderId: string
}

function AddressManager({
  addresses,
  onAdd,
  onDelete,
  newAddress,
  setNewAddress,
}: {
  addresses: Address[]
  onAdd: () => void
  onDelete: (id: string) => void
  newAddress: {
    firstName: string
    lastName: string
    street: string
    postalCode: string
    city: string
    country: string
  }
  setNewAddress: (v: {
    firstName: string
    lastName: string
    street: string
    postalCode: string
    city: string
    country: string
  }) => void
}) {
  return (
    <div className="space-y-4">
      {addresses.length === 0 && (
        <p className="text-sm text-muted-foreground">No addresses added yet.</p>
      )}

      {addresses.map((addr) => (
        <div key={addr.id} className="border rounded-lg p-3 flex justify-between">
          <p className="text-sm">
            {addr.firstName} {addr.lastName}, {addr.street}, {addr.city}
          </p>
          <button className="text-red-400 text-sm" onClick={() => onDelete(addr.id)}>
            Delete
          </button>
        </div>
      ))}

      {/* FULL ADDRESS FORM */}
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="First name"
          value={newAddress.firstName}
          onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
        />
        <Input
          placeholder="Last name"
          value={newAddress.lastName}
          onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
        />
        <Input
          placeholder="Street"
          value={newAddress.street}
          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
        />
        <Input
          placeholder="Postal code"
          value={newAddress.postalCode}
          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
        />
        <Input
          placeholder="City"
          value={newAddress.city}
          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
        />
        <Input
          placeholder="Country"
          value={newAddress.country}
          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
        />
      </div>

      <Button onClick={onAdd}>Add</Button>
    </div>
  )
}
/* -------------------------------------------------------
   MAIN TAB CONTENT
------------------------------------------------------- */
export default function TabContent({
  session,
  orders,
}: {
  session: { user: User }
  orders: OrderWithItems[]
}) {
  const [tab, setTab] = useState<'orders' | 'profile' | 'settings'>('orders')

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
            {session.user.name?.charAt(0).toUpperCase() ?? '?'}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{session.user.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {session.user.email} · Member since{' '}
              {new Date(session.user.createdAt).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="mx-auto max-w-10xl">
        <div className="flex min-h-[900px]">
          {/* SIDEBAR */}
          <aside className="w-52 border-r py-5 px-3 flex flex-col gap-3">
            <p className="px-2 mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              Account
            </p>

            <div
              onClick={() => setTab('orders')}
              className={`px-3 py-2 rounded-lg cursor-pointer ${
                tab === 'orders'
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              Orders
            </div>

            <div
              onClick={() => setTab('profile')}
              className={`px-3 py-2 rounded-lg cursor-pointer ${
                tab === 'profile'
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              Profile
            </div>

            <div
              onClick={() => setTab('settings')}
              className={`px-3 py-2 rounded-lg cursor-pointer ${
                tab === 'settings'
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
                  <p className="font-normal">Not added</p>
                  <button className="text-sm  text-red-400 hover:text-red-300 mt-1">
                    Add Phone Number
                  </button>
                </div>

                {/* Address Book */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Addresses</p>
                  <AddressManager
                    addresses={addresses}
                    onAdd={addAddress}
                    onDelete={deleteAddress}
                    newAddress={newAddress}
                    setNewAddress={setNewAddress}
                  />
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
