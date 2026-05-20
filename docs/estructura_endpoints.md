# Estructura Detallada de Endpoints REST - ReelClips

Documento que explica en detalle cada uno de los endpoints REST disponibles en la plataforma ReelClips, incluyendo estructura, protocolo, parámetros, respuestas y funcionamiento.

---

## 📋 Tabla de Contenidos

1. [Módulo Usuarios](#módulo-usuarios)
2. [Módulo Reels](#módulo-reels)
3. [Módulo Categorías](#módulo-categorías)
4. [Módulo Interacciones](#módulo-interacciones)
5. [Módulo Feed](#módulo-feed)
6. [Módulo Chat](#módulo-chat)

---

## Módulo Usuarios

### 1. POST `/api/usuarios/registro` (RF-01)

**Descripción:** Registra un nuevo usuario en la plataforma, creando automáticamente un canal personal asociado.

**Protocolo HTTP:** `POST`

**Estructura de la Solicitud:**

```
POST /api/usuarios/registro HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

username=usuarioA&email=usuario@test.com&password=miContraseña123
```

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `username` | String | ✅ | Nombre de usuario único | `usuarioA` |
| `email` | String | ✅ | Correo electrónico único | `usuario@test.com` |
| `password` | String | ✅ | Contraseña del usuario | `miContraseña123` |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 1,
  "username": "usuarioA",
  "email": "usuario@test.com",
  "nombreVisualizacion": null,
  "fotoPerfil": null,
  "descripcion": null,
  "estadoCuenta": "ACTIVA",
  "fechaRegistro": "2025-05-19T10:30:00"
}
```

**Respuesta DTO (UsuarioInfo):**

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

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Usuario registrado exitosamente |
| 400 | Bad Request | Email o username ya en uso |
| 400 | Bad Request | Datos inválidos o incompletos |

**Reglas de Negocio (RN):**

- **RN-01:** El username debe ser único en la plataforma
- **RN-03:** Se genera automáticamente un canal personal vinculado al usuario
- El email debe ser único y válido
- La contraseña se almacena de forma segura (hash)

**Funcionamiento:**

1. Se valida que el username y email no existan previamente
2. Se crea el registro del usuario con estado `ACTIVA`
3. Se genera automáticamente un canal personal asociado al usuario
4. Se retorna el objeto `UsuarioInfo` con los datos del usuario creado

---

### 2. POST `/api/usuarios/login` (RF-02)

**Descripción:** Autentica al usuario con sus credenciales y retorna sus datos si son correctas.

**Protocolo HTTP:** `POST`

**Estructura de la Solicitud:**

```
POST /api/usuarios/login HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

email=usuario@test.com&password=miContraseña123
```

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `email` | String | ✅ | Correo electrónico | `usuario@test.com` |
| `password` | String | ✅ | Contraseña | `miContraseña123` |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 1,
  "username": "usuarioA",
  "email": "usuario@test.com",
  "nombreVisualizacion": null,
  "fotoPerfil": null,
  "descripcion": null,
  "estadoCuenta": "ACTIVA",
  "fechaRegistro": "2025-05-19T10:30:00"
}
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Sesión iniciada exitosamente |
| 403 | Forbidden | Credenciales incorrectas |
| 403 | Forbidden | Cuenta desactivada |
| 404 | Not Found | Usuario no encontrado |

**Funcionamiento:**

1. Se busca el usuario por email en la base de datos
2. Se valida que la contraseña coincida
3. Se verifica que la cuenta esté activa (`estadoCuenta != DESACTIVADA`)
4. Se retorna el objeto `UsuarioInfo` con los datos del usuario
5. El cliente es responsable de almacenar la información de sesión

---

### 3. GET `/api/usuarios/{id}/perfil` (RF-05)

**Descripción:** Obtiene el perfil público de un usuario específico.

**Protocolo HTTP:** `GET`

**Estructura de la Solicitud:**

```
GET /api/usuarios/1/perfil HTTP/1.1
Host: localhost:8080
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `id` | Long | ✅ | ID del usuario | `1` |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 1,
  "username": "usuarioA",
  "nombreVisualizacion": "Mi Nombre",
  "fotoPerfil": "https://supabase.../foto.jpg",
  "descripcion": "Bienvenidos a mi canal"
}
```

**Respuesta DTO (PerfilInfo):**

```java
record PerfilInfo(
    Long id,
    String username,
    String nombreVisualizacion,
    String fotoPerfil,
    String descripcion
)
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Perfil encontrado |
| 404 | Not Found | Usuario no encontrado |

**Funcionamiento:**

1. Se busca el usuario por ID
2. Se retorna solo la información pública del perfil
3. No incluye datos sensibles como email o fecha de registro

---

### 4. PUT `/api/usuarios/{id}/perfil` (RF-04)

**Descripción:** Actualiza el perfil del usuario (nombre de visualización, descripción, URL de foto).

**Protocolo HTTP:** `PUT`

**Estructura de la Solicitud:**

```
PUT /api/usuarios/1/perfil HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

nombre=Mi Nuevo Nombre&foto=https://supabase.../foto2.jpg&descripcion=Nueva descripción
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | Long | ✅ | ID del usuario a editar |

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `nombre` | String | ✅ | Nombre de visualización | `Mi Nombre` |
| `foto` | String | ✅ | URL de la foto de perfil | `https://supabase.../foto.jpg` |
| `descripcion` | String | ✅ | Descripción del canal | `Bienvenidos a mi canal` |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 1,
  "username": "usuarioA",
  "email": "usuario@test.com",
  "nombreVisualizacion": "Mi Nuevo Nombre",
  "fotoPerfil": "https://supabase.../foto2.jpg",
  "descripcion": "Nueva descripción",
  "estadoCuenta": "ACTIVA",
  "fechaRegistro": "2025-05-19T10:30:00"
}
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Perfil actualizado exitosamente |
| 404 | Not Found | Usuario no encontrado |

**Funcionamiento:**

1. Se valida que el usuario exista
2. Se actualiza el nombre de visualización, foto y descripción
3. Se retorna el objeto `UsuarioInfo` actualizado

**Nota:** Para subir una nueva foto de perfil desde un archivo, usar el endpoint POST `/{id}/foto`

---

### 5. POST `/api/usuarios/{id}/foto` (RF-04)

**Descripción:** Sube una imagen a Supabase Storage y actualiza la URL de la foto de perfil.

**Protocolo HTTP:** `POST`

**Estructura de la Solicitud:**

```
POST /api/usuarios/1/foto HTTP/1.1
Host: localhost:8080
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="foto"; filename="perfil.jpg"
Content-Type: image/jpeg

[contenido binario de la imagen]
------WebKitFormBoundary--
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | Long | ✅ | ID del usuario |

**Parámetros de Entrada (Form Data - Multipart):**

| Parámetro | Tipo | Requerido | Descripción | Formato |
|-----------|------|-----------|-------------|---------|
| `foto` | File | ✅ | Archivo de imagen | jpg, png, webp |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 1,
  "username": "usuarioA",
  "email": "usuario@test.com",
  "nombreVisualizacion": "Mi Nombre",
  "fotoPerfil": "https://supabase.../usuarios/1/foto_1234567890.jpg",
  "descripcion": "Bienvenidos a mi canal",
  "estadoCuenta": "ACTIVA",
  "fechaRegistro": "2025-05-19T10:30:00"
}
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Foto subida y perfil actualizado |
| 404 | Not Found | Usuario no encontrado |
| 500 | Internal Server Error | Error al subir el archivo a Supabase |

**Funcionamiento:**

1. Se valida que el usuario exista
2. Si existe una foto previa, se elimina de Supabase Storage
3. Se sube el nuevo archivo a Supabase Storage
4. Se actualiza la URL de la foto en el perfil del usuario
5. Se retorna el objeto `UsuarioInfo` actualizado con la nueva URL

---

### 6. PATCH `/api/usuarios/{id}/username` (RF-04)

**Descripción:** Cambia el nombre de usuario. Solo permite un cambio cada 30 días.

**Protocolo HTTP:** `PATCH`

**Estructura de la Solicitud:**

```
PATCH /api/usuarios/1/username HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

nuevoUsername=mi_nuevo_username
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | Long | ✅ | ID del usuario |

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `nuevoUsername` | String | ✅ | Nuevo nombre de usuario único | `mi_nuevo_username` |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 1,
  "username": "mi_nuevo_username",
  "email": "usuario@test.com",
  "nombreVisualizacion": "Mi Nombre",
  "fotoPerfil": "https://supabase.../foto.jpg",
  "descripcion": "Bienvenidos a mi canal",
  "estadoCuenta": "ACTIVA",
  "fechaRegistro": "2025-05-19T10:30:00"
}
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Username actualizado exitosamente |
| 400 | Bad Request | Han pasado menos de 30 días desde el último cambio |
| 400 | Bad Request | El nuevo username ya está en uso |
| 404 | Not Found | Usuario no encontrado |

**Reglas de Negocio (RN):**

- **RN-04:** Solo se permite cambiar el username una vez cada 30 días
- El nuevo username debe ser único
- Preserva la trazabilidad de la identidad del usuario

**Funcionamiento:**

1. Se valida que el usuario exista
2. Se verifica que hayan pasado al menos 30 días desde el último cambio
3. Se valida que el nuevo username no esté en uso
4. Se actualiza el username
5. Se retorna el objeto `UsuarioInfo` actualizado

---

### 7. DELETE `/api/usuarios/{id}` (RF-06)

**Descripción:** Desactiva la cuenta del usuario. Los datos se conservan durante 30 días.

**Protocolo HTTP:** `DELETE`

**Estructura de la Solicitud:**

```
DELETE /api/usuarios/1 HTTP/1.1
Host: localhost:8080
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | Long | ✅ | ID del usuario a desactivar |

**Estructura de la Respuesta (204 No Content):**

```
HTTP/1.1 204 No Content
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 204 | No Content | Cuenta desactivada exitosamente |
| 404 | Not Found | Usuario no encontrado |

**Reglas de Negocio (RN):**

- **RN-05:** Los reels y mensajes se conservan durante 30 días
- Permite la recuperación de la cuenta dentro de los 30 días
- Después de 30 días, se realiza una eliminación permanente

**Funcionamiento:**

1. Se valida que el usuario exista
2. Se cambia el estado de la cuenta a `DESACTIVADA`
3. Se inicia un proceso de retención de datos de 30 días
4. Se retorna 204 No Content

---

## Módulo Reels

### 1. POST `/api/reels` (RF-07)

**Descripción:** Publica un nuevo reel con video. El video se sube a Supabase Storage.

**Protocolo HTTP:** `POST`

**Estructura de la Solicitud:**

```
POST /api/reels HTTP/1.1
Host: localhost:8080
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="usuarioId"

1
------WebKitFormBoundary
Content-Disposition: form-data; name="video"; filename="myreel.mp4"
Content-Type: video/mp4

[contenido binario del video]
------WebKitFormBoundary
Content-Disposition: form-data; name="descripcion"

Descripción de mi reel
------WebKitFormBoundary
Content-Disposition: form-data; name="duracionSegundos"

45
------WebKitFormBoundary
Content-Disposition: form-data; name="tamanoMB"

150.5
------WebKitFormBoundary
Content-Disposition: form-data; name="categoriaIds"

1
------WebKitFormBoundary
Content-Disposition: form-data; name="categoriaIds"

2
------WebKitFormBoundary--
```

**Parámetros de Entrada (Form Data - Multipart):**

| Parámetro | Tipo | Requerido | Descripción | Restricciones |
|-----------|------|-----------|-------------|---------------|
| `usuarioId` | Long | ✅ | ID del usuario que publica | Debe existir |
| `video` | File | ✅ | Archivo de video | mp4, máx. 500MB |
| `descripcion` | String | ❌ | Descripción del reel | Máx. 500 caracteres |
| `duracionSegundos` | int | ✅ | Duración del video | Máx. 90 segundos |
| `tamanoMB` | double | ✅ | Tamaño del archivo | Máx. 500 MB |
| `categoriaIds` | List<Long> | ✅ | IDs de categorías | Mínimo 1 categoría |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 100,
  "urlVideo": "https://supabase.../reels/100/video.mp4",
  "urlMiniatura": "https://supabase.../reels/100/thumbnail.jpg",
  "descripcion": "Descripción de mi reel",
  "duracionSegundos": 45,
  "tamanoArchivoMB": 150.5,
  "estado": "ACTIVO",
  "fechaPublicacion": "2025-05-19T14:45:30",
  "contadorLikes": 0,
  "contadorComentarios": 0,
  "canalId": 1,
  "categorias": ["Humor", "Tecnología"]
}
```

**Respuesta DTO (ReelInfo):**

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

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Reel publicado exitosamente |
| 400 | Bad Request | Duración o tamaño inválido |
| 400 | Bad Request | Sin categoría asignada |
| 403 | Forbidden | Usuario no autenticado |
| 500 | Internal Server Error | Error al subir a Supabase |

**Reglas de Negocio (RN):**

- **RN-06:** Duración máxima 90 segundos
- **RN-07:** Tamaño máximo 500 MB
- Mínimo una categoría obligatoria
- El reel se crea con estado `ACTIVO`
- Se asocia automáticamente al canal del usuario

**Funcionamiento:**

1. Se valida que el usuario exista
2. Se valida duración (máx. 90s) y tamaño (máx. 500MB)
3. Se valida que al menos haya una categoría
4. Se sube el video a Supabase Storage
5. Se genera una miniatura del video
6. Se crea el registro del reel en la base de datos
7. Se retorna el objeto `ReelInfo` con los datos del reel creado

---

### 2. GET `/api/reels` (RF-10)

**Descripción:** Lista todos los reels públicos con estado ACTIVO.

**Protocolo HTTP:** `GET`

**Estructura de la Solicitud:**

```
GET /api/reels HTTP/1.1
Host: localhost:8080
```

**Parámetros de Entrada:** Ninguno

**Estructura de la Respuesta (200 OK):**

```json
[
  {
    "id": 100,
    "urlVideo": "https://supabase.../reels/100/video.mp4",
    "urlMiniatura": "https://supabase.../reels/100/thumbnail.jpg",
    "descripcion": "Primer reel",
    "duracionSegundos": 45,
    "tamanoArchivoMB": 150.5,
    "estado": "ACTIVO",
    "fechaPublicacion": "2025-05-19T14:45:30",
    "contadorLikes": 25,
    "contadorComentarios": 3,
    "canalId": 1,
    "categorias": ["Humor", "Tecnología"]
  },
  {
    "id": 101,
    "urlVideo": "https://supabase.../reels/101/video.mp4",
    "urlMiniatura": "https://supabase.../reels/101/thumbnail.jpg",
    "descripcion": "Segundo reel",
    "duracionSegundos": 60,
    "tamanoArchivoMB": 200.0,
    "estado": "ACTIVO",
    "fechaPublicacion": "2025-05-19T15:30:00",
    "contadorLikes": 50,
    "contadorComentarios": 7,
    "canalId": 2,
    "categorias": ["Deportes"]
  }
]
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Lista de reels activos |

**Reglas de Negocio (RN):**

- **RN-09:** Solo retorna reels con estado `ACTIVO`
- Todos los reels son públicos por defecto

**Funcionamiento:**

1. Se consulta la base de datos por todos los reels con estado `ACTIVO`
2. Se retorna una lista de objetos `ReelInfo`

---

### 3. GET `/api/reels/{id}` (RF-10)

**Descripción:** Obtiene los datos completos de un reel específico.

**Protocolo HTTP:** `GET`

**Estructura de la Solicitud:**

```
GET /api/reels/100 HTTP/1.1
Host: localhost:8080
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | Long | ✅ | ID del reel |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 100,
  "urlVideo": "https://supabase.../reels/100/video.mp4",
  "urlMiniatura": "https://supabase.../reels/100/thumbnail.jpg",
  "descripcion": "Descripción del reel",
  "duracionSegundos": 45,
  "tamanoArchivoMB": 150.5,
  "estado": "ACTIVO",
  "fechaPublicacion": "2025-05-19T14:45:30",
  "contadorLikes": 25,
  "contadorComentarios": 3,
  "canalId": 1,
  "categorias": ["Humor", "Tecnología"]
}
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Reel encontrado |
| 404 | Not Found | Reel no encontrado |

**Funcionamiento:**

1. Se busca el reel por ID en la base de datos
2. Se retorna el objeto `ReelInfo` con los datos completos

---

### 4. PUT `/api/reels/{reelId}` (RF-08)

**Descripción:** Edita la descripción y categorías de un reel. Solo el propietario puede editarlo.

**Protocolo HTTP:** `PUT`

**Estructura de la Solicitud:**

```
PUT /api/reels/100 HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

usuarioId=1&descripcion=Nueva descripción&categoriaIds=1&categoriaIds=3
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `reelId` | Long | ✅ | ID del reel a editar |

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `usuarioId` | Long | ✅ | ID del usuario propietario | `1` |
| `descripcion` | String | ❌ | Nueva descripción | `Nueva descripción` |
| `categoriaIds` | List<Long> | ✅ | Nuevos IDs de categorías | `[1, 3]` |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 100,
  "urlVideo": "https://supabase.../reels/100/video.mp4",
  "urlMiniatura": "https://supabase.../reels/100/thumbnail.jpg",
  "descripcion": "Nueva descripción",
  "duracionSegundos": 45,
  "tamanoArchivoMB": 150.5,
  "estado": "ACTIVO",
  "fechaPublicacion": "2025-05-19T14:45:30",
  "contadorLikes": 25,
  "contadorComentarios": 3,
  "canalId": 1,
  "categorias": ["Humor", "Entretenimiento"]
}
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Reel editado exitosamente |
| 400 | Bad Request | Datos inválidos |
| 403 | Forbidden | El usuario no es propietario del reel |
| 404 | Not Found | Reel no encontrado |

