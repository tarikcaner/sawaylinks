"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Save } from "lucide-react";

const themes = [
  {
    id: "midnight",
    name: "Midnight",
    description: "Koyu gradyan, cam efektli kartlar",
    bg: "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950",
    cardBg: "bg-white/10 backdrop-blur-sm",
    cardBorder: "border-white/20",
    textColor: "text-white",
    subtextColor: "text-gray-300",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Derin mavi, turkuaz tonlari",
    bg: "bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900",
    cardBg: "bg-white/10 backdrop-blur-sm",
    cardBorder: "border-cyan-400/20",
    textColor: "text-white",
    subtextColor: "text-cyan-200",
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Sicak tonlar, turuncu ve pembe",
    bg: "bg-gradient-to-br from-orange-950 via-rose-900 to-pink-900",
    cardBg: "bg-white/10 backdrop-blur-sm",
    cardBorder: "border-orange-400/20",
    textColor: "text-white",
    subtextColor: "text-orange-200",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Temiz, beyaz arka plan",
    bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
    cardBg: "bg-white",
    cardBorder: "border-gray-200",
    textColor: "text-gray-900",
    subtextColor: "text-gray-500",
  },
];

export default function AdminThemePage() {
  const { authFetch } = useAdmin();
  const [currentTheme, setCurrentTheme] = useState("midnight");
  const [selectedTheme, setSelectedTheme] = useState("midnight");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await fetch("/api/theme");
        const data = await res.json();
        if (data.theme) {
          setCurrentTheme(data.theme);
          setSelectedTheme(data.theme);
        }
      } catch {
        toast.error("Tema yuklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchTheme();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authFetch("/api/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: selectedTheme }),
      });
      if (res.ok) {
        setCurrentTheme(selectedTheme);
        toast.success("Tema kaydedildi!");
      } else {
        toast.error("Tema kaydedilemedi.");
      }
    } catch {
      toast.error("Bir hata olustu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tema</h1>
        {selectedTheme !== currentTheme && (
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Kaydet
              </>
            )}
          </Button>
        )}
      </div>

      {/* Theme grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const isCurrent = currentTheme === theme.id;

          return (
            <Card
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`relative cursor-pointer p-1 transition-all ${
                isSelected
                  ? "ring-2 ring-primary border-primary"
                  : "hover:border-ring/50"
              }`}
            >
              {/* Mini preview */}
              <div
                className={`rounded-lg ${theme.bg} p-4 aspect-[4/3] flex flex-col items-center justify-center gap-2`}
              >
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-gray-500/30 ring-2 ring-white/20" />
                {/* Name placeholder */}
                <div
                  className={`text-xs font-semibold ${theme.textColor}`}
                >
                  Saway
                </div>
                <div className={`text-[10px] ${theme.subtextColor}`}>
                  @saway
                </div>
                {/* Card placeholders */}
                <div className="w-full max-w-[140px] space-y-1.5 mt-1">
                  <div
                    className={`h-6 rounded-md border ${theme.cardBg} ${theme.cardBorder}`}
                  />
                  <div
                    className={`h-6 rounded-md border ${theme.cardBg} ${theme.cardBorder}`}
                  />
                  <div
                    className={`h-6 rounded-md border ${theme.cardBg} ${theme.cardBorder}`}
                  />
                </div>
              </div>

              {/* Theme info */}
              <div className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">
                    {theme.name}
                  </h3>
                  {isCurrent && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0"
                    >
                      Aktif
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {theme.description}
                </p>
              </div>

              {/* Selected check */}
              {isSelected && (
                <div className="absolute top-3 right-3 size-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="size-3.5 text-primary-foreground" />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
