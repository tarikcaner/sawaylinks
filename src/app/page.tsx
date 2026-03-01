"use client";

import { useEffect, useState } from "react";
import { getTheme } from "@/lib/themes";
import type { Theme } from "@/lib/themes";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
  isPinned?: boolean;
  order: number;
}

interface SiteData {
  profile: {
    name: string;
    username: string;
    bio: string;
    avatar: string;
  };
  theme: string;
  links: LinkItem[];
}

export default function Home() {
  const [data, setData] = useState<SiteData | null>(null);
  const [theme, setTheme] = useState<Theme>(getTheme("midnight"));

  useEffect(() => {
    fetch("/api/site")
      .then((r) => r.json())
      .then((d: SiteData) => {
        setData(d);
        setTheme(getTheme(d.theme));
      })
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
      </div>
    );
  }

  const pinnedLinks = data.links.filter((l) => l.isPinned).sort((a, b) => a.order - b.order);
  const otherLinks = data.links.filter((l) => !l.isPinned).sort((a, b) => a.order - b.order);

  return (
    <div className={`${theme.bodyClass} antialiased`}>
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center px-4 py-10">
        {/* Profile */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className={`h-24 w-24 overflow-hidden rounded-full ${theme.avatarBorderClass} ${theme.avatarGradientClass}`}>
              {data.profile.avatar ? (
                <img
                  src={data.profile.avatar}
                  alt={data.profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
                  {data.profile.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <h1 className={`mt-4 ${theme.nameClass}`}>{data.profile.name}</h1>
          <p className={`mt-1 ${theme.usernameClass}`}>{data.profile.username}</p>
          <p className={`mt-2 ${theme.bioClass}`}>{data.profile.bio}</p>
        </div>

        {/* Links */}
        <div className="mt-8 w-full space-y-3">
          {pinnedLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex w-full items-center justify-center px-6 py-4 text-center font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${theme.cardClass} ${theme.cardPinnedClass}`}
            >
              <span className="text-sm sm:text-base">{link.title}</span>
              <svg className={`absolute right-4 h-4 w-4 ${theme.cardHoverClass} opacity-0 transition-opacity group-hover:opacity-100`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
          {otherLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex w-full items-center justify-center px-6 py-4 text-center font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${theme.cardClass}`}
            >
              <span className="text-sm sm:text-base">{link.title}</span>
              <svg className={`absolute right-4 h-4 w-4 ${theme.cardHoverClass} opacity-0 transition-opacity group-hover:opacity-100`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>

        <footer className={`mt-12 pb-6 text-center text-xs ${theme.footerClass}`}>
          <p>&copy; {new Date().getFullYear()} {data.profile.name}</p>
        </footer>
      </main>
    </div>
  );
}