**Reglas de Negocio (RN):**

- **RN-08:** Solo el propietario del reel puede editarlo

**Funcionamiento:**

1. Se valida que el reel exista
2. Se verifica que el usuario sea el propietario del reel
3. Se actualiza la descripción (si se proporciona)
4. Se actualiza las categorías asociadas
5. Se retorna el objeto `ReelInfo` actualizado

---

### 5. DELETE `/api/reels/{reelId}` (RF-09)

**Descripción:** Marca el reel como ELIMINADO. Solo el propietario puede eliminarlo.

**Protocolo HTTP:** `DELETE`

**Estructura de la Solicitud:**

```
DELETE /api/reels/100 HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

usuarioId=1
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `reelId` | Long | ✅ | ID del reel a eliminar |

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `usuarioId` | Long | ✅ | ID del usuario propietario | `1` |

**Estructura de la Respuesta (204 No Content):**

```
HTTP/1.1 204 No Content
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 204 | No Content | Reel eliminado exitosamente |
| 403 | Forbidden | El usuario no es propietario del reel |
| 404 | Not Found | Reel no encontrado |

**Reglas de Negocio (RN):**

- **RN-08:** Solo el propietario del reel puede eliminarlo
- El reel se marca como `ELIMINADO` (no se elimina físicamente)

