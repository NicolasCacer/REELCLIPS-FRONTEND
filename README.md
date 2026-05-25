# ReelClips Frontend

Frontend de ReelClips construido con Next.js (App Router), TypeScript y Tailwind CSS.

## Despliegue

- URL productiva: [https://reelclips-frontend.vercel.app/](https://reelclips-frontend.vercel.app/)
- El despliegue se realiza automáticamente con Vercel a partir del repositorio.

## Estructura del repositorio

```text
.
|-- app/
|   |-- favicon.ico
|   |-- globals.css
|   |-- layout.tsx
|   |-- page.tsx
|   |-- (public)/
|   |   |-- login/
|   |   |   `-- page.tsx
|   |   `-- register/
|   |       `-- page.tsx
|   `-- (private)/
|       |-- layout.tsx
|       |-- chats/
|       |   |-- page.tsx
|       |   `-- [chatId]/
|       |       `-- page.tsx
|       |-- home/
|       |   `-- page.tsx
|       |-- profile/
|       |   `-- page.tsx
|       `-- publish/
|           `-- page.tsx
|-- docs/
|   |-- ADR/
|   |   |-- ADR.md
|   |   |-- ADR-001.md
|   |   |-- ADR-002.md
|   |   |-- ADR-003.md
|   |   |-- ADR-004.md
|   |   |-- ADR-005.md
|   |   |-- ADR-006.md
|   |   |-- ADR-007.md
|   |   |-- ADR-008.md
|   |   |-- ADR-009.md
|   |   |-- ADR-010.md
|   |   |-- ADR-011.md
|   |   |-- ADR-012.md
|   |   |-- ADR-013.md
|   |   |-- ADR-014.md
|   |   |-- ADR-015.md
|   |   |-- ADR-016.md
|   |   |-- ADR-017.md
|   |   |-- ADR-018.md
|   |   |-- ADR-019.md
|   |   `-- ADR-020.md
|   `-- C4/
|       |-- c4-nivel-1-contexto.md
|       `-- c4-nivel-2-contenedor.md
|-- features/
|   |-- auth/
|   |   |-- controllers/
|   |   |   |-- authContext.tsx
|   |   |   |-- useLoginController.ts
|   |   |   `-- useRegisterController.ts
|   |   |-- model/
|   |   |   `-- auth.types.ts
|   |   |-- services/
|   |   |   `-- auth.service.ts
|   |   `-- views/
|   |       |-- LoginForm.tsx
|   |       `-- RegisterForm.tsx
|   |-- chats/
|   |   |-- controllers/
|   |   |   |-- useChatDetailController.ts
|   |   |   `-- useChatsController.ts
|   |   |-- model/
|   |   |   |-- chat.types.ts
|   |   |   `-- message.types.ts
|   |   |-- services/
|   |   |   |-- chat.service.ts
|   |   |   `-- chatSocket.service.ts
|   |   `-- views/
|   |       |-- ChatDetailView.tsx
|   |       |-- ChatLayoutView.tsx
|   |       `-- ChatView.tsx
|   |-- feed/
|   |   |-- controllers/
|   |   |   |-- useComments.ts
|   |   |   |-- useFeedController.ts
|   |   |   `-- useHomeFeed.ts
|   |   |-- model/
|   |   |   |-- comments.types.ts
|   |   |   |-- feed.types.ts
|   |   |   |-- interactions.types.ts
|   |   |   `-- reel.types.ts
|   |   |-- services/
|   |   |   |-- comments.service.ts
|   |   |   |-- feed.service.ts
|   |   |   |-- interactions.service.ts
|   |   |   `-- reel.service.ts
|   |   `-- views/
|   |       |-- HomeView.tsx
|   |       |-- ReelCard.tsx
|   |       `-- components/
|   |           |-- Avatar.tsx
|   |           |-- CategoryBar.tsx
|   |           |-- CommentsPanel.tsx
|   |           |-- HomeSidebar.tsx
|   |           `-- ReelViewer.tsx
|   |-- profile/
|   |   |-- controllers/
|   |   |   |-- useProfile.ts
|   |   |   `-- useProfileController.ts
|   |   |-- model/
|   |   |   `-- profile.types.ts
|   |   |-- services/
|   |   |   `-- profile.service.ts
|   |   `-- views/
|   |       |-- LogoutButton.tsx
|   |       |-- ProfileCard.tsx
|   |       |-- ProfileView.tsx
|   |       `-- components/
|   |           |-- EditProfileModal.tsx
|   |           |-- ProfileHeader.tsx
|   |           `-- PublicationsGrid.tsx
|   `-- publish/
|       |-- controllers/
|       |   `-- usePublishController.ts
|       |-- model/
|       |   `-- publish.types.ts
|       |-- services/
|       |   `-- publish.service.ts
|       `-- views/
|           `-- PublishForm.tsx
|-- public/
|   |-- file.svg
|   |-- globe.svg
|   |-- next.svg
|   |-- vercel.svg
|   `-- window.svg
|-- shared/
|   |-- components/
|   |   |-- AuthLayout.tsx
|   |   |-- Button.tsx
|   |   |-- Card.tsx
|   |   |-- Input.tsx
|   |   |-- Navbar.tsx
|   |   `-- Sidebar.tsx
|   |-- hooks/
|   |   `-- useAuth.ts
|   |-- services/
|   |   `-- api.ts
|   |-- styles/
|   |-- types/
|   |   `-- api.types.ts
|   `-- utils/
|       `-- formatDate.ts
|-- .dockerignore
|-- .env.local
|-- .gitignore
|-- AGENTS.md
|-- CLAUDE.md
|-- Dockerfile
|-- docker-compose.yml
|-- eslint.config.mjs
|-- estructura_endpoints.md
|-- next-env.d.ts
|-- next.config.ts
|-- package-lock.json
|-- package.json
|-- postcss.config.mjs
|-- README.md
`-- tsconfig.json
```

Nota: se excluyen carpetas generadas/externas como `.git`, `node_modules` y `.next`.

## Enfoque MVC aplicado

Se utilizó una adaptación de MVC orientada a frontend:

- `Model`: tipos y estructuras de datos en `features/*/model`.
- `View`: componentes y composición visual en `features/*/views` y rutas en `app/`.
- `Controller`: hooks/controladores que orquestan estado y eventos en `features/*/controllers`.
- `Service`: acceso a backend/sockets en `features/*/services` y `shared/services`.

Además, el ruteo y la lógica de organización de carpetas fueron definidos por el equipo.

## Ejecución local

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar entorno de desarrollo:

```bash
npm run dev
```

3. Abrir en navegador:

```text
http://localhost:3000
```

## Build y ejecución con Docker Compose

```bash
docker compose build
docker compose up
```

Si deseas correrlo en segundo plano:

```bash
docker compose up -d
```

## Variables de entorno

Crear/ajustar `.env.local` con:

```env
NEXT_PUBLIC_API_URL=...
```

## Diseño y uso de IA

Todo el proyecto se desarrolló con apoyo de IA para acelerar:

- generación de código,
- propuestas de diseño de pantallas,
- debugging,
- redacción/documentación técnica.

Lo que **no** fue definido por IA:

- el diseño original base del producto (acordado por el equipo),
- el ruteo y la lógica de carpetas.

Referencias de diseño usadas por el equipo:

- Inspiración visual: [Social Media App (Dribbble)](https://dribbble.com/shots/18030178-Social-Media-App)
- Paleta: [Paleta de color](https://coolors.co/palette/133c55-386fa4-59a5d8-84d2f6-91e5f6)
