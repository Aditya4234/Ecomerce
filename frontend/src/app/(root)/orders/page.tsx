"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { useGetOrdersQuery } from "@/store/api/apiSlice";

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "warning" | "outline"> = {
  delivered: "default",
  shipped: "warning",
  processing: "secondary",
  pending: "outline",
  cancelled: "destructive",
};

const statusFilters = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const statusParam = statusFilter === "All" ? undefined : statusFilter.toLowerCase();
  const { data, isLoading, isError } = useGetOrdersQuery({ page: currentPage, status: statusParam });

  const filtered = useMemo(() => {
    if (!data?.data) return [];
    if (!search) return data.data;
    return data.data.filter((order) =>
      order._id.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const totalPages = data?.pages ?? 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 w-48 bg-secondary rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-64 bg-secondary rounded-lg animate-pulse mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 sm:p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
                    <div className="h-3 w-48 bg-secondary rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <Package className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Failed to load orders
          </h1>
          <p className="text-muted-foreground mb-8">
            Something went wrong. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" size="lg">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            No orders yet
          </h1>
          <p className="text-muted-foreground mb-8">
            Start shopping and your orders will appear here.
          </p>
          <Link href="/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          My Orders
        </h1>
        <p className="text-muted-foreground mb-8">
          Track and manage your orders
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-2xl border border-input bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground bg-secondary"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No orders found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try a different search or filter
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/orders/${order._id}`}>
                  <div className="flex items-center gap-4 p-4 sm:p-6 rounded-2xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                        <span className="font-mono text-sm font-bold text-foreground">
                          {order._id}
                        </span>
                        <Badge
                          variant={statusVariants[order.status]}
                          className="w-fit capitalize"
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                        <span>{formatDate(order.createdAt)}</span>
                        <span className="hidden sm:inline">|</span>
                        <span>{order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}</span>
                        <span className="hidden sm:inline">|</span>
                        <span className="font-medium text-foreground">
                          {formatPrice(order.totalPrice)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-50 transition-all"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                  currentPage === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-50 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
