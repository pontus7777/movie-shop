import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'
import { DiscountTable } from './_components/discount-table'
import { CreateDiscountTierButton } from './_components/discount-create'

export default async function AdminDiscountsPage() {
  await requireAdmin()
  const tiers = await prisma.bulkDiscountTier.findMany({ orderBy: { minQuantity: 'asc' } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bulk Discounts</h2>
          <p className="text-muted-foreground">
            Automatic percentage discounts based on total cart quantity
          </p>
        </div>

        <CreateDiscountTierButton />
      </div>

      <DiscountTable tiers={tiers} />
    </div>
  )
}
