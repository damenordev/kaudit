/**
 * Prompt y schema para la generación de descripciones de PR con IA.
 * Genera contenido Markdown profesional para Pull Requests.
 */
import { z } from 'zod'

// Schema Zod para la generación estructurada del output
export const generationSchema = z.object({
  title: z.string().describe('Título conciso y descriptivo para el PR (máx 72 chars)'),
  summary: z.string().describe('Resumen ejecutivo de los cambios (2-3 oraciones)'),
  changes: z.string().describe('Descripción detallada de los cambios en formato Markdown con bullets'),
  suggestions: z.string().describe('Sugerencias y recomendaciones para el revisor en Markdown'),
  checklist: z.string().describe('Checklist de verificación para el revisor en formato Markdown'),
})

// Tipos inferidos del schema
export type TGenerationSchemaOutput = z.infer<typeof generationSchema>

/**
 * Genera el prompt para crear una descripción de PR.
 * @param gitDiff - El diff del código
 * @param validationResult - Resultado de la validación previa
 * @returns Prompt formateado para el modelo de IA
 */
export function generationPrompt(
  gitDiff: string,
  validationResult: { isValid: boolean; issues: Array<{ type: string; severity: string; message: string }> }
): string {
  const issuesContext =
    validationResult.issues.length > 0
      ? `\n## Problemas detectados en la validación:\n${validationResult.issues.map(i => `- [${i.severity.toUpperCase()}] ${i.type}: ${i.message}`).join('\n')}`
      : '\n## Validación: ✅ Sin problemas de seguridad detectados'

  return `Eres un experto en desarrollo de software. Genera una descripción profesional para un Pull Request basándote en el git diff proporcionado.

## Contexto de Validación:
- Estado de validación: ${validationResult.isValid ? '✅ APROBADO' : '⚠️ CON ADVERTENCIAS'}
${issuesContext}

## Instrucciones:

### title
- Escribe un título claro y conciso (máximo 72 caracteres)
- Usa verbos imperativos: "Add", "Fix", "Update", "Refactor", "Remove"
- No uses punto final

### summary
- Resume los cambios en 2-3 oraciones
- Explica QUÉ se cambió y POR QUÉ
- Menciona el impacto principal

### changes
- Lista los cambios principales en bullets Markdown
- Agrupa por área funcional si es posible
- Incluye detalles técnicos relevantes

### suggestions
- Proporciona recomendaciones para el revisor
- Menciona áreas que requieren atención especial
- Sugiere tests adicionales si aplica

### checklist
- Genera una lista de verificación en Markdown
- Incluye items como: tests, documentación, breaking changes
- Considera el contexto del diff

## Git Diff:

\`\`\`diff
${gitDiff}
\`\`\`

Responde con un JSON válido que cumpla el schema especificado. Todo el contenido debe estar en español.`
}
