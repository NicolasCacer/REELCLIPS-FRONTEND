// src/features/feed/views/components/CommentsPanel.tsx
"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Send } from "lucide-react";

import { Avatar } from "./Avatar";
import type { ComentarioDetalle, UsuarioInfo } from "@/shared/types/api.types";

export type CommentsPanelHandle = {
  focus: () => void;
};

type CommentsPanelProps = {
  comentarios: ComentarioDetalle[];
  loading: boolean;
  usuario: UsuarioInfo | null;
  onEnviar: (contenido: string) => void;
};

export const CommentsPanel = forwardRef<CommentsPanelHandle, CommentsPanelProps>(
  function CommentsPanel({ comentarios, loading, usuario, onEnviar }, ref) {
    const [texto, setTexto] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    const enviar = () => {
      const limpio = texto.trim();
      if (!limpio) return;
      onEnviar(limpio);
      setTexto("");
    };

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        enviar();
      }
    };

    return (
      <div className="flex h-full w-80 shrink-0 flex-col gap-4 rounded-3xl border border-soft/50 bg-white p-4 shadow-sm">
        {/* Lista de comentarios */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
          {loading && (
            <p className="text-sm text-secondary">Cargando comentarios…</p>
          )}

          {!loading && comentarios.length === 0 && (
            <p className="mt-6 text-center text-sm text-secondary">
              Sé el primero en comentar.
            </p>
          )}

          {comentarios.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <Avatar nombre={`Usuario ${c.usuarioId}`} size={36} ring={false} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary">
                  Usuario {c.usuarioId}
                </p>
                <p className="break-words text-sm leading-snug text-secondary">
                  {c.contenido}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Caja para escribir */}
        <div className="flex items-end gap-3 rounded-2xl border border-soft/60 bg-background/60 p-3">
          <textarea
            ref={inputRef}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder="Escribe algo..."
            className="min-h-[44px] flex-1 resize-none bg-transparent text-sm text-primary placeholder:text-secondary/70 focus:outline-none"
          />
          <div className="flex flex-col items-center gap-2">
            <Avatar nombre={usuario?.username ?? "Yo"} src={usuario?.fotoPerfil} size={36} />
            <button
              type="button"
              onClick={enviar}
              disabled={!texto.trim()}
              aria-label="Enviar comentario"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition hover:bg-secondary disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }
);