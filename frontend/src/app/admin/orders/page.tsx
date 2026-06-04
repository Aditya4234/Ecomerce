"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/store/api/apiSlice";

const statusFilters = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusVariants: Record<string, "default" | "warning" | "destructive" | "secondary" | "outline"> = {
  delivered: "default",
  shipped: "warning",
  processing: "secondary",
  pending: "outline",
  cancelled: "destructive",
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useGetAllOrdersQuery({
    page: currentPage,
    status: statusFilter !== "All" ? statusFilter.toLowerCase() : undefined,
  });

  const [updateOrderStatus, { isLoading: updating }] = useUpdateOrderStatusMutation();

  const orders = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.pages ?? 1;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (!newStatus) return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          updateOrderStatus({ id, status: newStatus }).unwrap()
        )
      );
      setSelectedIds([]);
    } catch {
      //
    }
    e.target.value = "";
  };

  const getCustomerName = (user: unknown) => {
    if (typeof user === "object" && user && "name" in user) {
      return (user as { name: string }).name;
    }
    return String(user ?? "Unknown");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center py-12">
        Failed to load orders. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">
            {total} orders
          </p>
        </div>
        {selectedIds.length > 0 && (
          <select
            onChange={handleBulkAction}
            disabled={updating}
            className="h-10 px-4 rounded-xl border border-input bg-secondary text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Bulk Actions</option>
            <option value="processing">Mark Processing</option>
            <option value="shipped">Mark Shipped</option>
            <option value="delivered">Mark Delivered</option>
            <option value="cancelled">Mark Cancelled</option>
          </select>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(orders.map((o) => o._id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    checked={selectedIds.length === orders.length && orders.length > 0}
                    className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                  />
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Items
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                  Total
                </th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(order._id)}
                      onChange={() => toggleSelect(order._id)}
                      className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-foreground">
                    {order._id}
                  </td>
                  <td className="py-3 px-4 text-foreground">
                    {getCustomerName(order.user)}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-foreground">
                    {order.orderItems.length}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={statusVariants[order.status]}
                      className="capitalize text-[10px] px-2 py-0.5"
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-foreground">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground inline-flex"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-50 transition-all"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                currentPage === i + 1
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-50 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
