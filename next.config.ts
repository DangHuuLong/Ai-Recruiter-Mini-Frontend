import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Produces a self-contained dist/standalone/ with only the deps actually used at
  // runtime — lets the Docker runner stage skip `npm install` entirely.
  output: "standalone",
};

export default withNextIntl(nextConfig);
