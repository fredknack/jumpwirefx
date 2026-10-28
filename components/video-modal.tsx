"use client";

import { useEffect, useRef } from "react";
import type { Media } from "@/lib/types";

type Props = { video: Media; title: string; onClose: () => void };

/**
 * Native <dialog> holding a single <video>. Mounted only while open, so the
 * video element (and its network traffic) exists only while the modal does.
 */
export function VideoModal({ video, title, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[min(96vw,1200px)] rounded-xl bg-black p-0 text-white shadow-2xl backdrop:bg-black/85"
    >
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-10 right-0 z-10 rounded-full px-3 py-1 text-sm text-white/80 hover:bg-white/10 hover:text-white"
        >
          Close ✕
        </button>
        <video
          controls
          autoPlay
          playsInline
          preload="metadata"
          src={video.url}
          className="aspect-video w-full rounded-xl bg-black"
        >
          {video.alt}
        </video>
      </div>
    </dialog>
  );
}
