# ⚡ Next.js Base Template

Un template moderno y completo para construir aplicaciones Next.js de producción con las mejores prácticas y tecnologías actuales.

## ✨ Características

### 🚀 Stack Tecnológico

| Tecnología                                       | Descripción                       |
| ------------------------------------------------ | --------------------------------- |
| [Next.js 16](https://nextjs.org)                 | Framework React con App Router    |
| [React 19](https://react.dev)                    | Última versión de React           |
| [TypeScript 5.9](https://www.typescriptlang.org) | Tipado estático robusto           |
| [Tailwind CSS 4](https://tailwindcss.com)        | Utilidades CSS modernas           |
| [Drizzle ORM](https://orm.drizzle.team)          | ORM type-safe para bases de datos |
| [Better Auth](https://better-auth.com)           | Autenticación moderna y flexible  |

### 🎨 UI & Componentes

- **[shadcn/ui](https://ui.shadcn.com)** - Componentes accesibles y personalizables
- **[Radix UI](https://radix-ui.com)** - Primitivos sin estilo
- **[Lucide Icons](https://lucide.dev)** - Iconos hermosos
- **[Framer Motion](https://motion.dev)** - Animaciones fluidas
- **Sistema de temas** - Paletas de colores personalizables con soporte dark/light

### 🤖 Features Incluidos

- **Chat con IA** - Integración con AI SDK para asistentes inteligentes
- **Editor Rico** - Lexical editor para contenido avanzado
- **Kanban Board** - Tablero drag & drop con @dnd-kit
- **Internacionalización** - next-intl para múltiples idiomas
- **Autenticación completa** - Sign in / Sign up con better-auth

## 📁 Estructura del Proyecto

```txt
├── app/                   # App Router (Next.js 16)
│   ├── (public)/          # Rutas públicas
│   │   └── (auth)/        # Autenticación (signin/signup)
│   ├── api/               # API Routes
│   └── dashboard/         # Área protegida
│       ├── ai-chat/       # Chat con IA
│       ├── editor/        # Editor de texto
│       ├── kanban/        # Tablero Kanban
│       └── settings/      # Configuración
├── src/
│   └── core/              # Núcleo de la aplicación
│       ├── components/    # Componentes compartidos
│       ├── db/            # Esquemas de base de datos
│       ├── form/          # Sistema de formularios
│       ├── hooks/         # Custom hooks
│       ├── i18n/          # Internacionalización
│       ├── locales/       # Traducciones
│       ├── theme/         # Sistema de temas
│       └── ui/            # Componentes UI base
├── drizzle/               # Migraciones de BD
├── tests/                 # Tests E2E
└── public/                # Archivos estáticos
```

## 🛠️ Comandos

```bash
# Desarrollo
pnpm dev              # Servidor de desarrollo con Turbopack
pnpm build            # Build de producción
pnpm start            # Servidor de producción
pnpm preview          # Build + preview

# Calidad de código
pnpm lint             # Ejecutar ESLint
pnpm lint:fix         # Corregir errores de lint
pnpm typecheck        # Verificar tipos
pnpm check            # Lint + typecheck

# Base de datos
pnpm db:generate      # Generar migraciones
pnpm db:migrate       # Ejecutar migraciones
pnpm db:push          # Push directo al schema
pnpm db:studio        # Drizzle Studio

# Testing
pnpm test             # Tests unitarios (Vitest)
pnpm test:ui          # Vitest UI
pnpm test:e2e         # Tests E2E (Playwright)

# Utilidades
pnpm g:module         # Generar nuevo módulo
pnpm format:write     # Formatear código
```

## 🚀 Inicio Rápido

### 1. Clonar y instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y configura tus variables:

```bash
cp .env.example .env
```

### 3. Levantar Base de Datos (Docker)

Si no tienes una instancia de PostgreSQL corriendo, puedes usar el docker-compose incluido:

```bash
docker compose up -d
```

Esto levantará un Postgres en el puerto `5433` con las credenciales por defecto del `.env`.

### 4. Sincronizar el Schema

```bash
pnpm db:push
```

### 5. Iniciar el servidor

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Dependencias Principales

### Producción

- `next` - Framework web
- `react` & `react-dom` - UI library
- `drizzle-orm` & `postgres` - Base de datos
- `better-auth` - Autenticación
- `ai` & `@ai-sdk/react` - Integración IA
- `next-intl` - Internacionalización
- `zod` - Validación de schemas
- `react-hook-form` - Manejo de formularios
- `@radix-ui/*` - Componentes primitivos
- `framer-motion` - Animaciones

### Desarrollo

- `typescript` - Tipado
- `tailwindcss` - CSS utilities
- `vitest` - Testing unitario
- `@playwright/test` - Testing E2E
- `drizzle-kit` - Migraciones DB
- `prettier` - Formateo

## 📄 Licencia

MIT - Libre para uso personal y comercial.

---

Hecho con ❤️ usando las mejores tecnologías web modernas.
