'use client'

import { Agentation } from 'agentation'

export default function AgentationProvider() {
  return <Agentation onAnnotationAdd={console.log} onSubmit={console.log} />
}
