import type { PerfilInfo } from "@/shared/types/api.types";

export type PublicProfileModalState = {
  perfil: PerfilInfo | null;
  totalPublicaciones: number;
  usuarioId: number | null;
  loading: boolean;
  creandoConversacion: boolean;
  error: string | null;
  mensajeError: string | null;
  open: boolean;
};

export type UsePublicProfileModalReturn =
  PublicProfileModalState & {
    abrirPerfil: (usuarioId: number) => Promise<void>;
    cerrarPerfil: () => void;
    enviarMensaje: () => Promise<void>;
  };
