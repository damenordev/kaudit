/**
 * User type for examples module.
 * Represents a user in the data table example.
 */
export interface IUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'user' | 'editor'
  status: 'active' | 'inactive' | 'pending'
  createdAt: Date
}

/**
 * User role options for filter dropdowns.
 */
export const USER_ROLE_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'User', value: 'user' },
] as const

/**
 * User status options for filter dropdowns.
 */
export const USER_STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
] as const
