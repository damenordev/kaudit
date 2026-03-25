# Reglas Core del Proyecto (Directivas Universales)

## 🤖 0. Comportamiento de la IA (¡CRÍTICO!)

- **Cero Código Perezoso:** NUNCA uses placeholders como `// ... código existente`. Escribe siempre el código completo.
- **Idioma:** Los comentarios y la documentación DEBEN estar en español. El código (variables, funciones, archivos) DEBE estar en inglés.
- **Preservación:** NUNCA elimines comentarios, imports funcionales o código existente a menos que se te pida explícitamente.
- **Sin Any:** El uso de `any` está estrictamente prohibido. Usa `unknown` si es necesario o tipos específicos.
- **Límites de Calidad:** Máximo **150 líneas** por archivo. Está PROHIBIDO el uso de banners o ASCII-art.
- **Uso de Skills (MANDATORIO):** Si existe una skill relacionada con la petición del usuario, es **OBLIGATORIO** usarla. No asumas que sabes cómo hacer algo si hay una skill que define el estándar del proyecto. Si existe una skill relacionada con la petición, es OBLIGATORIO leer su `SKILL.md` y aplicarla.

## 📁 1. Nomenclatura Global

### Archivos (kebab-case + sufijo)

| Sufijo          | Propósito                   | Ejemplo             |
| :-------------- | :-------------------------- | :------------------ |
| `.utils.ts`     | Utilidades                  | `cn.utils.ts`       |
| `.schema.ts`    | Validación/Zod              | `user.schema.ts`    |
| `.actions.ts`   | Mutaciones (Server Actions) | `user.actions.ts`   |
| `.queries.ts`   | Lecturas DB                 | `user.queries.ts`   |
| `.types.ts`     | Definiciones TS             | `user.types.ts`     |
| `.constants.ts` | Constantes del módulo       | `user.constants.ts` |
| `.config.ts`    | Configuración del módulo    | `sidebar.config.ts` |
| `.service.ts`   | Lógica de negocio           | `auth.service.ts`   |

### Código

| Entidad     | Convención       | Ejemplo           |
| :---------- | :--------------- | :---------------- |
| Componentes | PascalCase       | `UserProfile`     |
| Interfaces  | I + PascalCase   | `IUserProfile`    |
| Types       | T + PascalCase   | `TUserRole`       |
| Enums       | E + PascalCase   | `EUserRole`       |
| Hooks       | use + camelCase  | `useAuth`         |
| Constantes  | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |

## ⚛️ 2. Frontend & React (Estándares)

- **Rendering:** Server Components por defecto. El `'use client'` se pone lo más ABAJO posible del árbol.
- **Gestión de Estado:** Si hay mucho estado, aíslalo en un React Context (`.provider.tsx` y `.context.ts`).
- **Estilos:** OBLIGATORIO usar `cn()` de `@/core/utils/cn.utils` para Tailwind.
- **Exportaciones:** Usa exportaciones inline (`export function MiComponente`). Nada de bloques de exportación al final.
- **Interfaces:** OBLIGATORIO exportar las interfaces de las props con el prefijo `I`.

## 🏗️ 3. Regla de Oro de Arquitectura

- El proyecto se divide en `core/` (infraestructura) y `modules/` (lógica de negocio).
- **Flujo unidireccional:** `modules/` puede importar de `core/`, pero `core/` **NUNCA** importa de `modules/`.

## 🧠 4. Especialización

Busca siempre en `.agent/skills/`. No pidas permiso para usar una skill, simplemente úsala si detectas que es relevante para la tarea.
