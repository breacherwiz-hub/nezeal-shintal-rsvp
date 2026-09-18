/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,

  basePath: isProd ? '/nezeal-shintal-rsvp' : '',
  assetPrefix: isProd ? '/nezeal-shintal-rsvp/' : '',

  images: {
    unoptimized: true,
  },
};

export default nextConfig;