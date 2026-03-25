# Kanban

Componente de arrastrar y soltar para organizar items en columnas.

## Uso básico

```tsx
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from '@/modules/kanban'

interface ITask {
  id: string
  title: string
}

function TaskBoard() {
  const [columns, setColumns] = useState<Record<string, ITask[]>>({
    todo: [{ id: '1', title: 'Crear diseño' }],
    done: [{ id: '2', title: 'Configurar proyecto' }],
  })

  return (
    <Kanban value={columns} onValueChange={setColumns} getItemValue={task => task.id}>
      <KanbanBoard>
        {Object.entries(columns).map(([columnId, tasks]) => (
          <KanbanColumn key={columnId} value={columnId}>
            <KanbanColumnHandle>
              <h3>{columnId}</h3>
            </KanbanColumnHandle>
            <KanbanColumnContent value={columnId} items={tasks} getItemValue={task => task.id}>
              {task => (
                <KanbanItem key={task.id} value={task.id}>
                  <KanbanItemHandle>{task.title}</KanbanItemHandle>
                </KanbanItem>
              )}
            </KanbanColumnContent>
          </KanbanColumn>
        ))}
      </KanbanBoard>
      <KanbanOverlay>
        <div className="bg-muted size-full rounded-md" />
      </KanbanOverlay>
    </Kanban>
  )
}
```

## Componentes

### Kanban

Componente raíz. Maneja el estado y el contexto de drag & drop.

| Prop            | Tipo                                   | Descripción                      |
| --------------- | -------------------------------------- | -------------------------------- |
| `value`         | `Record<string, T[]>`                  | Columnas con sus items           |
| `onValueChange` | `(value: Record<string, T[]>) => void` | Callback al mover items          |
| `getItemValue`  | `(item: T) => string`                  | Función para obtener ID del item |
| `onItemClick`   | `(item: T) => void`                    | Callback al hacer clic en item   |
| `className`     | `string`                               | Clases CSS adicionales           |

### KanbanBoard

Contenedor horizontal de columnas.

### KanbanColumn

Columna individual.

| Prop        | Tipo     | Descripción                 |
| ----------- | -------- | --------------------------- |
| `value`     | `string` | Identificador de la columna |
| `className` | `string` | Clases CSS adicionales      |

### KanbanColumnHandle

Cabecera de la columna.

### KanbanColumnContent

Área scrollable que contiene los items. Usa render props.

| Prop           | Tipo                     | Descripción                |
| -------------- | ------------------------ | -------------------------- |
| `value`        | `string`                 | ID de la columna           |
| `items`        | `T[]`                    | Array de items             |
| `getItemValue` | `(item: T) => string`    | Función para obtener ID    |
| `children`     | `(item: T) => ReactNode` | Render prop para cada item |

### KanbanItem

Item arrastrable.

| Prop        | Tipo      | Descripción            |
| ----------- | --------- | ---------------------- |
| `value`     | `string`  | Identificador del item |
| `disabled`  | `boolean` | Deshabilita arrastre   |
| `className` | `string`  | Clases CSS adicionales |

### KanbanItemHandle

Contenido del item.

### KanbanOverlay

Elemento fantasma durante el arrastre.

## Requisitos

Los items deben implementar `IKanbanItem`:

```tsx
interface IKanbanItem {
  id: string // o UniqueIdentifier de @dnd-kit/core
}
```

## Dependencias

- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`
