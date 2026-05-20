// GUÍA DE INTEGRACIÓN - Controllers con Services

## 📋 Patrón General de Controllers

Los controllers usan React hooks para manejar estado y lógica de negocio.
Cada controller debe:
1. Importar el service correspondiente
2. Llamar al service cuando sea necesario
3. Actualizar el estado local
4. Manejar errores

## 🔐 FEATURE: AUTH

### useLoginController.ts

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginService } from "../services/auth.service";
import type { LoginRequest, LoginResponse } from "../model/auth.types";

export function useLoginController() {
  const router = useRouter();
  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof LoginRequest, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    try {
      setIsLoading(true);
      // Respuesta es UsuarioInfo del backend
      const usuario = await loginService(form);
      
      // Guardar datos del usuario
      localStorage.setItem("reelclips_user", JSON.stringify(usuario));
      localStorage.setItem("reelclips_userId", String(usuario.id));
      
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    error,
    isLoading,
    handleChange,
    handleLogin,
  };
}
```

### useRegisterController.ts

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerService } from "../services/auth.service";
import type { RegisterRequest, RegisterResponse } from "../model/auth.types";

export function useRegisterController() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof RegisterRequest, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.email || !form.password) {
      setError("Todos los campos son requeridos");
      return;
    }

    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      setIsLoading(true);
      const usuario = await registerService(form);
      
      localStorage.setItem("reelclips_user", JSON.stringify(usuario));
      localStorage.setItem("reelclips_userId", String(usuario.id));
      
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    error,
    isLoading,
    handleChange,
    handleRegister,
  };
}
```

## 📹 FEATURE: FEED

### useFeedController.ts

```typescript
"use client";

import { useState, useCallback } from "react";
import { getFeedService } from "../services/feed.service";
import { getCommentsService, addLikeService, removeLikeService, addCommentService } from "../services/interactions.service";
import type { GetFeedRequest } from "../model/feed.types";
import type { ReelInfo } from "@/shared/types/api.types";

export function useFeedController() {
  const [reels, setReels] = useState<ReelInfo[]>([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const [hayMas, setHayMas] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [likes, setLikes] = useState<Map<number, boolean>>(new Map());

  const cargarFeed = useCallback(async (params: GetFeedRequest) => {
    try {
      setLoading(true);
      const response = await getFeedService(params);
      
      setReels(params.pagina === 0 ? response.reels : [...reels, ...response.reels]);
      setPaginaActual(response.paginaActual);
      setHayMas(response.hayMas);
    } catch (err: any) {
      setError(err.message || "Error al cargar feed");
    } finally {
      setLoading(false);
    }
  }, [reels]);

  const cargarMas = useCallback((usuarioId: number) => {
    cargarFeed({
      usuarioId,
      pagina: paginaActual + 1,
    });
  }, [paginaActual, cargarFeed]);

  const darLike = useCallback(async (usuarioId: number, reelId: number) => {
    try {
      await addLikeService({ usuarioId, reelId });
      setLikes(new Map(likes).set(reelId, true));
    } catch (err: any) {
      setError(err.message || "Error al dar like");
    }
  }, [likes]);

  const quitarLike = useCallback(async (usuarioId: number, reelId: number) => {
    try {
      await removeLikeService({ usuarioId, reelId });
      setLikes(new Map(likes).set(reelId, false));
    } catch (err: any) {
      setError(err.message || "Error al quitar like");
    }
  }, [likes]);

  const agregarComentario = useCallback(async (usuarioId: number, reelId: number, contenido: string) => {
    try {
      await addCommentService({ usuarioId, reelId, contenido });
      // Aquí podrías recargar los comentarios del reel
    } catch (err: any) {
      setError(err.message || "Error al agregar comentario");
    }
  }, []);

  return {
    reels,
    loading,
    error,
    hayMas,
    paginaActual,
    likes,
    cargarFeed,
    cargarMas,
    darLike,
    quitarLike,
    agregarComentario,
  };
}
```

## 💬 FEATURE: CHATS

### useChatsController.ts

```typescript
"use client";

import { useState, useCallback } from "react";
import { createConversationService, getConversationMessagesService } from "../services/chat.service";
import type { Conversacion, Mensaje } from "../model/chat.types";

export function useChatsController() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const iniciarConversacion = useCallback(async (usuarioId: number, destinatarioId: number) => {
    try {
      setLoading(true);
      const conversacion = await createConversationService({ usuarioId, destinatarioId });
      
      // Agregar a la lista si no existe
      setConversaciones(prev => 
        prev.find(c => c.id === conversacion.id) ? prev : [...prev, conversacion]
      );
      
      return conversacion;
    } catch (err: any) {
      setError(err.message || "Error al iniciar conversación");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    conversaciones,
    loading,
    error,
    iniciarConversacion,
  };
}
```

