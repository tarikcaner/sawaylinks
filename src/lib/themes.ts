export interface Theme {
  id: string;
  name: string;
  description: string;
  // Body/page styles
  bodyClass: string;
  // Profile text styles
  nameClass: string;
  usernameClass: string;
  bioClass: string;
  // Avatar styles
  avatarBorderClass: string;
  avatarGradientClass: string;
  // Link card styles
  cardClass: string;
  cardPinnedClass: string;
  cardHoverClass: string;
  // Footer styles
  footerClass: string;
}

export const themes: Record<string, Theme> = {
  midnight: {
    id: "midnight",
    name: "Midnight",
    description: "Koyu gradient, cam efektli kartlar",
    bodyClass: "min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white",
    nameClass: "text-2xl font-bold tracking-tight text-white",
    usernameClass: "text-sm text-gray-400",
    bioClass: "text-sm text-gray-300",
    avatarBorderClass: "border-2 border-white/20",
    avatarGradientClass: "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20",
    cardClass: "border border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-2xl",
    cardPinnedClass: "border-white/15 bg-white/10 shadow-lg shadow-white/5 hover:bg-white/15 hover:shadow-white/10",
    cardHoverClass: "text-gray-500",
    footerClass: "text-gray-500",
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    description: "Derin mavi, okyanus tonları",
    bodyClass: "min-h-screen bg-gradient-to-br from-blue-950 via-cyan-900 to-blue-950 text-white",
    nameClass: "text-2xl font-bold tracking-tight text-white",
    usernameClass: "text-sm text-cyan-300",
    bioClass: "text-sm text-cyan-200",
    avatarBorderClass: "border-2 border-cyan-400/30",
    avatarGradientClass: "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20",
    cardClass: "border border-cyan-400/15 bg-cyan-500/10 text-white hover:bg-cyan-500/15 rounded-2xl",
    cardPinnedClass: "border-cyan-400/20 bg-cyan-500/15 shadow-lg shadow-cyan-500/10 hover:bg-cyan-500/20",
    cardHoverClass: "text-cyan-400",
    footerClass: "text-cyan-600",
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    description: "Sıcak tonlar, gün batımı",
    bodyClass: "min-h-screen bg-gradient-to-br from-orange-950 via-rose-900 to-purple-950 text-white",
    nameClass: "text-2xl font-bold tracking-tight text-white",
    usernameClass: "text-sm text-orange-300",
    bioClass: "text-sm text-orange-200",
    avatarBorderClass: "border-2 border-orange-400/30",
    avatarGradientClass: "bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-500/20",
    cardClass: "border border-orange-400/15 bg-orange-500/10 text-white hover:bg-orange-500/15 rounded-2xl",
    cardPinnedClass: "border-orange-400/20 bg-orange-500/15 shadow-lg shadow-orange-500/10 hover:bg-orange-500/20",
    cardHoverClass: "text-orange-400",
    footerClass: "text-orange-600",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Temiz, beyaz, minimalist",
    bodyClass: "min-h-screen bg-gray-50 text-gray-900",
    nameClass: "text-2xl font-bold tracking-tight text-gray-900",
    usernameClass: "text-sm text-gray-500",
    bioClass: "text-sm text-gray-600",
    avatarBorderClass: "border-2 border-gray-200",
    avatarGradientClass: "bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg shadow-gray-300",
    cardClass: "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:shadow-md rounded-2xl",
    cardPinnedClass: "border-gray-300 bg-white shadow-md text-gray-900 hover:shadow-lg",
    cardHoverClass: "text-gray-400",
    footerClass: "text-gray-400",
  },
};

export function getTheme(id: string): Theme {
  return themes[id] || themes.midnight;
}
