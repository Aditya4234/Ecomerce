"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  ChevronLeft,
  Truck,
  Shield,
  RefreshCcw,
  Clock,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatPrice, formatDate } from "@/lib/utils";
import type { AppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import {
  useGetProductQuery,
  useGetProductsQuery,
  useAddReviewMutation,
  useGetProductReviewsQuery,
} from "@/store/api/apiSlice";

export default function ProductDetailPage() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const id = params.slug as string;

  const { data: productRes, isLoading, error } = useGetProductQuery(id);
  const product = productRes?.data;

  const { data: reviewsRes } = useGetProductReviewsQuery(id, { skip: !product });
  const reviews = reviewsRes?.data ?? [];

  const categoryId = product?.category?._id ?? "";
  const { data: relatedRes } = useGetProductsQuery(
    { category: categoryId, limit: 5 },
    { skip: !categoryId }
  );
  const relatedProducts = (relatedRes?.data ?? []).filter((p) => p._id !== id);

  const [addReview, { isLoading: isReviewSubmitting }] = useAddReviewMutation();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    if (product) {
      if (product.sizes?.length && !selectedSize) setSelectedSize(product.sizes[0]);
      if (product.colors?.length && !selectedColor) setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const productImages = product
    ? product.images.map((img) =>
        typeof img === "string" ? img : (img as { url: string }).url
      )
    : [];

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: productImages[0],
        price: product.price,
        stock: product.stock,
        quantity,
        size: selectedSize,
        color: selectedColor,
      })
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    try {
      await addReview({
        product: product._id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      }).unwrap();
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
    } catch {
      // error handled by RTK
    }
  };

  const getImageUrl = (img: string | { url: string }): string =>
    typeof img === "string" ? img : img.url;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">Product not found.</p>
        <Link href="/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-card mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.comparePrice && (
                <Badge
                  variant="destructive"
                  className="absolute top-4 left-4 text-sm px-3 py-1"
                >
                  -{Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-primary"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-primary font-medium mb-2">
              {product.category.name}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  {product.averageRating} ({product.numReviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              {product.comparePrice && (
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  You save {formatPrice(product.comparePrice - product.price)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-6">
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-muted-foreground/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? "border-primary scale-110"
                            : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-foreground">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.stock} in stock
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  size="lg"
                  className="flex-1 h-13"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 px-6"
                >
                  <Heart className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 px-6"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                {[
                  { icon: Truck, label: "Free Shipping", desc: "On orders above ₹999" },
                  { icon: Shield, label: "Secure Payment", desc: "100% secure checkout" },
                  { icon: RefreshCcw, label: "Easy Returns", desc: "30-day return policy" },
                  { icon: Clock, label: "Fast Delivery", desc: "3-5 business days" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm text-muted-foreground">Share:</span>
                <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex border-b border-border mb-6">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "description" | "reviews")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all capitalize ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "description" ? "Description" : `Reviews (${product.numReviews})`}
              </button>
            ))}
          </div>

          {activeTab === "description" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-sm max-w-none text-muted-foreground"
            >
              <p className="leading-relaxed">{product.description}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <form
                onSubmit={handleSubmitReview}
                className="p-6 rounded-2xl border border-border bg-card space-y-4"
              >
                <h3 className="font-semibold text-foreground">Write a Review</h3>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewRating(i + 1)}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          i < reviewRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="Review title"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Write your review..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  className="flex min-h-[100px] w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" disabled={isReviewSubmitting}>
                  {isReviewSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>

              {reviews.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet. Be the first to review!
                </p>
              )}

              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 rounded-2xl border border-border bg-card"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={review.user.avatar || "/placeholder.svg"}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground text-sm">
                          {review.user.name}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="font-medium text-foreground text-sm mb-1">
                        {review.title}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rp) => (
              <Link key={rp._id} href={`/products/${rp.slug}`}>
                <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={
                        rp.images?.[0]
                          ? getImageUrl(rp.images[0])
                          : "/placeholder.svg"
                      }
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {rp.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-muted-foreground">
                        {rp.averageRating} ({rp.numReviews})
                      </span>
                    </div>
                    <p className="text-base font-bold text-foreground mt-1">
                      {formatPrice(rp.price)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
