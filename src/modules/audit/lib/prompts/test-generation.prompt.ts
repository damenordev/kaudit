/**
 * Prompt para generación de tests unitarios con IA.
 * Genera tests usando vitest y @testing-library/react.
 */
import { z } from 'zod'

// Schema para la respuesta de generación de tests
export const testGenerationSchema = z.object({
  testFilePath: z.string(),
  testCode: z.string(),
  framework: z.enum(['vitest', 'jest']),
  description: z.string(),
})

/** Contexto de issues para incluir en el prompt */
interface ITestIssueContext {
  type: string
  severity: string
  message: string
}

/**
 * Genera el prompt para crear tests unitarios a partir de un archivo modificado.
 */
export function testGenerationPrompt(
  filePath: string,
  diff: string,
  language: string,
  issues: ITestIssueContext[]
): string {
  const issuesContext =
    issues.length > 0
      ? `Validation issues found in this file:\n${issues.map(i => `- [${i.severity}] ${i.type}: ${i.message}`).join('\n')}`
      : 'No issues found during validation.'

  return `You are an expert test engineer. Generate comprehensive unit tests for the modified code.

File: ${filePath}
Language: ${language}

${issuesContext}

Guidelines:
- Use vitest as the test framework (describe, it, expect, vi)
- Use @testing-library/react for React component tests
- Test both happy paths and edge cases
- Mock external dependencies with vi.mock()
- Use TypeScript with proper types (NO "any" keyword)
- Follow the existing project conventions:
  - Interfaces use "I" prefix (e.g., IUserProfile)
  - Types use "T" prefix (e.g., TUserRole)
  - File naming: kebab-case with suffixes (.utils.ts, .service.ts, etc.)
- Include descriptive test names
- Test file should be placed alongside the source with proper naming

Git diff of changes:
\`\`\`diff
${diff}
\`\`\`

Respond with a JSON object containing:
- testFilePath: Suggested path for the test file (e.g., "src/module/file.test.ts")
- testCode: Complete test file code (fully runnable, no placeholders)
- framework: "vitest"
- description: Brief description of what the tests cover`
}
