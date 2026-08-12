// Static-export variant of app/page.tsx, swapped in by
// .github/workflows/deploy-gh-pages.yml before `next build`. Not a route —
// Next only treats files literally named app/page.tsx as routes, and this
// file lives outside app/.
import { ProjectListClient } from "@/components/ProjectListClient";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-24 sm:px-10 sm:py-32">
      <header className="mb-20">
        <p className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-500">
          Software engineer
        </p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-transparent sm:text-6xl bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500">
          Sahil Kalgutkar
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          I build production-shaped systems end to end. Case studies below are served
          through a self-hosted GraphQL API backed by Supabase — not hardcoded.
        </p>
        <a
          href="https://github.com/sahilkalgutkar"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-950 hover:decoration-zinc-500 dark:text-zinc-300 dark:decoration-zinc-700 dark:hover:text-white dark:hover:decoration-zinc-400"
        >
          github.com/sahilkalgutkar
        </a>
      </header>

      <ProjectListClient />
    </main>
  );
}
