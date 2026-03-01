"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";

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
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

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
        showMessage("error", "Tema yuklenemedi.");
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
        showMessage("success", "Tema kaydedildi!");
      } else {
        showMessage("error", "Tema kaydedilemedi.");
      }
    } catch {
      showMessage("error", "Bir hata olustu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tema</h1>
        {selectedTheme !== currentTheme && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        )}
      </div>

      {/* Toast message */}
      {message && (
        <div
          className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Theme grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          const isCurrent = currentTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`relative text-left rounded-xl border-2 p-1 transition-all ${
                isSelected
                  ? "border-purple-500 ring-2 ring-purple-500/20"
                  : "border-white/10 hover:border-white/20"
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
                <div
                  className={`text-[10px] ${theme.subtextColor}`}
                >
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
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white text-sm">
                    {theme.name}
                  </h3>
                  {isCurrent && (
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {theme.description}
                </p>
              </div>

              {/* Selected check */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
