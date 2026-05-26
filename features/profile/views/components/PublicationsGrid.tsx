// src/features/profile/views/components/PublicationsGrid.tsx
"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle, Play, Images, X } from "lucide-react";

import type { ReelInfo } from "@/shared/types/api.types";

type PublicationsGridProps = {
  publicaciones: ReelInfo[];
  loading: boolean;
};

export function PublicationsGrid({ publicaciones, loading }: PublicationsGridProps) {
  // ===== 👇 NUEVO: reel seleccionado para el modal 👇 =====
  const [reelActivo, setReelActivo] = useState<ReelInfo | null>(null);
  // ===== 👆 fin 👆 =====

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
        <p className="text-lg font-semibold text-primary">Aún no tienes publicaciones</p>
        <p className="max-w-xs text-sm text-secondary">
          Cuando publiques un reel, aparecerá aquí en tu perfil.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {publicaciones.map((reel) => (
          // ===== 👇 CAMBIO: ahora es un <button> con onClick 👇 =====
          <button
            key={reel.id}
            type="button"
            onClick={() => setReelActivo(reel)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-primary"
          >
            {/* ===== 👆 fin del cambio 👆 ===== */}
            {reel.urlMiniatura ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={reel.urlMiniatura}
                alt={reel.descripcion ?? "publicación"}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-primary" />
            )}

            {/* Indicador de reel */}
            <span className="absolute right-2 top-2 text-white/90 drop-shadow">
              <Play size={16} fill="currentColor" />
            </span>

            {/* Etiqueta de categoría */}
            {reel.categorias?.length ? (
              <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                #{reel.categorias[0]}
              </span>
            ) : null}

            {/* Overlay con métricas al pasar el mouse */}
            <div className="absolute inset-0 flex items-center justify-center gap-5 bg-primary/55 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <Heart size={18} fill="currentColor" /> {reel.contadorLikes}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <MessageCircle size={18} fill="currentColor" /> {reel.contadorComentarios}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* ===== 👇 NUEVO: modal que abre el reel ===== */}
      {reelActivo && (
        <ReelModal reel={reelActivo} onClose={() => setReelActivo(null)} />
      )}
      {/* ===== 👆 fin ===== */}
    </>
  );
}

// ===== 👇 NUEVO COMPONENTE: visor del reel en modal 👇 =====
function ReelModal({
  reel,
  onClose,
}: {
  reel: ReelInfo;
  onClose: () => void;
}) {
  // Cerrar con la tecla Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo (clic para cerrar) */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-primary/50 backdrop-blur-sm"
      />

      {/* Tarjeta */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
        >
          <X size={18} />
        </button>

        {/* Video */}
        <div className="relative aspect-[9/16] w-full shrink-0 bg-primary">
          {reel.urlVideo ? (
            <video
              src={reel.urlVideo}
              className="h-full w-full object-cover"
              controls
              autoPlay
              loop
              playsInline
            />
          ) : reel.urlMiniatura ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={reel.urlMiniatura}
              alt={reel.descripcion ?? "reel"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-primary" />
          )}
        </div>

        {/* Información */}
        <div className="flex flex-col gap-3 overflow-y-auto p-5">
          <p className="text-sm leading-relaxed text-primary">
            {reel.descripcion ?? "Sin descripción"}
          </p>

          {reel.categorias?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {reel.categorias.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-light/60 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  #{c}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex items-center gap-5 text-sm text-secondary">
            <span className="flex items-center gap-1.5">
              <Heart size={16} /> {reel.contadorLikes}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle size={16} /> {reel.contadorComentarios}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
// ===== 👆 fin del nuevo componente 👆 =====