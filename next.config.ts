import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/player", destination: "/", permanent: true },
      { source: "/mobilevideo/:id", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
