// DIAGRAMA DE ARQUITECTURA - CONSUMO DE BACKEND

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     APLICACIÓN FRONTEND (Next.js)                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
                  ┌─────────────────┴─────────────────┐
                  │                                   │
        ┌─────────▼─────────┐          ┌──────────────▼────────┐
        │  VISTAS (Views)   │          │  CONTROLLERS (Hooks)  │
        ├───────────────────┤          ├──────────────────────┤
        │ • LoginForm.tsx   │          │ • useLoginController │
        │ • FeedList.tsx    │◄────────┤ • useFeedController  │
        │ • ChatWindow.tsx  │          │ • useChatController  │
        │ • ProfileCard.tsx │          │ • usePublishCtrlr    │
        │ • PublishForm.tsx │          └──────────────────────┘
        └───────────────────┘                        ▲
                                                     │
                  ┌──────────────────────────────────┘
                  │
        ┌─────────▼──────────────┐
        │  SERVICES (Consumen API)
        ├────────────────────────┤
        │ • auth.service.ts      │◄──┐
        │ • feed.service.ts      │   │
        │ • reel.service.ts      │   │ Importan tipos de
        │ • chat.service.ts      │   │ features/*/model
        │ • profile.service.ts   │   │
        │ • publish.service.ts   │◄──┤
        │ • interactions.service │   │
        └─────────┬──────────────┘   │
                  │                  │
        ┌─────────▼────────────────────────────┐
        │  MODELO DE TIPOS (Model)              │
        ├───────────────────────────────────────┤
        │ • features/*/model/*.types.ts         │
        │   - auth.types.ts                     │
        │   - feed.types.ts                     │
        │   - reel.types.ts                     │
        │   - interactions.types.ts             │
        │   - chat.types.ts                     │
        │   - profile.types.ts                  │
        │   - publish.types.ts                  │
        │ • shared/types/api.types.ts           │
        └──────────┬─────────────────────────────┘
                   │
        ┌──────────▼─────────────────────┐
        │  API CLIENT (shared/services)   │
        ├─────────────────────────────────┤
        │ • api.ts (ApiClient Class)      │
        │   - GET / POST / PUT / PATCH    │
        │   - DELETE / FormData            │
        │   - Query String Builder         │
        │   - Error Handling               │
        └──────────┬──────────────────────┘
                   │
                   │ HTTP Requests
                   │
        ┌──────────▼──────────────────────┐
        │  BACKEND REST API                │
        │  (Base URL: /api)                │
        ├──────────────────────────────────┤
        │ • /usuarios (Auth)               │
        │ • /reels (Feed & Publish)        │
        │ • /categorias (Categories)       │
        │ • /interacciones (Likes/Comments)│
        │ • /chat (Conversations)          │
        │ • /feed (Feed with Filters)      │
        └──────────────────────────────────┘
```

## 📊 FLUJO DE DATOS - EJEMPLO: LOGIN

```
┌──────────────┐
│  LoginForm   │
│   (Vista)    │
└──────┬───────┘
       │ Llama handleLogin()
       │
┌──────▼─────────────────┐
│ useLoginController     │
│ (Hook/Controller)      │
└──────┬─────────────────┘
       │ Llama loginService()
       │
┌──────▼──────────────────────────────┐
│ auth.service.ts                      │
│ loginService(data: LoginRequest)    │
└──────┬───────────────────────────────┘
       │ Llama apiClient.post()
       │
┌──────▼──────────────────────────────┐
│ shared/services/api.ts               │
│ ApiClient.post(endpoint, data)      │
└──────┬───────────────────────────────┘
       │ Construye URL + headers + body
       │
┌──────▼──────────────────────────────┐
│ Fetch HTTP POST                      │
│ POST /api/usuarios/login             │
│ Body: { email, password }            │
└──────┬───────────────────────────────┘
       │
       │ Backend procesa, retorna UsuarioInfo
       │
┌──────▼──────────────────────────────┐
│ Response: UsuarioInfo (DTO)          │
│ {                                    │
│   id, username, email,               │
│   nombreVisualizacion, fotoPerfil,   │
│   descripcion, estadoCuenta,         │
│   fechaRegistro                      │
│ }                                    │
└──────┬───────────────────────────────┘
       │ Retorna a controller
       │
┌──────▼──────────────────────────────┐
│ useLoginController actualiza estado  │
│ localStorage.setItem(usuario)        │
│ router.push(/home)                   │
└──────────────────────────────────────┘
```

## 📁 ESTRUCTURA DE ARCHIVOS IMPLEMENTADA

```
features/
├── auth/
│   ├── model/
│   │   └── auth.types.ts .................. Tipos de auth
│   └── services/
│       └── auth.service.ts ................ 7 funciones de API
│
├── feed/
│   ├── model/
│   │   ├── feed.types.ts .................. Tipos de feed
│   │   ├── reel.types.ts .................. Tipos de reels
│   │   └── interactions.types.ts .......... Tipos de likes/comentarios
│   └── services/
│       ├── feed.service.ts ................ 7 funciones de categorías y feed
│       ├── reel.service.ts ................ 7 funciones de reels
│       └── interactions.service.ts ........ 5 funciones de likes/comentarios
│
├── chats/
│   ├── model/
│   │   ├── chat.types.ts .................. Tipos de chat
│   │   └── message.types.ts ............... Tipos de mensajes
│   └── services/
│       └── chat.service.ts ................ 2 funciones de chat
│
├── profile/
│   ├── model/
│   │   └── profile.types.ts ............... Tipos de perfil
│   └── services/
│       └── profile.service.ts ............. 5 funciones de perfil
│
└── publish/
    ├── model/
    │   └── publish.types.ts ............... Tipos de publicación
    └── services/
        └── publish.service.ts ............. 3 funciones de reel

shared/
├── types/
│   └── api.types.ts ...................... DTOs del backend (tipos compartidos)
└── services/
    └── api.ts ............................ ApiClient class (cliente HTTP)
```

## 🔄 MAPEO ENDPOINTS → SERVICIOS

### AUTH (7 funciones)
✅ POST   /api/usuarios/login              → loginService()
✅ POST   /api/usuarios/registro           → registerService()
✅ GET    /api/usuarios/{id}/perfil        → getProfileService()
✅ PUT    /api/usuarios/{id}/perfil        → updateProfileService()
✅ POST   /api/usuarios/{id}/foto          → uploadProfilePhotoService()
✅ PATCH  /api/usuarios/{id}/username      → changeUsernameService()
✅ DELETE /api/usuarios/{id}               → deleteAccountService()

### FEED (7 funciones)
✅ GET    /api/feed                        → getFeedService()
✅ GET    /api/categorias                  → getAllCategoriesService()
✅ GET    /api/categorias/{id}             → getCategoryService()
✅ GET    /api/categorias/filtrar          → filterCategoriesService()
✅ POST   /api/categorias                  → createCategoryService()
✅ PUT    /api/categorias/{id}             → updateCategoryService()
✅ DELETE /api/categorias/{id}             → deleteCategoryService()

### REELS (7 funciones)
✅ POST   /api/reels                       → createReelService()
✅ GET    /api/reels                       → getAllReelsService()
✅ GET    /api/reels/{id}                  → getReelService()
✅ PUT    /api/reels/{reelId}              → updateReelService()
✅ DELETE /api/reels/{reelId}              → deleteReelService()
✅ GET    /api/reels/{reelId}/stream       → getReelStreamService()
✅ GET    /api/reels/canal/{canalId}       → getCanalReelsService()

### INTERACCIONES (5 funciones)
✅ POST   /api/interacciones/like          → addLikeService()
✅ DELETE /api/interacciones/like          → removeLikeService()
✅ POST   /api/interacciones/comentario    → addCommentService()
✅ DELETE /api/interacciones/comentario    → deleteCommentService()
✅ GET    /api/interacciones/comentarios   → getCommentsService()

### CHAT (2 funciones)
✅ POST   /api/chat/conversacion           → createConversationService()
✅ GET    /api/chat/conversacion/{id}      → getConversationMessagesService()

### PROFILE (5 funciones)
✅ GET    /api/usuarios/{id}/perfil        → getProfileService()
✅ PUT    /api/usuarios/{id}/perfil        → updateProfileService()
✅ POST   /api/usuarios/{id}/foto          → uploadProfilePhotoService()
✅ PATCH  /api/usuarios/{id}/username      → changeUsernameService()
✅ DELETE /api/usuarios/{id}               → deleteAccountService()

### PUBLISH (3 funciones)
✅ POST   /api/reels                       → publishReelService()
✅ PUT    /api/reels/{reelId}              → editReelService()
✅ DELETE /api/reels/{reelId}              → deleteReelService()

TOTAL: 43 funciones implementadas

## 🎯 CARACTERÍSTICAS DESTACADAS

1. **Tipos Sincronizados**
   - Todos los DTOs matchean exactamente con la documentación del backend
   - Enumeraciones para estados (EstadoCuenta, EstadoReel, etc.)

2. **ApiClient Reutilizable**
   - Método GET, POST, PUT, PATCH, DELETE
   - Manejo automático de JSON
   - Soporte para FormData (multipart/form-data)
   - Construye query strings dinámicamente
   - Manejo centralizado de errores

3. **Query String Builder**
   - Convierte objetos a query parameters
   - Soporta arrays de parámetros
   - Maneja valores undefined/null

4. **Manejo de Errores**
   - Catch automático de errores HTTP
   - Parsing de errores JSON del backend
   - Fallback a mensajes genéricos

5. **Respuestas 204 No Content**
   - Manejo especial para respuestas sin contenido
   - Retorna void sin intentar parsear JSON

6. **FormData para Archivos**
   - Upload de videos (reels)
   - Upload de fotos (perfil)
   - Manejo de múltiples campos en FormData

## 📋 SIGUIENTES PASOS

1. Crear `.env.local` con la URL del backend
2. Actualizar controllers para usar los nuevos services
3. Actualizar vistas para integrar controllers
4. Implementar manejo de sesión (localStorage/cookies)
5. Agregar loading states y error handling en vistas
6. Implementar validaciones de input
7. Agregar interceptores de autenticación si es necesario
8. Implementar refresh de tokens si el backend lo requiere
