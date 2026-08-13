import Image from "next/image";
import { profile, stats } from "@/lib/profile";
import { assetPath } from "@/lib/asset-path";

export function Hero() {
  return (
    <header className="pt-16 pb-20 sm:pt-20">
      <Image
        src={assetPath(profile.photo)}
        alt={profile.name}
        width={112}
        height={112}
        priority
        className="h-28 w-28 rounded-full object-cover ring-4 ring-white/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.25)] dark:ring-white/10"
      />
      <p className="mt-6 font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-500">
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

      <div className="mt-8 flex flex-wrap gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-black/[.06] bg-white/60 px-4 py-3 backdrop-blur-xl dark:border-white/[.08] dark:bg-white/[.03]"
          >
            <p className="font-display text-xl font-medium text-zinc-900 dark:text-zinc-50">
              {stat.value}
            </p>
            <p className="font-mono text-[0.65rem] tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href={assetPath(profile.resume)}
          download
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Download Resume
        </a>
        <a
          href="#projects"
          className="inline-flex items-center gap-2 rounded-full border border-black/[.12] px-5 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:border-black/[.24] hover:bg-black/[.02] dark:border-white/[.16] dark:text-zinc-200 dark:hover:border-white/[.28] dark:hover:bg-white/[.04]"
        >
          View My Work
        </a>
      </div>

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