**Funcionamiento:**

1. Se valida que el reel exista
2. Se verifica que el usuario sea el propietario
3. Se cambia el estado del reel a `ELIMINADO`
4. Se retorna 204 No Content

---

### 6. GET `/api/reels/{reelId}/stream` (RF-10)

**Descripción:** Obtiene el stream de video con verificación de permisos. Utiliza patrón Proxy con caché.

**Protocolo HTTP:** `GET`

**Estructura de la Solicitud:**

```
GET /api/reels/100/stream HTTP/1.1
Host: localhost:8080
?usuarioId=1
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `reelId` | Long | ✅ | ID del reel a reproducir |

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `usuarioId` | Long | ✅ | ID del usuario que solicita el stream |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 100,
  "urlStream": "https://supabase.../reels/100/video.mp4",
  "tipoContenido": "video/mp4",
  "tamanoBytesStream": 157696000,
  "duracionSegundos": 45,
  "disponibleEnCache": true,
  "cachePor": "1800" 
}
```

**Respuesta DTO (VideoStream):**

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

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Stream disponible |
| 403 | Forbidden | Sin permiso para ver este reel |
| 404 | Not Found | Reel no encontrado |

**Funcionamiento (Patrón Proxy):**

1. Se valida que el reel exista
2. `ServicioAutorizacion` verifica que el usuario tenga permisos para ver el reel
3. Se consulta `CacheVideo` para verificar si el stream está en caché
4. Si está en caché, se retorna la URL del caché (más rápido)
5. Si no está en caché, se obtiene de `ServicioAlmacenamientoVideo`
6. Se retorna el objeto `VideoStream` con los datos del stream

