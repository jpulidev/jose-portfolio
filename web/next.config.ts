import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pins the workspace root to this directory. Without it Turbopack walks up and
  // finds a stray package-lock.json in the home directory, outside the repo.
  turbopack: { root: import.meta.dirname },
  images: {
    // Project screenshots are served from Sanity's asset CDN.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    // Modern formats, which the old site served none of.
    formats: ['image/avif', 'image/webp'],
  },
  // Surfaces accidental `any` and unsafe patterns at build time rather than
  // letting them ship.
  typedRoutes: true,
};

export default nextConfig;
