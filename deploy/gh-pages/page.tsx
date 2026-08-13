// Static-export variant of app/page.tsx, swapped in by
// .github/workflows/deploy-gh-pages.yml before `next build`. Not a route —
// Next only treats files literally named app/page.tsx as routes, and this
// file lives outside app/.
import { ProfilePage } from "@/components/ProfilePage";
import { ProjectListClient } from "@/components/ProjectListClient";

export default function Home() {
  return <ProfilePage projects={<ProjectListClient />} />;
}
