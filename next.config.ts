import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
};

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});
module.exports = withPWA({});

export default withPWA(nextConfig);
