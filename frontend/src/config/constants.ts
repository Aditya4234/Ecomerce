export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const SITE_NAME = "ShopNext"
export const SITE_DESCRIPTION =
  "Your premium destination for fashion, electronics, and lifestyle products."

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "New Arrivals", href: "/shop?sortBy=newest" },
  { label: "Deals", href: "/shop?sortBy=discount" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const

export const CATEGORIES = [
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Home & Living", value: "home-living" },
  { label: "Beauty", value: "beauty" },
  { label: "Sports", value: "sports" },
  { label: "Books", value: "books" },
  { label: "Toys", value: "toys" },
  { label: "Automotive", value: "automotive" },
] as const

export const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
  { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
  { label: "₹10,000 - ₹25,000", min: 10000, max: 25000 },
  { label: "₹25,000+", min: 25000, max: Infinity },
] as const

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Popular", value: "popular" },
  { label: "Biggest Discount", value: "discount" },
] as const

export const RATINGS = [
  { label: "4 ★ & above", value: 4 },
  { label: "3 ★ & above", value: 3 },
  { label: "2 ★ & above", value: 2 },
  { label: "1 ★ & above", value: 1 },
] as const

export const SHIPPING_COST = 49

export const FREE_SHIPPING_MIN = 499

export const ITEMS_PER_PAGE = 12

export const MAX_CART_QUANTITY = 10

export const ORDER_STATUSES = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
] as const
