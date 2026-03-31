/**
 * Prompt para validación de código con IA.
 * Detecta problemas de seguridad en git diffs.
 */
import { z } from 'zod'

// Schema para la respuesta de validación
export const validationSchema = z.object({
  isValid: z.boolean(),
  issues: z.array(
    z.object({
      type: z.enum(['API_KEY', 'SQL_INJECTION', 'XSS', 'SECRET', 'DANGEROUS_LOGIC']),
      severity: z.enum(['critical', 'high', 'medium', 'low']),
      line: z.number(),
      message: z.string(),
      suggestion: z.string(),
    })
  ),
})

/**
 * Genera el prompt para validar un git diff.
 */
export function validationPrompt(gitDiff: string): string {
  return `You are a security code reviewer. Analyze the following git diff for potential security issues.

Focus on:
- API keys or secrets exposed in code
- SQL injection vulnerabilities
- XSS (Cross-Site Scripting) risks
- Dangerous logic patterns
- Hardcoded credentials

For each issue found, provide:
- The type of issue
- Severity level (critical, high, medium, low)
- The line number where it occurs
- A clear description of the problem
- A suggestion to fix it

If no issues are found, return isValid: true and an empty issues array.

Git diff to analyze:
\`\`\`diff
${gitDiff}
\`\`\`

Respond with a JSON object matching the schema.`
}
