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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
  isPinned?: boolean;
  order: number;
}

interface SortableLinkCardProps {
  link: LinkItem;
  index: number;
  linksCount: number;
  editingId: string | null;
  editTitle: string;
  editUrl: string;
  editCategory: string;
  editPinned: boolean;
  deletingId: string | null;
  onMoveLink: (index: number, direction: "up" | "down") => void;
  onStartEdit: (link: LinkItem) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
  onTogglePin: (link: LinkItem) => void;
  onDeleteLink: (id: string) => void;
  onSetDeletingId: (id: string | null) => void;
  onSetEditTitle: (val: string) => void;
  onSetEditUrl: (val: string) => void;
  onSetEditCategory: (val: string) => void;
  onSetEditPinned: (val: boolean) => void;
  categoryLabel: (cat?: string) => string;
}

function SortableLinkCard({
  link,
  index,
  linksCount,
  editingId,
  editTitle,
  editUrl,
  editCategory,
  editPinned,
  deletingId,
  onMoveLink,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onTogglePin,
  onDeleteLink,
  onSetDeletingId,
  onSetEditTitle,
  onSetEditUrl,
  onSetEditCategory,
  onSetEditPinned,
  categoryLabel,
}: SortableLinkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : ("auto" as const),
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`py-0 transition-colors hover:border-ring/50 ${isDragging ? "shadow-lg border-primary/50" : ""}`}
      >
        <CardContent className="p-3">
          {editingId === link.id ? (
            /* Edit mode */
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  type="text"
                  value={editTitle}
                  onChange={(e) => onSetEditTitle(e.target.value)}
                  placeholder="Baslik"
                />
                <Input
                  type="url"
                  value={editUrl}
                  onChange={(e) => onSetEditUrl(e.target.value)}
                  placeholder="URL"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={editCategory}
                  onChange={(e) => onSetEditCategory(e.target.value)}
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
                    onCheckedChange={onSetEditPinned}
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
                  onClick={onCancelEdit}
                >
                  <X className="size-4" />
                  Vazgec
                </Button>
                <Button
                  size="sm"
                  onClick={() => onSaveEdit(link.id)}
                >
                  <Check className="size-4" />
                  Kaydet
                </Button>
              </div>
            </div>
          ) : (
            /* Display mode */
            <div className="flex items-center gap-3">
              {/* Grip (drag handle) + Reorder */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  {...attributes}
                  {...listeners}
                  className="cursor-grab active:cursor-grabbing touch-none p-0.5 rounded hover:bg-muted"
                  aria-label="Surukle"
                >
                  <GripVertical className="size-4 text-muted-foreground/50" />
                </button>
                <div className="flex flex-col -space-y-0.5">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onMoveLink(index, "up")}
                    disabled={index === 0}
                    title="Yukari tasi"
                  >
                    <ChevronUp className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onMoveLink(index, "down")}
                    disabled={index === linksCount - 1}
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
                  onClick={() => onTogglePin(link)}
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
                  onClick={() => onStartEdit(link)}
                  title="Duzenle"
                >
                  <Pencil className="size-3.5" />
                </Button>

                {deletingId === link.id ? (
                  <div className="flex items-center gap-1 ml-1">
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => onDeleteLink(link.id)}
                    >
                      Sil
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onSetDeletingId(null)}
                    >
                      Iptal
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onSetDeletingId(link.id)}
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
    </div>
  );
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

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);

    const newLinks = arrayMove(links, oldIndex, newIndex);
    setLinks(newLinks);

    const ids = newLinks.map((l) => l.id);
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            {links.map((link, index) => (
              <SortableLinkCard
                key={link.id}
                link={link}
                index={index}
                linksCount={links.length}
                editingId={editingId}
                editTitle={editTitle}
                editUrl={editUrl}
                editCategory={editCategory}
                editPinned={editPinned}
                deletingId={deletingId}
                onMoveLink={moveLink}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onSaveEdit={saveEdit}
                onTogglePin={togglePin}
                onDeleteLink={deleteLink}
                onSetDeletingId={setDeletingId}
                onSetEditTitle={setEditTitle}
                onSetEditUrl={setEditUrl}
                onSetEditCategory={setEditCategory}
                onSetEditPinned={setEditPinned}
                categoryLabel={categoryLabel}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
