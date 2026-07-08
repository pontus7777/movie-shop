'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import { Eye, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { OrderDetailsDialog } from './order-details-dialog'
import { Prisma } from '@/generated/prisma/client'

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    user: true
    shippingAddress: true
    items: {
      include: {
        movie: true
      }
    }
  }
}>

type Props = {
  order: OrderWithDetails
}

export function OrderActions({ order }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Eye className="mr-2 size-4" />
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <OrderDetailsDialog order={order} open={open} onOpenChange={setOpen} />
    </>
  )
}
