export interface User {
  _id: string
  name: string
  email: string
  role: "user" | "admin"
  isEmailVerified: boolean
  avatar?: string
  shippingAddresses: ShippingAddress[]
  phone?: string
  createdAt: string
}

export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  category: Category
  subcategory?: string
  images: Array<{ url: string; publicId: string; _id: string }>
  sizes?: string[]
  colors?: string[]
  stock: number
  featured: boolean
  isActive: boolean
  averageRating: number
  numReviews: number
  reviews: Review[]
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: { url: string; publicId?: string }
  parent?: Category | string
  subcategories?: Category[]
  isActive: boolean
  createdAt: string
}

export interface Order {
  _id: string
  user: User | string
  orderItems: OrderItem[]
  shippingAddress: ShippingAddress
  paymentInfo: PaymentResult
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt?: string
  isDelivered: boolean
  deliveredAt?: string
  status: OrderStatus
  coupon?: string
  discount?: number
  createdAt: string
}

export interface OrderItem {
  product: string
  name: string
  image: string
  quantity: number
  size?: string
  color?: string
  price: number
}

export interface CartItem {
  product: Product | string
  name: string
  image: string
  quantity: number
  size?: string
  color?: string
  price: number
  stock: number
}

export interface Wishlist {
  _id: string
  user: string
  products: Product[]
  createdAt: string
}

export interface Review {
  _id: string
  user: {
    _id: string
    name: string
    avatar?: string
  }
  product: string
  rating: number
  title: string
  comment: string
  createdAt: string
}

export interface Coupon {
  _id: string
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minOrderValue?: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  isActive: boolean
  expiresAt: string
  createdAt: string
}

export interface Banner {
  _id: string
  title: string
  subtitle?: string
  image: string
  link?: string
  isActive: boolean
  position: "hero" | "sidebar" | "bottom"
  createdAt: string
}

export interface ShippingAddress {
  _id?: string
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault?: boolean
}

export interface PaymentResult {
  id?: string
  status: string
  update_time?: string
  email_address?: string
  method: "razorpay" | "cod"
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  page: number
  pages: number
  total: number
  count: number
}

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  revenueChange: number
  ordersChange: number
  productsChange: number
  usersChange: number
  recentOrders: Order[]
  topProducts: Product[]
  revenueByMonth: SalesData[]
}

export interface SalesData {
  month: string
  revenue: number
  orders: number
}

export interface FilterState {
  category: string
  priceRange: [number, number]
  rating: number | null
  sortBy: string
  search: string
  page: number
  limit: number
}
