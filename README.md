# kaudit

**AI-first PR auditor** that reviews your pull requests for security vulnerabilities, generates professional descriptions, and provides contextual chat — before you ship.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Why kaudit?

Code reviews catch bugs, but they don't scale. kaudit runs on every PR and checks for API key leaks, SQL injection patterns, XSS vectors, and other common issues — then posts inline comments and a summary directly on GitHub.

## Features

- **Security detection** — API keys, SQL injection, XSS, hardcoded secrets
- **PR descriptions** — professional summaries generated from the diff
- **Contextual chat** — ask questions about any file in the audit
- **Diff dashboard** — Monaco editor with side-by-side diff viewer
- **Commit timeline** — visual timeline of all commits in the PR
- **Architecture diagrams** — Mermaid diagrams of change impact
- **GitHub App** — automatic PR comments, status checks, and merge blocking on critical issues
- **Advanced filters** — filter audits by status, date, and repository
- **i18n** — Spanish and English support

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/kaudit.git
cd kaudit

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values (see Configuration below)

# 4. Set up the database
pnpm db:push

# 5. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

For the background job processor, run in a separate terminal:

```bash
pnpm dev:inngest
```

## Configuration

Create a `.env` file from `.env.example` and fill in the values:

| Variable                   | Required | Description                                                         |
| -------------------------- | -------- | ------------------------------------------------------------------- |
| `DATABASE_URL`             | Yes      | PostgreSQL connection string                                        |
| `BETTER_AUTH_SECRET`       | Prod     | Secret for authentication                                           |
| `BETTER_AUTH_URL`          | No       | Auth callback URL (default: `http://localhost:3000`)                |
| `GITHUB_TOKEN`             | Prod     | GitHub personal access token (`repo`, `write:pull_requests` scopes) |
| `GITHUB_WEBHOOK_SECRET`    | No       | Secret for validating GitHub webhook payloads                       |
| `GITHUB_APP_CLIENT_ID`     | No       | GitHub App OAuth client ID                                          |
| `GITHUB_APP_CLIENT_SECRET` | No       | GitHub App OAuth client secret                                      |
| `OPENROUTER_API_KEY`       | Yes      | OpenRouter API key for AI model access                              |
| `REQUESTY_API_KEY`         | Yes      | Requesty API key for AI model routing                               |
| `INNGEST_EVENT_KEY`        | No       | Inngest event key (optional in development)                         |
| `INNGEST_SIGNING_KEY`      | No       | Inngest signing key (optional in development)                       |
| `SENTRY_DSN`               | No       | Sentry DSN for error tracking                                       |

## CLI Usage

The CLI audits your current git diff and creates a PR in one command:

```bash
# Basic — audit commits since branching from main
npx github-auditor ship

# Audit staged changes instead of commits
npx github-auditor ship --staged

# Custom base branch
npx github-auditor ship --base develop

# Skip automatic push after audit
npx github-auditor ship --no-push

# Full options
npx github-auditor ship \
  --base main \
  --url http://localhost:3000 \
  --timeout 300000 \
  --repo https://github.com/owner/repo
```

### CLI Options

| Flag              | Default                 | Description                                         |
| ----------------- | ----------------------- | --------------------------------------------------- |
| `--base <branch>` | `main`                  | Base branch for comparison                          |
| `--url <url>`     | `http://localhost:3000` | API server URL                                      |
| `--timeout <ms>`  | `300000`                | Maximum polling timeout                             |
| `--staged`        | `false`                 | Audit staged changes (`git add`) instead of commits |
| `--repo <url>`    | auto-detected           | Repository URL (required if no git remote)          |
| `--no-push`       | `false`                 | Skip automatic push after successful audit          |
| `--no-color`      | `false`                 | Disable colored output                              |

### How it works

```
1. Detect git repo and current branch
2. Collect diff (staged or commits against base)
3. POST diff to /api/audit/start
4. Inngest workflow processes the audit:
   ├── Parse diff into files and hunks
   ├── Validate for security issues
   ├── Enrich issues with file context
   └── Generate PR description
5. Poll /api/audit/[id]/status until complete
6. Display results (issues found, PR description)
7. Push branch and create PR (unless --no-push)
```

## Architecture

