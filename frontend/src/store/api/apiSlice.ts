import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  User,
  Product,
  Category,
  Order,
  CartItem,
  Coupon,
  Banner,
  Review,
  ApiResponse,
  PaginatedResponse,
  DashboardStats,
  SalesData,
  ShippingAddress,
} from "@/types"

function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = getToken()
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: [
    "User",
    "Products",
    "Product",
    "Categories",
    "Cart",
    "Wishlist",
    "Orders",
    "Order",
    "Coupons",
    "Banners",
    "Reviews",
    "Dashboard",
    "Users",
  ],
  endpoints: (builder) => ({
    // ─── Auth ───────────────────────────────────────────────────────
    login: builder.mutation<
      ApiResponse<{ user: User; token: string; refreshToken: string }>,
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<
      ApiResponse<{ user: User; token: string }>,
      { name: string; email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),

    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),

    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => "/auth/profile",
      transformResponse: (response: ApiResponse<{ user: User }>) => ({
        ...response,
        data: response.data.user,
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<
      ApiResponse<User>,
      Partial<User> & { password?: string }
    >({
      query: (body) => ({ url: "/auth/profile", method: "PUT", body }),
      transformResponse: (response: ApiResponse<{ user: User }>) => ({
        ...response,
        data: response.data.user,
      }),
      invalidatesTags: ["User"],
    }),

    forgotPassword: builder.mutation<
      ApiResponse<{ message: string }>,
      { email: string }
    >({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),

    resetPassword: builder.mutation<
      ApiResponse<{ message: string }>,
      { token: string; password: string }
    >({
      query: ({ token, password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),

    verifyEmail: builder.mutation<
      ApiResponse<{ message: string }>,
      { token: string }
    >({
      query: ({ token }) => ({
        url: `/auth/verify-email/${token}`,
        method: "GET",
      }),
    }),

    refreshToken: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { refreshToken: string }
    >({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body,
      }),
    }),

    updatePassword: builder.mutation<
      ApiResponse<null>,
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({ url: "/auth/password", method: "PUT", body }),
    }),

    // ─── Products ──────────────────────────────────────────────────
    getProducts: builder.query<
      PaginatedResponse<Product>,
      {
        page?: number
        limit?: number
        category?: string
        search?: string
        sortBy?: string
        minPrice?: number
        maxPrice?: number
        rating?: number
      }
    >({
      query: (params) => {
        const { sortBy, ...rest } = params
        return {
          url: "/products",
          params: { ...rest, sort: sortBy },
        }
      },
      transformResponse: (response: {
        success: boolean
        data: { products: Product[] }
        pagination: { page: number; total: number; totalPages: number }
      }) => ({
        success: true,
        data: response.data.products,
        page: response.pagination.page,
        pages: response.pagination.totalPages,
        total: response.pagination.total,
        count: response.data.products.length,
      }),
      providesTags: ["Products"],
    }),

    getProduct: builder.query<ApiResponse<Product>, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: {
        success: boolean
        data: { product: Product }
      }) => ({
        success: true,
        data: response.data.product,
      }),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    getFeaturedProducts: builder.query<ApiResponse<Product[]>, void>({
      query: () => "/products/featured",
      transformResponse: (response: {
        success: boolean
        data: { products: Product[] }
      }) => ({
        success: true,
        data: response.data.products,
      }),
      providesTags: ["Products"],
    }),

    createProduct: builder.mutation<ApiResponse<Product>, FormData>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
        formData: true,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
        formData: true,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Products",
        { type: "Product", id },
      ],
    }),

    deleteProduct: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Products"],
    }),

    // ─── Categories ────────────────────────────────────────────────
    getCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => "/categories",
      transformResponse: (response: {
        success: boolean
        data: { categories: Category[] }
      }) => ({
        success: true,
        data: response.data.categories,
      }),
      providesTags: ["Categories"],
    }),

    createCategory: builder.mutation<
      ApiResponse<Category>,
      { name: string; description?: string; parent?: string }
    >({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: ["Categories"],
    }),

    // ─── Cart ──────────────────────────────────────────────────────
    getCart: builder.query<ApiResponse<CartItem[]>, void>({
      query: () => "/cart",
      transformResponse: (response: {
        success: boolean
        data: { cart: { items: CartItem[] } }
      }) => ({
        success: true,
        data: response.data.cart.items,
      }),
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<
      ApiResponse<CartItem[]>,
      { product: string; quantity: number; size?: string; color?: string }
    >({
      query: (body) => ({ url: "/cart", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation<
      ApiResponse<CartItem[]>,
      { product: string; size?: string; color?: string }
    >({
      query: (body) => ({ url: "/cart/remove", method: "DELETE", body }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<ApiResponse<null>, void>({
      query: () => ({ url: "/cart", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),

    applyCoupon: builder.mutation<
      ApiResponse<{ discount: number }>,
      { code: string }
    >({
      query: (body) => ({ url: "/cart/apply-coupon", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),

    // ─── Wishlist ──────────────────────────────────────────────────
    getWishlist: builder.query<ApiResponse<Product[]>, void>({
      query: () => "/wishlist",
      transformResponse: (response: {
        success: boolean
        data: { wishlist: { products: Product[] } }
      }) => ({
        success: true,
        data: response.data.wishlist.products,
      }),
      providesTags: ["Wishlist"],
    }),

    addToWishlist: builder.mutation<
      ApiResponse<Product[]>,
      { product: string }
    >({
      query: (body) => ({ url: "/wishlist", method: "POST", body }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation<
      ApiResponse<Product[]>,
      { product: string }
    >({
      query: (body) => ({
        url: "/wishlist/remove",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // ─── Orders ────────────────────────────────────────────────────
    createOrder: builder.mutation<
      ApiResponse<Order>,
      {
        orderItems: Array<{
          product: string
          name: string
          image: string
          quantity: number
          size?: string
          color?: string
          price: number
        }>
        shippingAddress: ShippingAddress
        paymentMethod: string
        itemsPrice: number
        taxPrice: number
        shippingPrice: number
        totalPrice: number
        coupon?: string
      }
    >({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      transformResponse: (response: {
        success: boolean
        data: { order: Order }
      }) => ({
        success: true,
        data: response.data.order,
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),

    getOrders: builder.query<PaginatedResponse<Order>, { page?: number; status?: string }>({
      query: (params) => ({ url: "/orders/myorders", params }),
      transformResponse: (response: {
        success: boolean
        data: { orders: Order[] }
        pagination: { page: number; total: number; totalPages: number }
      }) => ({
        success: true,
        data: response.data.orders,
        page: response.pagination.page,
        pages: response.pagination.totalPages,
        total: response.pagination.total,
        count: response.data.orders.length,
      }),
      providesTags: ["Orders"],
    }),

    getOrder: builder.query<ApiResponse<Order>, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: (response: {
        success: boolean
        data: { order: Order }
      }) => ({
        success: true,
        data: response.data.order,
      }),
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),

    cancelOrder: builder.mutation<ApiResponse<Order>, string>({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: "PUT" }),
      invalidatesTags: (_result, _error, id) => [
        "Orders",
        { type: "Order", id },
      ],
    }),

    getAllOrders: builder.query<
      PaginatedResponse<Order>,
      { page?: number; status?: string }
    >({
      query: (params) => ({ url: "/orders", params }),
      transformResponse: (response: {
        success: boolean
        data: { orders: Order[] }
        pagination: { page: number; total: number; totalPages: number }
      }) => ({
        success: true,
        data: response.data.orders,
        page: response.pagination.page,
        pages: response.pagination.totalPages,
        total: response.pagination.total,
        count: response.data.orders.length,
      }),
      providesTags: ["Orders"],
    }),

    updateOrderStatus: builder.mutation<
      ApiResponse<Order>,
      { id: string; status: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Orders",
        { type: "Order", id },
      ],
    }),

    // ─── Payments ──────────────────────────────────────────────────
    createRazorpayOrder: builder.mutation<
      ApiResponse<{ orderId: string; amount: number; currency: string }>,
      { amount: number }
    >({
      query: (body) => ({
        url: "/payments/razorpay/create-order",
        method: "POST",
        body,
      }),
    }),

    verifyPayment: builder.mutation<
      ApiResponse<{ message: string }>,
      {
        razorpayOrderId: string
        razorpayPaymentId: string
        razorpaySignature: string
      }
    >({
      query: (body) => ({
        url: "/payments/razorpay/verify",
        method: "POST",
        body,
      }),
    }),

    // ─── Admin ─────────────────────────────────────────────────────
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => "/admin/stats",
      providesTags: ["Dashboard"],
    }),

    getRevenueData: builder.query<
      ApiResponse<SalesData[]>,
      { year?: number }
    >({
      query: (params) => ({ url: "/admin/revenue", params }),
      providesTags: ["Dashboard"],
    }),

    getUsers: builder.query<
      PaginatedResponse<User>,
      { page?: number; search?: string }
    >({
      query: (params) => ({ url: "/admin/users", params }),
      transformResponse: (response: {
        success: boolean
        data: { users: User[] }
        pagination: { page: number; total: number; totalPages: number }
      }) => ({
        success: true,
        data: response.data.users,
        page: response.pagination.page,
        pages: response.pagination.totalPages,
        total: response.pagination.total,
        count: response.data.users.length,
      }),
      providesTags: ["Users"],
    }),

    getUser: builder.query<ApiResponse<User>, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    getInventoryReport: builder.query<
      ApiResponse<Product[]>,
      { lowStock?: number }
    >({
      query: (params) => ({ url: "/admin/inventory", params }),
      transformResponse: (response: {
        success: boolean
        data: { products: Product[]; summary: unknown }
      }) => ({
        success: true,
        data: response.data.products,
      }),
    }),

    getSalesReport: builder.query<
      ApiResponse<{
        totalSales: number
        totalOrders: number
        averageOrderValue: number
        salesByDay: Array<{ date: string; sales: number; orders: number }>
      }>,
      { startDate?: string; endDate?: string }
    >({
      query: (params) => ({ url: "/admin/sales", params }),
    }),

    // ─── Coupons ───────────────────────────────────────────────────
    getCoupons: builder.query<ApiResponse<Coupon[]>, void>({
      query: () => "/coupons",
      transformResponse: (response: {
        success: boolean
        data: { coupons: Coupon[] }
      }) => ({
        success: true,
        data: response.data.coupons,
      }),
      providesTags: ["Coupons"],
    }),

    createCoupon: builder.mutation<ApiResponse<Coupon>, Partial<Coupon>>({
      query: (body) => ({ url: "/coupons", method: "POST", body }),
      invalidatesTags: ["Coupons"],
    }),

    updateCoupon: builder.mutation<
      ApiResponse<Coupon>,
      { id: string; data: Partial<Coupon> }
    >({
      query: ({ id, data }) => ({
        url: `/coupons/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),

    deleteCoupon: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/coupons/${id}`, method: "DELETE" }),
      invalidatesTags: ["Coupons"],
    }),

    validateCoupon: builder.mutation<
      ApiResponse<{ discountAmount: number; coupon: Coupon }>,
      { code: string; cartTotal: number }
    >({
      query: (params) => ({ url: "/coupons/validate", method: "GET", params }),
    }),

    // ─── Banners ───────────────────────────────────────────────────
    getBanners: builder.query<ApiResponse<Banner[]>, void>({
      query: () => "/banners",
      transformResponse: (response: {
        success: boolean
        data: { banners: Banner[] }
      }) => ({
        success: true,
        data: response.data.banners,
      }),
      providesTags: ["Banners"],
    }),

    createBanner: builder.mutation<ApiResponse<Banner>, FormData>({
      query: (body) => ({
        url: "/banners",
        method: "POST",
        body,
        formData: true,
      }),
      invalidatesTags: ["Banners"],
    }),

    updateBanner: builder.mutation<
      ApiResponse<Banner>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/banners/${id}`,
        method: "PUT",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["Banners"],
    }),

    deleteBanner: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/banners/${id}`, method: "DELETE" }),
      invalidatesTags: ["Banners"],
    }),

    // ─── Reviews ───────────────────────────────────────────────────
    addReview: builder.mutation<
      ApiResponse<Review>,
      { product: string; rating: number; title: string; comment: string }
    >({
      query: (body) => ({ url: "/reviews", method: "POST", body }),
      invalidatesTags: (_result, _error, { product }) => [
        { type: "Product", id: product },
        "Reviews",
      ],
    }),

    getProductReviews: builder.query<ApiResponse<Review[]>, string>({
      query: (productId) => `/products/${productId}/reviews`,
      transformResponse: (response: {
        success: boolean
        data: { reviews: Review[] }
      }) => ({
        success: true,
        data: response.data.reviews,
      }),
      providesTags: (_result, _error, productId) => [
        { type: "Reviews", id: productId },
      ],
    }),
  }),
})

export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useRefreshTokenMutation,
  useUpdatePasswordMutation,
  // Products
  useGetProductsQuery,
  useGetProductQuery,
  useGetFeaturedProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  // Categories
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  // Cart
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useApplyCouponMutation,
  // Wishlist
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  // Orders
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  // Payments
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
  // Admin
  useGetDashboardStatsQuery,
  useGetRevenueDataQuery,
  useGetUsersQuery,
  useGetUserQuery,
  useGetInventoryReportQuery,
  useGetSalesReportQuery,
  // Coupons
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
  // Banners
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  // Reviews
  useAddReviewMutation,
  useGetProductReviewsQuery,
} = apiSlice
