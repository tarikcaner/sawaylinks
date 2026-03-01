export interface Theme {
  id: string;
  name: string;
  description: string;
  bodyClass: string;
  nameClass: string;
  usernameClass: string;
  bioClass: string;
  avatarBorderClass: string;
  avatarGradientClass: string;
  cardClass: string;
  cardPinnedClass: string;
  cardHoverClass: string;
  footerClass: string;
}

export interface ThemeCustomization {
  buttonStyle: "rounded" | "pill" | "square" | "outline";
  fontStyle: "sans" | "serif" | "mono";
  avatarShape: "circle" | "square" | "rounded";
  hideFooter: boolean;
}

export const defaultCustomization: ThemeCustomization = {
  buttonStyle: "rounded",
  fontStyle: "sans",
  avatarShape: "circle",
  hideFooter: false,
};

// Button style classes (applied to link cards)
export const buttonStyles: Record<string, { class: string; label: string }> = {
  rounded: { class: "rounded-2xl", label: "Yuvarlak" },
  pill: { class: "rounded-full", label: "Hap" },
  square: { class: "rounded-none", label: "Kare" },
  outline: { class: "rounded-2xl bg-transparent! border-2!", label: "Cerceve" },
};

// Font style classes
export const fontStyles: Record<string, { class: string; label: string }> = {
  sans: { class: "font-sans", label: "Sans" },
  serif: { class: "font-serif", label: "Serif" },
  mono: { class: "font-mono", label: "Mono" },
};

// Avatar shape classes
export const avatarShapes: Record<string, { class: string; label: string }> = {
  circle: { class: "rounded-full", label: "Daire" },
  square: { class: "rounded-none", label: "Kare" },
  rounded: { class: "rounded-2xl", label: "Yuvarlak Kare" },
};

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
    cardClass: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    cardPinnedClass: "border-white/15 bg-white/10 shadow-lg shadow-white/5 hover:bg-white/15",
    cardHoverClass: "text-gray-500",
    footerClass: "text-gray-500",
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    description: "Derin mavi, okyanus tonlari",
    bodyClass: "min-h-screen bg-gradient-to-br from-blue-950 via-cyan-900 to-blue-950 text-white",
    nameClass: "text-2xl font-bold tracking-tight text-white",
    usernameClass: "text-sm text-cyan-300",
    bioClass: "text-sm text-cyan-200",
    avatarBorderClass: "border-2 border-cyan-400/30",
    avatarGradientClass: "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20",
    cardClass: "border border-cyan-400/15 bg-cyan-500/10 text-white hover:bg-cyan-500/15",
    cardPinnedClass: "border-cyan-400/20 bg-cyan-500/15 shadow-lg shadow-cyan-500/10 hover:bg-cyan-500/20",
    cardHoverClass: "text-cyan-400",
    footerClass: "text-cyan-600",
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    description: "Sicak tonlar, gun batimi",
    bodyClass: "min-h-screen bg-gradient-to-br from-orange-950 via-rose-900 to-purple-950 text-white",
    nameClass: "text-2xl font-bold tracking-tight text-white",
    usernameClass: "text-sm text-orange-300",
    bioClass: "text-sm text-orange-200",
    avatarBorderClass: "border-2 border-orange-400/30",
    avatarGradientClass: "bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-500/20",
    cardClass: "border border-orange-400/15 bg-orange-500/10 text-white hover:bg-orange-500/15",
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
    cardClass: "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:shadow-md",
    cardPinnedClass: "border-gray-300 bg-white shadow-md text-gray-900 hover:shadow-lg",
    cardHoverClass: "text-gray-400",
    footerClass: "text-gray-400",
  },
  // NEW THEMES:
  neon: {
    id: "neon",
    name: "Neon",
    description: "Parlak neon isiklari, siber punk",
    bodyClass: "min-h-screen bg-black text-white",
    nameClass: "text-2xl font-bold tracking-tight text-green-400",
    usernameClass: "text-sm text-green-300/70",
    bioClass: "text-sm text-gray-400",
    avatarBorderClass: "border-2 border-green-400/50",
    avatarGradientClass: "bg-black shadow-lg shadow-green-500/30",
    cardClass: "border border-green-500/30 bg-green-500/5 text-green-400 hover:bg-green-500/10 hover:shadow-green-500/20 hover:shadow-lg",
    cardPinnedClass: "border-green-400/50 bg-green-500/10 shadow-lg shadow-green-500/20 hover:bg-green-500/15",
    cardHoverClass: "text-green-500",
    footerClass: "text-green-900",
  },
  pastel: {
    id: "pastel",
    name: "Pastel",
    description: "Yumusak pastel renkler",
    bodyClass: "min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 text-gray-800",
    nameClass: "text-2xl font-bold tracking-tight text-gray-800",
    usernameClass: "text-sm text-purple-500",
    bioClass: "text-sm text-gray-600",
    avatarBorderClass: "border-2 border-purple-200",
    avatarGradientClass: "bg-gradient-to-br from-pink-300 to-purple-400 shadow-lg shadow-purple-200",
    cardClass: "border border-purple-200 bg-white/70 backdrop-blur-sm text-gray-800 hover:bg-white/90 hover:shadow-md",
    cardPinnedClass: "border-purple-300 bg-white/80 shadow-md text-gray-800 hover:shadow-lg",
    cardHoverClass: "text-purple-400",
    footerClass: "text-purple-300",
  },
  forest: {
    id: "forest",
    name: "Forest",
    description: "Dogal yesil tonlar, orman",
    bodyClass: "min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 text-white",
    nameClass: "text-2xl font-bold tracking-tight text-white",
    usernameClass: "text-sm text-emerald-300",
    bioClass: "text-sm text-emerald-200",
    avatarBorderClass: "border-2 border-emerald-400/30",
    avatarGradientClass: "bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20",
    cardClass: "border border-emerald-400/15 bg-emerald-500/10 text-white hover:bg-emerald-500/15",
    cardPinnedClass: "border-emerald-400/20 bg-emerald-500/15 shadow-lg shadow-emerald-500/10 hover:bg-emerald-500/20",
    cardHoverClass: "text-emerald-400",
    footerClass: "text-emerald-600",
  },
  lavender: {
    id: "lavender",
    name: "Lavender",
    description: "Zarif lavanta ve mor tonlar",
    bodyClass: "min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 text-white",
    nameClass: "text-2xl font-bold tracking-tight text-white",
    usernameClass: "text-sm text-violet-300",
    bioClass: "text-sm text-violet-200",
    avatarBorderClass: "border-2 border-violet-400/30",
    avatarGradientClass: "bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20",
    cardClass: "border border-violet-400/15 bg-violet-500/10 text-white hover:bg-violet-500/15",
    cardPinnedClass: "border-violet-400/20 bg-violet-500/15 shadow-lg shadow-violet-500/10 hover:bg-violet-500/20",
    cardHoverClass: "text-violet-400",
    footerClass: "text-violet-600",
  },
};

export function getTheme(id: string): Theme {
  return themes[id] || themes.midnight;
}
