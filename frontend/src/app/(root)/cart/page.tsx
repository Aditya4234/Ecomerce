"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Heart,
  Tag,
  X,
  ChevronLeft,
} from "lucide-react";
import type { RootState } from "@/store";
import {
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
} from "@/store/slices/cartSlice";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, totalPrice, totalItems, coupon, discount } = useSelector(
    (state: RootState) => state.cart
  );
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setTimeout(() => {
      dispatch(applyCoupon({ code: couponCode, discount: 500 }));
      setCouponLoading(false);
    }, 1000);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = subtotal * 0.12;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added anything yet. Let&apos;s fix that!
          </p>
          <Link href="/products">
            <Button size="lg">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/products"
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Shopping Cart
            </h1>
            <p className="text-sm text-muted-foreground">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={`${String(item.product)}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-4 p-4 rounded-2xl border border-border bg-card"
              >
                <Link
                  href={`/products/${String(item.product)}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden shrink-0 bg-secondary"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${String(item.product)}`}
                    className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  {item.size && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Size: {item.size}
                    </p>
                  )}
                  {item.color && (
                    <p className="text-xs text-muted-foreground">
                      Color: {item.color}
                    </p>
                  )}
                  <p className="text-lg font-bold text-foreground mt-2">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-xl">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              product: String(item.product),
                              size: item.size,
                              color: item.color,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        className="p-2 text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              product: String(item.product),
                              size: item.size,
                              color: item.color,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="p-2 text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              product: String(item.product),
                              size: item.size,
                              color: item.color,
                            })
                          )
                        }
                        className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                    <span>Discount ({coupon.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Free
                      </span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (12%)</span>
                  <span className="text-foreground font-medium">
                    {formatPrice(tax)}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-base font-bold text-foreground">
                    Total
                  </span>
                  <span className="text-base font-bold text-foreground">
                    {formatPrice(totalPrice + shipping + tax)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-input bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyCoupon}
                    loading={couponLoading}
                    className="h-10"
                  >
                    Apply
                  </Button>
                </div>
                {coupon && (
                  <button
                    onClick={() => dispatch(removeCoupon())}
                    className="flex items-center gap-1 mt-2 text-xs text-destructive hover:text-destructive/80"
                  >
                    <X className="w-3 h-3" />
                    Remove coupon
                  </button>
                )}
              </div>

              <Link href="/checkout">
                <Button className="w-full h-12 text-base">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link
                href="/products"
                className="block text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
