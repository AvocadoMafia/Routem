import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  allowedDevOrigins: ['192.168.10.101'],
  /* config options here */
  images: {
    remotePatterns: [
      // dev: MinIO (http://localhost:9000) の画像
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.10.101',
        port: '9000',
        pathname: '/**',
      },
      // prod: OCI Object Storage
      {
        protocol: 'https',
        hostname: '*.oraclecloud.com',
        pathname: '/**',
      },
      // OAuth プロバイダのアバター
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      // mock / プレースホルダ画像
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
    ],
  },

};

export default withNextIntl(nextConfig);
