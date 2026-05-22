// Tipos generales de API
export enum EstadoCuenta {
  ACTIVA = "ACTIVA",
  DESACTIVADA = "DESACTIVADA",
}

export enum EstadoReel {
  ACTIVO = "ACTIVO",
  ELIMINADO = "ELIMINADO",
}

export enum TipoMensaje {
  TEXTO = "TEXTO",
  REEL = "REEL",
  IMAGEN = "IMAGEN",
  VIDEO = "VIDEO",
}

export enum TipoInteraccion {
  LIKE = "LIKE",
  COMENTARIO = "COMENTARIO",
}

// Usuarios
export type UsuarioInfo = {
  id: number;
  username: string;
  email: string;
  nombreVisualizacion: string | null;
  fotoPerfil: string | null;
  descripcion: string | null;
  estadoCuenta: EstadoCuenta;
  fechaRegistro: string; // ISO 8601 DateTime
};

export type PerfilInfo = {
  id: number;
  username: string;
  nombreVisualizacion: string | null;
  fotoPerfil: string | null;
  descripcion: string | null;
};

// Reels
export type ReelInfo = {
  id: number;
  urlVideo: string;
  urlMiniatura: string;
  descripcion: string | null;
  duracionSegundos: number;
  tamanoArchivoMB: number;
  estado: EstadoReel;
  fechaPublicacion: string; // ISO 8601 DateTime
  contadorLikes: number;
  contadorComentarios: number;
  canalId: number;
  categorias: string[];
};

export type VideoStream = {
  id: number;
  urlStream: string;
  tipoContenido: string;
  tamanoBytesStream: number;
  duracionSegundos: number;
  disponibleEnCache: boolean;
  cachePor: string;
};

// Categorías
export type CategoriaInfo = {
  id: number;
  nombre: string;
  descripcion: string;
};

// Interacciones
export type InteraccionInfo = {
  id: number;
  tipo: string; // "LIKE" | "COMENTARIO"
  usuarioId: number;
  reelId: number;
  fecha: string; // ISO 8601 DateTime
  contenido?: string; // Opcional, solo para comentarios
};

export type ComentarioDetalle = {
  id: number;
  tipo: TipoInteraccion;
  usuarioId: number;
  reelId: number;
  fecha: string;
  contenido: string;
};

// Feed
export type FeedResponse = {
  reels: ReelInfo[];
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  hayMas: boolean;
};

// Chat
export type ConversacionInfo = {
  id: number;
  usuario1Id: number;
  usuario2Id: number;
  fechaInicio: string; // ISO 8601 DateTime
};

export type MensajeInfo = {
  id: number;
  conversacionId: number;
  remitenteId: number;
  contenido: string;
  tipoContenido: TipoMensaje;
  reelReferidoId: number | null;
  fechaEnvio: string; // ISO 8601 DateTime
};
