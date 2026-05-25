# Architecture Decision Records - Frontend ReelClips

Este documento registra las decisiones arquitectónicas tomadas para la construcción del frontend de ReelClips.

---

## ADR-001: Uso de Next.js como framework principal del frontend

### Estado
Aceptado

### Contexto
ReelClips requiere una interfaz web moderna para consumir, publicar e interactuar con videos cortos. El frontend debe permitir navegación fluida, separación de vistas, integración con una API backend y posibilidad de despliegue independiente.

### Decisión
Se decidió utilizar Next.js como framework principal del frontend.

### Justificación
Next.js permite organizar la aplicación mediante rutas, componentes y layouts, facilitando la construcción de una experiencia web modular. Además, se integra fácilmente con React, TypeScript y plataformas de despliegue como Vercel o contenedores Docker.

### Consecuencias
#### Ventajas
- Facilita la construcción de páginas y rutas.
- Permite separar vistas públicas y privadas.
- Mejora la mantenibilidad del frontend.
- Facilita el despliegue independiente del backend.

#### Desventajas
- Introduce convenciones propias del framework.
- Requiere que el equipo conozca la estructura de Next.js.

---

## ADR-002: Uso de TypeScript para el desarrollo del frontend

### Estado
Aceptado

### Contexto
El frontend maneja datos relacionados con usuarios, reels, comentarios, chats, perfiles y autenticación. Estos datos deben mantener una estructura consistente entre vistas, controladores y servicios.

### Decisión
Se decidió utilizar TypeScript como lenguaje principal del frontend.

### Justificación
TypeScript permite definir tipos para modelos, respuestas de servicios y propiedades de componentes. Esto reduce errores durante el desarrollo y facilita el mantenimiento del código.

### Consecuencias
#### Ventajas
- Mayor seguridad en tiempo de desarrollo.
- Mejor autocompletado y documentación interna.
- Facilita el trabajo colaborativo.
- Reduce errores al consumir la API del backend.

#### Desventajas
- Requiere definir tipos y modelos adicionales.
- Puede aumentar ligeramente el tiempo inicial de desarrollo.

---

## ADR-003: Organización del frontend por funcionalidades

### Estado
Aceptado

### Contexto
El sistema incluye funcionalidades claramente diferenciadas: autenticación, feed, publicación de reels, perfil y chats. Si todo el código se organizara únicamente por tipo técnico, por ejemplo todos los componentes en una sola carpeta, el crecimiento del proyecto dificultaría su mantenimiento.

### Decisión
Se decidió organizar el frontend por módulos funcionales dentro de la carpeta `features`.

La estructura general es:

- `features/auth`
- `features/feed`
- `features/profile`
- `features/publish`
- `features/chats`

### Justificación
Esta organización permite que cada funcionalidad tenga sus propias vistas, controladores, modelos y servicios. De esta forma, los cambios en una funcionalidad tienen menor impacto sobre las demás.

### Consecuencias
#### Ventajas
- Mejor separación de responsabilidades.
- Mayor mantenibilidad.
- Facilita ubicar el código relacionado con una funcionalidad.
- Permite escalar el frontend sin mezclar dominios.

#### Desventajas
- Puede existir duplicación si no se identifican correctamente elementos compartidos.
- Requiere disciplina para no mezclar lógica entre módulos.

---

## ADR-004: Separación interna por controllers, services, model y views

### Estado
Aceptado

### Contexto
Cada funcionalidad del frontend necesita manejar lógica de presentación, lógica de interacción, comunicación con servicios externos y estructuras de datos. Mezclar todo dentro de los componentes visuales haría que las vistas fueran difíciles de mantener.

### Decisión
Se decidió separar cada funcionalidad en capas internas:

- `views`: componentes visuales o pantallas.
- `controllers`: hooks o controladores de interacción.
- `services`: comunicación con APIs o lógica de servicio.
- `model`: tipos o estructuras propias de la funcionalidad.

### Justificación
Esta separación aproxima el frontend a una arquitectura modular, donde las vistas no concentran toda la lógica. Los controladores gestionan estados e interacciones, los servicios encapsulan llamadas externas y los modelos definen estructuras de datos.

