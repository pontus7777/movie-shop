import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  /* config options here */

  //   async redirects() {
  //   return [
  //     {
  //       source: '/admin/crew/actors/create',
  //       destination: '/admin/crew',
  //       permanent: true, // or false
  //     },
  //   ];
  // },

}

export default nextConfig
