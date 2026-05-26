// features/feed/views/components/ReelModal.tsx
"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import type { ReelInfo } from "@/shared/types/api.types";

import { useAuth } from "@/features/auth/controllers/authContext";
import { useReelInteractions } from "@/features/feed/controllers/useReelInteractions";

import { ReelViewer } from "./ReelViewer";
import { CommentsPanel, type CommentsPanelHandle } from "./CommentsPanel";

type ReelModalProps = {
  reels: ReelInfo[];
  startIndex: number;
  onClose: () => void;
};

export function ReelModal({ reels, startIndex, onClose }: ReelModalProps) {
  const { user } = useAuth();

  const comentariosRef = useRef<CommentsPanelHandle>(null);

  const {
    reelActivo,
    activeIndex,
    total,
    comentarios,
    perfilesComentarios,
    loadingComentarios,
    reelLikeado,
    reelAnterior,
    reelSiguiente,
    toggleLike,
    agregarComentario,
  } = useReelInteractions({
    reels,
    startIndex,
    usuarioId: user?.id ?? null,
  });

  // Cerrar con la tecla Escape
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-primary/50 backdrop-blur-sm"
      />

      {/* Contenido */}
      <div className="relative z-10 flex h-[88vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-background shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition hover:bg-white"
        >
          <X size={20} />
        </button>

        <div className="flex min-h-0 flex-1 gap-5 p-5">
          <ReelViewer
            reel={reelActivo}
            liked={reelLikeado}
            loading={false}
            puedeSubir={activeIndex > 0}
            puedeBajar={activeIndex < total - 1}
            onToggleLike={toggleLike}
            onComentar={() => comentariosRef.current?.focus()}
            onAnterior={reelAnterior}
            onSiguiente={reelSiguiente}
          />

          <CommentsPanel
            ref={comentariosRef}
            comentarios={comentarios}
            perfilesComentarios={perfilesComentarios}
            loading={loadingComentarios}
            onEnviar={agregarComentario}
          />
        </div>
      </div>
    </div>
  );
}