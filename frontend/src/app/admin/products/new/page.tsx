"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ChevronLeft,
  Upload,
  X,
  Save,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  comparePrice: z.string().optional(),
  stock: z.string().min(1, "Stock is required"),
  category: z.string().min(1, "Category is required"),
});

type ProductInput = z.infer<typeof productSchema>;

const categories = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty",
  "Sports",
  "Books",
];

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductInput) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSaving(false);
    router.push("/admin/products");
  };

  const handleImageUpload = () => {
    // Simulate upload
    const url = `https://images.unsplash.com/photo-${1505740420928 + Math.floor(Math.random() * 100)}?w=400&q=80`;
    setImages([...images, url]);
  };

  const addItem = (
    list: string[],
    setter: (v: string[]) => void,
    input: string,
    inputSetter: (v: string) => void
  ) => {
    if (input.trim() && !list.includes(input.trim())) {
      setter([...list, input.trim()]);
      inputSetter("");
    }
  };

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <Input
                  label="Product Name"
                  placeholder="Enter product name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label="Slug"
                  placeholder="product-slug"
                  error={errors.slug?.message}
                  {...register("slug")}
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={5}
                    placeholder="Describe your product..."
                    className="w-full rounded-xl border border-input bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  {errors.description && (
                    <p className="mt-1.5 text-xs text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">
                Pricing & Stock
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Price (₹)"
                  type="number"
                  placeholder="2999"
                  error={errors.price?.message}
                  {...register("price")}
                />
                <Input
                  label="Compare Price (₹)"
                  type="number"
                  placeholder="3999"
                  error={errors.comparePrice?.message}
                  {...register("comparePrice")}
                />
                <Input
                  label="Stock Quantity"
                  type="number"
                  placeholder="100"
                  error={errors.stock?.message}
                  {...register("stock")}
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Category
                  </label>
                  <select
                    {...register("category")}
                    className="w-full h-11 rounded-xl border border-input bg-secondary px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1.5 text-xs text-destructive">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">
                Variants
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Sizes
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      placeholder="Add size..."
                      className="flex-1 h-10 px-4 rounded-xl border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addItem(sizes, setSizes, sizeInput, setSizeInput);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addItem(sizes, setSizes, sizeInput, setSizeInput)
                      }
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-sm"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => setSizes(sizes.filter((x) => x !== s))}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Colors (hex)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      placeholder="#6366f1"
                      className="flex-1 h-10 px-4 rounded-xl border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addItem(colors, setColors, colorInput, setColorInput);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addItem(colors, setColors, colorInput, setColorInput)
                      }
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm"
                      >
                        <span
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: c }}
                        />
                        {c}
                        <button
                          type="button"
                          onClick={() =>
                            setColors(colors.filter((x) => x !== c))
                          }
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag..."
                      className="flex-1 h-10 px-4 rounded-xl border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addItem(tags, setTags, tagInput, setTagInput);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addItem(tags, setTags, tagInput, setTagInput)
                      }
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-sm"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((x) => x !== t))}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">
                Product Images
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-secondary">
                    <img
                      src={img}
                      alt={`Product ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-all"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs">Upload</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">
                Settings
              </h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Featured Product</span>
              </label>
            </motion.div>

            <Button
              type="submit"
              className="w-full h-12"
              loading={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
