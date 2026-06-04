"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  ChevronRight,
  Edit3,
  Trash2,
  Plus,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { logout, setUser } from "@/store/slices/authSlice";
import { useGetOrdersQuery, useUpdateProfileMutation, useUpdatePasswordMutation } from "@/store/api/apiSlice";
import type { RootState } from "@/store";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "security", label: "Security", icon: Lock },
];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );
  const [activeTab, setActiveTab] = useState("overview");

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] =
    useUpdatePasswordMutation();
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useGetOrdersQuery({ page: 1 });

  const orders = ordersData?.data || [];
  const totalOrders = ordersData?.total || 0;
  const savedAddresses = user?.shippingAddresses || [];

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const onSaveProfile = async (data: ProfileInput) => {
    try {
      const res = await updateProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
      }).unwrap();
      dispatch(setUser(res.data));
    } catch (err: any) {
      setFormError("root", {
        message: err?.data?.message || "Failed to update profile",
      });
    }
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const onUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      await updatePassword({
        currentPassword,
        newPassword,
      }).unwrap();
      setPasswordSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          My Account
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={() => dispatch(logout())}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold text-white">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">
                        {user?.name || "User"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                      <Badge variant="secondary" className="mt-1 capitalize">
                        {user?.role || "user"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        icon: Package,
                        label: "Orders",
                        value: totalOrders,
                      },
                      {
                        icon: Heart,
                        label: "Wishlist",
                        value: wishlistItems.length,
                      },
                      {
                        icon: MapPin,
                        label: "Addresses",
                        value: savedAddresses.length,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="p-4 rounded-xl bg-secondary text-center"
                      >
                        <stat.icon className="w-5 h-5 mx-auto text-primary mb-2" />
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground">
                      Recent Orders
                    </h3>
                    <a
                      href="/orders"
                      className="text-sm text-primary hover:underline"
                    >
                      View All
                    </a>
                  </div>
                  {ordersLoading ? (
                    <div className="text-sm text-muted-foreground py-4 text-center">
                      Loading orders...
                    </div>
                  ) : ordersError ? (
                    <div className="text-sm text-destructive py-4 text-center">
                      Failed to load orders
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-4 text-center">
                      No orders yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <a
                          key={order._id}
                          href={`/orders/${order._id}`}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground font-mono">
                              {order._id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-foreground">
                              {formatPrice(order.totalPrice)}
                            </p>
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "default"
                                  : order.status === "shipped"
                                  ? "warning"
                                  : "secondary"
                              }
                              className="capitalize text-[10px] px-2 py-0"
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-bold text-foreground mb-4">
                    Order History
                  </h3>
                  {ordersLoading ? (
                    <div className="text-sm text-muted-foreground py-8 text-center">
                      Loading orders...
                    </div>
                  ) : ordersError ? (
                    <div className="text-sm text-destructive py-8 text-center">
                      Failed to load orders
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-8 text-center">
                      No orders yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <a
                          key={order._id}
                          href={`/orders/${order._id}`}
                          className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <Package className="w-8 h-8 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground font-mono">
                                {order._id}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(order.createdAt)} &middot;{" "}
                                {formatPrice(order.totalPrice)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "default"
                                  : order.status === "shipped"
                                  ? "warning"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {order.status}
                            </Badge>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">
                    Saved Addresses
                  </h3>
                  <Button size="sm" className="gap-1">
                    <Plus className="w-4 h-4" />
                    Add New
                  </Button>
                </div>
                {savedAddresses.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-8 text-center">
                    No saved addresses
                  </div>
                ) : (
                  savedAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="rounded-2xl border border-border bg-card p-5"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">
                            {addr.fullName}
                          </h4>
                          {addr.isDefault && (
                            <Badge variant="secondary" className="text-[10px]">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        <p>{addr.address}</p>
                        <p>
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                        <p>{addr.country}</p>
                        <p>{addr.phone}</p>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Profile Information
                  </h3>
                  <form
                    onSubmit={handleSubmit(onSaveProfile)}
                    className="space-y-4"
                  >
                    {errors.root && (
                      <p className="text-sm text-destructive">
                        {errors.root.message}
                      </p>
                    )}
                    <Input
                      label="Full Name"
                      error={errors.name?.message}
                      {...register("name")}
                    />
                    <Input
                      label="Email"
                      type="email"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />
                    <Button type="submit" loading={isUpdatingProfile}>
                      {isUpdatingProfile ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Change Password
                  </h3>
                  <form onSubmit={onUpdatePassword} className="space-y-4">
                    {passwordError && (
                      <p className="text-sm text-destructive">
                        {passwordError}
                      </p>
                    )}
                    {passwordSuccess && (
                      <p className="text-sm text-emerald-600">
                        {passwordSuccess}
                      </p>
                    )}
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button type="submit" loading={isUpdatingPassword}>
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
