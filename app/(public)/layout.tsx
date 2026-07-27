import '@/app/globals.css'
import Footer from '@/app/(public)/_components/footer'
import Header from '@/app/(public)/_components/header'
import { getCart } from '@/lib/cart'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Toaster } from 'sonner'

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cart = await getCart()
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header cartCount={cartCount} userName={session?.user.name ?? null} />
      <main className="flex-1">{children}</main>
      {/* <Toaster /> */}
      <Footer />
    </div>
  )
}
