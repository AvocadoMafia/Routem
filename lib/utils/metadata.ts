import type { Metadata } from "next";
import { getClientSiteUrl } from "@/lib/env/client";

export const SITE_NAME = "Routem";
export const DEFAULT_DESCRIPTION = "Share your travel routes with the world";
export const DEFAULT_OG_IMAGE_URL =
  "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/routem-thumbnail.webp";

type BuildMetadataOptions = {
  title?: string;
  description?: string;
  image?: string | null;
  path?: string;
  type?: "website" | "article" | "profile";
};

export function buildMetadata(options: BuildMetadataOptions = {}): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    image,
    path,
    type = "website",
  } = options;

  const baseUrl = getClientSiteUrl();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const ogImage = image || DEFAULT_OG_IMAGE_URL;
  const url = path
    ? `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
    : baseUrl;

  return {
    metadataBase: new URL(baseUrl),
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage }],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png" }],
    },
    manifest: "/manifest.json",
  };
}
