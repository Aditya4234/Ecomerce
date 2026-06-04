"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Banknote,
  MapPin,
  ShoppingBag,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { RootState } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import { formatPrice } from "@/lib/utils";
import { addressSchema, type AddressInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
} from "@/store/api/apiSlice";
import { useAuth } from "@/hooks/useAuth";

const steps = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: ShoppingBag },
];

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, totalPrice, discount, coupon } = useSelector(
    (state: RootState) => state.cart
  );
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">(
    "razorpay"
  );
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createOrder] = useCreateOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const defaultAddress =
    user?.shippingAddresses?.find((a) => a.isDefault) ||
    user?.shippingAddresses?.[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    if (defaultAddress) {
      reset({
        fullName: defaultAddress.fullName,
        phone: defaultAddress.phone,
        address: defaultAddress.address,
        city: defaultAddress.city,
        state: defaultAddress.state,
        zipCode: defaultAddress.zipCode,
        country: defaultAddress.country,
      });
    }
  }, [defaultAddress, reset]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = subtotal * 0.12;
  const finalTotal = totalPrice + shipping + tax;

  const nextStep = async () => {
    if (currentStep === 1) {
      const valid = await trigger();
      if (!valid) return;
    }
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const placeOrder = handleSubmit(async (data) => {
    setPlacing(true);
    setError(null);

    try {
      const orderItems = items.map((item) => ({
        product:
          typeof item.product === "string"
            ? item.product
            : item.product._id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
      }));

      const orderResponse = await createOrder({
        orderItems,
        shippingAddress: data,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: finalTotal,
        coupon: coupon?.code,
      }).unwrap();

      if (paymentMethod === "razorpay") {
        const razorpayResponse = await createRazorpayOrder({
          amount: Math.round(finalTotal * 100),
        }).unwrap();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayResponse.data.amount,
          currency: razorpayResponse.data.currency,
          order_id: razorpayResponse.data.orderId,
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              await verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }).unwrap();
              dispatch(clearCart());
              router.push(`/order-success?id=${orderResponse.data._id}`);
            } catch {
              setError("Payment verification failed. Please contact support.");
              setPlacing(false);
            }
          },
          modal: {
            ondismiss: () => {
              setPlacing(false);
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else {
        dispatch(clearCart());
        router.push(`/order-success?id=${orderResponse.data._id}`);
      }
    } catch (err: any) {
      setError(
        err?.data?.message || err?.message || "Something went wrong. Please try again."
      );
      setPlacing(false);
    }
  });

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
            Add some items to your cart before checking out.
          </p>
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:inline ${
                    currentStep >= step.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 rounded-full ${
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Shipping Address
                  </h2>
                  <form className="space-y-4">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      error={errors.fullName?.message}
                      {...register("fullName")}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />
                    <Input
                      label="Address"
                      placeholder="123 Main Street, Apt 4B"
                      error={errors.address?.message}
                      {...register("address")}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        placeholder="Mumbai"
                        error={errors.city?.message}
                        {...register("city")}
                      />
                      <Input
                        label="State"
                        placeholder="Maharashtra"
                        error={errors.state?.message}
                        {...register("state")}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="ZIP Code"
                        placeholder="400001"
                        error={errors.zipCode?.message}
                        {...register("zipCode")}
                      />
                      <Input
                        label="Country"
                        placeholder="India"
                        error={errors.country?.message}
                        {...register("country")}
                      />
                    </div>
                  </form>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => setPaymentMethod("razorpay")}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                        paymentMethod === "razorpay"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">
                          Razorpay
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Pay via UPI, Card, Net Banking, Wallet
                        </p>
                      </div>
                      {paymentMethod === "razorpay" && (
                        <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                      )}
                    </button>

                    <button
                      onClick={() => setPaymentMethod("cod")}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                        paymentMethod === "cod"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Banknote className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">
                          Cash on Delivery
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Pay when you receive your order
                        </p>
                      </div>
                      {paymentMethod === "cod" && (
                        <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Review Your Order
                  </h2>
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div
                        key={`${String(item.product)}-${item.size}-${item.color}`}
                        className="flex items-center gap-4 p-3 rounded-xl bg-secondary"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                            {item.size && ` | Size: ${item.size}`}
                            {item.color && ` | Color: ${item.color}`}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              {currentStep < 3 ? (
                <Button onClick={nextStep} className="gap-2">
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={placeOrder}
                  loading={placing}
                  className="gap-2"
                >
                  {placing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground font-medium">
                    {formatPrice(tax)}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-base font-bold text-foreground">
                    Total
                  </span>
                  <span className="text-base font-bold text-foreground">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
              {currentStep === 1 && (
                <p className="text-xs text-muted-foreground text-center">
                  Free shipping on orders above ₹999
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Link({
  href,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
