---
name: database-drizzle
description: Rules and patterns for Drizzle ORM with PostgreSQL. Use this skill whenever working with database schemas, creating tables, defining relations, writing queries, running migrations, or any database-related task. Also use when the user mentions "db", "database", "table", "schema", "migration", "SQL", "query", "Drizzle", "PostgreSQL", or asks to store/retrieve data persistently.
---

# Database (Drizzle ORM)

This project uses **Drizzle ORM** with **PostgreSQL**. Drizzle provides type-safe SQL with a minimal API surface.

## Quick Reference

| Task               | Command / Location                               |
| ------------------ | ------------------------------------------------ |
| DB client          | `import { db } from '@/core/db'`                 |
| Table helper       | `import { createTable } from '@/core/db'`        |
| Schema files       | `src/modules/[module]/models/[module].schema.ts` |
| Generate migration | `pnpm db:generate`                               |
| Apply migration    | `pnpm db:migrate`                                |
| Push to DB (dev)   | `pnpm db:push`                                   |
| Drizzle Studio     | `pnpm db:studio`                                 |

---

## Creating Tables

Always use `createTable` from `@/core/db` to ensure correct table prefixes in non-production environments.

### Basic Table Pattern

```typescript
// src/modules/[module]/models/[module].schema.ts
import { relations } from 'drizzle-orm'
import { text, timestamp, boolean, pgTable } from 'drizzle-orm/pg-core'
import { createTable } from '@/core/db'

export const user = createTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
})
```

### Key Patterns

- **Column naming**: Use `snake_case` for database columns (`created_at`, `user_id`)
- **Table constant**: Use `camelCase` for the exported table constant (`user`, `account`)
- **Primary keys**: Use `.primaryKey()` on the ID column
- **Unique constraints**: Chain `.unique()` for unique columns
- **Default values**: Use `.$defaultFn(() => value)` for dynamic defaults (timestamps, IDs)
- **Nullable fields**: Omit `.notNull()` for optional columns

### Foreign Keys with Cascade

```typescript
export const session = createTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  // ... other fields
})
```

The `references()` function accepts a callback that returns the referenced table's column. Use `onDelete: 'cascade'` to automatically delete related records.

---

## Defining Relations

Use Drizzle's `relations()` API to define relationships between tables. This enables type-safe joins and relational queries.

### One-to-Many

```typescript
export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
}))
```

### Many-to-One

```typescript
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))
```

### Pattern Summary

- Define relations in the same file as your schema
- Export relations with the naming pattern `[table]Relations`
- Use `many()` for collections, `one()` for single references
- For `one()`, explicitly map `fields` to `references`

---

## Type Safety

Derive TypeScript types from your schemas rather than defining them separately.

### Select and Insert Types

```typescript
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { user } from './user.schema'

// Type for reading from DB (all fields present)
type User = InferSelectModel<typeof user>

// Type for inserting (optional fields may be omitted)
type NewUser = InferInsertModel<typeof user>
```

### Usage in Functions

```typescript
import { User, NewUser } from './types'

async function createUser(data: NewUser): Promise<User> {
  const [created] = await db.insert(user).values(data).returning()
  return created
}
```

---

## Common Query Patterns

All queries use the `db` instance from `@/core/db`.

### Insert

```typescript
import { db } from '@/core/db'
import { user } from '@/modules/auth/models/auth.schema'

// Insert single record
const [newUser] = await db
  .insert(user)
  .values({ id: generateId(), name: 'John', email: 'john@example.com' })
  .returning()

// Insert multiple records
await db.insert(user).values([user1, user2, user3])
```

### Select

```typescript
// Get all records
const users = await db.select().from(user)

// Get with condition
const [foundUser] = await db.select().from(user).where(eq(user.email, 'john@example.com'))

// Select specific fields
const emails = await db.select({ email: user.email }).from(user)
```

### Update

```typescript
import { eq } from 'drizzle-orm'

await db.update(user).set({ name: 'Jane', updatedAt: new Date() }).where(eq(user.id, userId))
```

### Delete

```typescript
await db.delete(user).where(eq(user.id, userId))
```

### With Relations (Joins)

```typescript
const result = await db.select().from(session).leftJoin(user, eq(session.userId, user.id))
```

---

## Query File Organization

Place reusable queries in dedicated files:

```text
src/modules/[module]/
├── models/
│   └── [module].schema.ts      # Table definitions + relations
├── services/
│   └── [module].queries.ts     # Reusable query functions
└── actions/
    └── [module].ts             # Server actions (may contain queries)
```

### Example Query File

```typescript
// src/modules/auth/services/auth.queries.ts
import { eq } from 'drizzle-orm'
import { db } from '@/core/db'
import { user } from '../models/auth.schema'

export async function getUserByEmail(email: string) {
  const [found] = await db.select().from(user).where(eq(user.email, email))
  return found ?? null
}

export async function getUserById(id: string) {
  const [found] = await db.select().from(user).where(eq(user.id, id))
  return found ?? null
}
```

---

## Migrations Workflow

### Development Flow

1. **Create/edit schema** in `src/modules/[module]/models/[module].schema.ts`
2. **Generate migration**: `pnpm db:generate`
3. **Apply migration**: `pnpm db:migrate` (or `pnpm db:push` for rapid prototyping)

### Commands

| Command            | Purpose                                                   |
| ------------------ | --------------------------------------------------------- |
| `pnpm db:generate` | Generate SQL migration files from schema changes          |
| `pnpm db:migrate`  | Apply pending migrations to database                      |
| `pnpm db:push`     | Push schema directly to DB (no migration files, dev only) |
| `pnpm db:studio`   | Open Drizzle Studio GUI at `local.drizzle.studio`         |

### Migration Files Location

Generated migrations go to `./drizzle/` directory (configured in `drizzle.config.ts`).

---

## Schema Configuration

The project uses a glob pattern to discover schemas:

```typescript
// drizzle.config.ts
{
  schema: [
    './src/core/db/schema.ts',
    './src/modules/*/models/*.schema.ts',
  ],
}
```

This means any file matching `*.schema.ts` in a module's `models/` folder is automatically included.

---

## Best Practices

### Do

- Always use `createTable` for table definitions
- Use `snake_case` for column names, `camelCase` for TypeScript identifiers
- Define relations alongside table schemas
- Use `.$defaultFn()` for timestamps and generated values
- Use `onDelete: 'cascade'` for foreign keys when appropriate
- Derive types with `InferSelectModel` and `InferInsertModel`
- Place reusable queries in `.queries.ts` files

### Don't

- Don't use `pgTable` directly—use `createTable` instead
- Don't define types manually when you can infer them
- Don't forget to export relations from schema files
- Don't use `db:push` in production—always use migrations
