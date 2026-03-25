---
name: memory-protocol
description: Protocolo de memoria persistente con Engram MCP. Usa esta skill para guardar decisiones arquitecturales, bugs resueltos, patrones descubiertos y contexto entre sesiones. Se activa automáticamente cuando Engram está disponible como MCP server.
---

# Memory Protocol (Engram)

Este protocolo define cuándo y cómo un agente de IA debe guardar memorias usando Engram.

## Prerequisito

Engram debe estar configurado como MCP server. Ver `docs/setup-engram.md`.

## Cuándo Guardar Memoria

### SIEMPRE guardar después de:

1. **Resolver un bug significativo**
   - Tipo: `bugfix`
   - Topic key: `bug/<nombre-descriptivo>`
   - Incluir: qué falló, por qué, cómo se arregló, y qué aprendimos

2. **Tomar una decisión arquitectural**
   - Tipo: `architecture`
   - Topic key: `architecture/<área>`
   - Incluir: contexto, opciones consideradas, decisión tomada, razón

3. **Descubrir un patrón o gotcha**
   - Tipo: `pattern` o `discovery`
   - Topic key: `pattern/<nombre>` o `discovery/<nombre>`
   - Incluir: qué se descubrió, dónde aplica, ejemplo

4. **Completar una feature significativa**
   - Tipo: `feature`
   - Topic key: `feature/<nombre>`
   - Incluir: qué se implementó, decisiones tomadas, archivos clave

5. **Final de sesión** (si hubo trabajo significativo)
   - Usar `mem_session_summary`
   - Formato: Goal / Discoveries / Accomplished / Files modified

### NO guardar:

- Cambios triviales (typos, formatting)
- Información que ya está en la documentación del proyecto
- Cada paso individual (solo resultados significativos)

## Formato de Contenido

```
## What
[Descripción concisa de qué ocurrió]

## Why
[Por qué se tomó esta decisión / por qué falló]

## Where
[Archivos y rutas relevantes]

## Learned
[Qué aprendimos que aplica en el futuro]
```

## Flujo de Sesión

```
Inicio de sesión:
  1. mem_search para contexto relevante al task actual
  2. Trabajar normalmente

Durante la sesión:
  3. mem_save después de cada logro significativo

Final de sesión:
  4. mem_session_summary con resumen estructurado
```

## Topic Keys del Proyecto

Usar estos prefijos para mantener consistencia:

| Prefijo          | Uso                   | Ejemplo                          |
| ---------------- | --------------------- | -------------------------------- |
| `architecture/*` | Decisiones de diseño  | `architecture/module-contract`   |
| `bug/*`          | Bugs resueltos        | `bug/auth-session-expired`       |
| `decision/*`     | Decisiones tomadas    | `decision/ui-stays-in-core`      |
| `pattern/*`      | Patrones descubiertos | `pattern/form-4-layer`           |
| `config/*`       | Configuraciones       | `config/drizzle-createtable`     |
| `discovery/*`    | Descubrimientos       | `discovery/shadcn-ui-convention` |
| `feature/*`      | Features completadas  | `feature/kanban-module`          |

## Ejemplo de Uso

Después de resolver que `core/ui/` se mantiene separado de `components/`:

```
mem_save(
  title: "UI stays in core, components in modules",
  type: "decision",
  topic_key: "decision/ui-vs-components",
  content: "## What\nDecided to keep core/ui/ for design system primitives and modules/*/components/ for feature components.\n\n## Why\n- shadcn convention uses ui/\n- Semantic separation: ui = library, components = consumers\n- components.json integration\n\n## Where\n- src/core/ui/ (primitives)\n- src/modules/*/components/ (features)\n- src/modules/*/components/primitives/ (module-specific low-level UI)\n\n## Learned\nDon't apply module conventions to core infrastructure. They serve different roles."
)
```

## Recuperación de Contexto

Usar progressive disclosure (3 capas) para eficiencia en tokens:

```
1. mem_search "auth middleware" → resultados compactos con IDs (~100 tokens)
2. mem_timeline observation_id=42 → contexto temporal
3. mem_get_observation id=42 → contenido completo
```
