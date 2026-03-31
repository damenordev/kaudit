import { FilePlus, FileEdit, FileX, FileSymlink, type LucideIcon } from 'lucide-react'

import type { TFileStatus } from '../../types/diff.types'

/** Mapeo de estado de archivo a icono y color */
const STATUS_CONFIG: Record<TFileStatus, { icon: LucideIcon; color: string }> = {
  added: { icon: FilePlus, color: 'text-emerald-500' },
  modified: { icon: FileEdit, color: 'text-amber-500' },
  deleted: { icon: FileX, color: 'text-red-500' },
  renamed: { icon: FileSymlink, color: 'text-blue-500' },
}

export interface IStatusIconProps {
  status: TFileStatus
  className?: string
}

/** Icono que representa el estado de un archivo en el diff */
export function StatusIcon({ status, className }: IStatusIconProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return <Icon className={className ?? 'size-4'} />
}
