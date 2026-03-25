# Theme (Sistema de Temas)

Sistema de temas para la aplicación basado en variables CSS y cookies, compatible con paletas de colores personalizadas, grupos de fuentes, radio de bordes y modo oscuro. **No utiliza `next-themes`**; todo el estado se persiste en cookies para SSR sin FOUC.

## Arquitectura

```text
src/theme/
├── font/
│   ├── components/
│   │   ├── font-card.tsx
│   │   ├── font-provider.tsx
│   │   └── font-switcher.tsx
│   ├── font.config.ts
│   ├── fonts.ts
│   └── index.ts
├── palette/
│   ├── components/
│   │   ├── palette-card.tsx
│   │   ├── palette-provider.tsx
│   │   ├── palette-switcher.tsx
│   │   └── theme-mode-toggle.tsx
│   ├── styles/
│   │   ├── base.css
│   │   └── palettes/
│   │       ├── amethyst.css
│   │       ├── citrus.css
│   │       └── ...
│   ├── palette.config.ts
│   ├── utils.ts
│   └── index.ts
├── radius/
│   ├── components/
│   │   ├── radius-card.tsx
│   │   ├── radius-provider.tsx
│   │   └── radius-switcher.tsx
│   ├── radius.config.ts
│   └── index.ts
├── app-theme-provider.tsx
├── server.ts
├── types.ts
├── index.ts
└── README.md
```

Cada subsistema (`font`, `palette`, `radius`) tiene su propio `index.ts` para re-exportar su API; el barrel raíz (`theme/index.ts`) re-exporta desde ellos para mantener imports simples.

## Cómo funciona

1. **Persistencia en cookies**: Paleta, fuente y radio se guardan en cookies para **SSR sin parpadeos** y sin errores de hidratación.
2. **Variables CSS**: Cada paleta define variables semánticas (`--primary`, `--background`, etc.) en OKLCH.
3. **Tailwind v4**: `base.css` mapea esas variables a utilidades de Tailwind en `@theme inline`.
4. **Sincronización DOM**: Los providers aplican clases al `<html>` (ej: `class="citrus-dark font-sans"`).

## Uso

### Provider raíz

Envuelve la app en el layout y pasa la configuración leída en servidor:

```tsx
import { AppThemeProvider, fontVariables } from '@/theme'
import { getThemeConfig } from '@/theme/server'

export default async function RootLayout({ children }) {
  const themeConfig = await getThemeConfig()

  return (
    <html suppressHydrationWarning className={fontVariables}>
      <body>
        <AppThemeProvider config={themeConfig}>{children}</AppThemeProvider>
      </body>
    </html>
  )
}
```

### Componentes de UI

```tsx
import { ThemeSwitcher, ThemeModeToggle, RadiusSwitcher } from '@/theme'
import { FontSwitcher } from '@/theme'

// Selector de paleta
<ThemeSwitcher />

// Toggle claro/oscuro
<ThemeModeToggle />

// Selector de radio de bordes
<RadiusSwitcher />

// Selector de grupo de fuentes
<FontSwitcher />
```

### Tipos y config desde subsistemas

Si necesitas tipos o constantes sin pasar por el barrel raíz:

```tsx
import { type TThemePalette } from '@/theme/palette/palette.config'
```

## Añadir una nueva paleta

1. **Crear el CSS**: Añade `src/theme/palette/styles/palettes/mi-tema.css`.

   ```css
   .mi-tema,
   .mi-tema-dark {
     --primary-base: 0.6 0.2 180; /* L C H */
   }

   .mi-tema {
     --background: oklch(1 0 0);
     --foreground: oklch(0.15 0 0);
     --primary: oklch(var(--primary-base));
     /* ... resto de variables shadcn */
   }

   .mi-tema-dark {
     --background: oklch(0.15 0 0);
     --foreground: oklch(0.95 0 0);
     --primary: oklch(var(--primary-base));
     /* ... */
   }
   ```

2. **Importar**: Añade `@import './palettes/mi-tema.css';` en `palette/styles/base.css` (o en el índice de estilos que use la app).

3. **Registrar**: En `src/theme/palette/palette.config.ts` añade el nombre a `DASHBOARD_PALETTES` (o a `PUBLIC_PALETTES` si es solo para landing) y una entrada en `THEME_LABELS`.

   ```ts
   export const DASHBOARD_PALETTES = [..., 'mi-tema'] as const
   export const THEME_LABELS = { ..., 'mi-tema': 'Mi Tema' }
   ```

La convención **-dark** es obligatoria para temas oscuros; los helpers `isDarkTheme` y `getBaseTheme` dependen de ella.

## Paletas públicas (landing)

Para secciones públicas con tema fijo (sin cookies de usuario):

1. Crea el CSS igual que para una paleta normal.
2. En `palette.config.ts` añade el nombre a `PUBLIC_PALETTES`.
3. En el layout público (ej: `src/config/layout.config.ts`) define `PUBLIC_THEME_CONFIG.theme` y aplica la clase o `data-theme` en el `<html>` de ese layout.

## Notas técnicas

- **OKLCH**: Colores en OKLCH para mejor percepción y consistencia.
- **Nombres**: Los temas oscuros deben terminar en `-dark`.
- **Portabilidad**: El módulo es autocontenido; puedes reutilizar la carpeta `theme` en otro proyecto Next.js con Tailwind v4 (y las dependencias necesarias).
