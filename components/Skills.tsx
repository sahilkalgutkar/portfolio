import { skillGroups } from "@/lib/profile";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 py-14">
      <SectionHeading eyebrow="03 — Toolbox" title="Skills" />
      <div className="rounded-2xl border border-black/[.06] bg-white/60 p-6 backdrop-blur-xl sm:p-8 dark:border-white/[.08] dark:bg-white/[.03]">
        <dl className="flex flex-col gap-5">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <dt className="font-mono text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
                {group.label}
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-zinc-900/[.04] px-2.5 py-1 font-mono text-xs text-zinc-700 dark:bg-white/[.06] dark:text-zinc-300"
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
