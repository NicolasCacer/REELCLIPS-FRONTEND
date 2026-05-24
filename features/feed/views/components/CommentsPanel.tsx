// src/features/feed-comments/views/components/CommentsPanel.tsx
"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { Send } from "lucide-react";

import { Avatar } from "@/features/feed/views/components/Avatar";

import type {
  ComentarioDetalle,
} from "@/shared/types/api.types";

import type {
  CommentProfileMap,
} from "@/features/feed/model/comments.types";

export type CommentsPanelHandle = {
  focus: () => void;
};

type CommentsPanelProps = {
  comentarios: ComentarioDetalle[];

  perfilesComentarios: CommentProfileMap;

  loading: boolean;

  onEnviar: (
    contenido: string
  ) => Promise<void>;
};

export const CommentsPanel = forwardRef<
  CommentsPanelHandle,
  CommentsPanelProps
>(function CommentsPanel(
  {
    comentarios,
    perfilesComentarios,
    loading,
    onEnviar,
  },
  ref
) {
  const [texto, setTexto] =
    useState("");

  const [enviando, setEnviando] =
    useState(false);

  const inputRef =
    useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () =>
      inputRef.current?.focus(),
  }));

  /**
   * ENVIAR
   */
  const enviar = async () => {
    const limpio =
      texto.trim();

    if (!limpio || enviando) {
      return;
    }

    try {
      setEnviando(true);

      /**
       * limpieza inmediata
       */
      setTexto("");

      await onEnviar(limpio);

      /**
       * mantener focus
       */
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } finally {
      setEnviando(false);
    }
  };

  /**
   * ENTER
   */
  const onKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      void enviar();
    }
  };

  /**
   * ORDENADOS
   */
  const comentariosOrdenados =
    useMemo(() => {
      return [...comentarios].sort(
        (a, b) =>
          new Date(
            b.fecha
          ).getTime() -
          new Date(
            a.fecha
          ).getTime()
      );
    }, [comentarios]);

  /**
   * HORA LOCAL
   */
  const formatHora = (
    fecha: string
  ) => {
    try {
      return new Intl.DateTimeFormat(
        "es-CO",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      ).format(
        new Date(`${fecha}Z`)
      );
    } catch {
      return "";
    }
  };

  return (
    <div className="flex h-full w-80 shrink-0 flex-col overflow-hidden rounded-3xl border border-soft/40 bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b border-soft/30 px-5 py-4">
        <h2 className="text-sm font-semibold text-primary">
          Comentarios
        </h2>

        <p className="mt-1 text-xs text-secondary">
          {comentarios.length} comentario
          {comentarios.length !== 1
            ? "s"
            : ""}
        </p>
      </div>

      {/* LISTA */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        {loading && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-secondary">
              Cargando comentarios…
            </p>
          </div>
        )}

        {!loading &&
          comentarios.length ===
            0 && (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-center text-sm text-secondary">
                Sé el primero en comentar.
              </p>
            </div>
          )}

        {!loading &&
          comentariosOrdenados.map(
            (comentario) => {
              const perfil =
                perfilesComentarios?.[
                  comentario.usuarioId
                ];

              const nombre =
                perfil
                  ?.nombreVisualizacion ||
                perfil?.username ||
                `Usuario ${comentario.usuarioId}`;

              const mensaje =
                comentario.contenido?.trim() ||
                "Comentario pendiente.";

              return (
                <div
                  key={
                    comentario.id
                  }
                  className="flex items-start gap-3"
                >
                  <Avatar
                    nombre={nombre}
                    src={
                      perfil?.fotoPerfil
                    }
                    size={34}
                    ring={false}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="rounded-2xl bg-gray-100 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-primary">
                          {nombre}
                        </p>

                        <span className="text-[10px] text-secondary/40">
                          •
                        </span>

                        <p className="text-[11px] text-secondary">
                          {formatHora(
                            comentario.fecha
                          )}
                        </p>
                      </div>

                      <p className="mt-1 break-words text-sm leading-relaxed text-primary">
                        {mensaje}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
      </div>

      {/* INPUT */}
      <div className="border-t border-soft/30 bg-white p-4">
        <div className="flex items-end gap-3 rounded-2xl border border-soft/40 bg-gray-50 px-4 py-3 transition focus-within:border-accent/40 focus-within:bg-white">
          <textarea
            ref={inputRef}
            value={texto}
            onChange={(e) =>
              setTexto(
                e.target.value
              )
            }
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Añade un comentario..."
            className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent text-sm leading-relaxed text-primary placeholder:text-secondary/60 focus:outline-none"
          />

          <button
            type="button"
            onClick={() => {
              void enviar();
            }}
            disabled={
              !texto.trim() ||
              enviando
            }
            aria-label="Enviar comentario"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition hover:scale-105 hover:bg-secondary disabled:scale-100 disabled:opacity-30"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});