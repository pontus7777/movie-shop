'use client'

import { SlidersHorizontal } from 'lucide-react'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

import { Button } from '@/components/ui/button'

export function MobileMoviesFilters({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-[320px] overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle>
                        Filters
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-6">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    )
}