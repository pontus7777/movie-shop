'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BulkDiscountTier } from '@/generated/prisma/client'
import { MoreHorizontalIcon } from 'lucide-react'
import { deleteDiscountTier, updateDiscountTier } from '../_actions/discount-actions'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { EditDiscountTierDialog } from './discount-edit'

type Props = {
  tiers: BulkDiscountTier[]
}

export function DiscountTable({ tiers }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <Table>
      <TableCaption>Bulk discount tiers, applied automatically to the whole cart.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Min. Quantity</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Active</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tiers.map((tier) => (
          <TableRow key={tier.id}>
            <TableCell className="font-medium">{tier.minQuantity}+ items</TableCell>
            <TableCell>{tier.percentageOff}% off</TableCell>
            <TableCell>
              <Switch
                checked={tier.active}
                onCheckedChange={async (checked) => {
                  try {
                    await updateDiscountTier(tier.id, {
                      minQuantity: tier.minQuantity,
                      percentageOff: tier.percentageOff,
                      active: checked,
                    })
                    toast.success(checked ? 'Tier activated' : 'Tier deactivated')
                  } catch {
                    toast.error('Failed to update tier')
                  }
                }}
              />
            </TableCell>

            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditId(tier.id)}>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => setDeleteId(tier.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialog open={deleteId === tier.id} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this discount tier?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={async () => {
                        try {
                          setLoading(true)
                          await deleteDiscountTier(tier.id)
                          toast.success('Tier deleted')
                        } catch {
                          toast.error('Failed to delete tier')
                        } finally {
                          setLoading(false)
                          setDeleteId(null)
                        }
                      }}
                    >
                      {loading ? <Spinner /> : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {editId === tier.id && (
                <EditDiscountTierDialog tier={tier} open onOpenChange={() => setEditId(null)} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
