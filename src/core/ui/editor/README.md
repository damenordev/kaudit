# Editor (LexKit)

Editor de texto enriquecido reutilizable basado en LexKit (Lexical). Presets, toolbar configurable y compatible con formularios.

## Archivos

- `editor.tsx`: Componente principal que integra el proveedor de LexKit y opciones generales
- `editor-toolbar.tsx`: Barra de herramientas del editor (botones para formatear)
- `editor-link-dialog.tsx`: Diálogo para insertar / editar enlaces
- `editor-image-dialog.tsx`: Diálogo para insertar imágenes (mediante URL)
- `lexkit.system.ts`: Define las extensiones e inicializa el sistema del editor LexKit
- `editor.constants.ts`: Presets de botones, funciones base de la toolbar, atajos de teclado
- `editor.types.ts`: Tipos principales (props, presets, etc.)
- `editor.css`: Estilos base de LexKit
- `use-editor-state.ts`: Hook de estado global nativo (para diálogos)
- `use-image-upload.ts`: Hook utilitario opcional por si decides implementar carga directa de imágenes a un servidor

## Uso básico

```tsx
import { useState } from 'react'
import { Editor } from '@/core/ui/primitives/editor'

export default function MyComponent() {
  const [content, setContent] = useState('')

  return (
    <Editor
      value={content}
      onChange={setContent}
      preset="standard" // 'minimal' | 'standard' | 'full' | 'custom'
      placeholder="Escribe algo aquí..."
      minHeight="300px"
    />
  )
}
```

## Props del Editor (`IEditorProps`)

| Propiedad          | Tipo                                                  | Por defecto  | Descripción                                          |
| :----------------- | :---------------------------------------------------- | :----------- | :--------------------------------------------------- |
| `value`            | `string`                                              | `''`         | Contenido del editor (HTML, Markdown o Texto Plano)  |
| `onChange`         | `(value: string) => void`                             |              | Callback al cambiar el contenido                     |
| `preset`           | `'minimal'` \| `'standard'` \| `'full'` \| `'custom'` | `'standard'` | Conjunto predefinido de botones de toolbar           |
| `config`           | `IEditorConfig`                                       |              | Configuración personalizada del editor               |
| `placeholder`      | `string`                                              |              | Texto por defecto en el editor vacío                 |
| `editable`         | `boolean`                                             | `true`       | Habilita/deshabilita la edición                      |
| `minHeight`        | `string`                                              | `'150px'`    | Altura mínima del contenedor                         |
| `maxHeight`        | `string`                                              |              | Altura máxima opcional (con scroll)                  |
| `showToolbar`      | `boolean`                                             | `true`       | Muestra u oculta la barra de herramientas            |
| `className`        | `string`                                              |              | Clases CSS para el contenedor `<div>` padre          |
| `contentClassName` | `string`                                              |              | Clases CSS para el contenedor de escritura (LexKit)  |
| `toolbarClassName` | `string`                                              |              | Clases CSS para la toolbar                           |
| `onImageUpload`    | `(file: File) => Promise<string>`                     |              | Integración para subida asíncrona de imágenes        |
| `aria-invalid`     | `boolean`                                             | `false`      | Indica que hay error de validación (apariencia roja) |

---

## Modos de Formato (HTML | Markdown | Text | JSON)

LexKit puede importar y exportar en diferentes formatos. Puedes configurar esto en `config.output`.
La prop `onChange` recibirá el contenido en el formato seleccionado.

```tsx
<Editor value={markdownContent} onChange={setMarkdownContent} config={{ output: 'markdown' }} />
```

- **html** (por defecto): Exporta tags como `<b>`, `<i>`, `<p>`, etc.
- **markdown**: Exporta a Markdown compatible con GFM.
- **text**: Exporta solo texto sin formato (ideal para previsualizaciones).
- **json**: Exporta el nodo crudo interno en un string JSON o objeto.

## Integración con formularios

El componente está preparado para exportarse en la biblioteca de formularios y conectarse a React Hook Form + Zod.

### Dentro de un formulario (FormRichTextField)

```tsx
import { Form } from '@/core/form'
import { FormRichTextField } from '@/core/form/fields/form-richtext-field'

export function MyForm() {
  return (
    <FormRichTextField
      label="Cuerpo"
      placeholder="Contenido del post..."
      preset="standard"
      minHeight="200px"
      required
    />
  )
}
```

El `FormRichTextField` envuelve a `<Editor>` e inyecta `value`, `onChange` y el estado `aria-invalid` de forma transparente.

---

## Extensibilidad

### `editor.constants.ts`

Aquí viven:

