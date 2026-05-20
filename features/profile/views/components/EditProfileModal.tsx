// src/features/profile/views/components/EditProfileModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { X, Camera, AtSign } from "lucide-react";

import { Avatar } from "@/features/feed/views/components/Avatar";
import type { GuardarPerfilInput } from "@/features/profile/controllers/useProfile";
import type { PerfilInfo, UsuarioInfo } from "@/shared/types/api.types";

type EditProfileModalProps = {
  open: boolean;
  perfil: PerfilInfo | null;
  usuario: UsuarioInfo | null;
  guardando: boolean;
  error: string | null;
  aviso: string | null;
  onClose: () => void;
  onGuardar: (input: GuardarPerfilInput) => Promise<boolean>;
  onCambiarUsername: (nuevo: string) => Promise<boolean>;
  onLimpiarMensajes: () => void;
};

export function EditProfileModal({
  open,
  perfil,
  usuario,
  guardando,
  error,
  aviso,
  onClose,
  onGuardar,
  onCambiarUsername,
  onLimpiarMensajes,
}: EditProfileModalProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [nuevoUsername, setNuevoUsername] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inicializa el formulario cada vez que se abre.
  useEffect(() => {
    if (open) {
      setNombre(perfil?.nombreVisualizacion ?? usuario?.nombreVisualizacion ?? "");
      setDescripcion(perfil?.descripcion ?? usuario?.descripcion ?? "");
      setNuevoUsername("");
      setFotoFile(null);
      setFotoPreview(null);
      onLimpiarMensajes();
    }
  }, [open, perfil, usuario, onLimpiarMensajes]);

  // Limpia el objeto URL de la previsualización.
  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoPreview]);

  if (!open) return null;

  const fotoActual = perfil?.fotoPerfil ?? usuario?.fotoPerfil ?? null;
  const fotoMostrada = fotoPreview ?? fotoActual;

  const onSeleccionarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const onGuardarClick = async () => {
    const ok = await onGuardar({ nombre: nombre.trim(), descripcion: descripcion.trim(), fotoFile });
    if (ok) onClose();
  };

  const onCambiarUsernameClick = async () => {
    await onCambiarUsername(nuevoUsername);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo */}
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-primary/40 backdrop-blur-sm"
      />

      {/* Tarjeta */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-soft/40 px-6 py-4">
          <h2 className="text-lg font-bold text-primary">Editar perfil</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-secondary transition-colors hover:bg-light/40"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
          {/* Mensajes */}
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
          )}
          {aviso && (
            <p className="rounded-xl bg-light/50 px-3 py-2 text-sm font-medium text-secondary">{aviso}</p>
          )}

          {/* Foto */}
          <div className="flex items-center gap-4">
            <Avatar nombre={nombre || "Yo"} src={fotoMostrada} size={72} />
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl bg-light/50 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-soft/60"
              >
                <Camera size={16} /> Cambiar foto
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onSeleccionarFoto}
                className="hidden"
              />
              {fotoFile && (
                <p className="mt-1 max-w-[12rem] truncate text-xs text-secondary">{fotoFile.name}</p>
              )}
            </div>
          </div>

          {/* Nombre */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-primary">Nombre</span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="rounded-xl border border-soft/60 bg-background/40 px-3 py-2.5 text-sm text-primary outline-none transition-colors focus:border-accent"
            />
          </label>

          {/* Descripción */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-primary">Descripción</span>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Cuéntale a la gente sobre ti"
              className="resize-none rounded-xl border border-soft/60 bg-background/40 px-3 py-2.5 text-sm text-primary outline-none transition-colors focus:border-accent"
            />
          </label>

          {/* Cambio de nombre de usuario */}
          <div className="flex flex-col gap-1.5 border-t border-soft/40 pt-4">
            <span className="text-sm font-semibold text-primary">Nombre de usuario</span>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-1 rounded-xl border border-soft/60 bg-background/40 px-3 py-2.5">
                <AtSign size={15} className="text-secondary" />
                <input
                  type="text"
                  value={nuevoUsername}
                  onChange={(e) => setNuevoUsername(e.target.value)}
                  placeholder={perfil?.username ?? "nuevo_usuario"}
                  className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-secondary/60"
                />
              </div>
              <button
                type="button"
                onClick={onCambiarUsernameClick}
                disabled={guardando || !nuevoUsername.trim()}
                className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:opacity-40"
              >
                Cambiar
              </button>
            </div>
            <p className="text-xs text-secondary/80">
              Solo puedes cambiar tu nombre de usuario una vez cada 30 días.
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 border-t border-soft/40 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:bg-light/40"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onGuardarClick}
            disabled={guardando}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-50"
          >
            {guardando ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}