import { skillGroups, coreSkills, tierFill } from "@/lib/profile";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 py-14">
      <SectionHeading eyebrow="03 — Toolbox" title="Skills" />

      <div className="mb-5 rounded-2xl border border-black/[.06] bg-white/60 p-6 backdrop-blur-xl sm:p-8 dark:border-white/[.08] dark:bg-white/[.03]">
        <p className="mb-5 font-mono text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
          Core skills
        </p>
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {coreSkills.map((skill) => (
            <div key={skill.name}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{skill.name}</span>
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
                  {skill.tier} · {skill.years}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-900/[.06] dark:bg-white/[.08]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-white"
                  style={{ width: `${tierFill(skill.tier)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

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
