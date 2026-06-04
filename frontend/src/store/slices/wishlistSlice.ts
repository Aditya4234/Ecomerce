import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "@/types"

interface WishlistState {
  items: Product[]
  loading: boolean
}

const saveWishlistToStorage = (items: Product[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("wishlist", JSON.stringify(items))
  }
}

const initialState: WishlistState = {
  items: [],
  loading: false,
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<Product>) {
      const exists = state.items.find(
        (item) => item._id === action.payload._id
      )
      if (exists) {
        state.items = state.items.filter(
          (item) => item._id !== action.payload._id
        )
      } else {
        state.items.push(action.payload)
      }
      saveWishlistToStorage(state.items)
    },
    clearWishlist(state) {
      state.items = []
      saveWishlistToStorage([])
    },
    rehydrateWishlist(state, action: PayloadAction<Product[]>) {
      state.items = action.payload
      saveWishlistToStorage(action.payload)
    },
  },
})

export const { toggleWishlist, clearWishlist, rehydrateWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
