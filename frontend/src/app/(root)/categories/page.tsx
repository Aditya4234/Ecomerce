"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetCategoriesQuery } from "@/store/api/apiSlice";

const gradients = [
  "from-blue-600/20 to-blue-600/5",
  "from-pink-600/20 to-pink-600/5",
  "from-amber-600/20 to-amber-600/5",
  "from-rose-600/20 to-rose-600/5",
  "from-emerald-600/20 to-emerald-600/5",
  "from-indigo-600/20 to-indigo-600/5",
  "from-slate-600/20 to-slate-600/5",
  "from-orange-600/20 to-orange-600/5",
];

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useGetCategoriesQuery();

  const categories = data?.data ?? [];

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">
            Browse Categories
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Shop by Category
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Explore our wide range of categories and find exactly what
            you&apos;re looking for
          </p>
        </div>

        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-2xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Failed to load categories
              </h3>
              <p className="text-sm text-muted-foreground">
                Please try again later
              </p>
            </div>
          ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No categories found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((category, i) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group relative block overflow-hidden rounded-2xl aspect-[4/5]"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${gradients[i % gradients.length]} to-transparent z-10`}
                  />
                  {category.image?.url && (
                    <img
                      src={category.image.url}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
