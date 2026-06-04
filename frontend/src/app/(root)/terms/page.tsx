"use client";

import { motion } from "framer-motion";
import { FileText, Scale, AlertTriangle, Ban, Gavel, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    icon: FileText,
    title: "General Terms",
    content: "By accessing and using ShopHub, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you should not use our services. We reserve the right to update these terms at any time, and continued use constitutes acceptance of changes.",
  },
  {
    icon: Scale,
    title: "Account & Registration",
    content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate, current, and complete information during registration. We reserve the right to suspend or terminate accounts that violate our terms.",
  },
  {
    icon: AlertTriangle,
    title: "Orders & Payments",
    content: "All orders are subject to availability and acceptance. We reserve the right to cancel orders due to pricing errors, stock unavailability, or suspected fraud. Payment must be made at the time of purchase. Prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.",
  },
  {
    icon: Ban,
    title: "Prohibited Activities",
    content: "You agree not to: use our site for any unlawful purpose; attempt to gain unauthorized access to our systems; interfere with the proper functioning of the website; use automated bots or scrapers; engage in any activity that could damage, disable, or impair our services.",
  },
  {
    icon: Gavel,
    title: "Intellectual Property",
    content: "All content on ShopHub including product images, descriptions, logos, and trademarks are our property or our licensors. You may not reproduce, distribute, modify, or create derivative works without our express written permission.",
  },
  {
    icon: UserCheck,
    title: "Limitation of Liability",
    content: "ShopHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount paid by you for the product or service giving rise to the claim.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 gradient-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">
            Terms & Conditions
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Terms & Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-white/70 text-lg"
          >
            Last updated: June 2026
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm text-muted-foreground mb-12 leading-relaxed">
          Welcome to ShopHub. These Terms & Conditions govern your use of our website and services. By using ShopHub, you agree to these terms. Please read them carefully before making a purchase.
        </p>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    {section.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
