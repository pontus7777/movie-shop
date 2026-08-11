'use client'

import { useState, useTransition } from 'react'
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
import { cancelOrder } from '../_actions/cancel-order-action'

type Props = {
    orderId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OrderCancelDialog({ orderId, open, onOpenChange }: Props) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    function handleConfirm() {
        setError(null)
        startTransition(async () => {
            const result = await cancelOrder(orderId)
            if (!result.success) {
                setError(result.error ?? 'Something went wrong')
                return
            }
            onOpenChange(false)
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will mark the order as cancelled. This action can&apos;t be
                        undone from here.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Keep order</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault() // keep dialog open while pending / on error
                            handleConfirm()
                        }}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? 'Cancelling...' : 'Cancel Order'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}