import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray lockfile further up the tree is ignored.
  turbopack: { root: path.resolve(__dirname) },
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;
