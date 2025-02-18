/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, { "react-signature-canvas": "react-signature-canvas" }];
    return config;
  },
};

module.exports = nextConfig; 