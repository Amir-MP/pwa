/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, { "react-signature-canvas": "react-signature-canvas" }];
    return config;
  },
  experimental: {
    esmExternals: 'loose' // This might help with module loading
  }
};

module.exports = nextConfig; 