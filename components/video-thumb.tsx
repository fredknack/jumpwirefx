"use client";

import Image from "next/image";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import type { Media } from "@/lib/types";
import { VideoModal } from "@/components/video-modal";

type Props = {
  thumbnail: Media;
  video?: Media;
  title: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Mirror open state into `?video=1` so the modal is linkable (project pages). */
  linkable?: boolean;
};

const PARAM = "video";
const URL_EVENT = "jw:urlchange";

function hasVideoParam() {
  return new URLSearchParams(window.location.search).get(PARAM) === "1";
}

function setVideoParam(on: boolean) {
  const url = new URL(window.location.href);
  if (on) url.searchParams.set(PARAM, "1");
  else url.searchParams.delete(PARAM);
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  window.dispatchEvent(new Event(URL_EVENT));
}

function subscribeUrl(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(URL_EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(URL_EVENT, cb);
  };
}

/** Poster image with a play button that opens the video in a modal on demand. */
export function VideoThumb({
  thumbnail,
  video,
  title,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  className = "",
  linkable = false,
}: Props) {
  // When linkable, the URL (?video=1) is the single source of truth so the
  // modal is shareable and survives reload; otherwise plain local state.
  const urlOpen = useSyncExternalStore(subscribeUrl, hasVideoParam, () => false);
  const [stateOpen, setStateOpen] = useState(false);
  const open = linkable ? urlOpen : stateOpen;
  const playRef = useRef<HTMLButtonElement>(null);

  const show = useCallback(() => {
    if (linkable) setVideoParam(true);
    else setStateOpen(true);
  }, [linkable]);

  const close = useCallback(() => {
    if (linkable) setVideoParam(false);
    else setStateOpen(false);
    playRef.current?.focus();
  }, [linkable]);

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
        onClick={show}
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
