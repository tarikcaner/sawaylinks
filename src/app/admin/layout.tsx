"use client";

import { useAdmin } from "@/hooks/useAdmin";
import LoginForm from "@/components/admin/LoginForm";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link2, User, Palette, LogOut, Loader2 } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Linkler", icon: Link2 },
  { href: "/admin/profile", label: "Profil", icon: User },
  { href: "/admin/theme", label: "Tema", icon: Palette },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, login, logout } = useAdmin();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl flex items-center justify-between h-14 px-4">
          <Link href="/admin" className="text-sm font-semibold tracking-tight">
            SawayLinks
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant={isActive ? "secondary" : "ghost"} size="sm" className="gap-2 h-8 text-xs">
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Button variant="ghost" size="sm" onClick={logout} className="gap-2 h-8 text-xs text-muted-foreground hover:text-destructive">
            <LogOut className="h-3.5 w-3.5" />
            Cikis
          </Button>
        </div>
      </header>

      <Separator />

      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
