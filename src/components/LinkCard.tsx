import type { LinkItem } from "@/data/links";

export function LinkCard({ link, isPinned }: { link: LinkItem; isPinned?: boolean }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex w-full items-center justify-center rounded-2xl border px-6 py-4 text-center font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
        isPinned
          ? "border-white/15 bg-white/10 shadow-lg shadow-white/5 hover:bg-white/15 hover:shadow-white/10"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <span className="text-sm sm:text-base">{link.title}</span>
      <svg
        className="absolute right-4 h-4 w-4 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}
