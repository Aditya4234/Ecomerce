import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  isCartOpen: boolean
  isSearchOpen: boolean
  isMobileMenuOpen: boolean
  isSidebarOpen: boolean
  theme: "light" | "dark" | "system"
}

const initialState: UiState = {
  isCartOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isSidebarOpen: false,
  theme: "system",
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen
    },
    openCart(state) {
      state.isCartOpen = true
    },
    closeCart(state) {
      state.isCartOpen = false
    },
    toggleSearch(state) {
      state.isSearchOpen = !state.isSearchOpen
    },
    openSearch(state) {
      state.isSearchOpen = true
    },
    closeSearch(state) {
      state.isSearchOpen = false
    },
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen
    },
    openMobileMenu(state) {
      state.isMobileMenuOpen = true
    },
    closeMobileMenu(state) {
      state.isMobileMenuOpen = false
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    openSidebar(state) {
      state.isSidebarOpen = true
    },
    closeSidebar(state) {
      state.isSidebarOpen = false
    },
    setTheme(state, action: PayloadAction<"light" | "dark" | "system">) {
      state.theme = action.payload
    },
  },
})

export const {
  toggleCart,
  openCart,
  closeCart,
  toggleSearch,
  openSearch,
  closeSearch,
  toggleMobileMenu,
  openMobileMenu,
  closeMobileMenu,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  setTheme,
} = uiSlice.actions
export default uiSlice.reducer
