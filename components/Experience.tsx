import { experience } from "@/lib/profile";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 py-14">
      <SectionHeading eyebrow="02 — Career" title="Experience" />
      <div className="flex flex-col gap-5">
        {experience.map((job) => (
          <div
            key={`${job.company}-${job.start}`}
            className="rounded-2xl border border-black/[.06] bg-white/60 p-6 backdrop-blur-xl sm:p-8 dark:border-white/[.08] dark:bg-white/[.03]"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display text-lg font-medium text-zinc-900 dark:text-zinc-50">
                {job.role} <span className="text-zinc-500 dark:text-zinc-500">— {job.company}</span>
              </h3>
              <p className="font-mono text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
                {job.start} – {job.end}
              </p>
            </div>
            <ul className="mt-4 flex flex-col gap-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {job.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-5 flex flex-wrap gap-2">
              {job.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-zinc-900/[.04] px-2.5 py-1 font-mono text-xs text-zinc-700 dark:bg-white/[.06] dark:text-zinc-300"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
