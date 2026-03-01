import type { Profile } from "@/data/links";

export function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-white/20 bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
          <div className="flex h-full w-full items-center justify-center text-3xl font-bold">
            {profile.name.charAt(0)}
          </div>
        </div>
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">{profile.name}</h1>
      <p className="mt-1 text-sm text-gray-400">{profile.username}</p>
      <p className="mt-2 text-sm text-gray-300">{profile.bio}</p>
    </div>
  );
}
