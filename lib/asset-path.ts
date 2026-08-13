// next/image and plain <a href> downloads don't get basePath auto-applied
// (only next/link and next/router do) — see next.config.ts for why the two
// deployments have different base paths. Mirrors the same env check there.
const BASE_PATH = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" ? "/portfolio" : "";

export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}