---

### 7. GET `/api/reels/canal/{canalId}` (RF-10)

**Descripción:** Lista todos los reels publicados en un canal específico (todos los estados).

**Protocolo HTTP:** `GET`

**Estructura de la Solicitud:**

```
GET /api/reels/canal/1 HTTP/1.1
Host: localhost:8080
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `canalId` | Long | ✅ | ID del canal |

**Estructura de la Respuesta (200 OK):**

```json
[
  {
    "id": 100,
    "urlVideo": "https://supabase.../reels/100/video.mp4",
    "urlMiniatura": "https://supabase.../reels/100/thumbnail.jpg",
    "descripcion": "Reel del canal",
    "duracionSegundos": 45,
    "tamanoArchivoMB": 150.5,
    "estado": "ACTIVO",
    "fechaPublicacion": "2025-05-19T14:45:30",
    "contadorLikes": 25,
    "contadorComentarios": 3,
    "canalId": 1,
    "categorias": ["Humor"]
  }
]
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Lista de reels del canal |
| 404 | Not Found | Canal no encontrado |

**Funcionamiento:**

1. Se valida que el canal exista
2. Se consultan todos los reels del canal (todos los estados)
3. Se retorna una lista de objetos `ReelInfo`

---

## Módulo Categorías

### 1. GET `/api/categorias` (RF-19)

