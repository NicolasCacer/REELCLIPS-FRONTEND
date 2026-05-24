// src/features/feed/views/HomeView.tsx
"use client";

import { useRef } from "react";

import { useHomeFeed } from "@/features/feed/controllers/useHomeFeed";

import { CategoryBar } from "./components/CategoryBar";
import { ReelViewer } from "./components/ReelViewer";

import {
  CommentsPanel,
  type CommentsPanelHandle,
} from "@/features/feed/views/components/CommentsPanel";

export function HomeView() {
  const {
    categorias,
    categoriaActiva,

    reels,
    reelActivo,
    reelActivoIndex,

    comentarios,
    perfilesComentarios,

    reelLikeado,

    loadingReels,
    loadingComentarios,

    seleccionarCategoria,

    reelAnterior,
    reelSiguiente,

    toggleLike,
    agregarComentario,
  } = useHomeFeed();

  const comentariosRef =
    useRef<CommentsPanelHandle>(null);

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <CategoryBar
        categorias={categorias}
        activa={categoriaActiva}
        onSelect={seleccionarCategoria}
      />

      <div className="flex min-h-0 flex-1 gap-6">
        <ReelViewer
          reel={reelActivo}
          liked={reelLikeado}
          loading={loadingReels}
          puedeSubir={reelActivoIndex > 0}
          puedeBajar={
            reelActivoIndex < reels.length - 1
          }
          onToggleLike={toggleLike}
          onComentar={() =>
            comentariosRef.current?.focus()
          }
          onAnterior={reelAnterior}
          onSiguiente={reelSiguiente}
        />

        <CommentsPanel
          ref={comentariosRef}
          comentarios={comentarios}
          perfilesComentarios={
            perfilesComentarios
          }
          loading={loadingComentarios}
          onEnviar={agregarComentario}
        />
      </div>
    </div>
  );
}