"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { Media } from "@/lib/types";
import { VideoModal } from "@/components/video-modal";

type Props = {
  thumbnail: Media;
  video?: Media;
  title: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/** Poster image with a play button that opens the video in a modal on demand. */
export function VideoThumb({ thumbnail, video, title, priority = false, sizes = "(min-width: 1024px) 33vw, 100vw", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    playRef.current?.focus();
  }, []);

  const image = (
    <Image
      src={thumbnail.url}
      alt={thumbnail.alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  );

  if (!video) {
    return <div className={`relative aspect-video overflow-hidden rounded-lg bg-white/5 ${className}`}>{image}</div>;
  }

  return (
    <div className={`group relative aspect-video overflow-hidden rounded-lg bg-white/5 ${className}`}>
      {image}
      <button
        ref={playRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Play video: ${title}`}
        className="absolute inset-0 flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-brand"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-black shadow-lg transition-transform group-hover:scale-110 motion-reduce:transition-none">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
      {open && <VideoModal video={video} title={title} onClose={close} />}
    </div>
  );
}
