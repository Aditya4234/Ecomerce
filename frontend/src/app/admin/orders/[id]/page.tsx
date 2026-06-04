"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Package,
  MapPin,
  CreditCard,
  Download,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatPrice, formatDate } from "@/lib/utils";
import { useGetOrderQuery, useUpdateOrderStatusMutation } from "@/store/api/apiSlice";

const statusVariants: Record<string, "default" | "warning" | "destructive" | "secondary" | "outline"> = {
  delivered: "default",
  shipped: "warning",
  processing: "secondary",
  pending: "outline",
  cancelled: "destructive",
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [status, setStatus] = useState("");
  const [tracking, setTracking] = useState("");

  const { data, isLoading, error } = useGetOrderQuery(id);
  const [updateOrderStatus, { isLoading: updating }] = useUpdateOrderStatusMutation();

  const order = data?.data;

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const handleUpdate = async () => {
    if (!order) return;
    try {
      await updateOrderStatus({ id: order._id, status }).unwrap();
    } catch {
      //
    }
  };

  const getCustomerName = (user: unknown) => {
    if (typeof user === "object" && user && "name" in user) {
      return (user as { name: string }).name;
    }
    return String(user ?? "Unknown");
  };

  const getCustomerEmail = (user: unknown) => {
    if (typeof user === "object" && user && "email" in user) {
      return (user as { email: string }).email;
    }
    return "";
  };

  const getCustomerPhone = (user: unknown) => {
    if (typeof user === "object" && user && "phone" in user) {
      return (user as { phone?: string }).phone;
    }
    return "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-destructive text-center py-12">
        Failed to load order. Please try again.
      </div>
    );
  }

  const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order {id}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)} &middot; {totalItems} item{totalItems !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Order Items
            </h2>
            <div className="space-y-3">
              {order.orderItems.map((item, i) => (
                <div
                  key={`${item.product}-${i}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-secondary"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                      {item.size && ` | Size: ${item.size}`}
                      {item.color && ` | Color: ${item.color}`}
                    </p>
                  </div>
                  <p className="font-bold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">
              Update Order
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Order Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-11 rounded-xl border border-input bg-secondary px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <Input
                label="Tracking Number"
                placeholder="Enter tracking number"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
              />
              <Button
                className="gap-2"
                onClick={handleUpdate}
                disabled={updating || status === order.status}
              >
                <Save className="w-4 h-4" />
                {updating ? "Updating..." : "Update Order"}
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Shipping Address
            </h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Info
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="text-foreground font-medium">{order.paymentInfo.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={order.isPaid ? "default" : "secondary"} className="capitalize">
                  {order.isPaid ? "Paid" : "Unpaid"}
                </Badge>
              </div>
              {order.paymentInfo.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction</span>
                  <span className="text-foreground font-mono text-xs">{order.paymentInfo.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">
              Customer
            </h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-foreground">{getCustomerName(order.user)}</p>
              <p className="text-muted-foreground">{getCustomerEmail(order.user)}</p>
              <p className="text-muted-foreground">{getCustomerPhone(order.user)}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">
              Order Total
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.totalPrice - order.taxPrice - order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={order.shippingPrice === 0 ? "text-emerald-600" : ""}>
                  {order.shippingPrice === 0 ? "Free" : formatPrice(order.shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(order.taxPrice)}</span>
              </div>
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-destructive">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-foreground border-t border-border pt-2">
                <span>Total</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
