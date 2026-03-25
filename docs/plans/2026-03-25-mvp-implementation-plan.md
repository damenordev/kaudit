# GitHub Auditor AI - Plan de Implementación MVP

**Fecha:** 2026-03-25
**Estado:** Aprobado
**Hackathon:** CubePath 2026

---

## 1. Visión del Proyecto

GitHub Auditor es un asistente de ingeniería "AI-First" que automatiza la creación de Pull Requests y actúa como guardián de seguridad. Elimina la fricción de documentar cambios y previene que errores críticos lleguen al repositorio.

## 2. Decisiones de Arquitectura

| Decisión | Valor | Justificación |
|----------|-------|---------------|
| Flujo | CLI → PR completo | Requisito del usuario |
| Jobs asíncronos | Inngest | Requisito obligatorio |
| Caché | DB/Memoria | Redis opcional para MVP |
| Modelos IA | Requesty/OpenRouter | Ya configurados en el proyecto |
| Framework | Next.js 16 | Arquitectura existente |

## 3. Flujo de Datos

```
┌─────────┐    ┌──────────────┐    ┌─────────────────────────────────────────┐
│   CLI   │───▶│  API Route   │───▶│              Inngest                    │
│         │    │ /audit/start │    │  ┌─────────┐ ┌─────────┐ ┌──────────┐  │
└─────────┘    └──────────────┘    │  │ Step 1  │─▶│ Step 2  │─▶│  Step 3  │  │
       ▲                            │  │Validate │ │Generate │ │GitHub PR │  │
       │                            │  └─────────┘ └─────────┘ └──────────┘  │
       │                            └─────────────────────────────────────────┘
       │                                    │
       │         Polling / Status           │
       └────────────────────────────────────┘
```

## 4. Fases de Implementación

### Fase 1: Infraestructura Base
- Configurar Inngest (cliente, funciones, webhook)
- Crear schema de base de datos para auditorías

### Fase 2: Motor de Auditoría
- Servicio de validación de seguridad (detecta API keys, SQL injection, XSS)
- Servicio de generación de descripciones Markdown
- Servicio de integración con GitHub API

### Fase 3: Inngest Workflow
- Definir eventos y steps encadenados
- Implementar lógica de bloqueo ante fallos de seguridad

### Fase 4: API Endpoints
- POST `/api/audit/start` - Iniciar auditoría
- GET `/api/audit/[id]/status` - Consultar estado
- GET `/api/audit/list` - Historial

### Fase 5: CLI Tool
- Comando `npx github-auditor ship`
- Captura de git diff
- Polling de estado y visualización

### Fase 6: Dashboard
- Página de historial de auditorías
- Página de detalle con reporte

### Fase 7: Polish
- Variables de entorno
- Internacionalización
- Documentación

## 5. Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Framework | Next.js | 16.1.6 |
| ORM | Drizzle | 0.45.1 |
| Auth | better-auth | 1.4.18 |
| Jobs | Inngest | TBD |
| AI SDK | AI SDK | 6.0 |
| GitHub | Octokit | TBD |
| UI | Radix UI + Tailwind | 4.2 |

## 6. Criterios de Éxito

1. ✅ CLI ejecuta `ship` y captura git diff correctamente
2. ✅ Validación de seguridad detecta issues críticos
3. ✅ Generación de descripción produce Markdown profesional
4. ✅ PR se crea automáticamente en GitHub
5. ✅ Dashboard muestra historial y detalles
6. ✅ Tiempo total < 45 segundos

## 7. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Mitigación |
|--------|--------------|------------|
| GitHub API rate limits | Media | Implementar caché de diffs |
| Tiempo de respuesta IA | Alta | Usar modelos rápidos para validación |
| Inngest setup complejo | Baja | Documentación clara de setup |

---

**Próximos pasos:** Ver `docs/tasks/mvp-tasks.md` para el listado detallado de tareas.
