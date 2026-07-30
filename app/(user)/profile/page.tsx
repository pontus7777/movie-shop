import prisma from '@/lib/prisma'
import TabContent from './_components/user-tab-content'
import { requireAuth } from '@/lib/session-validation'
import { getDatabaseWishlist } from '@/lib/wishlist'
import { getPurchasedMovieIds } from '@/lib/order'

export default async function UserPage() {
  const session = await requireAuth()

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { movie: true } },
      shippingAddress: true,
    },
  })

  const wishlist = await getDatabaseWishlist(session.user.id)
  const wishlistItems = wishlist?.items ?? []
  const wishlistMovieIds = wishlistItems.map((item) => item.movie.id)
  const purchasedIds = await getPurchasedMovieIds(session.user.id, wishlistMovieIds)
  const activeWishlistItems = wishlistItems.filter((item) => !purchasedIds.has(item.movie.id))

  return <TabContent session={session} orders={orders} wishlistItems={activeWishlistItems} />
}
