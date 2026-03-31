/**
 * Prompt para generación automática de docstrings JSDoc.
 * Detecta funciones sin documentación y genera JSDoc en español.
 */
import { z } from 'zod'

/** Schema de validación para un docstring generado */
export const docstringSchema = z.object({
  filePath: z.string(),
  functionName: z.string(),
  line: z.number(),
  docstring: z.string(),
  language: z.enum(['typescript', 'javascript']),
})

/** Schema para la respuesta completa del modelo */
export const docstringResponseSchema = z.object({
  docstrings: z.array(docstringSchema),
})

/**
 * Genera el prompt para detectar funciones sin docstring
 * y producir JSDoc en español para cada una.
 *
 * @param sourceCode - Código fuente completo del archivo
 * @param filePath - Ruta relativa del archivo
 * @param language - Lenguaje de programación detectado
 * @returns Prompt formateado para el modelo de IA
 */
export function docstringGenerationPrompt(
  sourceCode: string,
  filePath: string,
  language: 'typescript' | 'javascript'
): string {
  return `Eres un generador experto de documentación JSDoc en español.
Analiza el siguiente código fuente y detecta TODAS las funciones que NO tengan docstring (bloque JSDoc /** ... */) encima de su declaración.

Para cada función sin docstring, genera un bloque JSDoc en español siguiendo estas reglas:
- Descripción clara y concisa en español
- @param para cada parámetro con tipo y descripción
- @returns con descripción del valor de retorno (si aplica)
- @example cuando la función no sea trivial
- @throws si la función puede lanzar errores

Reglas estrictas:
- NO generes docstrings para funciones que YA tienen uno
- NO inventes parámetros que no existen en la firma
- El JSDoc debe estar en español, el código permanece sin cambios
- Si TODAS las funciones ya tienen docstring, retorna array vacío

Archivo: ${filePath}
Lenguaje: ${language}

Código fuente:
\`\`\`${language}
${sourceCode}
\`\`\`

Responde SOLO con un JSON válido con esta estructura:
{
  "docstrings": [
    {
      "filePath": "${filePath}",
      "functionName": "nombre de la función",
      "line": número_de_línea,
      "docstring": "/**\\n * Descripción en español.\\n * @param nombre - descripción\\n * @returns descripción\\n */",
      "language": "${language}"
    }
  ]
}`
}
