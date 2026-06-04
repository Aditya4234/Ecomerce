"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "@/store/api/apiSlice";
import type { Coupon } from "@/types";

const defaultForm = {
  code: "",
  discountType: "percentage" as "percentage" | "fixed",
  discountValue: 0,
  minOrderValue: 0,
  maxDiscount: 0,
  usageLimit: 0,
  expiresAt: "",
};

export default function AdminCouponsPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data, isLoading, error } = useGetCouponsQuery();

  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();

  const coupons = data?.data ?? [];

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue ?? 0,
      maxDiscount: coupon.maxDiscount ?? 0,
      usageLimit: coupon.usageLimit ?? 0,
      expiresAt: coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().split("T")[0]
        : "",
    });
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleSubmit = async () => {
    const payload: Partial<Coupon> = {
      code: form.code,
      discountType: form.discountType,
      discountValue: form.discountValue,
      minOrderValue: form.minOrderValue || undefined,
      maxDiscount: form.maxDiscount || undefined,
      usageLimit: form.usageLimit || undefined,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
    };

    try {
      if (editing) {
        await updateCoupon({ id: editing._id, data: payload }).unwrap();
      } else {
        await createCoupon(payload).unwrap();
      }
      setModalOpen(false);
    } catch {
      //
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id).unwrap();
      } catch {
        //
      }
    }
  };

  const getDiscountLabel = (coupon: Coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}% Off`;
    }
    return `₹${coupon.discountValue.toLocaleString()} Off`;
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
        Failed to load coupons. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coupons</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} coupons
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Coupon
        </Button>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search coupons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((coupon, i) => (
          <motion.div
            key={coupon._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-foreground text-lg tracking-wider">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm text-primary font-semibold mt-1">
                  {getDiscountLabel(coupon)}
                </p>
              </div>
              <Badge
                variant={coupon.isActive ? "default" : "secondary"}
                className="capitalize text-[10px]"
              >
                {coupon.isActive ? "active" : "inactive"}
              </Badge>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Usage: {coupon.usedCount}/{coupon.usageLimit ?? "∞"}</p>
              <p>Expires: {coupon.expiresAt ? formatDate(coupon.expiresAt) : "Never"}</p>
            </div>
            <div className="flex gap-1 mt-4 pt-3 border-t border-border">
              <button
                onClick={() => openEdit(coupon)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(coupon._id)}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm hover:bg-secondary text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? "Edit Coupon" : "Add Coupon"}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Coupon Code"
            placeholder="SAVE20"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Type</label>
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm({ ...form, discountType: e.target.value as "percentage" | "fixed" })
                }
                className="w-full h-11 rounded-xl border border-input bg-secondary px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <Input
              label="Value"
              type="number"
              placeholder="20"
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Order Value"
              type="number"
              placeholder="0"
              value={form.minOrderValue}
              onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
            />
            <Input
              label="Max Discount"
              type="number"
              placeholder="0"
              value={form.maxDiscount}
              onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Usage Limit"
              type="number"
              placeholder="500"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
            />
            <Input
              label="Expiry Date"
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={creating || updating}
          >
            {editing ? "Update Coupon" : "Create Coupon"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
