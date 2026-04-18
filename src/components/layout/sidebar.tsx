"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  Settings,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderOpen, matchPrefix: "/projects" },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 p-4 h-16">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
          <Shield className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-bold text-lg tracking-tight"
          >
            PromptSure
          </motion.span>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.matchPrefix && pathname.startsWith(item.matchPrefix));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-violet-500/10 text-violet-400"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-violet-400")} />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-0.5 h-6 bg-violet-500 rounded-r"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 space-y-2 border-t border-zinc-800/50">
        <Link
          href="/pricing"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-all"
        >
          <Zap className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Upgrade</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </motion.aside>
  );
}
