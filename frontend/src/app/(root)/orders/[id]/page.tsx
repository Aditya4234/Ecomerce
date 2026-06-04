"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { useGetOrderQuery, useCancelOrderMutation } from "@/store/api/apiSlice";

function buildTimeline(status: string, createdAt: string) {
  const steps = [
    { status: "Order Placed", key: "placed" },
    { status: "Confirmed", key: "confirmed" },
    { status: "Processing", key: "processing" },
    { status: "Shipped", key: "shipped" },
    { status: "Delivered", key: "delivered" },
  ];

  if (status === "cancelled") {
    steps.push({ status: "Cancelled", key: "cancelled" });
  }

  return steps.map((step) => {
    let completed = false;
    switch (step.key) {
      case "placed":
        completed = true;
        break;
      case "confirmed":
        completed = ["confirmed", "processing", "shipped", "delivered"].includes(status);
        break;
      case "processing":
        completed = ["processing", "shipped", "delivered"].includes(status);
        break;
      case "shipped":
        completed = ["shipped", "delivered"].includes(status);
        break;
      case "delivered":
        completed = status === "delivered";
        break;
      case "cancelled":
        completed = status === "cancelled";
        break;
    }
    return {
      status: step.status,
      date: completed && step.key === "placed" ? createdAt : null,
      completed,
    };
  });
}

const statusColors: Record<string, "default" | "warning" | "destructive" | "secondary" | "outline"> = {
  delivered: "default",
  shipped: "warning",
  processing: "secondary",
  confirmed: "secondary",
  pending: "outline",
  cancelled: "destructive",
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: res, isLoading, error } = useGetOrderQuery(id);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !res?.data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Failed to load order details.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const order = res.data;
  const timeline = buildTimeline(order.status, order.createdAt);
  const itemsPrice = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Order {order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Invoice
            </Button>
            {order.status !== "cancelled" &&
              order.status !== "delivered" && (
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={() => cancelOrder(order._id)}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Cancel Order
                </Button>
              )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Order Timeline
              </h2>
              <div className="relative">
                {timeline.map((step, i) => (
                  <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          step.completed
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      {i < timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-full ${
                            step.completed ? "bg-primary" : "bg-border"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <p
                        className={`font-medium text-sm ${
                          step.completed
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.status}
                      </p>
                      {step.date && (
                        <p className="text-xs text-muted-foreground">
                          {formatDate(step.date)}
                        </p>
                      )}
                    </div>
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
                Order Items
              </h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.name}
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
                      <p className="text-sm font-bold text-foreground mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Info
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="text-foreground font-medium capitalize">
                    {order.paymentInfo.method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant={order.isPaid ? "default" : "outline"}
                  >
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
                {order.paymentInfo.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment ID</span>
                    <span className="text-foreground font-mono text-xs">
                      {order.paymentInfo.razorpayPaymentId}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-2 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-emerald-600">
                      {order.shippingPrice === 0 ? "Free" : formatPrice(order.shippingPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(order.taxPrice)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground border-t border-border pt-2">
                    <span>Total</span>
                    <span>{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
