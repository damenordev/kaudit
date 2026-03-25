import { type ReactNode } from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table'

/** Modos de visualización disponibles para la tabla de datos. */
export type TDataTableViewMode = 'table' | 'grid'

/** Variante para un filtro del toolbar. */
export type TDataTableFilterVariant = 'search' | 'select' | 'multi-select'

/** Opción dentro de un filtro select o multi-select. */
export interface IDataTableFilterOption {
  label: string
  value: string
  icon?: ReactNode
}

/** Configuración de un filtro que se renderizará en el toolbar. */
export interface IDataTableFilterConfig {
  /** Identificador único. Para filtros de columna, debe coincidir con el accessorKey. */
  id: string
  /** Etiqueta legible mostrada en la UI del filtro. */
  label: string
  /** Tipo de control de filtro a renderizar. */
  variant: TDataTableFilterVariant
  /** Texto placeholder para inputs de búsqueda. */
  placeholder?: string
  /** Opciones disponibles para variantes select y multi-select. */
  options?: IDataTableFilterOption[]
}

/** Cadenas traducibles para el módulo DataTable. */
export interface IDataTableTranslations {
  noResults?: string
  noResultsTitle?: string
  noResultsDescription?: string
  rowsPerPage?: string
  /** Función que recibe { current, total } y devuelve el texto del indicador de página. */
  pageOf?: (params: { current: number; total: number }) => string
  /** Función que recibe { selected, total } y devuelve el texto de selección. */
  rowsSelected?: (params: { selected: number; total: number }) => string
  selectAll?: string
  selectRow?: string
  reset?: string
  view?: string
  toggleColumns?: string
  clearFilters?: string
  sortAsc?: string
  sortDesc?: string
  hideColumn?: string
  tableView?: string
  gridView?: string
  goToFirstPage?: string
  goToPreviousPage?: string
  goToNextPage?: string
  goToLastPage?: string
}

/** Props para el componente DataTable. */
export interface IDataTableProps<TData, TValue> {
  /** Definiciones de columna para TanStack Table. */
  columns: ColumnDef<TData, TValue>[]
  /** Array de datos de filas a mostrar. */
  data: TData[]

  /** Configuración declarativa de filtros. */
  filters?: IDataTableFilterConfig[]

  /** Habilita el toggle de vista tabla/grid en el toolbar. */
  enableViewToggle?: boolean
  /** Modo de vista inicial cuando enableViewToggle es true. */
  defaultViewMode?: TDataTableViewMode
  /** Renderizado personalizado de cada item en vista grid. */
  renderGridItem?: (item: TData) => ReactNode

  /** Habilita columna de checkbox para selección. */
  enableSelection?: boolean
  /** Acciones masivas cuando hay filas seleccionadas. */
  bulkActions?: (selectedRows: TData[]) => ReactNode

  /** Estado vacío personalizado cuando no hay resultados. */
  emptyState?: ReactNode

  /** Acciones extra al final del toolbar (ej. botón "Crear"). */
  toolbarActions?: ReactNode

  /** Número total de páginas. Pasar para habilitar paginación server-side. */
  pageCount?: number
  /** Estado de paginación controlado. */
  pagination?: PaginationState
  /** Callback cuando cambia la paginación (modo server-side). */
  onPaginationChange?: OnChangeFn<PaginationState>
  /** Estado de ordenamiento controlado. */
  sorting?: SortingState
  /** Callback cuando cambia el ordenamiento (modo server-side). */
  onSortingChange?: OnChangeFn<SortingState>
  /** Estado de filtros de columna controlado. */
  columnFilters?: ColumnFiltersState
  /** Callback cuando cambian los filtros de columna (modo server-side). */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  /** Valor de búsqueda global controlado (búsqueda server-side). */
  searchValue?: string
  /** Callback cuando cambia el valor de búsqueda global. */
  onSearchChange?: (value: string) => void

  /** Cadenas localizadas para la UI de la tabla. */
  translations?: IDataTableTranslations
}
