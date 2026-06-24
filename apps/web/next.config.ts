import "@FC237/env/web";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
};

export default withMDX(nextConfig);
