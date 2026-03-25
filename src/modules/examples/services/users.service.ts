import { type IUser } from '../types/user.types'

/**
 * Fake users data for examples module.
 * Used to demonstrate data table patterns without connecting to a database.
 */
const fakeUsers: IUser[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'editor',
    status: 'active',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@example.com',
    role: 'editor',
    status: 'active',
    createdAt: new Date('2024-04-05'),
  },
  {
    id: '5',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    role: 'user',
    status: 'pending',
    createdAt: new Date('2024-05-12'),
  },
  {
    id: '6',
    firstName: 'Diana',
    lastName: 'Miller',
    email: 'diana.miller@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-06-18'),
  },
  {
    id: '7',
    firstName: 'Edward',
    lastName: 'Davis',
    email: 'edward.davis@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-07-22'),
  },
  {
    id: '8',
    firstName: 'Fiona',
    lastName: 'Garcia',
    email: 'fiona.garcia@example.com',
    role: 'editor',
    status: 'inactive',
    createdAt: new Date('2024-08-30'),
  },
  {
    id: '9',
    firstName: 'George',
    lastName: 'Martinez',
    email: 'george.martinez@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-09-14'),
  },
  {
    id: '10',
    firstName: 'Hannah',
    lastName: 'Rodriguez',
    email: 'hannah.rodriguez@example.com',
    role: 'user',
    status: 'pending',
    createdAt: new Date('2024-10-08'),
  },
  {
    id: '11',
    firstName: 'Ivan',
    lastName: 'Lee',
    email: 'ivan.lee@example.com',
    role: 'editor',
    status: 'active',
    createdAt: new Date('2024-11-03'),
  },
  {
    id: '12',
    firstName: 'Julia',
    lastName: 'Clark',
    email: 'julia.clark@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: '13',
    firstName: 'Kevin',
    lastName: 'Lewis',
    email: 'kevin.lewis@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: new Date('2025-01-09'),
  },
  {
    id: '14',
    firstName: 'Laura',
    lastName: 'Walker',
    email: 'laura.walker@example.com',
    role: 'editor',
    status: 'active',
    createdAt: new Date('2025-01-20'),
  },
  {
    id: '15',
    firstName: 'Michael',
    lastName: 'Hall',
    email: 'michael.hall@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2025-02-05'),
  },
]

// ─── Constants ─────────────────────────────────────────────────────

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

// ─── Types ──────────────────────────────────────────────────────────

export interface IGetUsersParams {
  page?: string | number
  limit?: string | number
  q?: string
}

export interface IGetUsersResult {
  data: IUser[]
  pageCount: number
  total: number
}

// ─── Service ────────────────────────────────────────────────────────

/**
 * Simula una consulta de base de datos con paginación y filtrado.
 * Acepta strings directamente desde searchParams y maneja defaults internamente.
 */
export const getUsers = async (params: IGetUsersParams = {}): Promise<IGetUsersResult> => {
  const page = typeof params.page === 'string' ? parseInt(params.page) : (params.page ?? DEFAULT_PAGE)
  const limit = typeof params.limit === 'string' ? parseInt(params.limit) : (params.limit ?? DEFAULT_LIMIT)
  const q = params.q ?? ''

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300))

  // Filtrar por búsqueda
  let filtered = fakeUsers
  if (q) {
    const query = q.toLowerCase()
    filtered = fakeUsers.filter(
      user =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    )
  }

  // Calcular paginación
  const total = filtered.length
  const pageCount = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const paginatedData = filtered.slice(offset, offset + limit)

  return {
    data: paginatedData,
    pageCount,
    total,
  }
}
