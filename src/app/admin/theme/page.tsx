"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Check, Loader2, Save, Smartphone, Settings2 } from "lucide-react";
import {
  themes as themeConfigs,
  getTheme,
  buttonStyles,
  fontStyles,
  avatarShapes,
  defaultCustomization,
  type Theme,
  type ThemeCustomization,
} from "@/lib/themes";

interface SiteProfile {
  name: string;
  username: string;
  bio: string;
  avatar: string;
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
  isPinned?: boolean;
  order: number;
}

// Phone preview component
function PhonePreview({
  theme,
  customization,
  profile,
  links,
}: {
  theme: Theme;
  customization: ThemeCustomization;
  profile: SiteProfile;
  links: LinkItem[];
}) {
  const btnStyle = buttonStyles[customization.buttonStyle] || buttonStyles.rounded;
  const fontClass = fontStyles[customization.fontStyle]?.class || "";
  const avatarShape = avatarShapes[customization.avatarShape]?.class || "rounded-full";

  const pinnedLinks = links.filter((l) => l.isPinned).sort((a, b) => a.order - b.order).slice(0, 3);
  const otherLinks = links.filter((l) => !l.isPinned).sort((a, b) => a.order - b.order).slice(0, 2);
  const displayLinks = [...pinnedLinks, ...otherLinks];

  return (
    <div className="relative mx-auto w-[280px]">
      {/* Phone frame */}
      <div className="rounded-[2.5rem] border-[6px] border-gray-700 bg-gray-800 p-1 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-700 rounded-b-2xl z-10" />
        {/* Screen */}
        <div className={`rounded-[2rem] overflow-hidden ${fontClass}`}>
          <div className={`${theme.bodyClass} px-4 pt-10 pb-6 antialiased`} style={{ minHeight: "520px" }}>
            {/* Profile */}
            <div className="flex flex-col items-center text-center">
              <div className={`h-16 w-16 overflow-hidden ${avatarShape} ${theme.avatarBorderClass} ${theme.avatarGradientClass}`}>
                {profile.avatar ? (
                  <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                    {profile.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <h2 className={`mt-3 text-base font-bold ${theme.nameClass.replace("text-2xl", "text-base")}`}>
                {profile.name || "My Brand"}
              </h2>
              <p className={`mt-0.5 text-[10px] ${theme.usernameClass}`}>
                {profile.username || "@mybrand"}
              </p>
              <p className={`mt-1 text-[10px] ${theme.bioClass}`}>
                {profile.bio || "Welcome"}
              </p>
            </div>

            {/* Links */}
            <div className="mt-4 space-y-2">
              {displayLinks.map((link, i) => (
                <div
                  key={link.id || i}
                  className={`flex items-center justify-center px-3 py-2.5 text-center text-[11px] font-medium transition-all ${theme.cardClass} ${btnStyle.class} ${link.isPinned ? theme.cardPinnedClass : ""}`}
                >
                  {link.title || "Link"}
                </div>
              ))}
              {displayLinks.length === 0 && (
                <>
                  <div className={`flex items-center justify-center px-3 py-2.5 text-[11px] font-medium ${theme.cardClass} ${btnStyle.class}`}>
                    Instagram
                  </div>
                  <div className={`flex items-center justify-center px-3 py-2.5 text-[11px] font-medium ${theme.cardClass} ${btnStyle.class}`}>
                    Website
                  </div>
                  <div className={`flex items-center justify-center px-3 py-2.5 text-[11px] font-medium ${theme.cardClass} ${btnStyle.class}`}>
                    TikTok
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {!customization.hideFooter && (
              <div className={`mt-6 text-center text-[9px] ${theme.footerClass}`}>
                &copy; 2024 {profile.name || "My Brand"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Theme preview thumbnails data for the grid
const themeList = Object.values(themeConfigs);

const themePreviews: Record<string, { bg: string; cardBg: string; cardBorder: string; textColor: string; subtextColor: string }> = {
  midnight: { bg: "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950", cardBg: "bg-white/10", cardBorder: "border-white/20", textColor: "text-white", subtextColor: "text-gray-300" },
  ocean: { bg: "bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900", cardBg: "bg-white/10", cardBorder: "border-cyan-400/20", textColor: "text-white", subtextColor: "text-cyan-200" },
  sunset: { bg: "bg-gradient-to-br from-orange-950 via-rose-900 to-pink-900", cardBg: "bg-white/10", cardBorder: "border-orange-400/20", textColor: "text-white", subtextColor: "text-orange-200" },
  minimal: { bg: "bg-gradient-to-br from-gray-50 via-white to-gray-100", cardBg: "bg-white", cardBorder: "border-gray-200", textColor: "text-gray-900", subtextColor: "text-gray-500" },
  neon: { bg: "bg-black", cardBg: "bg-green-500/10", cardBorder: "border-green-500/30", textColor: "text-green-400", subtextColor: "text-green-300/70" },
  pastel: { bg: "bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100", cardBg: "bg-white/70", cardBorder: "border-purple-200", textColor: "text-gray-800", subtextColor: "text-purple-500" },
  forest: { bg: "bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950", cardBg: "bg-emerald-500/10", cardBorder: "border-emerald-400/20", textColor: "text-white", subtextColor: "text-emerald-300" },
  lavender: { bg: "bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950", cardBg: "bg-violet-500/10", cardBorder: "border-violet-400/20", textColor: "text-white", subtextColor: "text-violet-300" },
};

export default function AdminThemePage() {
  const { authFetch } = useAdmin();
  const [currentTheme, setCurrentTheme] = useState("midnight");
  const [selectedTheme, setSelectedTheme] = useState("midnight");
  const [customization, setCustomization] = useState<ThemeCustomization>(defaultCustomization);
  const [savedCustomization, setSavedCustomization] = useState<ThemeCustomization>(defaultCustomization);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<SiteProfile>({ name: "", username: "", bio: "", avatar: "" });
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [mobileTab, setMobileTab] = useState<"themes" | "preview">("themes");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [themeRes, siteRes] = await Promise.all([
          fetch("/api/theme"),
          fetch("/api/site"),
        ]);
        const themeData = await themeRes.json();
        const siteData = await siteRes.json();

        if (themeData.theme) {
          setCurrentTheme(themeData.theme);
          setSelectedTheme(themeData.theme);
        }
        if (themeData.customization) {
          setCustomization(themeData.customization);
          setSavedCustomization(themeData.customization);
        }
        if (siteData.profile) {
          setProfile(siteData.profile);
        }
        if (siteData.links) {
          setLinks(siteData.links);
        }
      } catch {
        toast.error("Tema yuklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hasChanges =
    selectedTheme !== currentTheme ||
    JSON.stringify(customization) !== JSON.stringify(savedCustomization);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authFetch("/api/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: selectedTheme, customization }),
      });
      if (res.ok) {
        setCurrentTheme(selectedTheme);
        setSavedCustomization(customization);
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

  const activeTheme = getTheme(selectedTheme);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tema</h1>
        <div className="flex items-center gap-2">
          {/* Mobile tab toggle */}
          <div className="flex sm:hidden">
            <Button
              variant={mobileTab === "themes" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setMobileTab("themes")}
            >
              <Settings2 className="size-4" />
            </Button>
            <Button
              variant={mobileTab === "preview" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setMobileTab("preview")}
            >
              <Smartphone className="size-4" />
            </Button>
          </div>
          {hasChanges && (
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
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Left: Themes + Customization */}
        <div className={`flex-1 space-y-6 ${mobileTab === "preview" ? "hidden sm:block" : ""}`}>
          {/* Theme grid */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Sablonlar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {themeList.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                const isCurrent = currentTheme === theme.id;
                const preview = themePreviews[theme.id];

                return (
                  <Card
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`relative cursor-pointer p-0.5 transition-all ${
                      isSelected ? "ring-2 ring-primary border-primary" : "hover:border-ring/50"
                    }`}
                  >
                    <div className={`rounded-md ${preview?.bg || ""} p-3 aspect-[3/4] flex flex-col items-center justify-center gap-1.5`}>
                      <div className="w-7 h-7 rounded-full bg-gray-500/30 ring-1 ring-white/20" />
                      <div className={`text-[9px] font-semibold ${preview?.textColor || "text-white"}`}>Brand</div>
                      <div className={`text-[7px] ${preview?.subtextColor || "text-gray-300"}`}>@brand</div>
                      <div className="w-full max-w-[80px] space-y-1 mt-1">
                        <div className={`h-4 rounded-sm border ${preview?.cardBg || ""} ${preview?.cardBorder || ""}`} />
                        <div className={`h-4 rounded-sm border ${preview?.cardBg || ""} ${preview?.cardBorder || ""}`} />
                      </div>
                    </div>
                    <div className="px-2 py-2">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-[11px]">{theme.name}</span>
                        {isCurrent && (
                          <Badge variant="secondary" className="text-[8px] px-1 py-0 h-3.5">Aktif</Badge>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 size-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="size-3 text-primary-foreground" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Customization options */}
          <div className="space-y-5">
            <h2 className="text-sm font-medium text-muted-foreground">Ozellestirme</h2>

            {/* Button Style */}
            <div className="space-y-2">
              <Label className="text-xs">Buton Stili</Label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(buttonStyles).map(([key, style]) => (
                  <button
                    key={key}
                    onClick={() => setCustomization((c) => ({ ...c, buttonStyle: key as ThemeCustomization["buttonStyle"] }))}
                    className={`border text-xs py-2 px-3 transition-all ${style.class} ${
                      customization.buttonStyle === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Style */}
            <div className="space-y-2">
              <Label className="text-xs">Yazi Tipi</Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(fontStyles).map(([key, style]) => (
                  <button
                    key={key}
                    onClick={() => setCustomization((c) => ({ ...c, fontStyle: key as ThemeCustomization["fontStyle"] }))}
                    className={`border rounded-lg text-xs py-2 px-3 transition-all ${style.class} ${
                      customization.fontStyle === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Shape */}
            <div className="space-y-2">
              <Label className="text-xs">Avatar Sekli</Label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(avatarShapes).map(([key, shape]) => (
                  <button
                    key={key}
                    onClick={() => setCustomization((c) => ({ ...c, avatarShape: key as ThemeCustomization["avatarShape"] }))}
                    className={`border rounded-lg text-xs py-2.5 px-3 transition-all flex items-center justify-center gap-2 ${
                      customization.avatarShape === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:bg-accent"
                    }`}
                  >
                    <div className={`size-5 bg-muted-foreground/30 ${shape.class}`} />
                    {shape.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hide Footer */}
            <div className="flex items-center justify-between">
              <Label htmlFor="hide-footer" className="text-xs cursor-pointer">Footer&apos;i gizle</Label>
              <Switch
                id="hide-footer"
                checked={customization.hideFooter}
                onCheckedChange={(checked) => setCustomization((c) => ({ ...c, hideFooter: checked }))}
              />
            </div>
          </div>
        </div>

        {/* Right: Phone Preview (sticky on desktop, tab on mobile) */}
        <div className={`sm:sticky sm:top-20 sm:self-start ${mobileTab === "themes" ? "hidden sm:block" : ""}`}>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 text-center">Onizleme</h2>
          <PhonePreview
            theme={activeTheme}
            customization={customization}
            profile={profile}
            links={links}
          />
        </div>
      </div>
    </div>
  );
}
