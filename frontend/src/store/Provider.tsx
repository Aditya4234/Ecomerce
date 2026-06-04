"use client"

import { useEffect } from "react"
import { Provider as ReduxProvider, useDispatch } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { store } from "./index"
import { rehydrateCart } from "./slices/cartSlice"
import { rehydrateWishlist } from "./slices/wishlistSlice"
import type { CartItem } from "@/types"
import type { Product } from "@/types"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function StoreHydrator() {
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        dispatch(rehydrateCart(JSON.parse(savedCart) as CartItem[]))
      }
    } catch {}

    try {
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        dispatch(rehydrateWishlist(JSON.parse(savedWishlist) as Product[]))
      }
    } catch {}
  }, [dispatch])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <StoreHydrator />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          scriptProps={{ suppressHydrationWarning: true } as any}
        >
          {children}
          <Toaster
            position="top-center"
            duration={3000}
            closeButton
          />
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  )
}