**Descripción:** Retorna todas las categorías disponibles.

**Protocolo HTTP:** `GET`

**Estructura de la Solicitud:**

```
GET /api/categorias HTTP/1.1
Host: localhost:8080
```

**Parámetros de Entrada:** Ninguno

**Estructura de la Respuesta (200 OK):**

```json
[
  {
    "id": 1,
    "nombre": "Humor",
    "descripcion": "Videos cómicos y divertidos"
  },
  {
    "id": 2,
    "nombre": "Tecnología",
    "descripcion": "Videos sobre tecnología e innovación"
  },
  {
    "id": 3,
    "nombre": "Deportes",
    "descripcion": "Videos de deportes y competencias"
  }
]
```

**Respuesta DTO (CategoriaInfo):**

```java
record CategoriaInfo(
    Long id,
    String nombre,
    String descripcion
)
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Lista de categorías |

**Funcionamiento:**

1. Se consultan todas las categorías de la base de datos
2. Se retorna una lista de objetos `CategoriaInfo`

---

### 2. GET `/api/categorias/{id}` (RF-19)

**Descripción:** Retorna una categoría específica por su ID.

**Protocolo HTTP:** `GET`

**Estructura de la Solicitud:**

```
GET /api/categorias/1 HTTP/1.1
Host: localhost:8080
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | Long | ✅ | ID de la categoría |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 1,
  "nombre": "Humor",
  "descripcion": "Videos cómicos y divertidos"
}
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Categoría encontrada |
| 404 | Not Found | Categoría no encontrada |

**Funcionamiento:**

1. Se busca la categoría por ID
2. Se retorna el objeto `CategoriaInfo` si existe

---

### 3. POST `/api/categorias` (RF-19)

**Descripción:** Crea una nueva categoría. Solo administradores pueden crear categorías.

**Protocolo HTTP:** `POST`

**Estructura de la Solicitud:**

```
POST /api/categorias HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

nombre=Nueva Categoría&descripcion=Descripción de la nueva categoría
```

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `nombre` | String | ✅ | Nombre de la categoría | `Nueva Categoría` |
| `descripcion` | String | ✅ | Descripción de la categoría | `Descripción...` |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 10,
  "nombre": "Nueva Categoría",
  "descripcion": "Descripción de la nueva categoría"
}
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Categoría creada exitosamente |
| 403 | Forbidden | Solo administradores pueden crear categorías |

**Funcionamiento:**

1. Se verifica que el usuario sea administrador
2. Se valida que el nombre sea único
3. Se crea la categoría
4. Se retorna el objeto `CategoriaInfo` con la nueva categoría

---

### 4. PUT `/api/categorias/{id}` (RF-19)

**Descripción:** Edita una categoría existente. Solo administradores pueden editar.

**Protocolo HTTP:** `PUT`

**Estructura de la Solicitud:**

```
PUT /api/categorias/1 HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

nombre=Categoría Actualizada&descripcion=Nueva descripción
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | Long | ✅ | ID de la categoría |

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `nombre` | String | ✅ | Nuevo nombre | `Categoría Actualizada` |
| `descripcion` | String | ✅ | Nueva descripción | `Nueva descripción` |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 1,
  "nombre": "Categoría Actualizada",
  "descripcion": "Nueva descripción"
}
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Categoría editada exitosamente |
| 403 | Forbidden | Solo administradores pueden editar categorías |
| 404 | Not Found | Categoría no encontrada |

**Funcionamiento:**

1. Se verifica que el usuario sea administrador
2. Se valida que la categoría exista
3. Se actualiza el nombre y descripción
4. Se retorna el objeto `CategoriaInfo` actualizado

---

### 5. DELETE `/api/categorias/{id}` (RF-19)

**Descripción:** Elimina una categoría. Solo administradores pueden eliminar.

**Protocolo HTTP:** `DELETE`

**Estructura de la Solicitud:**

```
DELETE /api/categorias/1 HTTP/1.1
Host: localhost:8080
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | Long | ✅ | ID de la categoría a eliminar |

**Estructura de la Respuesta (204 No Content):**

```
HTTP/1.1 204 No Content
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 204 | No Content | Categoría eliminada exitosamente |
| 403 | Forbidden | Solo administradores pueden eliminar categorías |
| 404 | Not Found | Categoría no encontrada |

**Funcionamiento:**

1. Se verifica que el usuario sea administrador
2. Se valida que la categoría exista
3. Se elimina la categoría de la base de datos
4. Se retorna 204 No Content

---

### 6. GET `/api/categorias/filtrar` (RF-21)

**Descripción:** Filtra y retorna categorías que coincidan con los nombres indicados.

**Protocolo HTTP:** `GET`

**Estructura de la Solicitud:**

```
GET /api/categorias/filtrar?nombres=Humor&nombres=Deportes HTTP/1.1
Host: localhost:8080
```

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `nombres` | List<String> | ✅ | Lista de nombres de categorías | `[Humor, Deportes]` |

**Estructura de la Respuesta (200 OK):**

```json
[
  {
    "id": 1,
    "nombre": "Humor",
    "descripcion": "Videos cómicos y divertidos"
  },
  {
    "id": 3,
    "nombre": "Deportes",
    "descripcion": "Videos de deportes y competencias"
  }
]
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Categorías filtradas |

