import { createMDX } from 'fumadocs-mdx/next';
import { fileURLToPath } from 'node:url';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  serverExternalPackages: ['@takumi-rs/image-response', '@rlz/preset-transform', 'ts-morph'],
  reactStrictMode: true,
  turbopack: {
    root: fileURLToPath(new URL('../../', import.meta.url)),
  },
  experimental: {
    // A relocated workspace can leave stale absolute paths in the dev cache.
    turbopackFileSystemCacheForDev: false,
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/docs/:path*',
      },
    ];
  },
};

export default withMDX(config);
