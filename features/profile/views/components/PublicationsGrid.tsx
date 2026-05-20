// src/features/profile/views/components/PublicationsGrid.tsx
"use client";

import { Heart, MessageCircle, Play, Images } from "lucide-react";

import type { ReelInfo } from "@/shared/types/api.types";

type PublicationsGridProps = {
  publicaciones: ReelInfo[];
  loading: boolean;
};

export function PublicationsGrid({ publicaciones, loading }: PublicationsGridProps) {
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
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
      {publicaciones.map((reel) => (
        <div
          key={reel.id}
          className="group relative aspect-square overflow-hidden rounded-lg bg-primary"
        >
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

          {/* Overlay con métricas al pasar el mouse */}
          <div className="absolute inset-0 flex items-center justify-center gap-5 bg-primary/55 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Heart size={18} fill="currentColor" /> {reel.contadorLikes}
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <MessageCircle size={18} fill="currentColor" /> {reel.contadorComentarios}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}