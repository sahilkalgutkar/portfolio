import type { NextConfig } from "next";

// Set by .github/workflows/deploy-gh-pages.yml only. The Vercel build never
// sets this, so Vercel keeps full SSR + the /api/graphql route.
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStaticExport && {
    output: "export",
    // Repo is "portfolio", so GitHub Pages serves it as a project page at
    // <username>.github.io/portfolio — update this if the repo is renamed.
    basePath: "/portfolio",
    trailingSlash: true,
    // Image Optimization needs a server, which static export doesn't have.
    images: { unoptimized: true },
  }),
};

export default nextConfig;
