"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Pin,
  ExternalLink,
  X,
  Check,
  Loader2,
} from "lucide-react";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
  isPinned?: boolean;
  order: number;
}

export default function AdminLinksPage() {
  const { authFetch } = useAdmin();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New link form
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formCategory, setFormCategory] = useState("social");
  const [formPinned, setFormPinned] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPinned, setEditPinned] = useState(false);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      const sorted = (data.links || []).sort(
        (a: LinkItem, b: LinkItem) => a.order - b.order
      );
      setLinks(sorted);
    } catch {
      toast.error("Linkler yuklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const res = await authFetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          url: formUrl,
          category: formCategory,
          isPinned: formPinned,
        }),
      });
      if (res.ok) {
        toast.success("Link eklendi!");
        setFormTitle("");
        setFormUrl("");
        setFormCategory("social");
        setFormPinned(false);
        setShowForm(false);
        await fetchLinks();
      } else {
        toast.error("Link eklenemedi.");
      }
    } catch {
      toast.error("Bir hata olustu.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const startEdit = (link: LinkItem) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditCategory(link.category || "other");
    setEditPinned(link.isPinned || false);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await authFetch(`/api/links/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          url: editUrl,
          category: editCategory,
          isPinned: editPinned,
        }),
      });
      if (res.ok) {
        toast.success("Link guncellendi!");
        setEditingId(null);
        await fetchLinks();
      } else {
        toast.error("Guncelleme basarisiz.");
      }
    } catch {
      toast.error("Bir hata olustu.");
    }
  };

  const togglePin = async (link: LinkItem) => {
    try {
      const res = await authFetch(`/api/links/${link.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !link.isPinned }),
      });
      if (res.ok) {
        await fetchLinks();
      }
    } catch {
      toast.error("Bir hata olustu.");
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const res = await authFetch(`/api/links/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Link silindi!");
        setDeletingId(null);
        await fetchLinks();
      } else {
        toast.error("Silme basarisiz.");
      }
    } catch {
      toast.error("Bir hata olustu.");
    }
  };

  const moveLink = async (index: number, direction: "up" | "down") => {
    const newLinks = [...links];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newLinks.length) return;

    [newLinks[index], newLinks[swapIndex]] = [
      newLinks[swapIndex],
      newLinks[index],
    ];

    const ids = newLinks.map((l) => l.id);
    setLinks(newLinks);

    try {
      await authFetch("/api/links/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
    } catch {
      toast.error("Siralama guncellenemedi.");
      await fetchLinks();
    }
  };

  const categoryLabel = (cat?: string) => {
    switch (cat) {
      case "social":
        return "Sosyal";
      case "shop":
        return "Magaza";
      default:
        return "Diger";
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
        <h1 className="text-2xl font-bold tracking-tight">Linkler</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "default"}
          size="sm"
        >
          {showForm ? (
            <>
              <X className="size-4" />
              Vazgec
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Yeni Link Ekle
            </>
          )}
        </Button>
      </div>

      {/* Add link form */}
      {showForm && (
        <Card className="border-dashed">
          <CardContent>
            <h2 className="text-base font-semibold mb-4">Yeni Link</h2>
            <form onSubmit={handleAddLink} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="form-title">Baslik</Label>
                  <Input
                    id="form-title"
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Link basligi"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form-url">URL</Label>
                  <Input
                    id="form-url"
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="form-category">Kategori</Label>
                  <select
                    id="form-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30"
                  >
                    <option value="social">Sosyal Medya</option>
                    <option value="shop">Magaza</option>
                    <option value="other">Diger</option>
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="form-pinned"
                      checked={formPinned}
                      onCheckedChange={setFormPinned}
                    />
                    <Label htmlFor="form-pinned" className="cursor-pointer">
                      Sabitlensin
                    </Label>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={formSubmitting}>
                  {formSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Ekleniyor...
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" />
                      Ekle
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Links list */}
      <div className="space-y-2">
        {links.length === 0 && (
          <div className="text-center text-muted-foreground py-16">
            <p className="text-sm">Henuz link eklenmemis.</p>
          </div>
        )}

        {links.map((link, index) => (
          <Card
            key={link.id}
            className="py-0 transition-colors hover:border-ring/50"
          >
            <CardContent className="p-3">
              {editingId === link.id ? (
                /* Edit mode */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Baslik"
                    />
                    <Input
                      type="url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="URL"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30"
                    >
                      <option value="social">Sosyal Medya</option>
                      <option value="shop">Magaza</option>
                      <option value="other">Diger</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`edit-pinned-${link.id}`}
                        checked={editPinned}
                        onCheckedChange={setEditPinned}
                      />
                      <Label
                        htmlFor={`edit-pinned-${link.id}`}
                        className="cursor-pointer"
                      >
                        Sabitlensin
                      </Label>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEdit}
                    >
                      <X className="size-4" />
                      Vazgec
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => saveEdit(link.id)}
                    >
                      <Check className="size-4" />
                      Kaydet
                    </Button>
                  </div>
                </div>
              ) : (
                /* Display mode */
                <div className="flex items-center gap-3">
                  {/* Grip + Reorder */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <GripVertical className="size-4 text-muted-foreground/50" />
                    <div className="flex flex-col -space-y-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => moveLink(index, "up")}
                        disabled={index === 0}
                        title="Yukari tasi"
                      >
                        <ChevronUp className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => moveLink(index, "down")}
                        disabled={index === links.length - 1}
                        title="Asagi tasi"
                      >
                        <ChevronDown className="size-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Link info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm truncate">
                        {link.title}
                      </h3>
                      {link.isPinned && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          <Pin className="size-2.5" />
                          Sabit
                        </Badge>
                      )}
                      {link.category && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {categoryLabel(link.category)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <ExternalLink className="size-3 text-muted-foreground shrink-0" />
                      <p className="text-xs text-muted-foreground truncate">
                        {link.url}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => togglePin(link)}
                      title={
                        link.isPinned ? "Sabitlemeyi kaldir" : "Sabitle"
                      }
                      className={
                        link.isPinned
                          ? "text-primary hover:text-primary"
                          : ""
                      }
                    >
                      <Pin
                        className="size-3.5"
                        fill={link.isPinned ? "currentColor" : "none"}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => startEdit(link)}
                      title="Duzenle"
                    >
                      <Pencil className="size-3.5" />
                    </Button>

                    {deletingId === link.id ? (
                      <div className="flex items-center gap-1 ml-1">
                        <Button
                          variant="destructive"
                          size="xs"
                          onClick={() => deleteLink(link.id)}
                        >
                          Sil
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setDeletingId(null)}
                        >
                          Iptal
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setDeletingId(link.id)}
                        title="Sil"
                        className="hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
