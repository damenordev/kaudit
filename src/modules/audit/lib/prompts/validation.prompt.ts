/**
 * Prompt y schema para la validación de código con IA.
 * Detecta problemas de seguridad como API keys, SQLi, XSS, secrets y dangerous logic.
 */
import { z } from 'zod'

// Schema Zod para la validación estructurada del output
export const validationSchema = z.object({
  isValid: z.boolean().describe('Indica si el código es seguro sin problemas críticos'),
  issues: z
    .array(
      z.object({
        type: z
          .enum(['API_KEY', 'SQL_INJECTION', 'XSS', 'SECRET', 'DANGEROUS_LOGIC'])
          .describe('Tipo de problema detectado'),
        severity: z.enum(['critical', 'high', 'medium', 'low']).describe('Nivel de severidad'),
        line: z.number().describe('Número de línea aproximado donde está el problema'),
        message: z.string().describe('Descripción clara del problema'),
        suggestion: z.string().describe('Sugerencia concreta para corregir el problema'),
      })
    )
    .describe('Lista de problemas detectados en el código'),
})

// Tipos inferidos del schema
export type TValidationSchemaOutput = z.infer<typeof validationSchema>

/**
 * Genera el prompt para validar un git diff.
 * @param gitDiff - El diff del código a validar
 * @returns Prompt formateado para el modelo de IA
 */
export function validationPrompt(gitDiff: string): string {
  return `Eres un experto en seguridad de código. Analiza el siguiente git diff y detecta problemas de seguridad.

## Tipos de problemas a detectar:

### API_KEY
- Claves API expuestas en el código
- Tokens de autenticación hardcodeados
- Credenciales en texto plano

### SQL_INJECTION
- Consultas SQL concatenadas sin parametrizar
- Uso de string interpolation en queries
- Falta de sanitización de inputs

### XSS
- innerHTML o dangerousSetInnerHTML sin sanitizar
- Renderizado de HTML dinámico sin escape
- Uso de eval() o funciones similares

### SECRET
- Contraseñas hardcodeadas
- Private keys expuestas
- Secrets de servicios cloud

### DANGEROUS_LOGIC
- Lógica que puede causar bucles infinitos
- Eliminación de datos sin confirmación
- Permisos demasiado permisivos

## Reglas:
1. Si el diff está vacío o solo contiene cambios triviales, retorna isValid: true con issues vacío
2. Clasifica la severidad: critical (exploitable), high (riesgo alto), medium (potencial), low (best practice)
3. Proporciona sugerencias específicas y accionables
4. El número de línea debe ser aproximado basado en el contexto del diff

## Git Diff a analizar:

\`\`\`diff
${gitDiff}
\`\`\`

Responde con un JSON válido que cumpla el schema especificado.`
}
