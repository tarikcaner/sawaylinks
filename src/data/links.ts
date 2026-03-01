export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
  isPinned?: boolean;
}

export interface Profile {
  name: string;
  username: string;
  bio: string;
  avatar: string;
}

export const profile: Profile = {
  name: "Saway",
  username: "@saway",
  bio: "Şıklığın Adresi ✨",
  avatar: "/avatar.png",
};

export const links: LinkItem[] = [
  {
    id: "website",
    title: "🌐 Web Sitemiz",
    url: "https://www.saway.com.tr",
    category: "social",
    isPinned: true,
  },
  {
    id: "instagram",
    title: "📸 Instagram",
    url: "https://instagram.com/saway",
    category: "social",
    isPinned: true,
  },
  {
    id: "tiktok",
    title: "🎵 TikTok",
    url: "https://tiktok.com/@saway",
    category: "social",
    isPinned: true,
  },
  {
    id: "twitter",
    title: "🐦 Twitter / X",
    url: "https://x.com/saway",
    category: "social",
  },
  {
    id: "bestsellers",
    title: "🔥 Çok Satanlar",
    url: "https://www.saway.com.tr/cok-satanlar",
    category: "shop",
    isPinned: true,
  },
  {
    id: "newseason",
    title: "🆕 Yeni Sezon",
    url: "https://www.saway.com.tr/yeni-sezon",
    category: "shop",
  },
  {
    id: "sale",
    title: "💰 İndirimli Ürünler",
    url: "https://www.saway.com.tr/indirim",
    category: "shop",
  },
];
