import { ProjectDetailServer } from "@/components/ProjectDetailServer";

// See app/page.tsx for why force-dynamic matters here. The GitHub Pages
// build overwrites this whole file (see
// .github/workflows/deploy-gh-pages.yml) with a generateStaticParams +
// client-fetching variant, so this only ever applies to Vercel.
export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-24 sm:px-10 sm:py-32">
      <ProjectDetailServer slug={slug} />
    </main>
  );
}
