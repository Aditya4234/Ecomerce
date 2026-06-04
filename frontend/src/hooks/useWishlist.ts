"use client"

import { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import {
  toggleWishlist as toggleWishlistAction,
  clearWishlist as clearWishlistAction,
} from "@/store/slices/wishlistSlice"
import type { Product } from "@/types"

export function useWishlist() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(
    (state: RootState) => state.wishlist
  )

  const toggle = useCallback(
    (product: Product) => {
      dispatch(toggleWishlistAction(product))
    },
    [dispatch]
  )

  const isInWishlist = useCallback(
    (productId: string) => {
      return items.some((item) => item._id === productId)
    },
    [items]
  )

  const addItem = useCallback(
    (product: Product) => {
      if (!isInWishlist(product._id)) {
        dispatch(toggleWishlistAction(product))
      }
    },
    [dispatch, isInWishlist]
  )

  const removeItem = useCallback(
    (productId: string) => {
      const product = items.find((item) => item._id === productId)
      if (product) {
        dispatch(toggleWishlistAction(product))
      }
    },
    [dispatch, items]
  )

  const clear = useCallback(() => {
    dispatch(clearWishlistAction())
  }, [dispatch])

  return {
    items,
    loading,
    addItem,
    removeItem,
    isInWishlist,
    toggle,
    clear,
  }
}