- `EDITOR_PRESETS`: Qué botones se muestran para `minimal`, `standard` y `full`.
- `createToolbarItems()`: Mapa donde se construyen los atajos y qué comandos de LexKit se ejecutan (e.g., `commands.toggleBold()`, `activeStates.bold`, etc).

Para agregar un **nuevo botón**:

1. Agrega el nuevo ítem a la función `createToolbarItems`. Ej. `sup: { ... }`
2. Modifica el tipo `TToolbarItem` en `editor.types.ts`
3. Incluye la key en los arreglos de los `EDITOR_PRESETS`.

---

## Dependencias

Este editor se monta sobre:

- `@lexkit/editor`: Núcleo de la integración simplificada de Lexical.
- `@lexical/react`: Integración oficial de React para Meta Lexical.
- Extensiones Lexical: `rich-text`, `history`, `html`, `list`, `markdown`, `selection`, `utils`, `lexical`.

## Estilos

LexKit aplica por defecto una de las clases configuradas en `editor.tsx` (`classNames={{ contentEditable: 'lexkit' }}`) y todo el CSS específico se controla en `editor.css`.

- `.lexkit`: Contenedor principal del contenido
- `prose` de Tailwind no es directamente requerido por defecto ya que `editor.css` define explícitamente qué hacer con los elementos `p, h1, h2, a, img`, etc.
  El editor soporta dos formas de insertar imágenes:

1. **URL directa**: Ingresa una URL en el dialog de imagen.
2. **Upload local**: Usa el prop `onImageUpload` para habilitar un botón de "subir archivo".

**Patrón recomendado de upload**:

```tsx
async function uploadImage(file: File): Promise<string> {
  // 1. Insertar preview inmediato (opcional)
  const reader = new FileReader()
  const base64 = await new Promise<string>(resolve => {
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
  // Si allowBase64 está activado, puedes insertar el base64 inmediatamente

  // 2. Upload en background
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const { url } = await response.json()

  // 3. El editor reemplaza la imagen con la URL final
  return url
}
```

## TypeScript

El editor incluye tipos completos:

```typescript
import type {
  IEditorProps,
  IEditorConfig,
  IEditorLinkDialogProps,
  IEditorImageDialogProps,
  TEditorPreset,
  TToolbarItem,
  TOutputFormat,
} from '@/components/ui/editor'
```

## Utilidades TipTap

Las utilidades de TipTap están centralizadas junto al editor:

```typescript
import { getChain, canUndo, canRedo } from '@/components/ui/editor/editor.utils'
```

Funciones disponibles:

- `getChain(editor)`: Obtiene la cadena de comandos TipTap con foco
- `canUndo(editor)`: Verifica si se puede deshacer
- `canRedo(editor)`: Verifica si se puede rehacer

## Componentes del editor

- **Editor**: Componente principal del editor
- **EditorToolbar**: Barra de herramientas
- **EditorToolbarButton**: Botón individual de la toolbar
- **EditorLinkDialog**: Dialog para insertar enlaces
- **EditorImageDialog**: Dialog para insertar imágenes (con soporte de upload)

## Hooks del editor

El editor sigue el patrón de separación de lógica en hooks customizados:

- **useEditorInstance**: Inicializa y gestiona la instancia del editor TipTap, extensiones y efectos
- **useEditorState**: Gestiona el estado de los dialogs (enlaces e imágenes)
- **useImageUpload**: Gestiona la lógica de subida de imágenes

### Uso de hooks

Los hooks están diseñados para ser usados internamente por el componente Editor, pero también pueden ser utilizados directamente si necesitas un control más granular:

```tsx
import { useEditorInstance } from '@/components/ui/editor'

function MyCustomEditor() {
  const { editor, toolbarItems } = useEditorInstance({
    value: content,
    onChange: setContent,
    preset: 'standard',
  })
  // Tu lógica custom aquí
}
```

## Dependencias

El editor requiere:

- `@tiptap/react@^3.19.0`
- `@tiptap/starter-kit@^3.19.0`
- `@tiptap/extension-image@^3.19.0`
- `@tiptap/extension-typography@^3.19.0`
- `@tiptap/extension-placeholder@^3.19.0`
- `@tiptap/pm@^3.19.0`
- `next-intl@^4.7.0` (para i18n de toolbar)

## Accesibilidad

- **ARIA labels**: Los tooltips y botones tienen ARIA labels apropiados
- **Keyboard navigation**: Soporta tabulación y atajos de teclado
- **i18n**: Todos los textos están internacionalizados en `es` y `en`

## CSS

Los estilos del editor están en `editor.css`. Clases principales:

- `.tiptap`: Contenedor principal del contenido
- `.tiptap-compact`: Variante compacta (menos margins)

**Dark mode**: Automáticamente compatible con `@tailwindcss` y las variables de CSS del proyecto.
