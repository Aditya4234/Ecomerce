"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  GripVertical,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "@/store/api/apiSlice";
import type { Banner } from "@/types";

const defaultForm = {
  title: "",
  subtitle: "",
  link: "",
  position: "hero" as "hero" | "sidebar" | "bottom",
};

export default function AdminBannersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data, isLoading, error } = useGetBannersQuery();

  const [createBanner, { isLoading: creating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: updating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: deleting }] = useDeleteBannerMutation();

  const banners = data?.data ?? [];

  const openEdit = (banner: Banner) => {
    setEditing(banner);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle ?? "",
      link: banner.link ?? "",
      position: banner.position,
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(defaultForm);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", form.title);
    if (form.subtitle) formData.append("subtitle", form.subtitle);
    if (form.link) formData.append("link", form.link);
    formData.append("position", form.position);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editing) {
        await updateBanner({ id: editing._id, data: formData }).unwrap();
      } else {
        await createBanner(formData).unwrap();
      }
      setModalOpen(false);
    } catch {
      //
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteBanner(id).unwrap();
      } catch {
        //
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center py-12">
        Failed to load banners. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Banners</h1>
          <p className="text-sm text-muted-foreground">
            {banners.length} banners
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Banner
        </Button>
      </div>

      <div className="space-y-4">
        {banners.map((banner, i) => (
          <motion.div
            key={banner._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card"
          >
            <div className="cursor-grab text-muted-foreground hover:text-foreground">
              <GripVertical className="w-5 h-5" />
            </div>
            <div className="w-24 h-16 rounded-xl overflow-hidden bg-secondary shrink-0">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground">{banner.title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="secondary" className="capitalize text-[10px]">
                  {banner.position}
                </Badge>
              </div>
            </div>
            <Badge
              variant={banner.isActive ? "default" : "secondary"}
              className="capitalize text-[10px]"
            >
              {banner.isActive ? "active" : "inactive"}
            </Badge>
            <div className="flex gap-1">
              <button
                onClick={() => openEdit(banner)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(banner._id)}
                disabled={deleting}
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
        title={editing ? "Edit Banner" : "Add Banner"}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Banner title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="Subtitle (optional)"
            placeholder="Banner subtitle"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
          <Input
            label="Link (optional)"
            placeholder="/promotions/summer"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Position</label>
            <select
              value={form.position}
              onChange={(e) =>
                setForm({ ...form, position: e.target.value as "hero" | "sidebar" | "bottom" })
              }
              className="w-full h-11 rounded-xl border border-input bg-secondary px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="hero">Hero</option>
              <option value="sidebar">Sidebar</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Image</label>
            <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-muted-foreground/50 transition-colors">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {imageFile ? imageFile.name : "Click to upload image"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={creating || updating}
          >
            {editing ? "Update Banner" : "Create Banner"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
