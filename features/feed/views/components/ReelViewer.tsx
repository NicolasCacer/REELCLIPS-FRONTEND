// src/features/feed/views/components/ReelViewer.tsx
"use client";

import {
  ThumbsUp,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
} from "lucide-react";

import { useRef, useState, useEffect } from "react";

import type { ReelInfo } from "@/shared/types/api.types";

type ReelViewerProps = {
  reel: ReelInfo | null;
  liked: boolean;
  loading: boolean;
  puedeSubir: boolean;
  puedeBajar: boolean;
  onToggleLike: () => void;
  onComentar: () => void;
  onAnterior: () => void;
  onSiguiente: () => void;
};

export function ReelViewer({
  reel,
  liked,
  loading,
  puedeSubir,
  puedeBajar,
  onToggleLike,
  onComentar,
  onAnterior,
  onSiguiente,
}: ReelViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayButton, setShowPlayButton] =
    useState(false);
  const hideButtonTimeoutRef =
    useRef<NodeJS.Timeout | null>(null);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    // Mostrar botón y reiniciar timeout
    setShowPlayButton(true);
    resetHideTimeout();
  };

  const resetHideTimeout = () => {
    if (hideButtonTimeoutRef.current) {
      clearTimeout(hideButtonTimeoutRef.current);
    }
    hideButtonTimeoutRef.current = setTimeout(
      () => {
        setShowPlayButton(false);
      },
      3000 // Ocultar después de 3 segundos
    );
  };

  const handleVideoInteraction = () => {
    setShowPlayButton(true);
    resetHideTimeout();
  };

  useEffect(() => {
    return () => {
      if (hideButtonTimeoutRef.current) {
        clearTimeout(hideButtonTimeoutRef.current);
      }
    };
  }, []);
  return (
    <div className="flex h-full min-h-0 flex-1 items-center justify-center">
      <div className="relative flex h-full max-h-[640px] w-full max-w-[380px] items-center justify-center">
        {/* Marco del reel (formato vertical 9:16) */}
        <div className="relative aspect-[9/16] h-full max-h-full w-auto overflow-hidden rounded-3xl border border-soft/50 bg-primary shadow-xl">
          {/* Video */}
          {reel?.urlVideo ? (
            <video
              ref={videoRef}
              key={reel.id}
              src={reel.urlVideo}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              playsInline
              controls
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onMouseMove={handleVideoInteraction}
              onTouchStart={handleVideoInteraction}
            />
          ) : reel?.urlMiniatura ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={reel.urlMiniatura}
              alt={reel.descripcion ?? "reel"}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-secondary via-primary to-primary" />
          )}

          {/* Overlay para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/20" />

          {/* Botón Play/Pause Central */}
          {reel?.urlVideo && (
            <button
              type="button"
              onClick={togglePlayPause}
              onMouseMove={handleVideoInteraction}
              aria-label={
                isPlaying ? "Pausar" : "Reproducir"
              }
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                showPlayButton
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50">
                {isPlaying ? (
                  <Pause
                    size={48}
                    className="fill-white text-white"
                  />
                ) : (
                  <Play
                    size={48}
                    className="fill-white text-white"
                  />
                )}
              </div>
            </button>
          )}

          {/* Estado de carga */}
          {loading && (
            <div className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Cargando…
            </div>
          )}

          {/* Información del reel */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="line-clamp-3 text-sm font-medium leading-relaxed text-white/95">
              {reel?.descripcion ?? "Sin descripción"}
            </p>

            {reel?.categorias?.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {reel.categorias.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
                  >
                    #{c}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Navegación */}
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col gap-2">
            <button
              type="button"
              onClick={onAnterior}
              disabled={!puedeSubir}
              aria-label="Reel anterior"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/30 disabled:opacity-30"
            >
              <ChevronUp size={18} />
            </button>

            <button
              type="button"
              onClick={onSiguiente}
              disabled={!puedeBajar}
              aria-label="Reel siguiente"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/30 disabled:opacity-30"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Acciones flotantes */}
          <div className="absolute bottom-10 right-3 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={onToggleLike}
              aria-pressed={liked}
              aria-label="Me gusta"
              className={[
                "flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 backdrop-blur-sm",
                liked
                  ? "bg-accent/80 text-white hover:bg-accent"
                  : "bg-white/30 text-white ring-1 ring-white/40 hover:bg-white/50",
              ].join(" ")}
            >
              <ThumbsUp size={22} fill={liked ? "currentColor" : "none"} />
            </button>

            <span className="-mt-2 text-xs font-semibold text-white">
              {reel?.contadorLikes ?? 0}
            </span>

            <button
              type="button"
              onClick={onComentar}
              aria-label="Comentar"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 text-white shadow-lg transition-all hover:scale-105 hover:bg-white/50 backdrop-blur-sm"
            >
              <MessageCircle size={22} />
            </button>

            <span className="-mt-2 text-xs font-semibold text-white">
              {reel?.contadorComentarios ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}