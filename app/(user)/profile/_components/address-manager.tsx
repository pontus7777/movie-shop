import { Input } from '@/components/ui/input'
import { Button } from 'react-email'

export type Address = {
  id: string
  firstName: string
  lastName: string
  street: string
  postalCode: string
  city: string
  country: string
  orderId: string
}
/* -------------------------------------------------------
   ADDRESS MANAGER (UI ONLY)
------------------------------------------------------- */

export default function AddressManager({
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
