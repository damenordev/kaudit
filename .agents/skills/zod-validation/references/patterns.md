# Zod Validation Patterns

## 1. Environment Variable Validation

Validate your `process.env` at build/runtime to prevent silent failures.

```typescript
import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.url(), // Updated to v4 syntax
  API_KEY: z.string().min(1),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

const env = EnvSchema.parse(process.env)
export { env }
```

## 2. Form Validation (Refinements)

A common pattern for "Confirm Password" or other cross-field validation.

```typescript
const SignUpSchema = z
  .object({
    email: z.email(), // Updated to v4 syntax
    password: z.string().min(8, 'Password must be at least 8 chars'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Error will be attached to this field
  })

type TSignUp = z.infer<typeof SignUpSchema>
```

## 3. API Response Validation

Ensure external APIs return what you expect.

```typescript
const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number().positive(),
  tags: z.array(z.string()).optional(),
});

async function fetchProduct(id: string) {
  const res = await fetch(\`/api/products/\${id}\`);
  const json = await res.json();

  // validates and strips unknown keys
  const product = ProductSchema.parse(json);
  return product;
}
```

## 4. Transformations

Clean or modify data during validation.

```typescript
const SearchQuerySchema = z.object({
  page: z
    .string()
    .transform(val => parseInt(val, 10))
    .pipe(z.number().positive())
    .catch(1), // Default to 1 if parsing fails or invalid

  query: z.string().trim().toLowerCase(),

  filters: z
    .string()
    .transform(str => str.split(',')) // "a,b,c" -> ["a", "b", "c"]
    .optional(),
})
```

## 5. Discriminated Unions

Great for handling different states or types of actions.

```typescript
const ActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('create'), data: z.string() }),
  z.object({ type: z.literal('update'), id: z.string(), data: z.string() }),
  z.object({ type: z.literal('delete'), id: z.string() }),
])

function handleAction(action: z.infer<typeof ActionSchema>) {
  // action.data (string)
  if (action.type === 'create') return

  // action.id, action.data
  if (action.type === 'update') return

  // action.id
  if (action.type === 'delete') return
}
```
