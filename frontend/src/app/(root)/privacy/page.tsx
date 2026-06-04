"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Mail, Cookie } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: "We collect information you provide directly to us, including your name, email address, phone number, shipping address, and payment details when you create an account or place an order. We also automatically collect certain information about your device and browsing behavior, including IP address, browser type, and pages visited.",
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: "We use your information to process orders, deliver products, send order updates, provide customer support, improve our services, and send promotional offers (with your consent). We do not sell your personal information to third parties.",
  },
  {
    icon: Lock,
    title: "Data Security",
    content: "We implement industry-standard security measures including SSL encryption, secure payment processing through Razorpay, and regular security audits. Your payment details are encrypted and never stored on our servers.",
  },
  {
    icon: Cookie,
    title: "Cookies",
    content: "We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.",
  },
  {
    icon: Mail,
    title: "Communication",
    content: "We may send you transactional emails related to your orders, account, or service updates. Marketing communications are sent only with your explicit consent, and you can unsubscribe at any time.",
  },
  {
    icon: Shield,
    title: "Your Rights",
    content: "You have the right to access, correct, or delete your personal data at any time. You can manage your data through your account settings or contact us for assistance. We will respond to your requests within 30 days.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 gradient-hero overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">
            Privacy Policy
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Your Privacy Matters
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
          At ShopHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. By using our services, you agree to the collection and use of information in accordance with this policy.
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

        <div className="mt-12 p-6 rounded-2xl bg-secondary/50 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-2">Contact Us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <span className="text-primary">hello@shophub.com</span> or write to us at{" "}
            <span className="text-primary">123 Commerce Street, Mumbai, India 400001</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
