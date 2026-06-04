import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { CartItem } from "@/types"

interface CartState {
  items: CartItem[]
  totalPrice: number
  totalItems: number
  coupon: { code: string; discount: number } | null
  discount: number
}

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items))
  }
}

const calcTotals = (items: CartItem[], discount: number) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return {
    totalPrice: Math.max(0, subtotal - discount),
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

const initialState: CartState = {
  items: [],
  coupon: null,
  discount: 0,
  totalPrice: 0,
  totalItems: 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{
        product: CartItem["product"]
        name: string
        image: string
        price: number
        stock: number
        quantity?: number
        size?: string
        color?: string
      }>
    ) {
      const { product, quantity = 1, size, color, name, image, price, stock } =
        action.payload
      const key = `${String(product)}-${size || ""}-${color || ""}`
      const existing = state.items.find(
        (item) =>
          `${String(item.product)}-${item.size || ""}-${item.color || ""}` ===
          key
      )

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, stock)
      } else {
        state.items.push({
          product,
          name,
          image,
          price,
          stock,
          quantity: Math.min(quantity, stock),
          size,
          color,
        })
      }

      saveCartToStorage(state.items)
      const { totalPrice, totalItems } = calcTotals(state.items, state.discount)
      state.totalPrice = totalPrice
      state.totalItems = totalItems
    },

    removeFromCart(
      state,
      action: PayloadAction<{
        product: string
        size?: string
        color?: string
      }>
    ) {
      const { product, size, color } = action.payload
      const key = `${product}-${size || ""}-${color || ""}`
      state.items = state.items.filter(
        (item) =>
          `${String(item.product)}-${item.size || ""}-${item.color || ""}` !==
          key
      )

      saveCartToStorage(state.items)
      const { totalPrice, totalItems } = calcTotals(state.items, state.discount)
      state.totalPrice = totalPrice
      state.totalItems = totalItems
    },

    updateQuantity(
      state,
      action: PayloadAction<{
        product: string
        size?: string
        color?: string
        quantity: number
      }>
    ) {
      const { product, size, color, quantity } = action.payload
      const key = `${product}-${size || ""}-${color || ""}`
      const item = state.items.find(
        (item) =>
          `${String(item.product)}-${item.size || ""}-${item.color || ""}` ===
          key
      )

      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock))
      }

      saveCartToStorage(state.items)
      const { totalPrice, totalItems } = calcTotals(state.items, state.discount)
      state.totalPrice = totalPrice
      state.totalItems = totalItems
    },

    clearCart(state) {
      state.items = []
      state.coupon = null
      state.discount = 0
      state.totalPrice = 0
      state.totalItems = 0
      saveCartToStorage([])
    },

    applyCoupon(
      state,
      action: PayloadAction<{ code: string; discount: number }>
    ) {
      state.coupon = { code: action.payload.code, discount: action.payload.discount }
      state.discount = action.payload.discount
      const { totalPrice, totalItems } = calcTotals(state.items, state.discount)
      state.totalPrice = totalPrice
      state.totalItems = totalItems
    },

    removeCoupon(state) {
      state.coupon = null
      state.discount = 0
      const { totalPrice, totalItems } = calcTotals(state.items, 0)
      state.totalPrice = totalPrice
      state.totalItems = totalItems
    },

    rehydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload
      const { totalPrice, totalItems } = calcTotals(state.items, state.discount)
      state.totalPrice = totalPrice
      state.totalItems = totalItems
      saveCartToStorage(action.payload)
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  rehydrateCart,
} = cartSlice.actions
export default cartSlice.reducer
