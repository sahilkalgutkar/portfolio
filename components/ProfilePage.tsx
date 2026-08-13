import type { ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { Hero } from "./Hero";
import { About } from "./About";
import { Experience } from "./Experience";
import { Skills } from "./Skills";
import { EducationCerts } from "./EducationCerts";
import { SiteFooter } from "./SiteFooter";
import { SectionHeading } from "./SectionHeading";

// Shared by app/page.tsx (Vercel) and deploy/gh-pages/page.tsx (GitHub
// Pages) — everything here is static profile data, identical on both
// deployments. Only how `projects` gets fetched differs between them
// (in-process ProjectListServer vs. client-fetching ProjectListClient),
// so that's the one piece each page variant supplies itself.
export function ProfilePage({ projects }: { projects: ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 sm:px-10">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <section id="projects" className="scroll-mt-20 py-14">
          <SectionHeading eyebrow="04 — Selected work" title="Projects" />
          {projects}
        </section>
        <EducationCerts />
        <SiteFooter />
      </main>
    </>
  );
}
