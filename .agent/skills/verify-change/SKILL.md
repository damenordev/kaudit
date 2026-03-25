---
name: verify-change
description: Verificación post-implementación. Ejecuta typecheck, lint y tests automáticamente después de implementar cambios. Usa esta skill cuando termines de implementar una feature, arreglar un bug, o completar tareas de un cambio.
---

# Verify Change

Verificación automática post-implementación. Ejecuta las comprobaciones de calidad del proyecto para asegurar que los cambios no rompen nada.

## Cuándo Usar

- Después de implementar una feature completa
- Después de arreglar un bug
- Después de completar las tareas de un cambio OpenSpec
- Cuando el usuario pida verificar el estado del proyecto
- Antes de hacer commit

## Pasos

### 1. TypeScript Check

```bash
pnpm run typecheck
```

**Si falla**: Analizar los errores de tipos. Arreglar antes de continuar.

### 2. ESLint

```bash
pnpm run lint
```

**Si falla**: Intentar auto-fix primero:

```bash
pnpm run lint:fix
```

Si aún hay errores, arreglar manualmente.

### 3. Tests Unitarios

```bash
pnpm run test --run
```

**Si falla**: Analizar qué tests fallan y por qué. NO modificar tests para que pasen sin entender el fallo.

### 4. Build (opcional, solo si se requiere)

```bash
pnpm run build
```

Solo ejecutar si:

- Los pasos anteriores pasan y se quiere validación completa
- El usuario lo pide explícitamente
- Se va a hacer deploy

## Reporte

Al finalizar, mostrar un resumen:

```
## ✅ Verification Report

| Check | Status | Details |
|---|---|---|
| TypeScript | ✅ Pass | No errors |
| ESLint | ✅ Pass | No warnings |
| Tests | ✅ Pass | 24/24 passed |
| Build | ⏭️ Skipped | Not requested |

**Result**: All checks passed. Safe to commit.
```

O si hay fallos:

```
## ❌ Verification Report

| Check | Status | Details |
|---|---|---|
| TypeScript | ❌ Fail | 3 errors in 2 files |
| ESLint | ✅ Pass | No warnings |
| Tests | ⏭️ Skipped | Blocked by TypeScript errors |

**Issues to fix**:
1. `src/modules/auth/components/sign-in-form.tsx:15` - Type 'string' is not assignable to type 'number'
2. ...

**Action**: Fix TypeScript errors and re-verify.
```

## Reglas

1. **Ejecutar en orden**: typecheck → lint → tests. Si uno falla, reportar pero intentar continuar con los siguientes
2. **No silenciar errores**: Si hay warnings o errores, reportarlos todos
3. **No modificar tests para que pasen**: Entender primero la causa raíz
4. **Ser explícito**: Reportar exactamente qué pasó, no resumir vagamente
5. **Sugerir siguiente paso**: Si todo pasa, sugerir commit. Si falla, sugerir fixes concretos
