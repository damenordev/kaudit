ALTER TABLE "kaudit_audit" ADD COLUMN "changed_files" jsonb;--> statement-breakpoint
ALTER TABLE "kaudit_audit" ADD COLUMN "commits" jsonb;--> statement-breakpoint
ALTER TABLE "kaudit_audit" ADD COLUMN "issues" jsonb;