**Funcionamiento:**

1. Se reciben los nombres de categorías a filtrar
2. Se consultan las categorías que coincidan con los nombres
3. Se retorna una lista de objetos `CategoriaInfo` filtrados

---

## Módulo Interacciones

### 1. POST `/api/interacciones/like` (RF-12)

**Descripción:** Da un like a un reel. Un usuario solo puede dar un like por reel.

**Protocolo HTTP:** `POST`

**Estructura de la Solicitud:**

```
POST /api/interacciones/like HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

usuarioId=1&reelId=100
```

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `usuarioId` | Long | ✅ | ID del usuario | `1` |
| `reelId` | Long | ✅ | ID del reel | `100` |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 1000,
  "tipo": "LIKE",
  "usuarioId": 1,
  "reelId": 100,
  "fecha": "2025-05-19T16:20:00"
}
```

**Respuesta DTO (InteraccionInfo):**

```java
record InteraccionInfo(
    Long id,
    String tipo,
    Long usuarioId,
    Long reelId,
    LocalDateTime fecha
)
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Like registrado exitosamente |
| 400 | Bad Request | Usuario ya dio like a este reel |

**Reglas de Negocio (RN):**

- **RN-13:** Un usuario solo puede dar un like por reel
- Intentar dar un segundo like debe retornar error o actualizar

**Funcionamiento:**

1. Se valida que el usuario y el reel existan
2. Se verifica que el usuario no haya dado un like previo a este reel
3. Se crea el registro de interacción de tipo `LIKE`
4. Se incrementa el contador de likes del reel
5. Se retorna el objeto `InteraccionInfo` con los datos del like

---

### 2. DELETE `/api/interacciones/like` (RF-13)

**Descripción:** Elimina el like dado a un reel.

**Protocolo HTTP:** `DELETE`

**Estructura de la Solicitud:**

```
DELETE /api/interacciones/like HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

usuarioId=1&reelId=100
```

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `usuarioId` | Long | ✅ | ID del usuario | `1` |
| `reelId` | Long | ✅ | ID del reel | `100` |

**Estructura de la Respuesta (204 No Content):**

```
HTTP/1.1 204 No Content
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 204 | No Content | Like eliminado exitosamente |
| 404 | Not Found | Like no encontrado |

**Funcionamiento:**

1. Se busca el like del usuario en el reel
2. Se elimina el registro de interacción
3. Se decrementa el contador de likes del reel
4. Se retorna 204 No Content

---

### 3. POST `/api/interacciones/comentario` (RF-14)

**Descripción:** Agrega un comentario público a un reel.

**Protocolo HTTP:** `POST`

**Estructura de la Solicitud:**

```
POST /api/interacciones/comentario HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

usuarioId=1&reelId=100&contenido=Excelente reel, me encantó
```

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `usuarioId` | Long | ✅ | ID del usuario | `1` |
| `reelId` | Long | ✅ | ID del reel | `100` |
| `contenido` | String | ✅ | Contenido del comentario | `Excelente reel...` |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 2000,
  "tipo": "COMENTARIO",
  "usuarioId": 1,
  "reelId": 100,
  "fecha": "2025-05-19T16:25:00"
}
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Comentario registrado exitosamente |
| 404 | Not Found | Usuario o reel no encontrado |

**Funcionamiento:**

1. Se valida que el usuario y el reel existan
2. Se crea el registro de interacción de tipo `COMENTARIO`
3. Se guarda el contenido del comentario
4. Se incrementa el contador de comentarios del reel
5. Se retorna el objeto `InteraccionInfo` con los datos del comentario

---

### 4. DELETE `/api/interacciones/comentario/{comentarioId}` (RF-15)

**Descripción:** Elimina un comentario. Solo el autor del comentario puede eliminarlo.

**Protocolo HTTP:** `DELETE`

**Estructura de la Solicitud:**

```
DELETE /api/interacciones/comentario/2000 HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

usuarioId=1
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `comentarioId` | Long | ✅ | ID del comentario a eliminar |

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `usuarioId` | Long | ✅ | ID del usuario autor | `1` |

**Estructura de la Respuesta (204 No Content):**

```
HTTP/1.1 204 No Content
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 204 | No Content | Comentario eliminado exitosamente |
| 403 | Forbidden | Solo el autor del comentario puede eliminarlo |
| 404 | Not Found | Comentario no encontrado |

**Funcionamiento:**

1. Se busca el comentario por ID
2. Se verifica que el usuario sea el autor del comentario
3. Se elimina el comentario
4. Se decrementa el contador de comentarios del reel
5. Se retorna 204 No Content

---

### 5. GET `/api/interacciones/comentarios/{reelId}` (RF-14)

**Descripción:** Retorna todos los comentarios de un reel en orden cronológico.

**Protocolo HTTP:** `GET`

**Estructura de la Solicitud:**

```
GET /api/interacciones/comentarios/100 HTTP/1.1
Host: localhost:8080
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `reelId` | Long | ✅ | ID del reel |

**Estructura de la Respuesta (200 OK):**

