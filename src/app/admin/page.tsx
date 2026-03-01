"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/hooks/useAdmin";

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
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      const sorted = (data.links || []).sort(
        (a: LinkItem, b: LinkItem) => a.order - b.order
      );
      setLinks(sorted);
    } catch {
      showMessage("error", "Linkler yuklenemedi.");
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
        showMessage("success", "Link eklendi!");
        setFormTitle("");
        setFormUrl("");
        setFormCategory("social");
        setFormPinned(false);
        setShowForm(false);
        await fetchLinks();
      } else {
        showMessage("error", "Link eklenemedi.");
      }
    } catch {
      showMessage("error", "Bir hata olustu.");
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
        showMessage("success", "Link guncellendi!");
        setEditingId(null);
        await fetchLinks();
      } else {
        showMessage("error", "Guncelleme basarisiz.");
      }
    } catch {
      showMessage("error", "Bir hata olustu.");
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
      showMessage("error", "Bir hata olustu.");
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const res = await authFetch(`/api/links/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showMessage("success", "Link silindi!");
        setDeletingId(null);
        await fetchLinks();
      } else {
        showMessage("error", "Silme basarisiz.");
      }
    } catch {
      showMessage("error", "Bir hata olustu.");
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
      showMessage("error", "Siralama guncellenemedi.");
      await fetchLinks();
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
        <h1 className="text-2xl font-bold">Linkler</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-medium rounded-lg transition-all"
        >
          {showForm ? "Vazgec" : "Yeni Link Ekle"}
        </button>
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

      {/* Add link form */}
      {showForm && (
        <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Yeni Link</h2>
          <form onSubmit={handleAddLink} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Baslik
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Link basligi"
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  URL
                </label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Kategori
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="social">Sosyal Medya</option>
                  <option value="shop">Magaza</option>
                  <option value="other">Diger</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                  <input
                    type="checkbox"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300">Sabitlensin</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all"
              >
                {formSubmitting ? "Ekleniyor..." : "Ekle"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links list */}
      <div className="space-y-3">
        {links.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            Henuz link eklenmemis.
          </div>
        )}

        {links.map((link, index) => (
          <div
            key={link.id}
            className="bg-gray-800/50 border border-white/10 rounded-xl p-4 transition-all hover:border-white/20"
          >
            {editingId === link.id ? (
              /* Edit mode */
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  <input
                    type="url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  >
                    <option value="social">Sosyal Medya</option>
                    <option value="shop">Magaza</option>
                    <option value="other">Diger</option>
                  </select>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editPinned}
                      onChange={(e) => setEditPinned(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-gray-800 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">Sabitlensin</span>
                  </label>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1.5 text-sm text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all"
                  >
                    Vazgec
                  </button>
                  <button
                    onClick={() => saveEdit(link.id)}
                    className="px-3 py-1.5 text-sm text-white bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-lg transition-all"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            ) : (
              /* Display mode */
              <div className="flex items-center gap-3">
                {/* Reorder buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveLink(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Yukari tasi"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveLink(index, "down")}
                    disabled={index === links.length - 1}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Asagi tasi"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Link info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white truncate">
                      {link.title}
                    </h3>
                    {link.isPinned && (
                      <span className="shrink-0 text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                        Sabit
                      </span>
                    )}
                    {link.category && (
                      <span className="shrink-0 text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
                        {link.category === "social"
                          ? "Sosyal"
                          : link.category === "shop"
                          ? "Magaza"
                          : "Diger"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{link.url}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePin(link)}
                    className={`p-2 rounded-lg transition-all ${
                      link.isPinned
                        ? "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                    title={link.isPinned ? "Sabitlemeyi kaldir" : "Sabitle"}
                  >
                    <svg
                      className="w-4 h-4"
                      fill={link.isPinned ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => startEdit(link)}
                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    title="Duzenle"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  {deletingId === link.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="px-2 py-1 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all"
                      >
                        Sil
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-700/50 rounded-lg transition-all"
                      >
                        Iptal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(link.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Sil"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
