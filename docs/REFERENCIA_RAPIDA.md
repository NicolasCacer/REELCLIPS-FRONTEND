// REFERENCIA RÁPIDA - MÉTODOS DISPONIBLES

## 🔐 Auth Services
```typescript
import { 
  loginService,
  registerService,
  getProfileService,
  updateProfileService,
  uploadProfilePhotoService,
  changeUsernameService,
  deleteAccountService
} from '@/features/auth/services/auth.service';
```

## 📹 Feed Services
```typescript
import {
  getFeedService,
  getAllCategoriesService,
  getCategoryService,
  filterCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService
} from '@/features/feed/services/feed.service';
```

## 🎬 Reel Services
```typescript
import {
  createReelService,
  getAllReelsService,
  getReelService,
  updateReelService,
  deleteReelService,
  getReelStreamService,
  getCanalReelsService
} from '@/features/feed/services/reel.service';
```

## 👍 Interactions Services
```typescript
import {
  addLikeService,
  removeLikeService,
  addCommentService,
  deleteCommentService,
  getCommentsService
} from '@/features/feed/services/interactions.service';
```

## 💬 Chat Services
```typescript
import {
  createConversationService,
  getConversationMessagesService
} from '@/features/chats/services/chat.service';
```

## 👤 Profile Services
```typescript
import {
  getProfileService,
  updateProfileService,
  uploadProfilePhotoService,
  changeUsernameService,
  deleteAccountService
} from '@/features/profile/services/profile.service';
```

## 🎨 Publish Services
```typescript
import {
  publishReelService,
  editReelService,
  deleteReelService
} from '@/features/publish/services/publish.service';
```

---

## 📝 EJEMPLOS DE USO

### 1. Login
```typescript
const usuario = await loginService({
  email: "usuario@test.com",
  password: "miContraseña123"
});
// Retorna: UsuarioInfo
```

### 2. Obtener Feed
```typescript
const feed = await getFeedService({
  usuarioId: 1,
  categorias: ["Humor", "Deportes"],
  pagina: 0
});
// Retorna: FeedResponse
// {
//   reels: ReelInfo[],
//   paginaActual: 0,
//   totalPaginas: 5,
//   totalElementos: 150,
//   hayMas: true
// }
```

### 3. Publicar Reel
```typescript
const formData = new FormData();
formData.append('usuarioId', '1');
formData.append('video', videoFile);
formData.append('descripcion', 'Mi primer reel');
formData.append('duracionSegundos', '45');
formData.append('tamanoMB', '150.5');
formData.append('categoriaIds', '1');
formData.append('categoriaIds', '2');

const reel = await publishReelService({
  usuarioId: 1,
  video: videoFile,
  descripcion: "Mi primer reel",
  duracionSegundos: 45,
  tamanoMB: 150.5,
  categoriaIds: [1, 2]
});
// Retorna: ReelInfo
```

### 4. Dar Like
```typescript
const like = await addLikeService({
  usuarioId: 1,
  reelId: 100
});
// Retorna: InteraccionInfo
```

### 5. Obtener Comentarios
```typescript
const comentarios = await getCommentsService({
  reelId: 100
});
// Retorna: ComentarioDetalle[]
```

### 6. Iniciar Conversación
```typescript
const conversacion = await createConversationService({
  usuarioId: 1,
  destinatarioId: 2
});
// Retorna: ConversacionInfo
```

### 7. Obtener Mensajes
```typescript
const mensajes = await getConversationMessagesService({
  conversacionId: 500,
  usuarioId: 1
});
// Retorna: MensajeInfo[]
```

### 8. Subir Foto de Perfil
```typescript
const usuario = await uploadProfilePhotoService({
  id: 1,
  foto: fotoFile
});
// Retorna: UsuarioInfo
```

### 9. Cambiar Username
```typescript
const usuario = await changeUsernameService({
  id: 1,
  nuevoUsername: "mi_nuevo_username"
});
// Retorna: ChangeUsernameResponse (UsuarioInfo)
```

### 10. Actualizar Perfil
```typescript
const usuario = await updateProfileService({
  id: 1,
  nombre: "Mi Nuevo Nombre",
  foto: "https://supabase.../foto.jpg",
  descripcion: "Nueva descripción"
});
// Retorna: UpdateProfileResponse (UsuarioInfo)
```

