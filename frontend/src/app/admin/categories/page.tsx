"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const allCategories = [
  { _id: "1", name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&q=80", count: 2456, status: "active" },
  { _id: "2", name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&q=80", count: 3890, status: "active" },
  { _id: "3", name: "Home & Living", slug: "home-living", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=100&q=80", count: 1234, status: "active" },
  { _id: "4", name: "Beauty", slug: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&q=80", count: 987, status: "inactive" },
  { _id: "5", name: "Sports", slug: "sports", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&q=80", count: 756, status: "active" },
  { _id: "6", name: "Books", slug: "books", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=100&q=80", count: 2345, status: "active" },
];

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<typeof allCategories[0] | null>(null);

  const filtered = allCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (cat: typeof allCategories[0]) => {
    setEditing(cat);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      // Delete logic
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} categories
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cat, i) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground">{cat.name}</h3>
              <p className="text-xs text-muted-foreground">
                /{cat.slug} &middot; {cat.count.toLocaleString()} products
              </p>
              <Badge
                variant={cat.status === "active" ? "default" : "secondary"}
                className="mt-1 text-[10px] capitalize"
              >
                {cat.status}
              </Badge>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => openEdit(cat)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat._id)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? "Edit Category" : "Add Category"}
        size="sm"
      >
        <div className="space-y-4">
          <Input label="Name" placeholder="Category name" defaultValue={editing?.name} />
          <Input label="Slug" placeholder="category-slug" defaultValue={editing?.slug} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
            <select className="w-full h-11 rounded-xl border border-input bg-secondary px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" defaultValue={editing?.status || "active"}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
