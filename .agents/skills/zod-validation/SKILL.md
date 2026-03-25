---
name: zod-validation
description: Comprehensive guide for using Zod for TypeScript schema validation. Use this skill when you need to: (1) Define data schemas for forms, APIs, or configuration, (2) Validate runtime data against these schemas, (3) Infer static TypeScript types from schemas, (4) Implement complex validation logic like refinements or transformations, or (5) Standardize error handling for validation failures.
---

# Zod Validation Skill

This skill provides best practices and patterns for using Zod to ensure type safety and data integrity in TypeScript applications.

## Core Principles

1. **Single Source of Truth**: Define the Zod schema first, then infer the TypeScript type using `z.infer<typeof Schema>`. Never manually define an interface that mirrors a schema.
2. **Runtime Safety**: Use Zod to validate all data at the boundaries of your application (API inputs, form submissions, external config).
3. **Strict Mode**: Ensure TypeScript's `strict` mode is enabled for maximum effectiveness.
4. **Parse vs. SafeParse**: Prefer `.safeParse()` for handling validation results gracefully without throwing errors, especially in server actions or UI logic.

## Usage Guide

### 1. Basic Schema Definition & Inference

Always export both the schema and the inferred type.

```typescript
import { z } from 'zod'

// 1. Define Schema (Zod v4+ syntax)
// Note: z.email() replaces z.string().email() in Zod v4
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(20),
  email: z.email(), // Updated to v4 syntax
  role: z.enum(['admin', 'user', 'guest']),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
})

// 2. Infer Type
export type TUser = z.infer<typeof UserSchema>
```

### 2. Validation Methods

- **`Schema.parse(data)`**: Validates data. Returns data if valid, throws `ZodError` if invalid. Use when you expect data to be valid or have a global error boundary.
- **`Schema.safeParse(data)`**: Validates data. Returns `{ success: true, data: T }` or `{ success: false, error: ZodError }`. **Recommended** for most logic.
- **`Schema.parseAsync(data)`**: For schemas with async refinements (e.g., checking DB for uniqueness).

### 3. Advanced Patterns

For detailed code examples of common patterns, see [references/patterns.md](references/patterns.md). This includes:

- Form Validation (React Hook Form)
- Environment Variable Validation
- API Request/Response Validation
- Complex Refinements (e.g., "Confirm Password")
- Transformations
