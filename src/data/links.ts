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

// Default example data — overridden by data/site.json at runtime
export const profile: Profile = {
  name: "My Brand",
  username: "@mybrand",
  bio: "Welcome to my links page",
  avatar: "",
};

export const links: LinkItem[] = [
  {
    id: "website",
    title: "Website",
    url: "https://example.com",
    category: "social",
    isPinned: true,
  },
  {
    id: "instagram",
    title: "Instagram",
    url: "https://instagram.com",
    category: "social",
    isPinned: true,
  },
  {
    id: "tiktok",
    title: "TikTok",
    url: "https://tiktok.com",
    category: "social",
    isPinned: true,
  },
  {
    id: "twitter",
    title: "Twitter / X",
    url: "https://x.com",
    category: "social",
  },
];
