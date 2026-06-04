"use client";

import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Shield,
  Star,
  Users,
  Package,
  Headphones,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "10K+", label: "Products" },
  { value: "99%", label: "Satisfaction" },
  { value: "24/7", label: "Support" },
];

const team = [
  {
    name: "Priya Sharma",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  {
    name: "Rahul Verma",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    name: "Ananya Patel",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
  {
    name: "Arjun Kapoor",
    role: "Marketing Director",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
];

const features = [
  {
    icon: Package,
    title: "Curated Collections",
    desc: "Every product is hand-picked by our team of experts",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    desc: "We stand behind every product we sell",
  },
  {
    icon: Star,
    title: "Premium Service",
    desc: "Exceptional customer experience from start to finish",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "Building a community of informed and happy shoppers",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Personal support team for every customer",
  },
  {
    icon: Heart,
    title: "Sustainable Practices",
    desc: "Committed to ethical and eco-friendly operations",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80')] bg-cover bg-center opacity-5" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4">
            Our Story
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            We&apos;re on a Mission to
            <br />
            <span className="text-gradient">Transform Shopping</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-white/70 text-lg"
          >
            ShopHub was founded with a simple vision: to make premium products
            accessible to everyone. We believe in quality, transparency, and
            exceptional customer service.
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl border border-border bg-card"
              >
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-3">
                Our Mission
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                What Drives Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At ShopHub, we&apos;re building the future of e-commerce. Our
                platform connects customers with premium products while ensuring
                the best prices, fastest delivery, and most reliable service in
                the industry.
              </p>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Mission</h3>
                  <p className="text-sm text-muted-foreground">
                    To democratize access to premium products and create a
                    seamless shopping experience for everyone.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Vision</h3>
                  <p className="text-sm text-muted-foreground">
                    To become the most trusted and customer-centric e-commerce
                    platform in India.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80"
                alt="Our team at work"
                className="rounded-2xl"
              />
              <div className="absolute -bottom-4 -left-4 p-4 rounded-2xl bg-card border border-border shadow-lg hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <img
                        key={i}
                        src={`https://images.unsplash.com/photo-${1494790108377 + i}?w=40&q=80`}
                        alt=""
                        className="w-8 h-8 rounded-full border-2 border-card"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      100+ Team Members
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Across 4 offices
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">
              Why ShopHub
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Built Different
            </h2>
            <p className="text-muted-foreground mt-2">
              Here&apos;s what sets us apart
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">
              Our Team
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Meet the People Behind ShopHub
            </h2>
            <p className="text-muted-foreground mt-2">
              A passionate team dedicated to your shopping experience
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="relative mx-auto w-32 h-32 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
