import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock de server-only para tests
vi.mock('server-only', () => ({}))
