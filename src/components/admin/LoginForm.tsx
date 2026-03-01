"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

interface LoginFormProps {
  onLogin: (password: string) => Promise<boolean>;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setError("");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.status === 429) {
        const seconds = data.retryAfter || 60;
        setCountdown(seconds);
        setError("Cok fazla deneme.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        if (data.remaining !== undefined && data.remaining <= 2) {
          setError(`Yanlis sifre. ${data.remaining} deneme hakkiniz kaldi.`);
        } else {
          setError("Yanlis sifre. Tekrar deneyin.");
        }
        setLoading(false);
        return;
      }

      // Success - use onLogin to update parent state
      localStorage.setItem("admin_token", data.token);
      const success = await onLogin(password);
      if (!success) {
        // Fallback - reload to pick up the stored token
        window.location.reload();
      }
    } catch {
      setError("Baglanti hatasi.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Admin Panel</CardTitle>
          <CardDescription>Yonetim paneline erisim icin sifrenizi girin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Sifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin sifresi"
                  autoFocus
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {countdown > 0 && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error} {countdown} saniye bekleyin.</span>
              </div>
            )}

            {error && countdown <= 0 && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || !password || countdown > 0}>
              {countdown > 0 ? `${countdown}s bekleyin` : loading ? "Giris yapiliyor..." : "Giris Yap"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
