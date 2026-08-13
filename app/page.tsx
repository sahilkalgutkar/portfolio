import { ProfilePage } from "@/components/ProfilePage";
import { ProjectListServer } from "@/components/ProjectListServer";

// Without this, the route can get classified as static-with-fallback and
// cache its first render indefinitely instead of hitting Supabase fresh on
// every request. The GitHub Pages build overwrites this whole file (see
// .github/workflows/deploy-gh-pages.yml) with a client-fetching variant, so
// this only ever applies to the Vercel deployment.
export const dynamic = "force-dynamic";

export default function Home() {
  return <ProfilePage projects={<ProjectListServer />} />;
}