### Consecuencias
#### Ventajas
- Componentes visuales más limpios.
- Mejor reutilización de lógica.
- Mayor facilidad para probar o modificar comportamientos.
- Separación clara entre UI y lógica de negocio del cliente.

#### Desventajas
- Aumenta la cantidad de archivos.
- Puede parecer más complejo para funcionalidades pequeñas.

---

## ADR-005: Uso de carpeta `shared` para elementos reutilizables

### Estado
Aceptado

### Contexto
El frontend necesita elementos comunes que son utilizados por varias funcionalidades, como componentes base, hooks, servicios, tipos y utilidades.

### Decisión
Se decidió crear una carpeta `shared` para centralizar elementos reutilizables.

La estructura considerada incluye:

- `shared/components`
- `shared/hooks`
- `shared/services`
- `shared/types`
- `shared/utils`

### Justificación
Centralizar recursos comunes evita duplicación de código y permite mantener consistencia entre funcionalidades. Por ejemplo, componentes de navegación, utilidades, tipos globales o servicios compartidos pueden mantenerse en un solo lugar.

### Consecuencias
#### Ventajas
- Evita duplicación.
- Mejora la consistencia visual y funcional.
- Facilita reutilización.
- Reduce acoplamiento entre funcionalidades.

#### Desventajas
- La carpeta `shared` puede crecer demasiado si no se controla.
- Se debe evitar mover lógica específica de una funcionalidad a `shared`.

---

## ADR-006: Separación entre rutas públicas y privadas

### Estado
Aceptado

### Contexto
ReelClips tiene vistas accesibles para usuarios no autenticados, como inicio de sesión o registro, y vistas que requieren sesión activa, como feed, perfil, publicación de reels y chats.

### Decisión
Se decidió separar las rutas de la aplicación en grupos públicos y privados dentro de la carpeta `app`.

### Justificación
La separación entre rutas públicas y privadas permite controlar mejor la navegación, los layouts y las restricciones de acceso. También hace visible en la estructura del proyecto qué partes requieren autenticación.

### Consecuencias
#### Ventajas
- Mayor claridad en la estructura de rutas.
- Facilita proteger vistas privadas.
- Permite layouts distintos según el tipo de usuario.
- Mejora la organización del frontend.

#### Desventajas
- Requiere mantener lógica de validación de sesión.
- Puede duplicar algunos elementos de layout si no se abstraen correctamente.

---

## ADR-007: Uso de Context y hooks para manejar autenticación

### Estado
Aceptado

### Contexto
La autenticación afecta a varias partes del frontend: login, registro, acceso a rutas privadas, visualización de usuario actual y cierre de sesión. Pasar estos datos manualmente entre componentes aumentaría el acoplamiento.

### Decisión
Se decidió utilizar un contexto de autenticación y hooks específicos para manejar login, registro y estado de sesión.

### Justificación
El uso de Context permite compartir el estado de autenticación entre componentes sin prop drilling. Los hooks permiten encapsular la lógica de interacción y mantener las vistas enfocadas en la presentación.

### Consecuencias
#### Ventajas
- Acceso centralizado al estado de autenticación.
- Menor duplicación de lógica.
- Vistas más simples.
- Facilita proteger rutas privadas.

#### Desventajas
- El contexto debe manejarse cuidadosamente para evitar estados inconsistentes.
- Si crece demasiado, puede requerir una solución de estado más especializada.

---

## ADR-008: Consumo del backend mediante servicios separados

### Estado
Aceptado

### Contexto
El frontend debe comunicarse con el backend para autenticación, obtención del feed, publicación de reels, comentarios, perfiles y chats. Si las llamadas HTTP se realizan directamente desde los componentes, el código se vuelve difícil de mantener.

### Decisión
Se decidió encapsular la comunicación con el backend dentro de archivos de servicios.

### Justificación
Los servicios separan la lógica de comunicación externa de la lógica visual. Esto permite modificar endpoints, headers, manejo de errores o estructura de respuestas sin afectar directamente las vistas.

