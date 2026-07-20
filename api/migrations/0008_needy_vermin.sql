CREATE TABLE `user_feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`rating_label` text NOT NULL,
	`ip_address` text,
	`device` text,
	`platform` text,
	`app_version` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_user_feedback_user` ON `user_feedback` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_user_feedback_rating` ON `user_feedback` (`rating`);