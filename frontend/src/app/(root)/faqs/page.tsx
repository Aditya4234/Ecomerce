"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const faqCategories = [
  {
    title: "Orders & Shipping",
    items: [
      {
        q: "How do I place an order?",
        a: "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase.",
      },
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 3-5 business days within India. Express shipping is available for 1-2 business days. International shipping takes 7-14 business days depending on the destination.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to over 50 countries worldwide. Shipping charges and delivery times vary by destination. You can see the estimated shipping cost at checkout.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order is shipped, you will receive a tracking number via email. You can also track your order from the Orders section in your account dashboard.",
      },
      {
        q: "Can I change my shipping address after placing an order?",
        a: "You can change your shipping address as long as the order hasn't been shipped yet. Please contact our support team immediately to make changes.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day hassle-free return policy on all unused items in their original packaging. Simply initiate a return from your account or contact our support team.",
      },
      {
        q: "How do I initiate a return?",
        a: "Log into your account, go to Orders, find the order you want to return, and click 'Return Item'. Follow the instructions to print the return label and ship the item back.",
      },
      {
        q: "How long does it take to get a refund?",
        a: "Once we receive your returned item, we'll process the refund within 5-7 business days. The amount will be credited to your original payment method.",
      },
      {
        q: "Can I exchange an item?",
        a: "Yes, you can exchange items for a different size or color. Initiate a return and select 'Exchange' as the reason. We'll ship the replacement once the return is processed.",
      },
    ],
  },
  {
    title: "Payment & Pricing",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI, Net Banking, wallets, and Cash on Delivery. All payments are processed securely through Razorpay.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use industry-standard SSL encryption and Razorpay's secure payment gateway. Your payment details are never stored on our servers.",
      },
      {
        q: "Do you offer discounts or coupons?",
        a: "Yes! We regularly offer discounts and promotional coupons. Subscribe to our newsletter and follow us on social media to stay updated on the latest deals.",
      },
      {
        q: "Can I use multiple coupons on a single order?",
        a: "Only one coupon can be applied per order. However, you can combine a coupon with other ongoing site-wide sales and offers.",
      },
    ],
  },
  {
    title: "Account & Support",
    items: [
      {
        q: "How do I create an account?",
        a: "Click on the 'Login' button at the top of the page and select 'Create Account'. Fill in your details and you'll be ready to shop in minutes.",
      },
      {
        q: "I forgot my password. What should I do?",
        a: "Click on 'Login' and then 'Forgot Password'. Enter your email address and we'll send you a link to reset your password.",
      },
      {
        q: "How can I contact customer support?",
        a: "You can reach us via email at hello@shophub.com, call us at +91 98765 43210, or use the contact form on our Contact page. We're available Mon-Sat, 9 AM to 6 PM.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes, you can request account deletion by contacting our support team. Please note that this action is irreversible and all your data will be permanently removed.",
      },
    ],
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<{ cat: number; item: number } | null>(null);
  const [search, setSearch] = useState("");

  const filtered = faqCategories.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 gradient-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">
            FAQ
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-white/70 text-lg mb-8"
          >
            Everything you need to know about shopping at ShopHub
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {filtered.map((cat, catIndex) => (
          <div key={cat.title}>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {cat.title}
            </h2>
            <div className="space-y-3">
              {cat.items.map((item, itemIndex) => {
                const isOpen =
                  openIndex?.cat === catIndex && openIndex?.item === itemIndex;
                return (
                  <motion.div
                    key={item.q}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenIndex(isOpen ? null : { cat: catIndex, item: itemIndex })
                      }
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-medium text-foreground pr-4">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="px-5 pb-5"
                      >
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
