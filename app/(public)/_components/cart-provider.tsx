'use client'

import {
  createContext,
  useContext,
  useState,
} from 'react'


type CartContextType = {
  cartCount: number
  updateCartCount: (amount: number) => void
  resetCartCount: () => void
}


const CartContext = createContext<CartContextType | null>(null)


export function CartProvider({
  children,
  initialCount,
}: {
  children: React.ReactNode
  initialCount: number
}) {
  const [cartCount, setCartCount] = useState(initialCount)


  function updateCartCount(amount: number) {
    setCartCount((count) =>
      Math.max(0, count + amount),
    )
  }


  function resetCartCount() {
    setCartCount(0)
  }


  return (
    <CartContext.Provider
      value={{
        cartCount,
        updateCartCount,
        resetCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}


export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider',
    )
  }

  return context
}