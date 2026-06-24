import "@FC237/env/web";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  webpack: (config) => {
    if (process.env.DISABLE_WEBPACK_FS_CACHE === "1") {
      config.cache = false;
    }

    return config;
  },
};

export default withMDX(nextConfig);
