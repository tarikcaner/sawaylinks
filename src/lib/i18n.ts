export type Language = "tr" | "en";

const translations = {
  // Nav
  "nav.links": { tr: "Linkler", en: "Links" },
  "nav.profile": { tr: "Profil", en: "Profile" },
  "nav.theme": { tr: "Tema", en: "Theme" },
  "nav.analytics": { tr: "Analitik", en: "Analytics" },
  "nav.logout": { tr: "Çıkış", en: "Logout" },

  // Links page
  "links.heading": { tr: "Linkler", en: "Links" },
  "links.addNew": { tr: "Yeni Link Ekle", en: "Add New Link" },
  "links.cancel": { tr: "Vazgeç", en: "Cancel" },
  "links.newLink": { tr: "Yeni Link", en: "New Link" },
  "links.title": { tr: "Başlık", en: "Title" },
  "links.titlePlaceholder": { tr: "Link başlığı", en: "Link title" },
  "links.url": { tr: "URL", en: "URL" },
  "links.category": { tr: "Kategori", en: "Category" },
  "links.categorySocial": { tr: "Sosyal Medya", en: "Social Media" },
  "links.categoryShop": { tr: "Mağaza", en: "Shop" },
  "links.categoryOther": { tr: "Diğer", en: "Other" },
  "links.categoryLabelSocial": { tr: "Sosyal", en: "Social" },
  "links.categoryLabelShop": { tr: "Mağaza", en: "Shop" },
  "links.categoryLabelOther": { tr: "Diğer", en: "Other" },
  "links.pinned": { tr: "Sabitlensin", en: "Pin this" },
  "links.pinnedBadge": { tr: "Sabit", en: "Pinned" },
  "links.adding": { tr: "Ekleniyor...", en: "Adding..." },
  "links.add": { tr: "Ekle", en: "Add" },
  "links.save": { tr: "Kaydet", en: "Save" },
  "links.empty": { tr: "Henüz link eklenmemiş.", en: "No links added yet." },
  "links.drag": { tr: "Sürükle", en: "Drag" },
  "links.moveUp": { tr: "Yukarı taşı", en: "Move up" },
  "links.moveDown": { tr: "Aşağı taşı", en: "Move down" },
  "links.unpin": { tr: "Sabitlemeyi kaldır", en: "Unpin" },
  "links.pin": { tr: "Sabitle", en: "Pin" },
  "links.edit": { tr: "Düzenle", en: "Edit" },
  "links.delete": { tr: "Sil", en: "Delete" },
  "links.deleteCancel": { tr: "İptal", en: "Cancel" },

  // Links toasts
  "toast.links.added": { tr: "Link eklendi!", en: "Link added!" },
  "toast.links.addFailed": { tr: "Link eklenemedi.", en: "Failed to add link." },
  "toast.links.updated": { tr: "Link güncellendi!", en: "Link updated!" },
  "toast.links.updateFailed": { tr: "Güncelleme başarısız.", en: "Update failed." },
  "toast.links.deleted": { tr: "Link silindi!", en: "Link deleted!" },
  "toast.links.deleteFailed": { tr: "Silme başarısız.", en: "Delete failed." },
  "toast.links.loadFailed": { tr: "Linkler yüklenemedi.", en: "Failed to load links." },
  "toast.links.reorderFailed": { tr: "Sıralama güncellenemedi.", en: "Failed to update order." },
  "toast.error": { tr: "Bir hata oluştu.", en: "An error occurred." },

  // Profile page
  "profile.heading": { tr: "Profil", en: "Profile" },
  "profile.photo": { tr: "Profil Fotoğrafı", en: "Profile Photo" },
  "profile.photoDesc": { tr: "JPG, PNG veya WebP. Maks. 2MB.", en: "JPG, PNG or WebP. Max 2MB." },
  "profile.photoChange": { tr: "Değiştir", en: "Change" },
  "profile.photoUploading": { tr: "Yükleniyor...", en: "Uploading..." },
  "profile.info": { tr: "Bilgiler", en: "Information" },
  "profile.name": { tr: "İsim", en: "Name" },
  "profile.namePlaceholder": { tr: "Adınız", en: "Your name" },
  "profile.username": { tr: "Kullanıcı Adı", en: "Username" },
  "profile.usernamePlaceholder": { tr: "@kullaniciadi", en: "@username" },
  "profile.bio": { tr: "Bio", en: "Bio" },
  "profile.bioPlaceholder": { tr: "Kendinizi tanıtın...", en: "Tell about yourself..." },
  "profile.save": { tr: "Kaydet", en: "Save" },
  "profile.saving": { tr: "Kaydediliyor...", en: "Saving..." },

  // Profile toasts
  "toast.profile.saved": { tr: "Profil kaydedildi!", en: "Profile saved!" },
  "toast.profile.saveFailed": { tr: "Profil kaydedilemedi.", en: "Failed to save profile." },
  "toast.profile.loadFailed": { tr: "Profil yüklenemedi.", en: "Failed to load profile." },

  // Avatar toasts
  "toast.avatar.uploaded": { tr: "Avatar yüklendi!", en: "Avatar uploaded!" },
  "toast.avatar.uploadFailed": { tr: "Avatar yüklenemedi.", en: "Failed to upload avatar." },
  "toast.avatar.uploadError": { tr: "Avatar yüklenirken hata oluştu.", en: "Error uploading avatar." },

  // Password
  "password.heading": { tr: "Şifre Değiştir", en: "Change Password" },
  "password.current": { tr: "Mevcut Şifre", en: "Current Password" },
  "password.currentPlaceholder": { tr: "Mevcut şifreniz", en: "Your current password" },
  "password.new": { tr: "Yeni Şifre", en: "New Password" },
  "password.newPlaceholder": { tr: "En az 8 karakter", en: "At least 8 characters" },
  "password.confirm": { tr: "Yeni Şifre (Tekrar)", en: "Confirm New Password" },
  "password.confirmPlaceholder": { tr: "Yeni şifrenizi tekrar girin", en: "Re-enter new password" },
  "password.change": { tr: "Şifreyi Değiştir", en: "Change Password" },
  "password.changing": { tr: "Değiştiriliyor...", en: "Changing..." },
  "toast.password.changed": { tr: "Şifre başarıyla değiştirildi!", en: "Password changed successfully!" },
  "toast.password.changeFailed": { tr: "Şifre değiştirilemedi.", en: "Failed to change password." },
  "password.minLength": { tr: "Yeni şifre en az 8 karakter olmalı.", en: "New password must be at least 8 characters." },
  "password.mismatch": { tr: "Yeni şifreler eşleşmiyor.", en: "New passwords do not match." },

  // Theme page
  "theme.heading": { tr: "Tema", en: "Theme" },
  "theme.templates": { tr: "Şablonlar", en: "Templates" },
  "theme.active": { tr: "Aktif", en: "Active" },
  "theme.customization": { tr: "Özelleştirme", en: "Customization" },
  "theme.buttonStyle": { tr: "Buton Stili", en: "Button Style" },
  "theme.fontStyle": { tr: "Yazı Tipi", en: "Font Style" },
  "theme.avatarShape": { tr: "Avatar Şekli", en: "Avatar Shape" },
  "theme.footer": { tr: "Footer", en: "Footer" },
  "theme.hideFooter": { tr: "Footer'ı gizle", en: "Hide footer" },
  "theme.footerText": { tr: "Footer Metni", en: "Footer Text" },
  "theme.footerHint": { tr: "Boş bırakılırsa varsayılan telif hakkı metni gösterilir.", en: "If left empty, default copyright text will be shown." },
  "theme.preview": { tr: "Önizleme", en: "Preview" },
  "theme.save": { tr: "Kaydet", en: "Save" },
  "theme.saving": { tr: "Kaydediliyor...", en: "Saving..." },
  "toast.theme.saved": { tr: "Tema kaydedildi!", en: "Theme saved!" },
  "toast.theme.saveFailed": { tr: "Tema kaydedilemedi.", en: "Failed to save theme." },
  "toast.theme.loadFailed": { tr: "Tema yüklenemedi.", en: "Failed to load theme." },

  // Analytics page
  "analytics.heading": { tr: "Analitik", en: "Analytics" },
  "analytics.7days": { tr: "7 Gün", en: "7 Days" },
  "analytics.14days": { tr: "14 Gün", en: "14 Days" },
  "analytics.30days": { tr: "30 Gün", en: "30 Days" },
  "analytics.views": { tr: "Görüntülenme", en: "Views" },
  "analytics.clicks": { tr: "Tıklama", en: "Clicks" },
  "analytics.avgPerDay": { tr: "ort. {n}/gün", en: "avg. {n}/day" },
  "analytics.new": { tr: "yeni", en: "new" },
  "analytics.topClicked": { tr: "En çok tıklanan", en: "Most clicked" },
  "analytics.clickCount": { tr: "{n} tıklama", en: "{n} clicks" },
  "analytics.lastNDays": { tr: "Son {n} Gün", en: "Last {n} Days" },
  "analytics.chartViews": { tr: "Görüntülenme", en: "Views" },
  "analytics.chartClicks": { tr: "Tıklama", en: "Clicks" },
  "analytics.linkPerformance": { tr: "Link Performansı", en: "Link Performance" },
  "analytics.noClicks": { tr: "Henüz tıklama verisi yok.", en: "No click data yet." },
  "analytics.today": { tr: "bugün", en: "today" },
  "analytics.average": { tr: "ortalama", en: "average" },
  "analytics.peak": { tr: "en yüksek", en: "peak" },
  "analytics.tooltipViews": { tr: "görüntülenme", en: "views" },
  "analytics.tooltipClicks": { tr: "tıklama", en: "clicks" },
  "toast.analytics.loadFailed": { tr: "Analitik verileri yüklenemedi.", en: "Failed to load analytics." },

  // Login
  "login.title": { tr: "Admin Panel", en: "Admin Panel" },
  "login.description": { tr: "Yönetim paneline erişim için şifrenizi girin", en: "Enter your password to access the admin panel" },
  "login.password": { tr: "Şifre", en: "Password" },
  "login.passwordPlaceholder": { tr: "Admin şifresi", en: "Admin password" },
  "login.submit": { tr: "Giriş Yap", en: "Sign In" },
  "login.loading": { tr: "Giriş yapılıyor...", en: "Signing in..." },
  "login.tooMany": { tr: "Çok fazla deneme.", en: "Too many attempts." },
  "login.waitSeconds": { tr: "{n} saniye bekleyin.", en: "Wait {n} seconds." },
  "login.cooldown": { tr: "{n}s bekleyin", en: "Wait {n}s" },
  "login.wrongPassword": { tr: "Yanlış şifre. Tekrar deneyin.", en: "Wrong password. Try again." },
  "login.attemptsLeft": { tr: "Yanlış şifre. {n} deneme hakkınız kaldı.", en: "Wrong password. {n} attempts left." },
  "login.connectionError": { tr: "Bağlantı hatası.", en: "Connection error." },

  // Avatar crop dialog
  "crop.title": { tr: "Fotoğrafı Kırp", en: "Crop Photo" },
  "crop.cancel": { tr: "İptal", en: "Cancel" },
  "crop.confirm": { tr: "Kırp ve Yükle", en: "Crop & Upload" },
  "crop.processing": { tr: "İşleniyor...", en: "Processing..." },

  // Language toggle
  "lang.toggle": { tr: "TR", en: "EN" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(
  key: TranslationKey,
  lang: Language,
  params?: Record<string, string | number>
): string {
  const entry = translations[key];
  let text: string = entry[lang];
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}
