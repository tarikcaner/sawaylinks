import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { ThemeCustomization } from "./themes";
import { defaultCustomization } from "./themes";

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
  isPinned?: boolean;
  order: number;
}

export interface SiteData {
  profile: {
    name: string;
    username: string;
    bio: string;
    avatar: string;
  };
  theme: string;
  customization: ThemeCustomization;
  links: LinkItem[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site.json");

const DEFAULT_DATA: SiteData = {
  profile: {
    name: "My Brand",
    username: "@mybrand",
    bio: "Welcome to my links page",
    avatar: "",
  },
  theme: "midnight",
  customization: defaultCustomization,
  links: [
    {
      id: "website",
      title: "Website",
      url: "https://example.com",
      category: "social",
      isPinned: true,
      order: 0,
    },
    {
      id: "instagram",
      title: "Instagram",
      url: "https://instagram.com",
      category: "social",
      isPinned: true,
      order: 1,
    },
    {
      id: "twitter",
      title: "Twitter / X",
      url: "https://x.com",
      category: "social",
      isPinned: false,
      order: 2,
    },
  ],
};

export async function getSiteData(): Promise<SiteData> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as SiteData;
  } catch {
    // File doesn't exist or is invalid — return default and persist it
    await saveSiteData(DEFAULT_DATA);
    return DEFAULT_DATA;
  }
}

export async function saveSiteData(data: SiteData): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}
