export const EUserRole = {
  ADMIN: 'admin',
  USER: 'user',
} as const

export type TUserRole = (typeof EUserRole)[keyof typeof EUserRole]