```json
[
  {
    "id": 2000,
    "tipo": "COMENTARIO",
    "usuarioId": 1,
    "reelId": 100,
    "fecha": "2025-05-19T16:25:00"
  },
  {
    "id": 2001,
    "tipo": "COMENTARIO",
    "usuarioId": 2,
    "reelId": 100,
    "fecha": "2025-05-19T16:30:00"
  }
]
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Lista de comentarios |

**Funcionamiento:**

1. Se busca el reel por ID
2. Se consultan todos los comentarios del reel
3. Se ordena por fecha (más antiguos primero)
4. Se retorna una lista de objetos `InteraccionInfo`

---

## Módulo Feed

### 1. GET `/api/feed` (RF-20, RF-21, RF-22)

**Descripción:** Retorna reels públicos paginados con posibilidad de filtrar por categorías. Excluye reels propios. Soporta scroll infinito.

**Protocolo HTTP:** `GET`

**Estructura de la Solicitud:**

```
GET /api/feed?usuarioId=1&categorias=Humor&categorias=Tecnología&pagina=0 HTTP/1.1
Host: localhost:8080
```

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Restricciones |
|-----------|------|-----------|-------------|---------------|
| `usuarioId` | Long | ✅ | ID del usuario autenticado | Debe existir |
| `categorias` | List<String> | ❌ | Nombres de categorías para filtrar | Opcional |
| `pagina` | int | ❌ | Número de página | Empieza en 0, default=0 |

**Estructura de la Respuesta (200 OK):**

```json
{
  "reels": [
    {
      "id": 100,
      "urlVideo": "https://supabase.../reels/100/video.mp4",
      "urlMiniatura": "https://supabase.../reels/100/thumbnail.jpg",
      "descripcion": "Reel de humor",
      "duracionSegundos": 45,
      "tamanoArchivoMB": 150.5,
      "estado": "ACTIVO",
      "fechaPublicacion": "2025-05-19T14:45:30",
      "contadorLikes": 25,
      "contadorComentarios": 3,
      "canalId": 2,
      "categorias": ["Humor", "Tecnología"]
    },
    {
      "id": 101,
      "urlVideo": "https://supabase.../reels/101/video.mp4",
      "urlMiniatura": "https://supabase.../reels/101/thumbnail.jpg",
      "descripcion": "Reel de deportes",
      "duracionSegundos": 60,
      "tamanoArchivoMB": 200.0,
      "estado": "ACTIVO",
      "fechaPublicacion": "2025-05-19T15:30:00",
      "contadorLikes": 50,
      "contadorComentarios": 7,
      "canalId": 3,
      "categorias": ["Deportes"]
    }
  ],
  "paginaActual": 0,
  "totalPaginas": 5,
  "totalElementos": 150,
  "hayMas": true
}
```

**Respuesta DTO (FeedResponse):**

```java
record FeedResponse(
    List<ReelInfo> reels,
    int paginaActual,
    int totalPaginas,
    long totalElementos,
    boolean hayMas
)
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Feed obtenido exitosamente |

**Reglas de Negocio (RN):**

- **RF-20:** Retorna reels públicos paginados
- **RF-21:** Filtra por categorías si se indican
- **RF-22:** Excluye reels propios del usuario (RN-12)
- **RN-14:** Soporta scroll infinito mediante paginación

**Funcionamiento:**

1. Se valida que el usuario exista
2. Se consultan reels públicos (estado ACTIVO)
3. Se excluyen los reels del usuario autenticado (RN-12)
4. Si se proporcionan categorías, se filtran los reels por esas categorías
5. Se aplica paginación (p. ej., 10 elementos por página)
6. Se retorna el objeto `FeedResponse` con:
   - `reels`: Lista de reels de la página actual
   - `paginaActual`: Número de página actual
   - `totalPaginas`: Total de páginas disponibles
   - `totalElementos`: Total de reels que cumplen los criterios
   - `hayMas`: Indica si hay más reels para cargar

---

## Módulo Chat

### 1. POST `/api/chat/conversacion` (RF-16)

**Descripción:** Inicia una nueva conversación entre dos usuarios o reutiliza una existente.

**Protocolo HTTP:** `POST`

**Estructura de la Solicitud:**

```
POST /api/chat/conversacion HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

usuarioId=1&destinatarioId=2
```

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `usuarioId` | Long | ✅ | ID del usuario autenticado | `1` |
| `destinatarioId` | Long | ✅ | ID del otro usuario | `2` |

**Estructura de la Respuesta (200 OK):**

```json
{
  "id": 500,
  "usuario1Id": 1,
  "usuario2Id": 2,
  "fechaInicio": "2025-05-19T10:00:00"
}
```

**Respuesta DTO (ConversacionInfo):**

