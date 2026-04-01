/** Tipos para la gestión de API keys en el dashboard */

/** API key enmascarada tal como la devuelve el endpoint GET */
export interface IMaskedApiKey {
  id: string
  name: string | null
  prefix: string | null
  start: string | null
  createdAt: Date | null
  expiresAt: Date | null
  enabled: boolean | null
}

/** Respuesta del endpoint POST al crear una API key */
export interface ICreateApiKeyResponse {
  key: {
    id: string
    name: string | null
    key: string
    prefix: string | null
    start: string | null
    createdAt: Date
    expiresAt: Date | null
    enabled: boolean | null
  }
  message: string
}

/** Props para el componente ApiKeysTab */
export interface IApiKeysTabProps {
  translations: IApiKeysTranslations
}

/** Traducciones del tab de API keys */
export interface IApiKeysTranslations {
  title: string
  description: string
  createButton: string
  table: {
    name: string
    key: string
    created: string
    status: string
    actions: string
    empty: string
    enabled: string
    disabled: string
    unnamed: string
    confirmDelete: string
    delete: string
  }
  create: {
    title: string
    nameLabel: string
    namePlaceholder: string
    cancel: string
    submit: string
    submitting: string
    error: string
  }
  reveal: {
    title: string
    warning: string
    copy: string
    copied: string
    close: string
  }
}
