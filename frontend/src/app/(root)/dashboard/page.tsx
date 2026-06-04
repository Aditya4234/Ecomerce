"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Package,
  Heart,
  MapPin,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Clock,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import { logout } from "@/store/slices/authSlice";
import { useGetOrdersQuery } from "@/store/api/apiSlice";
import type { RootState } from "@/store";
import type { AppDispatch } from "@/store";

const quickActions = [
  {
    label: "Browse Products",
    href: "/products",
    icon: ShoppingBag,
    gradient: "from-emerald-500 to-green-500",
    description: "Explore our latest collection",
  },
  {
    label: "View Orders",
    href: "/orders",
    icon: Package,
    gradient: "from-blue-500 to-cyan-500",
    description: "Track your orders",
  },
  {
    label: "Edit Profile",
    href: "/profile",
    icon: User,
    gradient: "from-purple-500 to-pink-500",
    description: "Update your details",
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
    gradient: "from-orange-500 to-red-500",
    description: "Products you love",
  },
];

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useGetOrdersQuery({ page: 1 });

  const orders = ordersData?.data ?? [];
  const totalOrders = ordersData?.total ?? 0;

  const stats = [
    { label: "Total Orders", value: totalOrders, icon: Package, color: "text-blue-500" },
    { label: "Wishlist", value: wishlistItems.length, icon: Heart, color: "text-red-500" },
    { label: "Addresses", value: user?.shippingAddresses?.length ?? 0, icon: MapPin, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-emerald-500/20">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Welcome back, {user?.name?.split(" ")[0] || "User"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile">
                  <Settings className="w-4 h-4 mr-1.5" />
                  Settings
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => dispatch(logout())}
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-5 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  Recent Orders
                </h2>
                <Link
                  href="/orders"
                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {ordersLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : ordersError ? (
                <div className="text-sm text-destructive py-8 text-center">
                  Failed to load orders
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    No orders yet
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/products">
                      Start Shopping
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 5).map((order, i) => (
                    <Link
                      key={order._id}
                      href={`/orders/${order._id}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground font-mono">
                            #{order._id.slice(-8)}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">
                            {formatPrice(order.totalPrice)}
                          </p>
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "shipped"
                                ? "warning"
                                : order.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                            }
                            className="capitalize text-[10px] px-2 py-0"
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold text-foreground">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="rounded-2xl border border-border bg-card p-4 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center`}
                      >
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {action.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Account Info Card */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Account Info
              </h3>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Role: </span>
                  <Badge variant="secondary" className="capitalize text-[10px]">
                    {user?.role || "user"}
                  </Badge>
                </p>
                <p>
                  <span className="font-medium text-foreground">Joined: </span>
                  {user?.createdAt
                    ? formatDate(user.createdAt)
                    : "N/A"}
                </p>
                <p>
                  <span className="font-medium text-foreground">Verified: </span>
                  {user?.isEmailVerified ? (
                    <Badge variant="default" className="text-[10px] bg-emerald-500">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      No
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