```
src/
├── core/                        # Shared infrastructure
│   ├── components/              # Dashboard, settings, theme
│   ├── config/                  # Routes, theme config
│   ├── hooks/                   # Shared React hooks
│   ├── lib/                     # DB, i18n, Inngest client, sidebar
│   ├── locales/                 # Translation files
│   ├── styles/                  # Theme and palettes
│   ├── ui/                      # DataTable, Form, Kanban components
│   └── utils/                   # cn, date utilities
│
├── modules/                     # Business logic (feature-based)
│   ├── audit/                   # Audit engine
│   │   ├── components/          # Monaco diff, chat panel, issues, Mermaid
│   │   ├── hooks/               # Audit-specific hooks
│   │   ├── inngest/             # Inngest workflow definition
│   │   ├── lib/                 # Prompt templates, diff parser
│   │   ├── models/              # Drizzle schema
│   │   ├── queries/             # Database queries
│   │   ├── services/            # Validation, enrichment, generation
│   │   └── types/               # TypeScript types
│   │
│   ├── github/                  # GitHub integration
│   │   ├── services/            # Commits, PR comments, status checks
│   │   ├── models/              # Drizzle schema
│   │   └── queries/             # Database queries
│   │
│   ├── ai-assistant/            # Contextual AI chat
│   ├── auth/                    # Authentication (better-auth)
│   └── landing/                 # Landing page
│
├── cli/                         # CLI tool (commander)
│   ├── commands/                # ship command
│   └── lib/                     # Git helpers, API client, display
│
└── env.js                       # Environment variable validation
```

**Data flow:** `modules/` imports from `core/`, but `core/` never imports from `modules/`.

## API Endpoints

| Method | Endpoint                       | Description                       |
| ------ | ------------------------------ | --------------------------------- |
| `POST` | `/api/audit/start`             | Start a new audit with a git diff |
| `GET`  | `/api/audit/list`              | List all audits                   |
| `GET`  | `/api/audit/[id]`              | Get audit details                 |
| `GET`  | `/api/audit/[id]/status`       | Poll audit processing status      |
| `GET`  | `/api/audit/[id]/files`        | Get audited files                 |
| `GET`  | `/api/audit/[id]/files/[path]` | Get specific file content         |
| `POST` | `/api/audit/[id]/chat`         | Chat with AI about the audit      |
| `POST` | `/api/audit/[id]/create-pr`    | Create a PR from audit results    |
| `POST` | `/api/webhooks/github`         | GitHub webhook receiver           |
| `GET`  | `/api/gh/callback`             | GitHub OAuth callback             |
| `POST` | `/api/chat`                    | General AI chat endpoint          |
| `GET`  | `/api/auth/[...all]`           | better-auth catch-all routes      |

## Scripts

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Start Next.js dev server with Turbopack |
| `pnpm dev:inngest`  | Start Inngest dev server                |
| `pnpm build`        | Production build                        |
| `pnpm start`        | Start production server                 |
| `pnpm lint`         | Run ESLint                              |
| `pnpm typecheck`    | Check TypeScript types                  |
| `pnpm test`         | Run tests with Vitest                   |
| `pnpm test:run`     | Run tests once (no watch)               |
| `pnpm db:push`      | Push schema changes to database         |
| `pnpm db:generate`  | Generate migration files                |
| `pnpm db:migrate`   | Run migrations                          |
| `pnpm db:studio`    | Open Drizzle Studio                     |
| `pnpm format:check` | Check formatting with Prettier          |
| `pnpm format:write` | Fix formatting with Prettier            |
| `pnpm cli:ship`     | Run the `ship` CLI command              |

## Tech Stack

| Category        | Technology                         |
| --------------- | ---------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack) |
| Language        | TypeScript 5.9                     |
| Auth            | better-auth                        |
| Database        | PostgreSQL + Drizzle ORM           |
| Background Jobs | Inngest                            |
| AI              | Vercel AI SDK + OpenRouter         |
| Editor          | Monaco Editor                      |
| Tables          | TanStack Table                     |
| Styling         | Tailwind CSS 4 + shadcn/ui         |
| Testing         | Vitest + Testing Library           |
| State           | nuqs (URL state), React Context    |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to your fork: `git push origin feat/my-feature`
5. Open a pull request

Make sure `pnpm typecheck` and `pnpm lint` pass before submitting.

## License

MIT
