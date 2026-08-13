import { profile } from "@/lib/profile";

export function Hero() {
  return (
    <header className="pt-16 pb-20 sm:pt-20">
      <p className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-500">
        {profile.title} · {profile.location}
      </p>
      <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-transparent sm:text-6xl bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
        {profile.name}
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        5+ years designing, building, and operating cloud-native backend services and platform
        tools in production. Case studies below are served through a self-hosted GraphQL API
        backed by Supabase — not hardcoded.
      </p>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
        <a
          href={`mailto:${profile.email}`}
          className="text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-950 hover:decoration-zinc-500 dark:text-zinc-300 dark:decoration-zinc-700 dark:hover:text-white dark:hover:decoration-zinc-400"
        >
          {profile.email}
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-950 hover:decoration-zinc-500 dark:text-zinc-300 dark:decoration-zinc-700 dark:hover:text-white dark:hover:decoration-zinc-400"
        >
          GitHub
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-950 hover:decoration-zinc-500 dark:text-zinc-300 dark:decoration-zinc-700 dark:hover:text-white dark:hover:decoration-zinc-400"
        >
          LinkedIn
        </a>
      </div>
    </header>
  );
}
