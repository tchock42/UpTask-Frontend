
# UpTask — Frontend

Frontend de la aplicación UpTask: una interfaz construida con React + TypeScript y Vite para gestionar proyectos, tareas, equipos y notas (stack MERN en el backend).

## Contenidos

- **Descripción:** qué es el proyecto.
- **Características:** funcionalidades principales.
- **Tecnologías:** librerías y herramientas usadas.
- **Instalación:** cómo ejecutar el proyecto en desarrollo.
- **Variables de entorno:** qué variables configurar.
- **Scripts útiles:** comandos npm disponibles.
- **Estructura:** resumen de carpetas importantes.
- **Contribuir:** cómo colaborar.

## Descripción

Interfaz web responsiva creada con Vite + React + TypeScript. Proporciona vistas y componentes para:

- Autenticación y gestión de usuarios.
- Crear/editar/eliminar proyectos y tareas.
- Gestión de equipos y búsqueda de miembros.
- Notas y detalles de tareas.

## Características

- Registro, login y recuperación de contraseña.
- CRUD de proyectos y tareas.
- Manejo de equipos y búsqueda de miembros.
- Validación de formularios con Zod.
- Sincronización con API mediante Axios y manejo de tokens.

## Tecnologías

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- React Hook Form
- Zod
- @tanstack/react-query

## Requisitos

- Node.js (recomendado >= 18)
- npm o pnpm

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tchock42/UpTask-Frontend.git
cd UpTask-Frontend
```

2. Instalar dependencias:

```bash
npm install
# o: pnpm install
```

3. Crear archivo de variables de entorno (`.env`) en la raíz con la URL de la API (ejemplo abajo).

4. Ejecutar en modo desarrollo:

```bash
npm run dev
```

## Variables de entorno

Este proyecto usa Vite; la URL de la API se obtiene desde `import.meta.env.VITE_API_URL`.

Ejemplo mínimo en `.env`:

```env
VITE_API_URL=https://api.tu-dominio.com
```

Además la aplicación espera almacenar el token de autenticación en `localStorage` con la clave `AUTH_TOKEN`.

## Scripts útiles

- `npm run dev` — inicia el servidor de desarrollo (Vite).
- `npm run build` — compila la aplicación para producción.
- `npm run preview` — sirve la versión build localmente.
- `npm run lint` — corre ESLint.

(Los scripts están definidos en `package.json`.)

## Estructura del proyecto (resumen)

- `src/components/` — componentes reutilizables y por pantallas.
- `src/views/` — páginas y vistas principales.
- `src/services/` — llamadas a la API (Axios wrappers).
- `src/hooks/` — hooks personalizados como `useAuth`.
- `src/layouts/` — layouts de la app (Auth, App, Profile).

## Contribuir

1. Abrir un issue describiendo el cambio o bug.
2. Crear una rama: `git checkout -b feat/mi-cambio`.
3. Hacer commits claros y pushear la rama.
4. Abrir un Pull Request contra `main`.

Por favor agrega pruebas o instrucciones para revisar el cambio cuando corresponda.

## Contacto

Si querés ayudar o tenés preguntas, abrí un issue o contactame vía GitHub.

---

_README actualizado: contiene instrucciones claras para instalar, configurar y ejecutar el frontend de UpTask._

