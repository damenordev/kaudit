'use client'

import { useCallback, useState } from 'react'

import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemDragHandle,
  KanbanOverlay,
} from '@/core/kanban'

import { Badge } from '@/core/ui/primitives/badge'
import { cn } from '@/core/utils/cn.utils'
import { Button } from '@/core/ui'
import { GripVertical, Trash2 } from 'lucide-react'

/** Tarea del tablero Kanban */
interface ITask {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
}

/** Prioridad de la tarea */
type TPriority = ITask['priority']

/** Datos iniciales del tablero */
const INITIAL_COLUMNS: Record<string, ITask[]> = {
  todo: [
    { id: '1', title: 'Investigar requerimientos del cliente', priority: 'high' },
    { id: '2', title: 'Crear wireframes de la interfaz', priority: 'medium' },
    { id: '3', title: 'Documentar arquitectura', priority: 'low' },
  ],
  'in-progress': [
    { id: '4', title: 'Desarrollar componentes base', priority: 'high' },
    { id: '5', title: 'Configurar base de datos', priority: 'medium' },
  ],
  done: [
    { id: '6', title: 'Configurar proyecto Next.js', priority: 'low' },
    { id: '7', title: 'Instalar dependencias', priority: 'low' },
  ],
}

/** Nombres de columnas */
const COLUMN_LABELS: Record<string, string> = {
  todo: 'Por hacer',
  'in-progress': 'En progreso',
  done: 'Completado',
}

/** Colores de prioridad */
const PRIORITY_STYLES: Record<TPriority, string> = {
  low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  high: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
}

/** Etiquetas de prioridad */
const PRIORITY_LABELS: Record<TPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

/** Página de demostración del componente Kanban */
export default function KanbanDemoPage() {
  const [columns, setColumns] = useState<Record<string, ITask[]>>(INITIAL_COLUMNS)

  const handleDelete = useCallback((taskId: string) => {
    setColumns(prev => {
      const newColumns: Record<string, ITask[]> = {}
      for (const [columnId, tasks] of Object.entries(prev)) {
        newColumns[columnId] = tasks.filter(task => task.id !== taskId)
      }
      return newColumns
    })
  }, [])

  const renderOverlayItem = useCallback(
    (task: ITask) => (
      <div className="bg-background border rounded-md shadow-lg p-3 w-72">
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium leading-snug">{task.title}</p>
            <Badge className={cn('text-xs', PRIORITY_STYLES[task.priority])}>{PRIORITY_LABELS[task.priority]}</Badge>
          </div>
        </div>
      </div>
    ),
    []
  )

  return (
    <Kanban value={columns} onValueChange={setColumns} getItemValue={task => task.id} className="h-full p-4">
      <KanbanBoard className="h-full">
        {Object.entries(columns).map(([columnId, tasks]) => (
          <KanbanColumn key={columnId} value={columnId}>
            <KanbanColumnHandle>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{COLUMN_LABELS[columnId]}</span>
                <Badge variant="secondary" className="rounded-full">
                  {tasks.length}
                </Badge>
              </div>
            </KanbanColumnHandle>
            <KanbanColumnContent value={columnId} items={tasks}>
              {task => (
                <KanbanItem key={task.id} value={task.id}>
                  <div className="flex items-start gap-2 p-3">
                    <KanbanItemDragHandle className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors">
                      <GripVertical className="h-4 w-4" />
                    </KanbanItemDragHandle>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium leading-snug">{task.title}</p>
                      <Badge className={cn('text-xs', PRIORITY_STYLES[task.priority])}>
                        {PRIORITY_LABELS[task.priority]}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </KanbanItem>
              )}
            </KanbanColumnContent>
          </KanbanColumn>
        ))}
      </KanbanBoard>
      <KanbanOverlay renderItem={renderOverlayItem} />
    </Kanban>
  )
}