### Consecuencias
#### Ventajas
- Componentes menos acoplados a la API.
- Mayor facilidad para cambiar endpoints.
- Mejor organización del código.
- Facilita reutilización de llamadas al backend.

#### Desventajas
- Requiere mantener una capa adicional.
- Los servicios deben mantenerse alineados con los contratos del backend.

---

## ADR-009: Uso de STOMP y SockJS para comunicación en tiempo real

### Estado
Aceptado

### Contexto
El sistema contempla funcionalidades de chat y posibles eventos en tiempo real. Para estas funcionalidades, una comunicación basada únicamente en peticiones HTTP puede ser insuficiente o generar demasiadas consultas periódicas.

### Decisión
Se decidió incluir STOMP sobre SockJS como mecanismo para comunicación en tiempo real desde el frontend.

### Justificación
STOMP proporciona un protocolo de mensajería sobre WebSocket y SockJS permite compatibilidad adicional cuando WebSocket no está disponible directamente. Esta decisión prepara el frontend para funcionalidades como chat, notificaciones o eventos interactivos.

### Consecuencias
#### Ventajas
- Permite comunicación bidireccional.
- Mejora la experiencia en funcionalidades de chat.
- Reduce la necesidad de polling constante.
- Se alinea con un backend que pueda exponer endpoints WebSocket.

#### Desventajas
- Aumenta la complejidad del cliente.
- Requiere manejar conexión, reconexión y errores.
- Puede ser innecesario para funcionalidades que no requieran tiempo real.

---

## ADR-010: Uso de Tailwind CSS para estilos

### Estado
Aceptado

### Contexto
El frontend requiere construir una interfaz visual de forma rápida y consistente. La plataforma se enfoca en contenido de video, navegación ágil y componentes reutilizables.

### Decisión
Se decidió utilizar Tailwind CSS para la definición de estilos.

### Justificación
Tailwind permite crear interfaces rápidamente mediante clases utilitarias. Esto facilita mantener consistencia visual sin crear una gran cantidad de archivos CSS personalizados.

### Consecuencias
#### Ventajas
- Desarrollo rápido de interfaces.
- Consistencia visual.
- Menor necesidad de CSS manual.
- Fácil integración con componentes React.

#### Desventajas
- Las clases pueden hacer que el JSX sea más extenso.
- Requiere acordar convenciones visuales para evitar inconsistencias.

---

## ADR-011: Uso de Lucide React para iconografía

### Estado
Aceptado

### Contexto
La interfaz de ReelClips necesita iconos para representar acciones comunes como navegación, publicación, perfil, comentarios, likes y chat.

### Decisión
Se decidió utilizar Lucide React como librería de iconos.

### Justificación
Lucide React ofrece iconos simples, modernos y compatibles con React. Permite mantener una línea visual consistente sin tener que diseñar iconos propios.

### Consecuencias
#### Ventajas
- Iconografía consistente.
- Fácil integración con componentes React.
- Reduce trabajo de diseño manual.
- Mejora la experiencia visual.

#### Desventajas
- Agrega una dependencia adicional.
- La personalización está limitada al estilo de la librería.

---

## ADR-012: Uso de ESLint para control de calidad del código

### Estado
Aceptado

### Contexto
El equipo necesita mantener un código consistente y reducir errores comunes durante el desarrollo del frontend.

### Decisión
Se decidió utilizar ESLint con configuración compatible con Next.js.

### Justificación
ESLint permite detectar problemas de estilo, errores potenciales y malas prácticas en el código antes de que lleguen a producción.

### Consecuencias
#### Ventajas
- Mejora la calidad del código.
- Ayuda a mantener consistencia entre desarrolladores.
- Detecta errores tempranos.
- Se puede integrar en flujos de CI/CD.

#### Desventajas
- Puede requerir ajustes de configuración.
- Algunas reglas pueden generar fricción inicial en el equipo.

---

## ADR-013: Configuración de salida standalone para despliegue

### Estado
Aceptado

### Contexto
El frontend debe poder desplegarse de manera independiente y ser compatible con entornos contenerizados.

### Decisión
Se decidió configurar Next.js con `output: "standalone"`.

