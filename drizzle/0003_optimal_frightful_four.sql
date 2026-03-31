CREATE TABLE "kaudit_github_installation" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"installation_id" integer NOT NULL,
	"account_id" integer NOT NULL,
	"account_login" text NOT NULL,
	"account_type" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expires_at" timestamp,
	"repository_selection" text DEFAULT 'all' NOT NULL,
	"repositories" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "kaudit_github_installation_installation_id_unique" UNIQUE("installation_id")
);
--> statement-breakpoint
ALTER TABLE "kaudit_audit" ADD COLUMN "docstrings" jsonb;--> statement-breakpoint
ALTER TABLE "kaudit_audit" ADD COLUMN "generated_tests" jsonb;--> statement-breakpoint
ALTER TABLE "kaudit_github_installation" ADD CONSTRAINT "kaudit_github_installation_user_id_kaudit_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."kaudit_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gh_installation_user_id_idx" ON "kaudit_github_installation" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "gh_installation_installation_id_idx" ON "kaudit_github_installation" USING btree ("installation_id");--> statement-breakpoint
CREATE INDEX "gh_installation_account_id_idx" ON "kaudit_github_installation" USING btree ("account_id");