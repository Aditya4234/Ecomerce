"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "";
  const shortId = orderId ? orderId.slice(-8).toUpperCase() : "";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Order Placed!
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase! Your order has been placed successfully
            and is being processed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl border border-border bg-card mb-8"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
            <Package className="w-4 h-4" />
            Order Number
          </div>
          <p className="text-xl font-bold text-foreground font-mono tracking-wider">
            {shortId || "N/A"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-2xl bg-secondary/50 border border-border mb-8"
        >
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your registered email address
            with all the order details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href={`/orders/${orderId}`}>
            <Button variant="outline" className="gap-2">
              <Package className="w-4 h-4" />
              View Order
            </Button>
          </Link>
          <Link href="/products">
            <Button className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}