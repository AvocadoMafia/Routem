import type { NextConfig } from "next";
// MinIO の画像URLで使うホストが remotePatterns に入っていないと、
// Next.js の Image コンポーネントで外部画像を表示できない。
// そのため、MinIO の公開URLで使う host:port を images.remotePatterns に追加する。
const minioUrl = process.env.MINIO_PUBLIC_ENDPOINT ?? process.env.MINIO_ENDPOINT;
const minioPattern: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number] | null = (() => {
  if (!minioUrl) return null;
  const parsed = new URL(minioUrl);
  return {
    protocol: parsed.protocol === "https:" ? "https" : "http",
    hostname: parsed.hostname,
    port: parsed.port,
    pathname: "/**",
  };
})();

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // 開発用の MinIO が private IP 上にあるため、ローカルネットワーク内の画像最適化を許可する
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      ...(minioPattern ? [minioPattern] : []),
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
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

export default nextConfig;
