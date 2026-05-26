// src/features/profile/views/components/PublicationsGrid.tsx
"use client";

import { useRef, useState } from "react";
import { Heart, Images, MessageCircle, Trash2 } from "lucide-react";

import type { ReelInfo } from "@/shared/types/api.types";

type PublicationsGridProps = {
  publicaciones: ReelInfo[];
  loading: boolean;
  deletingReelIds: Set<number>;
  onDeletePublication: (reelId: number) => Promise<boolean>;
};

function getMediaUrl(url: string | null | undefined): string | null {
  return url ? encodeURI(url) : null;
}

type PublicationTileProps = {
  reel: ReelInfo;
  isDeleting: boolean;
  onDeletePublication: (reelId: number) => Promise<boolean>;
};

function PublicationTile({
  reel,
  isDeleting,
  onDeletePublication,
}: PublicationTileProps) {
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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

  const handleConfirmDelete = async () => {
    const deleted = await onDeletePublication(reel.id);
    if (deleted) {
      setConfirmDeleteOpen(false);
    }
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

      <div className="absolute right-2 top-2 z-20">
        {confirmDeleteOpen ? (
          <div className="min-w-36 rounded-xl border border-red-200 bg-white/95 p-2 shadow-lg backdrop-blur">
            <p className="mb-2 text-center text-xs font-semibold text-primary">
              Eliminar publicacion?
            </p>
            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setConfirmDeleteOpen(false)}
                className="rounded-md px-2 py-1 text-xs font-semibold text-secondary transition hover:bg-light/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => void handleConfirmDelete()}
                className="rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "..." : "Eliminar"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            aria-label="Eliminar publicacion"
            title="Eliminar publicacion"
            disabled={isDeleting}
            onClick={() => setConfirmDeleteOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

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
  deletingReelIds,
  onDeletePublication,
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
        <PublicationTile
          key={reel.id}
          reel={reel}
          isDeleting={deletingReelIds.has(reel.id)}
          onDeletePublication={onDeletePublication}
        />
      ))}
    </div>
  );
}
