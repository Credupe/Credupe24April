CREATE TABLE `credit_score_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`full_name` text NOT NULL,
	`mobile` text NOT NULL,
	`email` text,
	`score` integer NOT NULL,
	`status` text DEFAULT 'COMPLETED' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_credit_score_requests_user` ON `credit_score_requests` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_credit_score_requests_mobile` ON `credit_score_requests` (`mobile`);