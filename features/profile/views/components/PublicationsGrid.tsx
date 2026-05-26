// src/features/profile/views/components/PublicationsGrid.tsx
"use client";

import { useRef } from "react";
import { Heart, Images, MessageCircle, Play } from "lucide-react";

import type { ReelInfo } from "@/shared/types/api.types";

type PublicationsGridProps = {
  publicaciones: ReelInfo[];
  loading: boolean;
};

function getMediaUrl(url: string | null | undefined): string | null {
  return url ? encodeURI(url) : null;
}

function PublicationTile({ reel }: { reel: ReelInfo }) {
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const miniaturaUrl = getMediaUrl(reel.urlMiniatura);
  const videoUrl = getMediaUrl(reel.urlVideo);

  const resetVideo = (video: HTMLVideoElement) => {
    video.pause();
    video.currentTime = 0;
  };

  const handlePreviewStart = (video: HTMLVideoElement) => {
    const playPromise = video.play();
    playPromiseRef.current = playPromise;
    playPromise.catch(() => {
      // Autoplay/hover previews are best-effort; failed play should not leak warnings.
    });
  };

  const handlePreviewEnd = (video: HTMLVideoElement) => {
    const playPromise = playPromiseRef.current;
    playPromiseRef.current = null;

    if (playPromise) {
      playPromise
        .catch(() => {
          // The play request can be interrupted if the cursor leaves quickly.
        })
        .finally(() => resetVideo(video));
      return;
    }

    resetVideo(video);
  };

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg bg-primary">
      {miniaturaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={miniaturaUrl}
          alt={reel.descripcion ?? "publicacion"}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : videoUrl ? (
        <video
          src={videoUrl}
          muted
          playsInline
          preload="metadata"
          onMouseEnter={(event) => {
            handlePreviewStart(event.currentTarget);
          }}
          onMouseLeave={(event) => {
            handlePreviewEnd(event.currentTarget);
          }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-primary" />
      )}

      <span className="absolute right-2 top-2 text-white/90 drop-shadow">
        <Play size={16} fill="currentColor" />
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 bg-gradient-to-t from-primary/85 via-primary/45 to-transparent px-2 pb-3 pt-8 transition-colors duration-200 group-hover:from-primary/95">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-white drop-shadow">
          <Heart size={17} fill="currentColor" /> {reel.contadorLikes ?? 0}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-white drop-shadow">
          <MessageCircle size={17} fill="currentColor" />{" "}
          {reel.contadorComentarios ?? 0}
        </span>
      </div>
    </div>
  );
}

export function PublicationsGrid({
  publicaciones,
  loading,
}: PublicationsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-lg bg-light/40"
          />
        ))}
      </div>
    );
  }

  if (publicaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-soft/70 text-secondary">
          <Images size={28} />
        </span>
        <p className="text-lg font-semibold text-primary">
          Aun no tienes publicaciones
        </p>
        <p className="max-w-xs text-sm text-secondary">
          Cuando publiques un reel, aparecera aqui en tu perfil.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
      {publicaciones.map((reel) => (
        <PublicationTile key={reel.id} reel={reel} />
      ))}
    </div>
  );
}
