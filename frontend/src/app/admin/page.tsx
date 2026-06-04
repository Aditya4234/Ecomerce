"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate } from "@/lib/utils";
import { useGetDashboardStatsQuery, useGetAllOrdersQuery } from "@/store/api/apiSlice";
import type { Order } from "@/types";

const statConfig = [
  { label: "Total Revenue", key: "totalRevenue" as const, changeKey: "revenueChange" as const, icon: DollarSign, gradient: "from-emerald-500 to-green-500", format: "price" },
  { label: "Total Orders", key: "totalOrders" as const, changeKey: "ordersChange" as const, icon: ShoppingBag, gradient: "from-blue-500 to-cyan-500", format: "number" },
  { label: "Total Products", key: "totalProducts" as const, changeKey: "productsChange" as const, icon: Package, gradient: "from-purple-500 to-pink-500", format: "number" },
  { label: "Total Users", key: "totalUsers" as const, changeKey: "usersChange" as const, icon: Users, gradient: "from-orange-500 to-red-500", format: "number" },
] as const;

const statusVariants: Record<string, "default" | "warning" | "destructive" | "secondary" | "outline"> = {
  delivered: "default",
  shipped: "warning",
  processing: "secondary",
  pending: "outline",
  cancelled: "destructive",
};

function getCustomerName(order: Order): string {
  if (typeof order.user === "object" && order.user !== null) {
    return (order.user as { name: string }).name;
  }
  return String(order.user);
}

export default function AdminDashboard() {
  const { data: statsRes, isLoading: statsLoading, isError: statsError } = useGetDashboardStatsQuery();
  const { data: ordersRes, isLoading: ordersLoading, isError: ordersError } = useGetAllOrdersQuery({ page: 1, limit: 5 } as never);

  const dashboardStats = statsRes?.data;
  const recentOrders = (ordersRes?.data ?? dashboardStats?.recentOrders ?? []) as Order[];
  const topProducts = dashboardStats?.topProducts ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5">
                <Skeleton className="w-10 h-10 rounded-xl mb-3" />
                <Skeleton className="h-7 w-28 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))
          : statsError
          ? (
              <div className="col-span-full text-center py-8 text-destructive">
                Failed to load dashboard data. Please try again later.
              </div>
            )
          : statConfig.map((stat, i) => {
              const value = dashboardStats?.[stat.key] ?? 0;
              const change = dashboardStats?.[stat.changeKey] ?? 0;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${
                        change >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-destructive"
                      }`}
                    >
                      {change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(change)}%
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.format === "price"
                      ? formatPrice(value)
                      : value.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                    Order
                  </th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                    Customer
                  </th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="text-right py-3 px-2 text-muted-foreground font-medium">
                    Total
                  </th>
                  <th className="py-3 px-2" />
                </tr>
              </thead>
              <tbody>
                {ordersLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-3 px-2"><Skeleton className="h-4 w-20" /></td>
                        <td className="py-3 px-2"><Skeleton className="h-4 w-28" /></td>
                        <td className="py-3 px-2 hidden sm:table-cell"><Skeleton className="h-4 w-24" /></td>
                        <td className="py-3 px-2"><Skeleton className="h-5 w-16 rounded-full" /></td>
                        <td className="py-3 px-2"><div className="flex justify-end"><Skeleton className="h-4 w-16" /></div></td>
                        <td className="py-3 px-2"><Skeleton className="w-7 h-7 rounded-lg" /></td>
                      </tr>
                    ))
                  : ordersError
                  ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-destructive text-sm">
                          Failed to load orders.
                        </td>
                      </tr>
                    )
                  : recentOrders.length === 0
                  ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                          No orders found.
                        </td>
                      </tr>
                    )
                  : recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-3 px-2 font-mono text-xs text-foreground">
                          {order._id}
                        </td>
                        <td className="py-3 px-2 text-foreground">
                          {getCustomerName(order)}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 px-2">
                          <Badge
                            variant={statusVariants[order.status] ?? "outline"}
                            className="capitalize text-[10px] px-2 py-0.5"
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-right font-medium text-foreground">
                          {formatPrice(order.totalPrice)}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground inline-flex"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          <Link
            href="/admin/orders"
            className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
          >
            View All Orders
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Top Products
          </h2>
          <div className="space-y-4">
            {statsLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))
              : topProducts.length === 0
              ? <p className="text-sm text-muted-foreground">No products data available.</p>
              : topProducts.map((product, i) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(product as any).sales} sales
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {formatPrice((product as any).revenue)}
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Products", href: "/admin/products" },
          { label: "Categories", href: "/admin/categories" },
          { label: "Coupons", href: "/admin/coupons" },
          { label: "Reports", href: "/admin/reports" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:bg-secondary transition-colors"
          >
            <span className="text-sm font-medium text-foreground">
              {item.label}
            </span>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
