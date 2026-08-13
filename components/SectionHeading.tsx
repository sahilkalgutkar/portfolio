export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-2xl font-medium text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
    </div>
  );
}
