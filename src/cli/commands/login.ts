/**
 * Comandos 'login' y 'logout' del CLI.
 * Maneja la autenticación con API keys del dashboard.
 */
import { Command } from 'commander'

import { validateApiKey } from '../lib/auth'
import { readConfig, writeConfig, clearConfig } from '../lib/config'
import { showError, showSuccess, showInfo, showSpinner } from '../lib/display'

// Longitud mínima esperada para una API key
const MIN_API_KEY_LENGTH = 20

/**
 * Crea el comando 'login' para autenticarse con API key.
 */
export function createLoginCommand(): Command {
  return new Command('login')
    .description('Autenticar con kaudit usando API key')
    .argument('<api-key>', 'API key obtenida del dashboard')
    .action(async (apiKey: string) => {
      // 1. Validación básica del formato
      if (!apiKey || apiKey.length < MIN_API_KEY_LENGTH) {
        showError('API key inválida. Debe tener al menos 20 caracteres.')
        process.exit(1)
      }

      // 2. Obtener server URL desde config o default
      const config = readConfig()
      const serverUrl = config.serverUrl || 'http://localhost:3000'

      // 3. Validar key contra el servidor
      showSpinner('Validando API key...')
      let result: { valid: boolean; userId?: string }
      try {
        result = await validateApiKey(apiKey, serverUrl)
      } catch (error) {
        showError(`No se pudo validar la API key: ${error instanceof Error ? error.message : 'Error de conexión'}`)
        showInfo('Verificá que el servidor esté accesible y la key sea correcta.')
        process.exit(1)
      }

      if (!result.valid) {
        showError('API key inválida. Verificá que sea correcta.')
        process.exit(1)
      }

      // 4. Guardar en config
      writeConfig({
        ...config,
        apiKey,
        userId: result.userId,
      })

      // 5. Mostrar éxito
      showSuccess('Autenticación exitosa!')
      if (result.userId) {
        showInfo(`Usuario: ${result.userId}`)
      }
      showInfo('Configuración guardada en ~/.kaudit/config.json')
    })
}

/**
 * Crea el comando 'logout' para eliminar credenciales.
 */
export function createLogoutCommand(): Command {
  return new Command('logout').description('Cerrar sesión y eliminar credenciales').action(() => {
    clearConfig()
    showSuccess('Sesión cerrada. Credenciales eliminadas.')
  })
}
