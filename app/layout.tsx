import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import { CartProvider } from './(public)/_components/cart-provider'
import { getCart } from '@/lib/cart'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Movie Shop App',
  description: 'Shop made by group Charlie',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const cart = await getCart()
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(geistSans.variable, geistMono.variable, 'antialiased', 'h-full')}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <CartProvider initialCount={cartCount}>
            <main className="flex-1">{children}</main>
            <Toaster position="top-center" richColors />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
