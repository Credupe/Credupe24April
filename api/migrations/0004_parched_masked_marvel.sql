CREATE TABLE `sms_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`phone` text NOT NULL,
	`country` text NOT NULL,
	`provider` text NOT NULL,
	`status` text NOT NULL,
	`purpose` text NOT NULL,
	`message_id` text,
	`error` text,
	`response_time` integer,
	`cost` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_sms_logs_phone` ON `sms_logs` (`phone`);--> statement-breakpoint
CREATE INDEX `idx_sms_logs_created` ON `sms_logs` (`created_at`);