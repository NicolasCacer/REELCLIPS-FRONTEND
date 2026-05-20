// src/features/profile/views/components/ProfileHeader.tsx
"use client";

import { useState } from "react";
import { Pencil, MoreVertical, LogOut, UserX } from "lucide-react";

import { Avatar } from "@/features/feed/views/components/Avatar";
import type { PerfilInfo, UsuarioInfo } from "@/shared/types/api.types";

type ProfileHeaderProps = {
  perfil: PerfilInfo | null;
  usuario: UsuarioInfo | null;
  totalPublicaciones: number;
  totalLikes: number;
  totalComentarios: number;
  onEditar: () => void;
  onCerrarSesion: () => void;
  onDesactivar: () => void;
};

function Stat({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  return (
    <div className="text-center sm:text-left">
      <span className="font-bold text-primary">{valor.toLocaleString()}</span>{" "}
      <span className="text-secondary">{etiqueta}</span>
    </div>
  );
}

export function ProfileHeader({
  perfil,
  usuario,
  totalPublicaciones,
  totalLikes,
  totalComentarios,
  onEditar,
  onCerrarSesion,
  onDesactivar,
}: ProfileHeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const username = perfil?.username ?? usuario?.username ?? "usuario";
  const nombre = perfil?.nombreVisualizacion ?? usuario?.nombreVisualizacion ?? username;
  const fotoPerfil = perfil?.fotoPerfil ?? usuario?.fotoPerfil ?? null;
  const descripcion = perfil?.descripcion ?? usuario?.descripcion ?? "";

  return (
    <header className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-12">
      <Avatar nombre={nombre} src={fotoPerfil} size={132} />

      <div className="flex min-w-0 flex-1 flex-col items-center gap-4 sm:items-start">
        {/* Username + acciones */}
        <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:justify-start">
          <h1 className="text-2xl font-semibold text-primary">@{username}</h1>

          <button
            type="button"
            onClick={onEditar}
            className="flex items-center gap-2 rounded-xl bg-light/50 px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-soft/60"
          >
            <Pencil size={15} /> Editar perfil
          </button>

          {/* Menú de ajustes */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuAbierto((v) => !v)}
              aria-label="Ajustes"
              aria-expanded={menuAbierto}
              className="flex h-9 w-9 items-center justify-center rounded-full text-primary transition-colors hover:bg-light/50"
            >
              <MoreVertical size={20} />
            </button>

            {menuAbierto && (
              <>
                {/* Cierre al hacer clic fuera */}
                <button
                  type="button"
                  aria-hidden
                  tabIndex={-1}
                  onClick={() => setMenuAbierto(false)}
                  className="fixed inset-0 z-10 cursor-default"
                />
                <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-soft/50 bg-white py-1 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuAbierto(false);
                      onCerrarSesion();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-primary transition-colors hover:bg-light/40"
                  >
                    <LogOut size={16} /> Cerrar sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuAbierto(false);
                      onDesactivar();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <UserX size={16} /> Desactivar cuenta
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-sm sm:justify-start">
          <Stat valor={totalPublicaciones} etiqueta="publicaciones" />
          <Stat valor={totalLikes} etiqueta="me gusta" />
          <Stat valor={totalComentarios} etiqueta="comentarios" />
        </div>

        {/* Nombre + bio */}
        <div className="w-full text-center sm:text-left">
          <p className="font-semibold text-primary">{nombre}</p>
          {descripcion ? (
            <p className="mt-0.5 whitespace-pre-line text-sm text-secondary">{descripcion}</p>
          ) : (
            <p className="mt-0.5 text-sm italic text-secondary/70">Sin descripción todavía.</p>
          )}
        </div>
      </div>
    </header>
  );
}