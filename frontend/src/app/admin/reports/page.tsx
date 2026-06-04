"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useGetRevenueDataQuery, useGetSalesReportQuery } from "@/store/api/apiSlice";

const categoryData = [
  { name: "Electronics", percentage: 35, value: 395000, color: "bg-blue-500" },
  { name: "Fashion", percentage: 28, value: 316000, color: "bg-pink-500" },
  { name: "Home & Living", percentage: 18, value: 203000, color: "bg-amber-500" },
  { name: "Beauty", percentage: 12, value: 135000, color: "bg-rose-500" },
  { name: "Others", percentage: 7, value: 79000, color: "bg-gray-400" },
];

const topProducts = [
  { name: "Wireless Headphones Pro", revenue: 701766, sales: 234 },
  { name: "Smart Watch Ultra", revenue: 2834811, sales: 189 },
  { name: "Premium Leather Jacket", revenue: 935844, sales: 156 },
  { name: "Noise-Canceling Earbuds", revenue: 1135258, sales: 142 },
  { name: "Minimalist Backpack", revenue: 255872, sales: 128 },
];

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState("7d");

  const dateParams = useMemo(() => {
    const now = new Date();
    let start: Date;
    switch (dateRange) {
      case "30d":
        start = new Date(now.getTime() - 30 * 86400000);
        break;
      case "90d":
        start = new Date(now.getTime() - 90 * 86400000);
        break;
      case "1y":
        start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        start = new Date(now.getTime() - 7 * 86400000);
    }
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: now.toISOString().split("T")[0],
    };
  }, [dateRange]);

  const {
    data: revenueResult,
    isLoading: revenueLoading,
    error: revenueError,
  } = useGetRevenueDataQuery({ year: new Date().getFullYear() });

  const {
    data: salesResult,
    isLoading: salesLoading,
    error: salesError,
  } = useGetSalesReportQuery(dateParams);

  const revenueData = revenueResult?.data ?? [];
  const salesReport = salesResult?.data;

  const totalRevenue = salesReport?.totalSales ?? revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = salesReport?.totalOrders ?? revenueData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = salesReport?.averageOrderValue ?? Math.round(totalRevenue / (totalOrders || 1));

  const salesByDay = salesReport?.salesByDay ?? [];

  const isLoading = revenueLoading || salesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (revenueError && salesError) {
    return (
      <div className="text-destructive text-center py-12">
        Failed to load reports. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Sales analytics and performance metrics
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {["7d", "30d", "90d", "1y"].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              dateRange === range
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground bg-secondary"
            }`}
          >
            {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "1 Year"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: formatPrice(totalRevenue) },
          { label: "Total Orders", value: totalOrders.toLocaleString() },
          { label: "Avg Order Value", value: formatPrice(avgOrderValue) },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-bold text-foreground mb-6">
            Revenue {dateRange === "7d" ? "(Last 7 Days)" : dateRange === "30d" ? "(Last 30 Days)" : dateRange === "90d" ? "(Last 90 Days)" : "(This Year)"}
          </h2>
          <div className="flex items-end gap-3 h-48">
            {(salesByDay.length > 0 ? salesByDay : revenueData).map((day: any, i: number) => {
              const revenue = day.revenue ?? day.sales ?? 0;
              const max = Math.max(
                ...(salesByDay.length > 0 ? salesByDay : revenueData).map(
                  (d: any) => d.revenue ?? d.sales ?? 0
                ),
                1
              );
              const height = (revenue / max) * 100;
              const label =
                day.day ??
                (day.month
                  ? day.month.slice(0, 3)
                  : day.date
                  ? new Date(day.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                  : "");
              return (
                <div
                  key={label || i}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <span className="text-[10px] text-muted-foreground font-medium">
                    ₹{(revenue / 1000).toFixed(0)}k
                  </span>
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-primary to-primary/60 transition-all duration-500"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-bold text-foreground mb-6">
            Sales by Category
          </h2>
          <div className="space-y-4">
            {categoryData.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{cat.name}</span>
                  <span className="text-muted-foreground">
                    {cat.percentage}% (₹{(cat.value / 1000).toFixed(0)}k)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-bold text-foreground mb-4">
            Top Products
          </h2>
          <div className="space-y-4">
            {topProducts.map((product, i) => {
              const max = Math.max(...topProducts.map((p) => p.revenue));
              const width = (product.revenue / max) * 100;
              return (
                <div key={product.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground truncate flex-1">
                      {i + 1}. {product.name}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {formatPrice(product.revenue)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="text-lg font-bold text-foreground mb-4">
            Daily Sales {dateRange === "7d" ? "(Last 7 Days)" : `(Last ${dateRange})`}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Date</th>
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">Orders</th>
                  <th className="text-right py-2 px-2 text-muted-foreground font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {salesByDay.slice(0, 7).map((day: any, i: number) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 px-2 text-foreground text-xs">
                      {new Date(day.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="py-2 px-2 text-right text-foreground">
                      {day.orders}
                    </td>
                    <td className="py-2 px-2 text-right font-medium text-foreground">
                      {formatPrice(day.sales ?? day.revenue ?? 0)}
                    </td>
                  </tr>
                ))}
                {salesByDay.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground">
                      No sales data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
