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
import { Camera, Loader2, Save, KeyRound } from "lucide-react";
import AvatarCropDialog from "@/components/admin/AvatarCropDialog";
import { useT } from "@/contexts/LanguageContext";

export default function AdminProfilePage() {
  const { authFetch } = useAdmin();
  const t = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/avatar.png");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Password change state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [changingPw, setChangingPw] = useState(false);

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
        toast.error(t("toast.profile.loadFailed"));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [t]);

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
        toast.success(t("toast.profile.saved"));
      } else {
        toast.error(t("toast.profile.saveFailed"));
      }
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropImageSrc(ev.target?.result as string);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be selected again
    e.target.value = "";
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setCropDialogOpen(false);
    setAvatarPreview(URL.createObjectURL(croppedBlob));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", croppedBlob, "avatar.jpg");

      const res = await authFetch("/api/avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAvatarUrl(data.url);
        setAvatarPreview(null);
        toast.success(t("toast.avatar.uploaded"));
      } else {
        const data = await res.json();
        toast.error(data.error || t("toast.avatar.uploadFailed"));
        setAvatarPreview(null);
      }
    } catch {
      toast.error(t("toast.avatar.uploadError"));
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
      <h1 className="text-2xl font-bold tracking-tight">{t("profile.heading")}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("profile.photo")}</CardTitle>
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
              <p className="text-sm font-medium">{t("profile.photo")}</p>
              <p className="text-xs text-muted-foreground">
                {t("profile.photoDesc")}
              </p>
              <Button
                variant="link"
                size="sm"
                className="px-0 h-auto"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? t("profile.photoUploading") : t("profile.photoChange")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("profile.info")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="profile-name">{t("profile.name")}</Label>
              <Input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("profile.namePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-username">{t("profile.username")}</Label>
              <Input
                id="profile-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("profile.usernamePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-bio">{t("profile.bio")}</Label>
              <Textarea
                id="profile-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t("profile.bioPlaceholder")}
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
                    {t("profile.saving")}
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    {t("profile.save")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("password.heading")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (newPw.length < 8) {
                toast.error(t("password.minLength"));
                return;
              }
              if (newPw !== confirmPw) {
                toast.error(t("password.mismatch"));
                return;
              }
              setChangingPw(true);
              try {
                const res = await authFetch("/api/auth/password", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
                });
                if (res.ok) {
                  toast.success(t("toast.password.changed"));
                  setCurrentPw("");
                  setNewPw("");
                  setConfirmPw("");
                } else {
                  const data = await res.json();
                  toast.error(data.error || t("toast.password.changeFailed"));
                }
              } catch {
                toast.error(t("toast.error"));
              } finally {
                setChangingPw(false);
              }
            }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="current-pw">{t("password.current")}</Label>
              <Input
                id="current-pw"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder={t("password.currentPlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pw">{t("password.new")}</Label>
              <Input
                id="new-pw"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder={t("password.newPlaceholder")}
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pw">{t("password.confirm")}</Label>
              <Input
                id="confirm-pw"
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder={t("password.confirmPlaceholder")}
                required
              />
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={changingPw}>
                {changingPw ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("password.changing")}
                  </>
                ) : (
                  <>
                    <KeyRound className="size-4" />
                    {t("password.change")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AvatarCropDialog
        open={cropDialogOpen}
        imageSrc={cropImageSrc}
        onClose={() => setCropDialogOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
