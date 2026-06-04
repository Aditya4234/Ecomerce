"use client"

import { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
} from "@/store/slices/cartSlice"
import type { CartItem } from "@/types"

export function useCart() {
  const dispatch = useDispatch()
  const { items, totalPrice, totalItems, coupon, discount } = useSelector(
    (state: RootState) => state.cart
  )

  const addItem = useCallback(
    (item: {
      product: CartItem["product"]
      name: string
      image: string
      price: number
      stock: number
      quantity?: number
      size?: string
      color?: string
    }) => {
      dispatch(addToCartAction(item))
    },
    [dispatch]
  )

  const removeItem = useCallback(
    (params: { product: string; size?: string; color?: string }) => {
      dispatch(removeFromCartAction(params))
    },
    [dispatch]
  )

  const updateQty = useCallback(
    (params: {
      product: string
      size?: string
      color?: string
      quantity: number
    }) => {
      dispatch(updateQuantityAction(params))
    },
    [dispatch]
  )

  const clear = useCallback(() => {
    dispatch(clearCartAction())
  }, [dispatch])

  return {
    items,
    totalPrice,
    totalItems,
    coupon,
    discount,
    addItem,
    removeItem,
    updateQty,
    clear,
  }
}