### useChatDetailController.ts

```typescript
"use client";

import { useState, useCallback, useEffect } from "react";
import { getConversationMessagesService } from "../services/chat.service";
import type { Mensaje } from "../model/chat.types";

export function useChatDetailController() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarMensajes = useCallback(async (conversacionId: number, usuarioId: number) => {
    try {
      setLoading(true);
      const respuesta = await getConversationMessagesService({
        conversacionId,
        usuarioId,
      });
      
      setMensajes(respuesta);
    } catch (err: any) {
      setError(err.message || "Error al cargar mensajes");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    mensajes,
    loading,
    error,
    cargarMensajes,
  };
}
```

## 👤 FEATURE: PROFILE

### useProfileController.ts

```typescript
"use client";

import { useState, useCallback } from "react";
import { getProfileService, updateProfileService, uploadProfilePhotoService, changeUsernameService } from "../services/profile.service";
import type { UserProfile, CurrentUser } from "../model/profile.types";

export function useProfileController() {
  const [perfil, setPerfil] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarPerfil = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      const perfilData = await getProfileService({ id: userId });
      setPerfil(perfilData);
    } catch (err: any) {
      setError(err.message || "Error al cargar perfil");
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarPerfil = useCallback(async (userId: number, nombre: string, foto: string, descripcion: string) => {
    try {
      setLoading(true);
      const usuarioActualizado = await updateProfileService({
        id: userId,
        nombre,
        foto,
        descripcion,
      });
      
      setPerfil({
        id: usuarioActualizado.id,
        username: usuarioActualizado.username,
        nombreVisualizacion: usuarioActualizado.nombreVisualizacion,
        fotoPerfil: usuarioActualizado.fotoPerfil,
        descripcion: usuarioActualizado.descripcion,
      });
    } catch (err: any) {
      setError(err.message || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  }, []);

  const subirFoto = useCallback(async (userId: number, archivo: File) => {
    try {
      setLoading(true);
      const usuarioActualizado = await uploadProfilePhotoService({
        id: userId,
        foto: archivo,
      });
      
      if (perfil) {
        setPerfil({
          ...perfil,
          fotoPerfil: usuarioActualizado.fotoPerfil,
        });
      }
    } catch (err: any) {
      setError(err.message || "Error al subir foto");
    } finally {
      setLoading(false);
    }
  }, [perfil]);

  return {
    perfil,
    loading,
    error,
    cargarPerfil,
    actualizarPerfil,
    subirFoto,
  };
}
```

## 🎬 FEATURE: PUBLISH

### usePublishController.ts

```typescript
"use client";

import { useState } from "react";
import { publishReelService, editReelService, deleteReelService } from "../services/publish.service";
import type { PublishReelRequest, EditReelRequest } from "../model/publish.types";

export function usePublishController() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const publicarReel = async (data: PublishReelRequest) => {
    try {
      setIsPublishing(true);
      setError("");
      setSuccessMessage("");
      
      const reel = await publishReelService(data);
      setSuccessMessage("Reel publicado exitosamente");
      
      return reel;
    } catch (err: any) {
      setError(err.message || "Error al publicar reel");
    } finally {
      setIsPublishing(false);
    }
  };

  const editarReel = async (data: EditReelRequest) => {
    try {
      setIsPublishing(true);
      setError("");
      setSuccessMessage("");
      
      const reel = await editReelService(data);
      setSuccessMessage("Reel actualizado exitosamente");
      
      return reel;
    } catch (err: any) {
      setError(err.message || "Error al editar reel");
    } finally {
      setIsPublishing(false);
    }
  };

  const eliminarReel = async (reelId: number, usuarioId: number) => {
    try {
      setIsPublishing(true);
      setError("");
      setSuccessMessage("");
      
      await deleteReelService({ reelId, usuarioId });
      setSuccessMessage("Reel eliminado exitosamente");
    } catch (err: any) {
      setError(err.message || "Error al eliminar reel");
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    isPublishing,
    error,
    successMessage,
    publicarReel,
    editarReel,
    eliminarReel,
  };
}
```

## ✅ Checklist de Integración

- [ ] Actualizar todos los controllers con los nuevos services
- [ ] Actualizar vistas para usar controllers actualizados
- [ ] Probar login/register
- [ ] Probar carga de feed con filtros
- [ ] Probar likes y comentarios
- [ ] Probar chat
- [ ] Probar perfil
- [ ] Probar publicar reels
- [ ] Implementar manejo de sesión con localStorage/cookies
- [ ] Agregar interceptores de autenticación si es necesario
