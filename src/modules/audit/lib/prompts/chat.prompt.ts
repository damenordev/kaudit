/**
 * Prompt para chat contextual con IA sobre auditorías.
 * Construye un system prompt con contexto de la auditoría.
 */
import type { IChangedFile, IEnrichedIssue, IAuditCommit, IValidationResult } from '../../types'

interface IAuditChatContext {
  repoUrl: string
  branchName: string
  targetBranch: string
  changedFiles: IChangedFile[] | null
  issues: IEnrichedIssue[] | null
  commits: IAuditCommit[] | null
  validationResult: IValidationResult | null
}

function buildIssuesSection(issues: IEnrichedIssue[]): string {
  if (!issues.length) return 'No issues detected.'
  return issues
    .map(
      (i, idx) =>
        `${idx + 1}. [${i.severity}] ${i.type}: ${i.title}\n   File: ${i.file}:${i.line}\n   ${i.message}${i.suggestedFix ? `\n   Suggested fix: ${i.suggestedFix}` : ''}`
    )
    .join('\n')
}

function buildFilesSection(files: IChangedFile[]): string {
  if (!files.length) return 'No changed files.'
  return files
    .slice(0, 30)
    .map(
      f =>
        `- ${f.path} (+${f.additions}/-${f.deletions}) [${f.status}]${f.issueCount > 0 ? ` (${f.issueCount} issues)` : ''}`
    )
    .join('\n')
}

function buildCommitsSection(commits: IAuditCommit[]): string {
  if (!commits.length) return 'No commits info.'
  return commits
    .slice(0, 15)
    .map(c => `- ${c.sha.slice(0, 7)} ${c.message.split('\n')[0]} (${c.author.name})`)
    .join('\n')
}

function buildValidationSection(validation: IValidationResult): string {
  if (validation.isValid && !validation.issues.length) return 'Validation passed. No issues found.'
  return validation.issues
    .map(i => `- [${i.severity}] ${i.type}: ${i.message}${i.suggestion ? `\n  Suggestion: ${i.suggestion}` : ''}`)
    .join('\n')
}

export function buildAuditChatPrompt(ctx: IAuditChatContext): string {
  const filesSection = ctx.changedFiles ? buildFilesSection(ctx.changedFiles) : 'No changed files.'
  const issuesSection = ctx.issues ? buildIssuesSection(ctx.issues) : 'No issues detected.'
  const commitsSection = ctx.commits ? buildCommitsSection(ctx.commits) : 'No commits info.'
  const validationSection = ctx.validationResult ? buildValidationSection(ctx.validationResult) : 'No validation.'

  return `You are an expert code review assistant. You are analyzing a GitHub Pull Request audit.

# Repository Context
- Repo: ${ctx.repoUrl}
- Branch: ${ctx.branchName} → ${ctx.targetBranch}

# Changed Files
${filesSection}

# Detected Issues
${issuesSection}

# Commits
${commitsSection}

# Security Validation
${validationSection}

# Instructions
- Answer questions about the code changes, issues, and suggestions.
- When discussing issues, reference specific files and line numbers.
- Provide actionable fix suggestions with code examples when relevant.
- If asked to explain an issue, provide both the "why" and the "how to fix".
- Respond in the same language the user writes in.
- Be concise but thorough. Use markdown formatting.`
}
