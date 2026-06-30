import '@/app/globals.css'
import Footer from '@/app/(public)/_components/footer'
import Header from '@/app/(public)/_components/header'
import { getCart } from '@/lib/cart' // added new line

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cart = await getCart() // added new line
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0) // added new line

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header cartCount={cartCount} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
