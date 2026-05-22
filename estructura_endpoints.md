# API REST ReelClips - Documentación Swagger

Documentación completa de todos los endpoints REST de la plataforma ReelClips con schemas, parámetros y respuestas.

**Base URL:** `http://localhost:8080/api`

---

## 📋 Tabla de Contenidos

1. [Usuarios](#usuarios)
2. [Reels](#reels)
3. [Categorías](#categorías)
4. [Interacciones](#interacciones)
5. [Feed](#feed)
6. [Chat](#chat)

---

## Usuarios

### POST /api/usuarios/registro

**Descripción:** Registra un nuevo usuario (RF-01)

```
POST /api/usuarios/registro
Content-Type: application/x-www-form-urlencoded

username=usuarioA&email=usuario@test.com&password=miContraseña
```

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `username` | String | ✅ | Nombre único del usuario |
| `email` | String | ✅ | Email único |
| `password` | String | ✅ | Contraseña (hasheada en backend) |

**Response 200 (UsuarioInfo):**
```json
{
  "id": 1,
  "username": "usuarioA",
  "email": "usuario@test.com",
  "nombreVisualizacion": null,
  "fotoPerfil": null,
  "descripcion": null,
  "estadoCuenta": "ACTIVA",
  "fechaRegistro": "2025-05-21T10:30:00"
}
```

**Response 400:** Email o username ya en uso

---

### POST /api/usuarios/login

**Descripción:** Autentica usuario (RF-02)

```
POST /api/usuarios/login
Content-Type: application/x-www-form-urlencoded

email=usuario@test.com&password=miContraseña
```

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `email` | String | ✅ | Email del usuario |
| `password` | String | ✅ | Contraseña |

**Response 200 (UsuarioInfo):** Retorna datos del usuario

**Response 403:** Credenciales incorrectas o cuenta desactivada

**Response 404:** Usuario no encontrado

---

### GET /api/usuarios/{id}/perfil

**Descripción:** Obtiene perfil público de usuario (RF-05)

```
GET /api/usuarios/1/perfil
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | ID del usuario |

**Response 200 (PerfilInfo):**
```json
{
  "id": 1,
  "username": "usuarioA",
  "nombreVisualizacion": "Mi Nombre",
  "fotoPerfil": "https://supabase.../foto.jpg",
  "descripcion": "Bienvenido a mi canal"
}
```

**Response 404:** Usuario no encontrado

---

### PUT /api/usuarios/{id}/perfil

**Descripción:** Edita perfil del usuario (RF-04)

```
PUT /api/usuarios/1/perfil
Content-Type: application/x-www-form-urlencoded

nombre=Nuevo Nombre&foto=https://url.../foto.jpg&descripcion=Nueva descripción
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | ID del usuario |

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `nombre` | String | ✅ | Nombre de visualización |
| `foto` | String | ✅ | URL de foto |
| `descripcion` | String | ✅ | Descripción del perfil |

**Response 200 (UsuarioInfo):** Perfil actualizado

**Response 404:** Usuario no encontrado

---

### POST /api/usuarios/{id}/foto

**Descripción:** Sube foto de perfil (RF-04)

```
POST /api/usuarios/1/foto
Content-Type: multipart/form-data

[binary image file]
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | ID del usuario |

**Request Body:**
```
Content-Disposition: form-data; name="foto"; filename="perfil.jpg"
Content-Type: image/jpeg
[binary data]
```

**Response 200 (UsuarioInfo):** Foto subida, URL actualizada

**Response 404:** Usuario no encontrado

**Response 500:** Error en Supabase

---

### PATCH /api/usuarios/{id}/username

**Descripción:** Cambia username (RF-04, máx 1 vez cada 30 días)

```
PATCH /api/usuarios/1/username
Content-Type: application/x-www-form-urlencoded

nuevoUsername=mi_nuevo_usuario
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | ID del usuario |

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `nuevoUsername` | String | ✅ | Nuevo nombre único |

**Response 200 (UsuarioInfo):** Username cambiado

**Response 400:** No ha pasado 30 días o username en uso

**Response 404:** Usuario no encontrado

---

### DELETE /api/usuarios/{id}

**Descripción:** Desactiva cuenta (RF-06)

```
DELETE /api/usuarios/1
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | ID del usuario |

**Response 204:** Cuenta desactivada (datos conservados 30 días)

**Response 404:** Usuario no encontrado

---

## Reels

### POST /api/reels

**Descripción:** Publica nuevo reel (RF-07, max 90s, 500MB)

```
POST /api/reels
Content-Type: multipart/form-data

usuarioId=1&video=[binary]&descripcion=Mi reel&duracionSegundos=45&tamanoMB=150.5&categoriaIds=1&categoriaIds=2
```

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción | Restricción |
|-------|------|----------|-------------|------------|
| `usuarioId` | Long | ✅ | ID del publicador | |
| `video` | File | ✅ | Archivo mp4 | máx 500MB |
| `descripcion` | String | ❌ | Descripción | máx 500 chars |
| `duracionSegundos` | int | ✅ | Duración | máx 90s |
| `tamanoMB` | double | ✅ | Tamaño archivo | máx 500MB |
| `categoriaIds` | List<Long> | ✅ | Categorías | mínimo 1 |

**Response 200 (ReelInfo):**
```json
{
  "id": 100,
  "urlVideo": "https://supabase.../reel.mp4",
  "urlMiniatura": "https://supabase.../thumb.jpg",
  "descripcion": "Mi primer reel",
  "duracionSegundos": 45,
  "tamanoArchivoMB": 150.5,
  "estado": "ACTIVO",
  "fechaPublicacion": "2025-05-21T14:30:00",
  "contadorLikes": 0,
  "contadorComentarios": 0,
  "canalId": 1,
  "categorias": ["Humor", "Tecnología"]
}
```

**Response 400:** Duración/tamaño inválido o sin categoría

**Response 403:** Sin permisos

**Response 500:** Error en Supabase

---

### GET /api/reels

**Descripción:** Lista reels activos (RF-10)

```
GET /api/reels
```

**Response 200 (List<ReelInfo>):** Array de reels

---

### GET /api/reels/{id}

**Descripción:** Obtiene reel por ID (RF-10)

```
GET /api/reels/100
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | ID del reel |

**Response 200 (ReelInfo):** Datos del reel

**Response 404:** Reel no encontrado

---

### PUT /api/reels/{reelId}

**Descripción:** Edita reel (RF-08, solo propietario)

```
PUT /api/reels/100
Content-Type: application/x-www-form-urlencoded

usuarioId=1&descripcion=Nueva desc&categoriaIds=1&categoriaIds=3
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `reelId` | Long | ID del reel |

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `usuarioId` | Long | ✅ | ID propietario |
| `descripcion` | String | ❌ | Nueva descripción |
| `categoriaIds` | List<Long> | ✅ | Nuevas categorías |

**Response 200 (ReelInfo):** Reel actualizado

**Response 403:** No es propietario

**Response 404:** Reel no encontrado

---

### DELETE /api/reels/{reelId}

**Descripción:** Elimina reel (RF-09, solo propietario)

```
DELETE /api/reels/100
Content-Type: application/x-www-form-urlencoded

usuarioId=1
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `reelId` | Long | ID del reel |

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `usuarioId` | Long | ✅ | ID propietario |

**Response 204:** Reel marcado como ELIMINADO

**Response 403:** No es propietario

**Response 404:** Reel no encontrado

---

### GET /api/reels/{reelId}/stream

**Descripción:** Stream de video con caché (RF-10)

```
GET /api/reels/100/stream?usuarioId=1
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `reelId` | Long | ID del reel |

**Query Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `usuarioId` | Long | ID del usuario |

**Response 200 (VideoStream):**
```json
{
  "id": 100,
  "urlStream": "https://supabase.../reel.mp4",
  "tipoContenido": "video/mp4",
  "tamanoBytesStream": 157696000,
  "duracionSegundos": 45,
  "disponibleEnCache": true,
  "cachePor": "1800"
}
```

**Response 403:** Sin permiso

**Response 404:** Reel no encontrado

---

### GET /api/reels/canal/{canalId}

**Descripción:** Lista reels de un canal (RF-10)

```
GET /api/reels/canal/1
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `canalId` | Long | ID del canal |

**Response 200 (List<ReelInfo>):** Array de reels del canal

**Response 404:** Canal no encontrado

---

## Categorías

### GET /api/categorias

**Descripción:** Lista todas las categorías (RF-19)

```
GET /api/categorias
```

**Response 200 (List<CategoriaInfo>):**
```json
[
  {
    "id": 1,
    "nombre": "Humor",
    "descripcion": "Videos cómicos"
  },
  {
    "id": 2,
    "nombre": "Tecnología",
    "descripcion": "Tech e innovación"
  }
]
```

---

### GET /api/categorias/{id}

**Descripción:** Obtiene categoría por ID (RF-19)

```
GET /api/categorias/1
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | ID de categoría |

**Response 200 (CategoriaInfo):** Datos de categoría

**Response 404:** Categoría no encontrada

---

### POST /api/categorias

**Descripción:** Crea categoría (RF-19, solo admin)

```
POST /api/categorias
Content-Type: application/x-www-form-urlencoded

nombre=Nueva Categoría&descripcion=Descripción
```

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `nombre` | String | ✅ | Nombre único |
| `descripcion` | String | ✅ | Descripción |

**Response 200 (CategoriaInfo):** Categoría creada

**Response 403:** Solo admin

---

### PUT /api/categorias/{id}

**Descripción:** Edita categoría (RF-19, solo admin)

```
PUT /api/categorias/1
Content-Type: application/x-www-form-urlencoded

nombre=Categoría Actualizada&descripcion=Nueva desc
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | ID de categoría |

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `nombre` | String | ✅ | Nuevo nombre |
| `descripcion` | String | ✅ | Nueva descripción |

**Response 200 (CategoriaInfo):** Categoría actualizada

**Response 403:** Solo admin

**Response 404:** Categoría no encontrada

---

### DELETE /api/categorias/{id}

**Descripción:** Elimina categoría (RF-19, solo admin)

```
DELETE /api/categorias/1
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | ID de categoría |

**Response 204:** Categoría eliminada

**Response 403:** Solo admin

**Response 404:** Categoría no encontrada

---

### GET /api/categorias/filtrar

**Descripción:** Filtra categorías por nombre (RF-21)

```
GET /api/categorias/filtrar?nombres=Humor&nombres=Deportes
```

**Query Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `nombres` | List<String> | Nombres de categorías |

**Response 200 (List<CategoriaInfo>):** Categorías filtradas

---

## Interacciones

### POST /api/interacciones/like

**Descripción:** Da like a reel (RF-12, 1 por usuario)

```
POST /api/interacciones/like
Content-Type: application/x-www-form-urlencoded

usuarioId=1&reelId=100
```

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `usuarioId` | Long | ✅ | ID usuario |
| `reelId` | Long | ✅ | ID reel |

**Response 200 (InteraccionInfo):**
```json
{
  "id": 1000,
  "tipo": "LIKE",
  "usuarioId": 1,
  "reelId": 100,
  "fecha": "2025-05-21T16:20:00"
}
```

**Response 400:** Usuario ya dio like

---

### DELETE /api/interacciones/like

**Descripción:** Quita like de reel (RF-13)

```
DELETE /api/interacciones/like
Content-Type: application/x-www-form-urlencoded

usuarioId=1&reelId=100
```

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `usuarioId` | Long | ✅ | ID usuario |
| `reelId` | Long | ✅ | ID reel |

**Response 204:** Like eliminado

**Response 404:** Like no encontrado

---

### POST /api/interacciones/comentario

**Descripción:** Comenta reel (RF-14)

```
POST /api/interacciones/comentario
Content-Type: application/x-www-form-urlencoded

usuarioId=1&reelId=100&contenido=Excelente reel!
```

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `usuarioId` | Long | ✅ | ID usuario |
| `reelId` | Long | ✅ | ID reel |
| `contenido` | String | ✅ | Texto comentario |

**Response 200 (InteraccionInfo):** Comentario registrado

---

### DELETE /api/interacciones/comentario/{comentarioId}

**Descripción:** Elimina comentario (RF-15, solo autor)

```
DELETE /api/interacciones/comentario/2000
Content-Type: application/x-www-form-urlencoded

usuarioId=1
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `comentarioId` | Long | ID comentario |

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `usuarioId` | Long | ✅ | ID autor |

**Response 204:** Comentario eliminado

**Response 403:** No es autor

**Response 404:** Comentario no encontrado

---

### GET /api/interacciones/comentarios/{reelId}

**Descripción:** Lista comentarios de reel (RF-14)

```
GET /api/interacciones/comentarios/100
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `reelId` | Long | ID reel |

**Response 200 (List<InteraccionInfo>):** Array de comentarios

---

## Feed

### GET /api/feed

**Descripción:** Feed paginado con filtros (RF-20, RF-21, RF-22)

```
GET /api/feed?usuarioId=1&categorias=Humor&categorias=Deportes&pagina=0
```

**Query Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `usuarioId` | Long | ✅ | ID usuario |
| `categorias` | List<String> | ❌ | Filtro categorías |
| `pagina` | int | ❌ | Página (default 0) |

**Response 200 (FeedResponse):**
```json
{
  "reels": [
    {
      "id": 100,
      "urlVideo": "https://supabase.../reel.mp4",
      "urlMiniatura": "https://supabase.../thumb.jpg",
      "descripcion": "Reel de humor",
      "duracionSegundos": 45,
      "tamanoArchivoMB": 150.5,
      "estado": "ACTIVO",
      "fechaPublicacion": "2025-05-21T14:30:00",
      "contadorLikes": 25,
      "contadorComentarios": 3,
      "canalId": 2,
      "categorias": ["Humor", "Tecnología"]
    }
  ],
  "paginaActual": 0,
  "totalPaginas": 5,
  "totalElementos": 150,
  "hayMas": true
}
```

**Características:**
- Excluye reels propios del usuario (RN-12)
- Filtra por categorías si se proporcionan (RF-21)
- Soporta scroll infinito (RN-14)

---

## Chat

### POST /api/chat/conversacion

**Descripción:** Inicia conversación (RF-16, única por par)

```
POST /api/chat/conversacion
Content-Type: application/x-www-form-urlencoded

usuarioId=1&destinatarioId=2
```

**Request Parameters:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `usuarioId` | Long | ✅ | ID iniciador |
| `destinatarioId` | Long | ✅ | ID destinatario |

**Response 200 (ConversacionInfo):**
```json
{
  "id": 500,
  "usuario1Id": 1,
  "usuario2Id": 2,
  "fechaInicio": "2025-05-21T10:00:00"
}
```

**Response 404:** Usuario o destinatario no encontrado

---

### GET /api/chat/conversacion/{conversacionId}/mensajes

**Descripción:** Historial de mensajes (RF-17)

```
GET /api/chat/conversacion/500/mensajes?usuarioId=1
```

**Path Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `conversacionId` | Long | ID conversación |

**Query Parameters:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `usuarioId` | Long | ID usuario autenticado |

**Response 200 (List<MensajeInfo>):**
```json
[
  {
    "id": 3000,
    "conversacionId": 500,
    "remitenteId": 1,
    "contenido": "¡Hola! ¿Cómo estás?",
    "tipoContenido": "TEXTO",
    "reelReferidoId": null,
    "fechaEnvio": "2025-05-21T14:00:00"
  },
  {
    "id": 3001,
    "conversacionId": 500,
    "remitenteId": 2,
    "contenido": "Muy bien, gracias",
    "tipoContenido": "TEXTO",
    "reelReferidoId": null,
    "fechaEnvio": "2025-05-21T14:05:00"
  }
]
```

**TipoMensaje Enum:** `TEXTO | REEL | IMAGEN | VIDEO`

**Response 403:** No es parte conversación

**Response 404:** Conversación no encontrada

---

## DTOs Reference

### UsuarioInfo
```java
record UsuarioInfo(
    Long id,
    String username,
    String email,
    String nombreVisualizacion,
    String fotoPerfil,
    String descripcion,
    EstadoCuenta estadoCuenta,
    LocalDateTime fechaRegistro
)
```

### PerfilInfo
```java
record PerfilInfo(
    Long id,
    String username,
    String nombreVisualizacion,
    String fotoPerfil,
    String descripcion
)
```

### ReelInfo
```java
record ReelInfo(
    Long id,
    String urlVideo,
    String urlMiniatura,
    String descripcion,
    int duracionSegundos,
    double tamanoArchivoMB,
    EstadoReel estado,
    LocalDateTime fechaPublicacion,
    int contadorLikes,
    int contadorComentarios,
    Long canalId,
    List<String> categorias
)
```

### VideoStream
```java
record VideoStream(
    Long id,
    String urlStream,
    String tipoContenido,
    long tamanoBytesStream,
    int duracionSegundos,
    boolean disponibleEnCache,
    String cachePor
)
```

### CategoriaInfo
```java
record CategoriaInfo(
    Long id,
    String nombre,
    String descripcion
)
```

### InteraccionInfo
```java
record InteraccionInfo(
    Long id,
    String tipo,
    Long usuarioId,
    Long reelId,
    LocalDateTime fecha
)
```

### FeedResponse
```java
record FeedResponse(
    List<ReelInfo> reels,
    int paginaActual,
    int totalPaginas,
    long totalElementos,
    boolean hayMas
)
```

### ConversacionInfo
```java
record ConversacionInfo(
    Long id,
    Long usuario1Id,
    Long usuario2Id,
    LocalDateTime fechaInicio
)
```

### MensajeInfo
```java
record MensajeInfo(
    Long id,
    Long conversacionId,
    Long remitenteId,
    String contenido,
    TipoMensaje tipoContenido,
    Long reelReferidoId,
    LocalDateTime fechaEnvio
)
```

---

## Enums & Types

### EstadoCuenta
- `ACTIVA` - Cuenta activa
- `DESACTIVADA` - Cuenta desactivada (30 días retención)

### EstadoReel
- `ACTIVO` - Reel publicado y visible
- `ELIMINADO` - Reel marcado como eliminado
- `BLOQUEADO` - Reel bloqueado por moderación

### TipoMensaje
- `TEXTO` - Mensaje de texto
- `REEL` - Referencia compartida de reel
- `IMAGEN` - Imagen compartida
- `VIDEO` - Video compartido

---

## HTTP Status Codes

| Código | Significado | Caso |
|--------|-------------|------|
| 200 | OK | Operación exitosa |
| 204 | No Content | Operación exitosa sin respuesta |
| 400 | Bad Request | Datos inválidos |
| 403 | Forbidden | Sin permisos/autenticación |
| 404 | Not Found | Recurso no existe |
| 500 | Server Error | Error interno |

---

## Reglas de Negocio (RN)

- **RN-01:** Username único por plataforma
- **RN-03:** Se genera canal automático al registrar
- **RN-04:** Cambio de username máximo 1 vez cada 30 días
- **RN-05:** Datos conservados 30 días después desactivación
- **RN-06:** Duración máxima reel: 90 segundos
- **RN-07:** Tamaño máximo reel: 500 MB
- **RN-08:** Solo propietario puede editar/eliminar reel
- **RN-09:** Solo reels ACTIVOS en listados públicos
- **RN-12:** Feed excluye reels propios
- **RN-13:** Un like por usuario por reel
- **RN-14:** Paginación para scroll infinito
- **RN-17:** Una conversación activa por par de usuarios
- **RN-18:** Mensajes ordenados cronológicamente

---

Documento actualizado: 21/05/2025
