import { education, certifications } from "@/lib/profile";
import { SectionHeading } from "./SectionHeading";

export function EducationCerts() {
  return (
    <section id="education" className="scroll-mt-20 py-14">
      <SectionHeading eyebrow="05 — Background" title="Education & Certifications" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/[.06] bg-white/60 p-6 backdrop-blur-xl dark:border-white/[.08] dark:bg-white/[.03]">
          <h3 className="font-mono text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
            Education
          </h3>
          <ul className="mt-4 flex flex-col gap-4">
            {education.map((entry) => (
              <li key={entry.school}>
                <p className="font-display text-base font-medium text-zinc-900 dark:text-zinc-50">
                  {entry.degree}
                </p>
                <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{entry.school}</p>
                <p className="mt-0.5 font-mono text-xs text-zinc-500 dark:text-zinc-500">
                  {entry.start} – {entry.end}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-black/[.06] bg-white/60 p-6 backdrop-blur-xl dark:border-white/[.08] dark:bg-white/[.03]">
          <h3 className="font-mono text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-500">
            Certifications
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {certifications.map((cert) => (
              <li key={cert} className="flex gap-2.5 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
