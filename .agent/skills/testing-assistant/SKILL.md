---
name: testing-assistant
description: Comprehensive workflow and guidelines for implementing testing in the project. Covers Unit Testing with Vitest and End-to-End (E2E) Testing with Playwright, including best practices for Server Actions, Hooks, and Authentication. Use this skill when asked to "write tests", "set up testing", "test this component", or "debug a test".
---

# Testing Assistant

This skill provides a comprehensive guide for implementing and maintaining tests in the project, ensuring code reliability and robustness.

## Testing Strategy Overview

We adhere to a "Testing Trophy" approach, prioritizing integration tests while maintaining a solid base of unit tests and critical E2E flows.

- **Vitest**: Unit and Integration testing (Components, Hooks, Utils, Server Actions).
- **Playwright**: End-to-End (E2E) testing (Critical path user flows, Browser interactions).

## Project Structure

All tests are centralized in the `tests/` directory at project root:

```
tests/
├── unit/                       # Unit tests (Vitest)
│   ├── setup.ts                # Vitest setup (jsdom, mocks)
│   ├── utils/                  # Tests for src/core/utils/*
│   ├── hooks/                  # Tests for src/core/hooks/*
│   └── modules/                # Tests for src/modules/*
│       └── [module]/
│           ├── schemas/
│           └── services/
├── e2e/                        # E2E tests (Playwright)
│   ├── auth.spec.ts
│   └── landing.spec.ts
└── reports/                    # Generated reports
    ├── coverage/               # Vitest coverage
    └── playwright-html/        # Playwright HTML report
```

## 1. Vitest (Unit & Integration) Workflow

### 1.1 Location & Naming Conventions

- **Centralized**: All unit tests go in `tests/unit/` mirroring the `src/` structure.
- **Naming Protocol**: `[filename].test.ts` or `[filename].test.tsx`.
- **Imports**: Use `@/` path aliases to import from `src/`.

```typescript
// tests/unit/modules/auth/schemas/sign-in.schema.test.ts
import { signInSchema } from '@/modules/auth/schemas/sign-in.schema'
```

### 1.2 Testing Server Actions (Integration)

Server Actions are async functions and should be tested as input/output units.

```typescript
// tests/unit/modules/auth/services/auth.actions.test.ts
import { describe, expect, it } from 'vitest'
import { signInAction } from '@/modules/auth/services/auth.actions'

describe('signInAction', () => {
  it('should return error for invalid input', async () => {
    // Arrange
    const invalidData = { email: 'not-an-email', password: 'short' }

    // Act
    const result = await signInAction(invalidData)

    // Assert
    expect(result.success).toBe(false)
  })
})
```

### 1.3 Testing Custom Hooks (Unit)

Use `renderHook` from `@testing-library/react` to test hook logic in isolation.

```typescript
// tests/unit/hooks/use-is-mobile.test.ts
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useIsMobile } from '@/core/hooks/use-is-mobile'

describe('useIsMobile', () => {
  it('should return true when window width is below mobile breakpoint', () => {
    // Arrange - Mock window.matchMedia
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 })
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    // Act
    const { result } = renderHook(() => useIsMobile())

    // Assert
    expect(result.current).toBe(true)
  })
})
```

### 1.4 Testing Zod Schemas (Unit)

```typescript
// tests/unit/modules/auth/schemas/sign-in.schema.test.ts
import { describe, expect, it } from 'vitest'
import { signInSchema } from '@/modules/auth/schemas/sign-in.schema'

describe('signInSchema', () => {
  it('should validate correct sign in data', () => {
    const result = signInSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = signInSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })
})
```

### 1.5 Mocks & Dependencies

- Use `vi.mock` for external modules (e.g., database clients, third-party APIs).
- Use `vi.spyOn` to assert calls on internal methods.
- Mock path must use `@/` alias for consistency.

```typescript
// Mocking a module
vi.mock('@/modules/auth/services/auth.service', () => ({
  getSession: vi.fn(),
}))

import { getSession } from '@/modules/auth/services/auth.service'
const mockGetSession = vi.mocked(getSession)
```

## 2. Playwright (E2E) Workflow

### 2.1 Location

- All E2E tests are in `tests/e2e/` directory.
- Reports are generated in `tests/reports/playwright-html/`.

### 2.2 Writing Robust Tests

Focus on user intent and accessibility roles, avoiding implementation details like CSS classes.

```typescript
// tests/e2e/auth.spec.ts
import { expect, test } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display sign in form', async ({ page }) => {
    // Arrange & Act
    await page.goto('/signin')

    // Assert
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test('should redirect to signin when accessing dashboard unauthenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/signin/)
  })
})
```

### 2.3 Browser Configuration

By default, only Chromium is configured for fast local development. Other browsers are commented out in `playwright.config.ts` and can be enabled for CI or comprehensive testing.

```bash
# Install browsers (first time only)
pnpm exec playwright install chromium

# Install all browsers (for comprehensive testing)
pnpm exec playwright install
```

### 2.4 Authentication in E2E

- **Avoid UI Login Repeatedly**: For non-auth tests, use session storage/cookies setup (global setup) to bypass the login screen.
- Only test the actual Login Form UI in `auth.spec.ts`.

## 3. Run Commands

```bash
# Unit tests (Vitest)
pnpm run test              # Run all unit tests
pnpm run test:ui           # Run with Vitest UI
pnpm run test:coverage     # Generate coverage

# E2E tests (Playwright)
pnpm run test:e2e          # Run all E2E tests (headless)
pnpm run test:e2e -- --ui  # Run with Playwright UI for debugging
```

## 4. Configuration Files

- `vitest.config.ts` - Vitest configuration (jsdom, setup, coverage)
- `playwright.config.ts` - Playwright configuration (browsers, baseURL, reports)
- `tests/unit/setup.ts` - Global test setup (mocks for matchMedia, ResizeObserver, etc.)

## 5. Best Practices Checklist

- [ ] **Centralized Tests**: All tests are in `tests/` directory, not alongside source files.
- [ ] **AAA Pattern**: Tests structured with Arrange, Act, Assert.
- [ ] **Path Aliases**: Using `@/` imports, not relative paths.
- [ ] **Accessibility Selectors**: Using `getByRole`, `getByLabel`, `getByText` instead of generic selectors.
- [ ] **Isolation**: Tests clean up state and mock external mutations.
- [ ] **No Explicit Waits**: Using assertions (`await expect`) instead of `waitForTimeout`.
- [ ] **Mocking**: Using `vi.mock` with `@/` paths for consistency.
