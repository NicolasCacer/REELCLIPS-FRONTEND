"use client";

import { MessageCircle, X } from "lucide-react";

import { Avatar } from "@/features/feed/views/components/Avatar";

import type { PerfilInfo } from "@/shared/types/api.types";

type PublicProfileModalProps = {
  perfil: PerfilInfo | null;
  totalPublicaciones: number;
  loading: boolean;
  creandoConversacion: boolean;
  error: string | null;
  mensajeError: string | null;
  onClose: () => void;
  onEnviarMensaje: () => void;
};

function Stat({
  valor,
  etiqueta,
}: {
  valor: number;
  etiqueta: string;
}) {
  return (
    <div className="text-center">
      <span className="font-bold text-primary">
        {valor.toLocaleString()}
      </span>{" "}
      <span className="text-secondary">{etiqueta}</span>
    </div>
  );
}

export function PublicProfileModal({
  perfil,
  totalPublicaciones,
  loading,
  creandoConversacion,
  error,
  mensajeError,
  onClose,
  onEnviarMensaje,
}: PublicProfileModalProps) {
  const nombre =
    perfil?.nombreVisualizacion || perfil?.username || "Perfil";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar perfil"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-primary/50 backdrop-blur-sm"
      />

      <section className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-soft/40 bg-white shadow-2xl">
        <div className="h-28 bg-gradient-to-br from-primary via-secondary to-accent" />

        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition hover:bg-white"
        >
          <X size={20} />
        </button>

        <div className="-mt-12 px-6 pb-6">
          {loading ? (
            <div className="flex min-h-52 flex-col items-center justify-center text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-soft/40 border-t-primary" />
              <p className="mt-4 text-sm font-medium text-secondary">
                Cargando perfil...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-52 flex-col items-center justify-center text-center">
              <Avatar nombre="?" size={84} className="ring-white" />
              <h2 className="mt-4 text-lg font-bold text-primary">
                Perfil no disponible
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {error}
              </p>
            </div>
          ) : perfil ? (
            <div>
              <Avatar
                nombre={nombre}
                src={perfil.fotoPerfil}
                size={96}
                className="ring-4 ring-white"
              />

              <div className="mt-4">
                <h2 className="text-2xl font-bold text-primary">
                  {nombre}
                </h2>

                <p className="mt-1 text-sm font-semibold text-secondary">
                  @{perfil.username}
                </p>

                <div className="mt-4 flex justify-start text-sm">
                  <Stat
                    valor={totalPublicaciones}
                    etiqueta="publicaciones"
                  />
                </div>

                <button
                  type="button"
                  onClick={onEnviarMensaje}
                  disabled={creandoConversacion}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-secondary disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70"
                >
                  <MessageCircle size={17} />
                  {creandoConversacion
                    ? "Abriendo chat..."
                    : "Enviar mensaje"}
                </button>

                {mensajeError ? (
                  <p className="mt-3 rounded-2xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
                    {mensajeError}
                  </p>
                ) : null}

                {perfil.descripcion?.trim() ? (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-dark">
                    {perfil.descripcion.trim()}
                  </p>
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-secondary">
                    Este perfil todavia no tiene descripcion publica.
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
