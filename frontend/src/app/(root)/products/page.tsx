"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Heart,
  Eye,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { useGetProductsQuery } from "@/store/api/apiSlice";
import { addToCart } from "@/store/slices/cartSlice";
import type { Product } from "@/types";
import type { AppDispatch } from "@/store";

const categories = ["All", "Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports"];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating", value: "rating" },
  { label: "Name", value: "name" },
];

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useGetProductsQuery({
    page: currentPage,
    limit: 12,
    category: selectedCategory !== "All" ? selectedCategory : undefined,
    search: searchTerm || undefined,
    sortBy,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 50000 ? priceRange[1] : undefined,
    rating: selectedRating ?? undefined,
  });

  const products = data?.data ?? [];
  const totalPages = data?.pages ?? 0;
  const totalProducts = data?.total ?? 0;

  const activeFilters: string[] = [];
  if (selectedCategory !== "All") activeFilters.push(`Category: ${selectedCategory}`);
  if (priceRange[0] > 0 || priceRange[1] < 50000)
    activeFilters.push(`Price: ₹${priceRange[0]} - ₹${priceRange[1]}`);
  if (selectedRating) activeFilters.push(`Rating: ${selectedRating}+`);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-3">Categories</h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                selectedCategory === cat
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={50000}
            step={1000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Rating</h3>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => {
                setSelectedRating(selectedRating === rating ? null : rating);
                setCurrentPage(1);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                selectedRating === rating
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" className="h-40 w-full" />
                ))}
              </div>
            </aside>
            <div className="flex-1 min-w-0">
              <Skeleton variant="rectangular" className="h-11 w-full mb-6" />
              <Skeleton variant="rectangular" className="h-5 w-48 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                    <Skeleton variant="rectangular" className="aspect-square w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton variant="text" className="w-20 h-3" />
                      <Skeleton variant="text" className="w-3/4 h-4" />
                      <Skeleton variant="text" className="w-1/3 h-3" />
                      <Skeleton variant="text" className="w-1/2 h-5" />
                      <Skeleton variant="rectangular" className="h-9 w-full rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Failed to load products
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error && "data" in error
                ? (error.data as { message?: string })?.message ?? "Something went wrong"
                : "Something went wrong"}
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-11 pl-10 pr-4 rounded-2xl border border-input bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-11 pl-4 pr-10 rounded-2xl border border-input bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>

                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl ${
                    viewMode === "grid"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-xl ${
                    viewMode === "list"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden p-2.5 rounded-xl text-muted-foreground hover:bg-secondary"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map((filter) => (
                  <span
                    key={filter}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {filter}
                    <X className="w-3 h-3 cursor-pointer" />
                  </span>
                ))}
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceRange([0, 50000]);
                    setSelectedRating(null);
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-4">
              Showing {products.length} of {totalProducts} results
            </p>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceRange([0, 50000]);
                    setSelectedRating(null);
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
                    : "space-y-4"
                }
              >
                {products.map((product: Product, index: number) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <div
                      className={`group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      <div
                        className={`relative overflow-hidden ${
                          viewMode === "list"
                            ? "w-48 shrink-0 aspect-square"
                            : "aspect-square"
                        }`}
                      >
                        <img
                          src={product.images?.[0]?.url ?? "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {product.comparePrice && (
                          <Badge
                            variant="destructive"
                            className="absolute top-3 left-3"
                          >
                            Sale
                          </Badge>
                        )}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-lg">
                            <Heart className="w-3.5 h-3.5" />
                          </button>
                          <Link href={`/products/${product._id}`}>
                            <button className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all shadow-lg">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                        </div>
                      </div>
                      <div className={`p-4 flex flex-col justify-center ${viewMode === "list" ? "flex-1" : ""}`}>
                        <p className="text-xs text-muted-foreground mb-1">
                          {product.category?.name ?? "Uncategorized"}
                        </p>
                        <Link href={`/products/${product._id}`}>
                          <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-muted-foreground">
                            {product.averageRating?.toFixed(1) ?? "0.0"} ({product.numReviews ?? 0})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold text-foreground">
                            {formatPrice(product.price)}
                          </span>
                          {product.comparePrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.comparePrice)}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            className="flex-1"
                            size="sm"
                            onClick={() =>
                              dispatch(
                                addToCart({
                                  product: product._id,
                                  name: product.name,
                                  image: product.images?.[0]?.url ?? "/placeholder.svg",
                                  price: product.price,
                                  stock: product.stock,
                                  quantity: 1,
                                })
                              )
                            }
                          >
                            Add to Cart
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            asChild
                          >
                            <Link href={`/products/${product._id}`}>
                              Buy Now
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileFilterOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-card border-l border-border p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-xl hover:bg-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
