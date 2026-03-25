import type { ComponentProps } from 'react'

import { cn } from '@/core/utils/cn.utils'
import { Panel as PanelPrimitive } from '@xyflow/react'

type PanelProps = ComponentProps<typeof PanelPrimitive>

export const Panel = ({ className, ...props }: PanelProps) => (
  <PanelPrimitive className={cn('m-4 overflow-hidden rounded-md border bg-card p-1', className)} {...props} />
)
