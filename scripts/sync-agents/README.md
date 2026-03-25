# Sync Agents

Sincroniza reglas y skills a todas las carpetas de agentes de IA del proyecto.

## Uso

```bash
pnpm run agents:sync
```

## Qué hace

1. **Fusiona skills** desde `.agents/skills/` hacia `.agent/skills/` (si existe)
2. **Sincroniza reglas** desde `.agent/rules/code-style.mdc` a todas las carpetas target
3. **Sincroniza skills** desde `.agent/skills/` a todas las carpetas target
4. **Elimina archivos legacy** (`development.mdc`, `code.mdc`)

## Estructura

```
scripts/sync-agents/
├── index.ts      # Script principal (entry point)
├── config.ts     # Configuración de carpetas fuente/destino
├── copy-dir.ts   # Utilidad para copiar directorios
└── README.md     # Este archivo
```

## Configuración (`config.ts`)

| Variable          | Valor por defecto                                                 | Descripción                |
| ----------------- | ----------------------------------------------------------------- | -------------------------- |
| `sourceFolder`    | `.agent`                                                          | Carpeta fuente principal   |
| `alternateSource` | `.agents`                                                         | Carpeta fuente alternativa |
| `targetFolders`   | `.agents`, `.cursor`, `.claude`, `.gemini`, `.codex`, `.opencode` | Carpetas destino           |
| `rulesFile`       | `code-style.mdc`                                                  | Archivo de reglas actual   |
| `oldRulesFile`    | `development.mdc`                                                 | Archivo de reglas antiguo  |
| `legacyRulesFile` | `code.mdc`                                                        | Archivo de reglas legacy   |

## Flujo de trabajo

```
.agents/skills/  ──(merge)──>  .agent/skills/
                              │
                              ▼
                    ┌───────────────────────┐
                    │   .cursor/skills/      │
                    │   .claude/skills/      │
.agent/rules/  ────▶│   .gemini/skills/      │
                    │   .codex/skills/       │
                    │   .opencode/skills/    │
                    │   .agents/skills/      │
                    └───────────────────────┘
```

## Convenciones

- **Fuente principal**: `.agent/` - Aquí se deben crear/editar las skills y reglas
- **Fuente alternativa**: `.agents/` - Se fusiona con `.agent/` si existe
- **No editar directamente** en carpetas target - Sus cambios se sobrescribirán
