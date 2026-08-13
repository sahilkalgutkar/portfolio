import { summary } from "@/lib/profile";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="about" className="scroll-mt-20 py-14">
      <SectionHeading eyebrow="01 — Summary" title="About" />
      <div className="rounded-2xl border border-black/[.06] bg-white/60 p-6 backdrop-blur-xl sm:p-8 dark:border-white/[.08] dark:bg-white/[.03]">
        <div className="flex flex-col gap-4 text-base leading-7 text-zinc-700 dark:text-zinc-300">
          {summary.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
