"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockOrder = {
  id: "ORD-2025-001",
  status: "shipped",
  items: [
    { name: "Wireless Bluetooth Headphones", qty: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80" },
    { name: "Premium Cotton T-Shirt", qty: 2, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80" },
  ],
  timeline: [
    { status: "Order Placed", date: "Mon, 25 May 2026", done: true },
    { status: "Order Confirmed", date: "Mon, 25 May 2026", done: true },
    { status: "Processing", date: "Tue, 26 May 2026", done: true },
    { status: "Shipped", date: "Thu, 28 May 2026", done: true },
    { status: "Out for Delivery", date: "Expected Fri, 29 May 2026", done: false },
    { status: "Delivered", date: "Pending", done: false },
  ],
};

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [tracked, setTracked] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) setTracked(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 gradient-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">
            Order Tracking
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Track Your Order
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-white/70 text-lg mb-8"
          >
            Enter your order ID to see real-time delivery status
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleTrack}
            className="max-w-md mx-auto flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter order ID (e.g., ORD-2025-001)"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <Button type="submit" variant="secondary" className="h-12 px-6">
              Track
            </Button>
          </motion.form>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!tracked ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Enter an Order ID to Track
            </h2>
            <p className="text-sm text-muted-foreground">
              You can find your order ID in your order confirmation email or in your account dashboard
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="rounded-2xl border border-border bg-card p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Order #{mockOrder.id}
                  </h2>
                  <p className="text-sm text-muted-foreground">Status: <span className="text-primary font-medium capitalize">{mockOrder.status}</span></p>
                </div>
                <Badge variant="secondary" className="capitalize">{mockOrder.status}</Badge>
              </div>
              <div className="space-y-3">
                {mockOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Order Timeline</h3>
              <div className="relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />
                <div className="space-y-6">
                  {mockOrder.timeline.map((event, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        event.done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}>
                        {event.done ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="pt-1.5">
                        <p className={`font-medium ${event.done ? "text-foreground" : "text-muted-foreground"}`}>
                          {event.status}
                        </p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
