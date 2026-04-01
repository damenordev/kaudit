/**
 * Prompt para validación de código con IA.
 * Detecta problemas de seguridad en git diffs.
 */
import { z } from 'zod'

// Categorías sugeridas para el campo "type" del issue
const ISSUE_TYPE_HINTS = [
  'API_KEY',
  'SECRET',
  'SQL_INJECTION',
  'XSS',
  'CSRF',
  'AUTH',
  'INJECTION',
  'DANGEROUS_LOGIC',
  'MISCONFIGURATION',
  'SENSITIVE_DATA',
  'PATH_TRAVERSAL',
  'SSRF',
] as const

// Schema para la respuesta de validación.
// "type" es string libre para que el modelo clasifique libremente;
// las categorías sugeridas se indican en el prompt.
export const validationSchema = z.object({
  isValid: z.boolean(),
  issues: z.array(
    z.object({
      type: z.string().describe(`Category of the security issue. Use one of: ${ISSUE_TYPE_HINTS.join(', ')}`),
      severity: z.enum(['critical', 'high', 'medium', 'low']),
      line: z.number(),
      message: z.string().describe('A clear description of the problem'),
      suggestion: z.string().describe('How to fix the issue'),
    })
  ),
})

/**
 * Genera el prompt para validar un git diff.
 * Incluye ejemplo JSON explícito para guiar al modelo.
 */
export function validationPrompt(gitDiff: string, customRules?: string): string {
  const customRulesSection = customRules 
    ? `\nCRITICAL CUSTOM RULES FROM USER:\nYou MUST enforce and strictly adhere to the following rules during this audit:\n"""\n${customRules}\n"""\n`
    : ''

  return `You are a security code reviewer. Analyze the following git diff for potential security issues.
${customRulesSection}

Focus on:
- API keys or secrets exposed in code
- SQL injection vulnerabilities
- XSS (Cross-Site Scripting) risks
- CSRF vulnerabilities
- Authentication / Authorization flaws
- Dangerous logic patterns
- Hardcoded credentials
- Path traversal, SSRF, and other injection risks

For each issue found, provide:
- "type": one of ${ISSUE_TYPE_HINTS.join(', ')} (use EXACTLY one of these values)
- "severity": "critical", "high", "medium", or "low"
- "line": the line number in the diff
- "message": a clear description of the problem (this field is REQUIRED)
- "suggestion": how to fix it

If no issues are found, return { "isValid": true, "issues": [] }.

IMPORTANT: Respond with a JSON object matching this exact structure:
{
  "isValid": boolean,
  "issues": [
    {
      "type": "one of: ${ISSUE_TYPE_HINTS.join(', ')}",
      "severity": "critical | high | medium | low",
      "line": number,
      "message": "string — description of the problem",
      "suggestion": "string — how to fix it"
    }
  ]
}

Git diff to analyze:
\`\`\`diff
${gitDiff}
\`\`\``
}
