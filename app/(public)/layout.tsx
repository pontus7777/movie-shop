import '@/app/globals.css'

import Footer from '@/app/(public)/_components/footer'
import Header from '@/app/(public)/_components/header/header'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { CartProvider } from './_components/cart-provider'
import { getCartCount } from '@/lib/cart'

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const cartCount = await getCartCount(session)

  return (
    <>
      {/* <CartProvider initialCount={cartCount}> */}
      <div className="flex min-h-screen w-full flex-col">
        <Header userName={session?.user.name ?? null} />

        <main className="flex-1 overflow-x-hidden">{children}</main>

        <Footer />
      </div>
      {/* </CartProvider> */}
    </>
  )
}
