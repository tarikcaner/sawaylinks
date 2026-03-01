"use client";

import { useState, useEffect, useRef } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Camera, Loader2, Save } from "lucide-react";

export default function AdminProfilePage() {
  const { authFetch } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/avatar.png");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.profile) {
          setName(data.profile.name || "");
          setUsername(data.profile.username || "");
          setBio(data.profile.bio || "");
          setAvatarUrl(data.profile.avatar || "/avatar.png");
        }
      } catch {
        toast.error("Profil yuklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, bio }),
      });
      if (res.ok) {
        toast.success("Profil kaydedildi!");
      } else {
        toast.error("Profil kaydedilemedi.");
      }
    } catch {
      toast.error("Bir hata olustu.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await authFetch("/api/avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAvatarUrl(data.url);
        setAvatarPreview(null);
        toast.success("Avatar yuklendi!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Avatar yuklenemedi.");
        setAvatarPreview(null);
      }
    } catch {
      toast.error("Avatar yuklenirken hata olustu.");
      setAvatarPreview(null);
    } finally {
      setUploading(false);
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
      <h1 className="text-2xl font-bold tracking-tight">Profil</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil Fotografi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="size-20 ring-2 ring-border">
                <AvatarImage
                  src={avatarPreview || avatarUrl}
                  alt="Avatar"
                />
                <AvatarFallback className="text-lg">
                  {name?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {uploading ? (
                  <Loader2 className="size-5 text-white animate-spin" />
                ) : (
                  <Camera className="size-5 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Profil Fotografi</p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG veya WebP. Maks. 2MB.
              </p>
              <Button
                variant="link"
                size="sm"
                className="px-0 h-auto"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Yukleniyor..." : "Degistir"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bilgiler</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Isim</Label>
              <Input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adiniz"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-username">Kullanici Adi</Label>
              <Input
                id="profile-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@kullaniciadi"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-bio">Bio</Label>
              <Textarea
                id="profile-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Kendinizi tanitin..."
                rows={3}
                className="resize-none"
              />
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={saving}>
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
