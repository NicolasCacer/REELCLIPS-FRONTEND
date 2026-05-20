// src/features/feed/views/HomeView.tsx
"use client";

import { useRef } from "react";

import { useHomeFeed } from "@/features/feed/controllers/useHomeFeed";
import { HomeSidebar } from "./components/HomeSidebar";
import { CategoryBar } from "./components/CategoryBar";
import { ReelViewer } from "./components/ReelViewer";
import { CommentsPanel, type CommentsPanelHandle } from "./components/CommentsPanel";

/**
 * Pantalla principal (Home) de ReelClips.
 *
 * Reproduce el diseño de `home_design` usando la paleta del proyecto
 * (tokens definidos en globals.css: primary / secondary / accent / soft / light).
 *
 * Ocupa toda la ventana (fixed inset-0) para presentar el shell del diseño
 * con su propio sidebar, sin modificar el layout privado compartido ni el backend.
 */
export function HomeView() {
  const {
    usuario,
    contactos,
    categorias,
    categoriaActiva,
    reels,
    reelActivo,
    reelActivoIndex,
    comentarios,
    reelLikeado,
    loadingReels,
    loadingComentarios,
    seleccionarCategoria,
    reelAnterior,
    reelSiguiente,
    toggleLike,
    agregarComentario,
  } = useHomeFeed();

  const comentariosRef = useRef<CommentsPanelHandle>(null);

  return (
    <div className="fixed inset-0 z-30 flex overflow-hidden bg-background font-sans text-primary">
      {/* Sidebar */}
      <HomeSidebar usuario={usuario} contactos={contactos} />

      {/* Contenido principal */}
      <div className="flex min-w-0 flex-1 flex-col gap-5 p-6">
        {/* Barra de categorías */}
        <CategoryBar
          categorias={categorias}
          activa={categoriaActiva}
          onSelect={seleccionarCategoria}
        />

        {/* Reel + comentarios */}
        <div className="flex min-h-0 flex-1 gap-6">
          <ReelViewer
            reel={reelActivo}
            liked={reelLikeado}
            loading={loadingReels}
            puedeSubir={reelActivoIndex > 0}
            puedeBajar={reelActivoIndex < reels.length - 1}
            onToggleLike={toggleLike}
            onComentar={() => comentariosRef.current?.focus()}
            onAnterior={reelAnterior}
            onSiguiente={reelSiguiente}
          />

          <CommentsPanel
            ref={comentariosRef}
            comentarios={comentarios}
            loading={loadingComentarios}
            usuario={usuario}
            onEnviar={agregarComentario}
          />
        </div>
      </div>
    </div>
  );
}