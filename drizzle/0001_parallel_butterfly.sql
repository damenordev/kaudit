CREATE TABLE "kaudit_audit" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"repo_url" text NOT NULL,
	"branch_name" text NOT NULL,
	"target_branch" text DEFAULT 'main' NOT NULL,
	"git_diff" text,
	"git_diff_hash" varchar(64),
	"status" text DEFAULT 'pending' NOT NULL,
	"validation_result" jsonb,
	"generated_content" jsonb,
	"pr_url" text,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "kaudit_audit_git_diff_hash_unique" UNIQUE("git_diff_hash")
);
--> statement-breakpoint
ALTER TABLE "kaudit_audit" ADD CONSTRAINT "kaudit_audit_user_id_kaudit_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."kaudit_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_user_id_idx" ON "kaudit_audit" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_status_idx" ON "kaudit_audit" USING btree ("status");--> statement-breakpoint
CREATE INDEX "audit_git_diff_hash_idx" ON "kaudit_audit" USING btree ("git_diff_hash");