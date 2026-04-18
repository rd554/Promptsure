"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  CreditCard,
  Shield,
  LogOut,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState("");
  const [building, setBuilding] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const { data } = await res.json();
        setUser(data);
        setFullName(data.full_name || "");
        setBuilding(data.building || "");
      }
    } catch {}
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, building }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const json = await res.json().catch(() => null);
        setError(json?.error || "Failed to save");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold"
        >
          Settings
        </motion.h1>
        <p className="text-zinc-400 mt-1">
          Manage your profile, billing, and account
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Profile */}
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-violet-400" />
            Profile
          </CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label>What are you building?</Label>
                <Input
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="e.g. AI customer support bot"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Save changes
                </Button>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5 text-sm text-emerald-400"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Saved
                  </motion.span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Billing */}
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-emerald-400" />
            Billing & Plan
          </CardTitle>
          <CardDescription>Your current plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">Starter plan</p>
                <Badge variant="default">Free</Badge>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Paid plans and payments are launching soon.
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push("/pricing")}>
              <Sparkles className="h-4 w-4" />
              See plans
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security / Account */}
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            Account
          </CardTitle>
          <CardDescription>Security and session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sign out</p>
              <p className="text-xs text-zinc-500">
                End your session on this device
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium mb-1">Delete account</p>
            <p className="text-xs text-zinc-500 mb-3">
              Permanently delete your account and all data. This cannot be undone.
            </p>
            <Button
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() =>
                (window.location.href =
                  "mailto:support@promptsure.ai?subject=Delete%20my%20account")
              }
            >
              Request account deletion
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
