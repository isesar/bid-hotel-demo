"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

const POSTER_URL = process.env.NEXT_PUBLIC_BG_VIDEO_POSTER;
const MP4_URL = process.env.NEXT_PUBLIC_BG_VIDEO_MP4;
const WEBM_URL = process.env.NEXT_PUBLIC_BG_VIDEO_WEBM;

export function BackgroundVideo() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop || !MP4_URL) return null;

  return (
    <video
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={POSTER_URL}
    >
      <source src={MP4_URL} type="video/mp4" />
      {WEBM_URL && <source src={WEBM_URL} type="video/webm" />}
    </video>
  );
}
