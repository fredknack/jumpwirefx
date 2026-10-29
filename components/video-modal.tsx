"use client";

import { useEffect, useRef } from "react";
import type { Media } from "@/lib/types";

type Props = { video: Media; title: string; onClose: () => void };

/**
 * Native <dialog> holding a single <video>. Mounted only while open, so the
 * video element (and its network traffic) exists only while the modal does.
 *
 * Every close path goes through dialog.close(): the browser then lifts the
 * modal state, restores focus to the opener, and fires `close`, which is the
 * one place `onClose` is called.
 */
export function VideoModal({ video, title, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Browsers close a modal dialog on Escape natively; this covers hosts that don't.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") ref.current?.close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(96vw,1200px)] overflow-visible rounded-xl bg-black p-0 text-white shadow-2xl backdrop:bg-black/85"
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close video"
          className="absolute top-2 right-2 z-10 rounded-full bg-black/70 px-3 py-1 text-sm text-white/90 hover:bg-black/90 hover:text-white focus-visible:ring-2 focus-visible:ring-brand"
        >
          Close ✕
        </button>
        <video
          controls
          autoPlay
          playsInline
          preload="metadata"
          src={video.url}
          className="aspect-video max-h-[calc(100dvh-2rem)] w-full rounded-xl bg-black"
        >
          {video.alt}
        </video>
      </div>
    </dialog>
  );
}
