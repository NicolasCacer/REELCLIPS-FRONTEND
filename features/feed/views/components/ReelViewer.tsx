// src/features/feed/views/components/ReelViewer.tsx
"use client";

import {
  ThumbsUp,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  Volume2,
  VolumeX,
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
  const [isMuted, setIsMuted] = useState(false);
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
      1500 // Ocultar después de 1.5 segundos
    );
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
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
      <div className="relative flex h-full max-h-[90vh] w-full max-w-[450px] items-center justify-center">
        {/* Marco del reel (formato vertical 9:16) */}
        <div
          className="group relative aspect-[9/16] h-full max-h-full w-auto overflow-hidden rounded-3xl border border-soft/50 bg-primary shadow-xl"
          onMouseEnter={() => setShowPlayButton(true)}
          onMouseLeave={() => setShowPlayButton(false)}
        >
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
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/20" />

          {/* Botón Play/Pause Central */}
          {reel?.urlVideo && (
            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={
                isPlaying ? "Pausar" : "Reproducir"
              }
              className={`absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                showPlayButton
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50">
                {isPlaying ? (
                  <Pause
                    size={36}
                    className="fill-white text-white"
                  />
                ) : (
                  <Play
                    size={36}
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
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-5">
            {/* Contenido izquierdo */}
            <div className="flex-1">
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

            {/* Botón Like - Alineado a la derecha */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={onToggleLike}
                aria-pressed={liked}
                aria-label="Me gusta"
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 backdrop-blur-sm",
                  liked
                    ? "bg-accent/80 text-white hover:bg-accent"
                    : "bg-white/30 text-white ring-1 ring-white/40 hover:bg-white/50",
                ].join(" ")}
              >
                <ThumbsUp size={18} fill={liked ? "currentColor" : "none"} />
              </button>

              <span className="text-xs font-semibold text-white">
                {reel?.contadorLikes ?? 0}
              </span>
            </div>
          </div>

          {/* Botón Mute/Unmute */}
          {reel?.urlVideo && (
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Activar audio" : "Silenciar"}
              className="absolute right-3 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm transition hover:bg-white/50"
            >
              {isMuted ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
          )}

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
        </div>
      </div>
    </div>
  );
}