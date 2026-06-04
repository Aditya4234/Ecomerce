"use client";

import { motion } from "framer-motion";
import { RotateCcw, RefreshCw, Clock, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  { icon: RotateCcw, title: "Initiate Return", desc: "Log into your account, go to Orders, and click 'Return Item' for the order you want to return." },
  { icon: RefreshCw, title: "Pack & Ship", desc: "Pack the item securely in its original packaging with all tags attached. Print the return label and ship it back." },
  { icon: Clock, title: "Inspection", desc: "Once we receive your return, our team inspects the item within 2-3 business days." },
  { icon: CreditCard, title: "Refund Issued", desc: "After inspection, your refund is processed within 5-7 business days to your original payment method." },
];

const conditions = [
  { icon: CheckCircle, text: "Items must be unused and in original condition", color: "text-emerald-600" },
  { icon: CheckCircle, text: "Original packaging and all tags must be intact", color: "text-emerald-600" },
  { icon: CheckCircle, text: "Return must be initiated within 30 days of delivery", color: "text-emerald-600" },
  { icon: AlertCircle, text: "Sale items and gift cards are non-returnable", color: "text-destructive" },
  { icon: AlertCircle, text: "Customers cover return shipping unless item is defective", color: "text-destructive" },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 gradient-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">
            Returns Policy
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Hassle-Free Returns
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-white/70 text-lg"
          >
            30-day return policy. No questions asked.
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Return Conditions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conditions.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
              >
                <c.icon className={`w-5 h-5 shrink-0 mt-0.5 ${c.color}`} />
                <span className="text-sm text-foreground">{c.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
