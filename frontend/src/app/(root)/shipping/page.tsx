"use client";

import { motion } from "framer-motion";
import { Package, Truck, Plane, Clock, Shield, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const shippingMethods = [
  {
    icon: Truck,
    title: "Standard Shipping",
    time: "3-5 Business Days",
    cost: "₹49",
    free: "Free on orders above ₹499",
  },
  {
    icon: Plane,
    title: "Express Shipping",
    time: "1-2 Business Days",
    cost: "₹149",
    free: "Free on orders above ₹999",
  },
  {
    icon: Package,
    title: "International Shipping",
    time: "7-14 Business Days",
    cost: "Calculated at checkout",
    free: "Varies by destination",
  },
];

const policies = [
  {
    title: "Order Processing",
    desc: "Orders are processed within 24 hours of placement (excluding weekends and holidays). You'll receive a confirmation email once your order is processed.",
  },
  {
    title: "Tracking Your Order",
    desc: "Once shipped, you'll receive a tracking number via email. You can also track your order in real-time from your account dashboard.",
  },
  {
    title: "Shipping Areas",
    desc: "We ship to all PIN codes across India and to over 50 countries worldwide. International shipping costs and delivery times vary by destination.",
  },
  {
    title: "Delivery Attempts",
    desc: "Our delivery partners will make up to 3 delivery attempts. If all attempts fail, the package will be returned to us and a refund will be processed.",
  },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 gradient-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">
            Shipping Information
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Shipping & Delivery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-white/70 text-lg"
          >
            Fast, reliable shipping right to your doorstep
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {shippingMethods.map((method, i) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <method.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                {method.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">{method.time}</p>
              <p className="text-2xl font-bold text-primary mb-1">{method.cost}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                {method.free}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-foreground">
            Shipping Policies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy, i) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {policy.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {policy.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
