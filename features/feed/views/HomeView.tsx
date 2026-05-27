// src/features/feed/views/HomeView.tsx
"use client";

import { useRef } from "react";
import Image from "next/image";

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
    perfilPublicadorActivo,

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

  const mostrarEstadoVacioCategoria =
    !loadingReels && reels.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <CategoryBar
        categorias={categorias}
        activa={categoriaActiva}
        onSelect={seleccionarCategoria}
      />

      {mostrarEstadoVacioCategoria ? (
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-3xl border border-dashed border-soft/50 bg-white/80 p-8">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <Image
              src="/empty-category.svg"
              alt="No hay videos disponibles para esta categoria"
              width={220}
              height={160}
              className="h-auto w-auto"
            />

            <h2 className="mt-5 text-lg font-bold text-primary">
              {categoriaActiva
                ? `No hay videos en "${categoriaActiva}"`
                : "No hay videos disponibles"}
            </h2>

            <p className="mt-2 text-sm text-secondary">
              Prueba con otra categoria o vuelve mas tarde para ver nuevo contenido.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 gap-6">
          <ReelViewer
            reel={reelActivo}
            perfilPublicador={perfilPublicadorActivo}
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
      )}
    </div>
  );
}