---

## 🎯 TIPOS DISPONIBLES

### Enumeraciones
```typescript
enum EstadoCuenta { ACTIVA, DESACTIVADA }
enum EstadoReel { ACTIVO, ELIMINADO }
enum TipoMensaje { TEXTO, REEL, IMAGEN, VIDEO }
enum TipoInteraccion { LIKE, COMENTARIO }
```

### DTOs Principales
- **UsuarioInfo**: Usuario autenticado
- **PerfilInfo**: Perfil público de usuario
- **ReelInfo**: Información completa de reel
- **VideoStream**: Stream de video
- **CategoriaInfo**: Categoría
- **InteraccionInfo**: Like o comentario
- **ComentarioDetalle**: Comentario con contenido
- **FeedResponse**: Respuesta paginada de feed
- **ConversacionInfo**: Conversación entre usuarios
- **MensajeInfo**: Mensaje en conversación

---

## ⚙️ CONFIGURACIÓN

### 1. Variables de Entorno
Crear `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. Almacenamiento de Usuario
```typescript
// Después del login
localStorage.setItem('reelclips_user', JSON.stringify(usuario));
localStorage.setItem('reelclips_userId', String(usuario.id));

// Obtener usuario
const usuario = JSON.parse(localStorage.getItem('reelclips_user') || '{}');
const userId = localStorage.getItem('reelclips_userId');
```

### 3. Manejo de Errores
```typescript
try {
  const resultado = await loginService(data);
} catch (error: any) {
  console.error(error.message);
  // "API Error: 403 Forbidden"
  // "Error al iniciar sesión"
  // etc.
}
```

---

## 📊 PARÁMETROS REQUERIDOS

### Por Feature

**Auth**
- login: email, password
- register: username, email, password
- updateProfile: id, nombre, foto, descripcion
- changeUsername: id, nuevoUsername

**Feed**
- getFeed: usuarioId, (categorias), (pagina)
- filterCategories: nombres

**Reels**
- createReel: usuarioId, video, duracionSegundos, tamanoMB, categoriaIds
- updateReel: reelId, usuarioId, (descripcion), categoriaIds
- deleteReel: reelId, usuarioId

**Interactions**
- addLike: usuarioId, reelId
- removeLike: usuarioId, reelId
- addComment: usuarioId, reelId, contenido
- deleteComment: comentarioId, usuarioId

**Chat**
- createConversation: usuarioId, destinatarioId
- getMessages: conversacionId, usuarioId

**Profile**
- getProfile: id
- updateProfile: id, nombre, foto, descripcion
- uploadPhoto: id, foto (File)
- changeUsername: id, nuevoUsername
- deleteAccount: id

**Publish**
- publishReel: usuarioId, video, duracionSegundos, tamanoMB, categoriaIds
- editReel: reelId, usuarioId, (descripcion), categoriaIds
- deleteReel: reelId, usuarioId

---

## 🚀 TIPS

1. **Respuestas 204 No Content**: Cuando una función retorna `void`, significa que no hay contenido en la respuesta (operación exitosa).

2. **Query Strings**: El ApiClient construye automáticamente los query strings. No necesitas construirlos manualmente.

3. **FormData**: Para archivos, el ApiClient usa FormData automáticamente. Solo pasa el objeto con el archivo.

4. **Arrays en Query**: Para parámetros array (como categoriaIds), el ApiClient los envía correctamente:
   ```
   categoriaIds=1&categoriaIds=2&categoriaIds=3
   ```

5. **Errores**: Todos los servicios lanzan errores que puedes capturar con try/catch.

6. **Tipos Completos**: Cada función tiene tipos completos de entrada y salida. Aprovecha el autocompletado de TypeScript.

7. **DTOs Inmutables**: Los objetos retornados por los servicios son del backend, no lo modifiques directamente. Crea copias si necesitas cambiarlos.

---

## 📞 REFERENCIAS

- **Estructura de endpoints**: Ver `estructura_endpoints.md`
- **Diagrama de arquitectura**: Ver `DIAGRAMA_ARQUITECTURA.md`
- **Integración con controllers**: Ver `GUIA_INTEGRACION_CONTROLLERS.md`
- **Implementación detallada**: Ver `IMPLEMENTACION_BACKEND.md`
