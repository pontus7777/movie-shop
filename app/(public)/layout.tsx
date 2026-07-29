import '@/app/globals.css'

import Footer from '@/app/(public)/_components/footer'
import Header from '@/app/(public)/_components/header/header'

import { getCart } from '@/lib/cart'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { CartProvider } from './_components/cart-provider'

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cart = await getCart()

  const cartCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <CartProvider initialCount={cartCount}>
      <div className="flex min-h-screen w-full flex-col">
        <Header
          userName={session?.user.name ?? null}
        />

        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>

        <Footer />
      </div>
    </CartProvider>
  )
}