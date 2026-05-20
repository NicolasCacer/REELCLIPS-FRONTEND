// src/features/profile/views/ProfileView.tsx
"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { useProfile } from "@/features/profile/controllers/useProfile";
import { HomeSidebar } from "@/features/feed/views/components/HomeSidebar";
import { ProfileHeader } from "./components/ProfileHeader";
import { PublicationsGrid } from "./components/PublicationsGrid";
import { EditProfileModal } from "./components/EditProfileModal";

/**
 * Pantalla de Perfil de ReelClips (estilo Instagram).
 *
 * Reutiliza el shell/sidebar del Home y la paleta del proyecto.
 * Ocupa toda la ventana (fixed inset-0) sin modificar el layout privado
 * compartido ni el backend.
 */
export function ProfileView() {
  const {
    usuario,
    perfil,
    publicaciones,
    totalPublicaciones,
    totalLikes,
    totalComentarios,
    loadingPublicaciones,
    guardando,
    error,
    aviso,
    guardarPerfil,
    cambiarUsername,
    cerrarSesion,
    desactivarCuenta,
    limpiarMensajes,
  } = useProfile();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-30 flex overflow-hidden bg-background font-sans text-primary">
      <HomeSidebar usuario={usuario} active="profile" />

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-6 py-10">
          <ProfileHeader
            perfil={perfil}
            usuario={usuario}
            totalPublicaciones={totalPublicaciones}
            totalLikes={totalLikes}
            totalComentarios={totalComentarios}
            onEditar={() => setEditOpen(true)}
            onCerrarSesion={cerrarSesion}
            onDesactivar={() => setConfirmOpen(true)}
          />

          <div className="my-8 h-px bg-soft/40" />

          <PublicationsGrid publicaciones={publicaciones} loading={loadingPublicaciones} />
        </div>
      </main>

      {/* Modal de edición */}
      <EditProfileModal
        open={editOpen}
        perfil={perfil}
        usuario={usuario}
        guardando={guardando}
        error={error}
        aviso={aviso}
        onClose={() => setEditOpen(false)}
        onGuardar={guardarPerfil}
        onCambiarUsername={cambiarUsername}
        onLimpiarMensajes={limpiarMensajes}
      />

      {/* Confirmación de desactivación */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setConfirmOpen(false)}
            className="absolute inset-0 cursor-default bg-primary/40 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle size={22} />
              </span>
              <h2 className="text-lg font-bold text-primary">Desactivar cuenta</h2>
            </div>
            <p className="text-sm leading-relaxed text-secondary">
              Tu cuenta se desactivará y se cerrará la sesión. Tus reels y mensajes se
              conservan durante 30 días antes de eliminarse de forma permanente.
            </p>
            {error && (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                {error}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-light/40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void desactivarCuenta()}
                disabled={guardando}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {guardando ? "Procesando…" : "Sí, desactivar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}