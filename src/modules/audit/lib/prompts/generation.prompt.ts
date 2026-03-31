/**
 * Prompt para generación de contenido de PR con IA.
 * Genera descripciones profesionales para Pull Requests.
 */
import { z } from 'zod'

// Schema para la respuesta de generación
// El modelo genera arrays de strings para cambios, sugerencias y checklist
export const generationSchema = z.object({
  title: z.string(),
  summary: z.string(),
  changes: z.array(z.string()),
  suggestions: z.array(z.string()),
  checklist: z.array(z.string()),
})

interface IValidationContext {
  isValid: boolean
  issues: Array<{
    type: string
    severity: string
    message: string
  }>
}

/**
 * Genera el prompt para crear una descripción de PR.
 */
export function generationPrompt(gitDiff: string, validation: IValidationContext): string {
  const issuesContext =
    validation.issues.length > 0
      ? `Validation found ${validation.issues.length} issues:\n${validation.issues.map(i => `- [${i.severity}] ${i.type}: ${i.message}`).join('\n')}`
      : 'No issues found during validation.'

  return `You are a technical writer creating a professional Pull Request description.

Based on the git diff and validation results, generate a clear and informative PR description.

${issuesContext}

Guidelines:
- Write a concise, descriptive title (imperative mood, no period at end)
- Summarize what changes and WHY (not just what)
- List the main changes as bullet points
- Provide helpful suggestions for reviewers
- Include a practical checklist

Git diff:
\`\`\`diff
${gitDiff}
\`\`\`

Respond with a JSON object containing:
- title: Short, descriptive PR title
- summary: 2-3 sentence overview of the changes
- changes: Bullet points of what changed (markdown format)
- suggestions: Helpful tips for reviewers
- checklist: Pre-merge checklist items (markdown format)`
}
