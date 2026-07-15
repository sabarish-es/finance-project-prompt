CREATE TABLE `customers` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`location` text,
	`address` text,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`customerId` text NOT NULL,
	`loanAmount` real NOT NULL,
	`principalAmount` real NOT NULL,
	`interestRate` real DEFAULT 0,
	`loanType` text DEFAULT 'Personal',
	`status` text DEFAULT 'Active',
	`startDate` integer NOT NULL,
	`endDate` integer,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`loanId` text NOT NULL,
	`amount` real NOT NULL,
	`date` integer NOT NULL,
	`type` text DEFAULT 'Regular',
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);