### Justificación
La salida standalone genera una versión optimizada de la aplicación para ejecución en producción, especialmente útil en despliegues con Docker o servidores independientes.

### Consecuencias
#### Ventajas
- Facilita el despliegue contenerizado.
- Reduce dependencias necesarias en producción.
- Permite ejecutar el frontend de manera más portable.
- Se alinea con una estrategia DevOps basada en Docker.

#### Desventajas
- Requiere validar correctamente el proceso de build.
- Puede necesitar configuración adicional para archivos estáticos o variables de entorno.

---

## ADR-014: Uso de Docker para contenerizar el frontend

### Estado
Aceptado

### Contexto
El proyecto necesita consistencia entre ambientes de desarrollo, pruebas y despliegue. Además, el frontend debe poder ejecutarse independientemente del backend.

### Decisión
Se decidió incluir configuración Docker para el frontend.

### Justificación
Docker permite empaquetar la aplicación con sus dependencias y ejecutarla de forma consistente en distintos entornos. Esto facilita el despliegue y reduce problemas relacionados con diferencias entre máquinas de desarrollo.

### Consecuencias
#### Ventajas
- Entorno reproducible.
- Facilita despliegue independiente.
- Mejora consistencia entre desarrollo y producción.
- Se alinea con prácticas DevOps.

#### Desventajas
- Aumenta la complejidad de configuración inicial.
- Requiere conocimiento básico de Docker.

---

## ADR-015: Separación del frontend y backend en repositorios independientes

### Estado
Aceptado

### Contexto
Aunque ReelClips se concibe como un sistema integrado, el frontend y el backend tienen tecnologías, ciclos de construcción y despliegue diferentes. El frontend está construido con Next.js y el backend con Spring Boot.

### Decisión
Se decidió mantener el frontend en un repositorio independiente del backend.

### Justificación
Separar los repositorios permite desplegar el frontend de forma autónoma, manejar dependencias propias de Node.js y evolucionar la interfaz sin afectar directamente el código del backend.

### Consecuencias
#### Ventajas
- Despliegue independiente.
- Separación clara de responsabilidades.
- Mejor organización por tecnología.
- Facilita integración con plataformas como Vercel o Docker.

#### Desventajas
- Requiere coordinación entre contratos de API.
- Puede haber inconsistencias si backend y frontend evolucionan sin sincronización.
- Necesita documentación clara de endpoints y variables de entorno.

---

## ADR-016: Uso de estructura modular orientada al dominio de ReelClips

### Estado
Aceptado

### Contexto
El dominio de ReelClips incluye usuarios, reels, feed, publicación, perfil y chats. Estas áreas representan funcionalidades del negocio y no solo elementos técnicos de interfaz.

### Decisión
Se decidió reflejar el dominio del sistema dentro de la estructura del frontend mediante módulos funcionales.

### Justificación
Organizar el frontend alrededor del dominio permite que el código sea más entendible para el equipo y más coherente con los requerimientos funcionales del sistema.

### Consecuencias
#### Ventajas
- El código refleja mejor el negocio.
- Facilita asociar requerimientos con implementación.
- Mejora la trazabilidad entre documentación y frontend.
- Permite evolucionar funcionalidades de forma aislada.

#### Desventajas
- Requiere mantener nombres y responsabilidades consistentes.
- Puede ser necesario refactorizar si el dominio cambia.

---

## ADR-017: Uso de hooks personalizados como controladores de pantalla

### Estado
Aceptado

### Contexto
Las vistas del frontend necesitan manejar estados, formularios, efectos, navegación, carga de datos y errores. Incluir toda esta lógica directamente en los componentes visuales los haría difíciles de leer.

### Decisión
Se decidió utilizar hooks personalizados como controladores de pantalla, por ejemplo para login, registro, feed, comentarios y home feed.

### Justificación
Los hooks personalizados permiten encapsular lógica de presentación e interacción, manteniendo los componentes visuales enfocados en renderizar la interfaz.

### Consecuencias
#### Ventajas
- Componentes más limpios.
- Lógica reutilizable.
- Mejor separación entre vista y comportamiento.
- Facilita pruebas y mantenimiento.