```java
record ConversacionInfo(
    Long id,
    Long usuario1Id,
    Long usuario2Id,
    LocalDateTime fechaInicio
)
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Conversación iniciada o reutilizada |
| 404 | Not Found | Usuario o destinatario no encontrado |

**Reglas de Negocio (RN):**

- **RN-17:** Solo puede haber una conversación activa entre dos usuarios
- Si la conversación ya existe, se reutiliza y se retorna

**Funcionamiento:**

1. Se valida que ambos usuarios existan
2. Se verifica si ya existe una conversación activa entre los dos usuarios
3. Si existe, se retorna la conversación existente
4. Si no existe, se crea una nueva conversación
5. Se retorna el objeto `ConversacionInfo` con los datos de la conversación

---

### 2. GET `/api/chat/conversacion/{conversacionId}/mensajes` (RF-17)

**Descripción:** Retorna todos los mensajes de una conversación en orden cronológico.

**Protocolo HTTP:** `GET`

**Estructura de la Solicitud:**

```
GET /api/chat/conversacion/500/mensajes?usuarioId=1 HTTP/1.1
Host: localhost:8080
```

**Parámetros de Entrada (Path Variables):**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `conversacionId` | Long | ✅ | ID de la conversación |

**Parámetros de Entrada (Query Parameters):**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `usuarioId` | Long | ✅ | ID del usuario autenticado | `1` |

**Estructura de la Respuesta (200 OK):**

```json
[
  {
    "id": 3000,
    "conversacionId": 500,
    "remitenteId": 1,
    "contenido": "¡Hola! ¿Cómo estás?",
    "tipoContenido": "TEXTO",
    "reelReferidoId": null,
    "fechaEnvio": "2025-05-19T14:00:00"
  },
  {
    "id": 3001,
    "conversacionId": 500,
    "remitenteId": 2,
    "contenido": "¡Hola! Muy bien, gracias",
    "tipoContenido": "TEXTO",
    "reelReferidoId": null,
    "fechaEnvio": "2025-05-19T14:05:00"
  },
  {
    "id": 3002,
    "conversacionId": 500,
    "remitenteId": 1,
    "contenido": "Mira este reel",
    "tipoContenido": "REEL",
    "reelReferidoId": 100,
    "fechaEnvio": "2025-05-19T14:10:00"
  }
]
```

**Respuesta DTO (MensajeInfo):**

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

**Enumeración (TipoMensaje):**

```java
enum TipoMensaje {
    TEXTO,      // Mensaje de texto plano
    REEL,       // Referencia a un reel compartido
    IMAGEN,     // Imagen compartida
    VIDEO       // Video compartido
}
```

**Códigos de Respuesta Posibles:**

| Código | Descripción | Motivo |
|--------|-------------|--------|
| 200 | OK | Historial de mensajes obtenido |
| 404 | Not Found | Conversación no encontrada |
| 403 | Forbidden | El usuario no es parte de la conversación |

**Reglas de Negocio (RN):**

- **RN-18:** El historial de mensajes se retorna en orden cronológico (más antiguos primero)
- Solo los usuarios de la conversación pueden ver el historial

**Funcionamiento:**

1. Se valida que la conversación exista
2. Se verifica que el usuario sea parte de la conversación (usuario1Id o usuario2Id)
3. Se consultan todos los mensajes de la conversación
4. Se ordena por fecha de envío (ascendente - más antiguos primero)
5. Se retorna una lista de objetos `MensajeInfo` con todos los mensajes

---

## 📌 Notas Generales

### Códigos de Estado HTTP Estándar

- **200 OK:** La solicitud fue exitosa
- **204 No Content:** La solicitud fue exitosa pero no hay contenido en la respuesta
- **400 Bad Request:** Datos inválidos o incompletos
- **403 Forbidden:** Acceso denegado (permisos insuficientes)
- **404 Not Found:** Recurso no encontrado
- **500 Internal Server Error:** Error en el servidor

### Convenciones de Parámetros

- **Path Variables:** Se especifican en la ruta como `{parametro}`
- **Query Parameters:** Se pasan en la URL como `?param=valor`
- **Form Data:** Para multipart/form-data (archivos)

### Patrones Arquitectónicos Utilizados

1. **Patrón Proxy:** Utilizado en `/api/reels/{reelId}/stream` para gestionar permisos y caché
2. **Patrón Facade:** Utilizado en módulos como Chat, Feed e Interacciones
3. **DTO (Data Transfer Objects):** Utilizados para encapsular y transferir datos

### Seguridad

- Validación de permisos en operaciones de edición y eliminación
- Solo propietarios pueden editar/eliminar sus recursos
- Solo administradores pueden gestionar categorías
- Verificación de autorización en endpoints sensibles

### Manejo de Archivos

- Videos: Almacenados en Supabase Storage
- Fotos: Almacenadas en Supabase Storage
- Miniaturas: Generadas automáticamente para reels

---

## 📚 Resumen de Requisitos Funcionales

| RF | Descripción | Endpoints |
|----|-------------|-----------|
| RF-01 | Registro de usuario | POST /api/usuarios/registro |
| RF-02 | Login de usuario | POST /api/usuarios/login |
| RF-04 | Edición de perfil | PUT/PATCH /api/usuarios/{id}/... |
| RF-05 | Ver perfil de usuario | GET /api/usuarios/{id}/perfil |
| RF-06 | Desactivar cuenta | DELETE /api/usuarios/{id} |
| RF-07 | Publicar reel | POST /api/reels |
| RF-08 | Editar reel | PUT /api/reels/{reelId} |
| RF-09 | Eliminar reel | DELETE /api/reels/{reelId} |
| RF-10 | Ver/listar reels | GET /api/reels/... |
| RF-12 | Dar like | POST /api/interacciones/like |
| RF-13 | Quitar like | DELETE /api/interacciones/like |
| RF-14 | Comentar reel | POST /api/interacciones/comentario |
| RF-15 | Eliminar comentario | DELETE /api/interacciones/comentario/{comentarioId} |
| RF-16 | Iniciar conversación | POST /api/chat/conversacion |
| RF-17 | Ver historial de chat | GET /api/chat/conversacion/{conversacionId}/mensajes |
| RF-19 | Gestionar categorías | GET/POST/PUT/DELETE /api/categorias |
| RF-20 | Obtener feed | GET /api/feed |
| RF-21 | Filtrar por categorías | GET /api/categorias/filtrar, GET /api/feed?categorias=... |
| RF-22 | Scroll infinito | GET /api/feed?pagina=... |

---

Documento generado: 19/05/2025