#### Desventajas
- Puede haber demasiados hooks si no se agrupan bien.
- Requiere convenciones claras de nombres y responsabilidades.

---

## ADR-018: Priorización de usabilidad y experiencia visual en el frontend

### Estado
Aceptado

### Contexto
ReelClips es una plataforma de consumo de videos cortos. La experiencia del usuario depende de una interfaz simple, navegación rápida y acciones visibles para interactuar con el contenido.

### Decisión
Se decidió construir el frontend priorizando componentes visuales reutilizables, navegación clara y separación de vistas por funcionalidad.

### Justificación
La usabilidad es un atributo clave del sistema. La estructura del frontend debe facilitar que el usuario pueda registrarse, iniciar sesión, ver reels, publicar contenido, consultar perfiles e interactuar con chats de manera intuitiva.

### Consecuencias
#### Ventajas
- Mejor experiencia para el usuario.
- Interfaz más fácil de extender.
- Mayor coherencia visual.
- Facilita futuras mejoras de diseño.

#### Desventajas
- Requiere mantener consistencia entre módulos.
- Puede necesitar iteraciones visuales adicionales.

---

## ADR-019: Uso de scripts estándar para desarrollo, build, start y lint

### Estado
Aceptado

### Contexto
El equipo necesita comandos simples y conocidos para ejecutar el proyecto localmente, construirlo para producción, iniciarlo y revisar calidad de código.

### Decisión
Se decidió usar scripts estándar de npm:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

### Justificación
Estos comandos son comunes en proyectos Next.js y facilitan la incorporación de nuevos desarrolladores al proyecto.

### Consecuencias
#### Ventajas
- Fácil ejecución local.
- Convenciones conocidas.
- Compatible con flujos de CI/CD.
- Reduce ambigüedad en el desarrollo.

#### Desventajas
- Requiere documentar variables de entorno necesarias.
- El comando de build puede fallar si no se sincronizan dependencias o contratos de API.

---

## ADR-020: Uso de alias de importación con `@/*`

### Estado
Aceptado

### Contexto
A medida que el frontend crece, las rutas relativas como `../../../shared/...` pueden volverse difíciles de leer y mantener.

### Decisión
Se decidió configurar un alias de importación `@/*` para referenciar archivos desde la raíz del proyecto.

### Justificación
El alias mejora la legibilidad de los imports y facilita mover archivos sin depender de rutas relativas largas.

### Consecuencias
#### Ventajas
- Imports más claros.
- Mejor mantenibilidad.
- Menor acoplamiento a la ubicación física relativa.
- Facilita trabajar con carpetas como `features` y `shared`.

#### Desventajas
- Requiere que TypeScript y Next.js mantengan configuración compatible.
- Los nuevos integrantes deben conocer la convención.

---

# Resumen de decisiones

| ADR | Decisión | Estado |
|---|---|---|
| ADR-001 | Uso de Next.js | Aceptado |
| ADR-002 | Uso de TypeScript | Aceptado |
| ADR-003 | Organización por funcionalidades | Aceptado |
| ADR-004 | Separación controllers/services/model/views | Aceptado |
| ADR-005 | Carpeta shared | Aceptado |
| ADR-006 | Rutas públicas y privadas | Aceptado |
| ADR-007 | Context y hooks para autenticación | Aceptado |
| ADR-008 | Servicios para consumo del backend | Aceptado |
| ADR-009 | STOMP y SockJS para tiempo real | Aceptado |
| ADR-010 | Tailwind CSS | Aceptado |
| ADR-011 | Lucide React | Aceptado |
| ADR-012 | ESLint | Aceptado |
| ADR-013 | Output standalone | Aceptado |
| ADR-014 | Docker para frontend | Aceptado |
| ADR-015 | Repositorio frontend independiente | Aceptado |
| ADR-016 | Estructura modular orientada al dominio | Aceptado |
| ADR-017 | Hooks personalizados como controladores | Aceptado |
| ADR-018 | Priorización de usabilidad | Aceptado |
| ADR-019 | Scripts estándar de npm | Aceptado |
| ADR-020 | Alias de importación `@/*` | Aceptado |